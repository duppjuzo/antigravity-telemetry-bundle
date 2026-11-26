import {
  QuantizerCelebi,
  Score,
  argbFromHex,
  argbFromRgb,
  hexFromArgb,
} from '@material/material-color-utilities';
import type { WallpaperCrop } from '../types/telemetry';
import { DEFAULT_SEED_HEX } from './seed-provider';

const MAX_SAMPLE_EDGE = 128;
const MAX_QUANTIZE_COLORS = 128;

interface DecodedSource {
  source: CanvasImageSource;
  width: number;
  height: number;
  cleanup: () => void;
}

async function decodeImageBlob(blob: Blob): Promise<DecodedSource> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(blob);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close(),
      };
    } catch {
      // Fallback to HTMLImageElement below
    }
  }

  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Failed to decode wallpaper image'));
      el.src = url;
    });
    return {
      source: img,
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      cleanup: () => URL.revokeObjectURL(url),
    };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

function clamp01(val: number): number {
  if (!Number.isFinite(val)) return 0;
  return Math.max(0, Math.min(1, val));
}

/**
 * Extracts up to 4 Material 3 Monet candidate seed hex colors from a wallpaper
 * image blob using Celebi quantization and Material Score ranking.
 */
export async function extractWallpaperSeedColors(
  blob: Blob,
  crop?: WallpaperCrop | null
): Promise<string[]> {
  const decoded = await decodeImageBlob(blob);
  try {
    const imgW = Math.max(1, decoded.width);
    const imgH = Math.max(1, decoded.height);

    let sx = 0;
    let sy = 0;
    let sw = imgW;
    let sh = imgH;

    if (crop) {
      const cx = clamp01(crop.x);
      const cy = clamp01(crop.y);
      const cw = Math.max(0.05, clamp01(crop.w));
      const ch = Math.max(0.05, clamp01(crop.h));
      sx = Math.floor(cx * imgW);
      sy = Math.floor(cy * imgH);
      sw = Math.max(1, Math.min(imgW - sx, Math.round(cw * imgW)));
      sh = Math.max(1, Math.min(imgH - sy, Math.round(ch * imgH)));
    }

    const scale = Math.min(1, MAX_SAMPLE_EDGE / Math.max(sw, sh));
    const dstW = Math.max(1, Math.round(sw * scale));
    const dstH = Math.max(1, Math.round(sh * scale));

    const canvas = document.createElement('canvas');
    canvas.width = dstW;
    canvas.height = dstH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      return [DEFAULT_SEED_HEX];
    }

    ctx.drawImage(decoded.source, sx, sy, sw, sh, 0, 0, dstW, dstH);
    const { data } = ctx.getImageData(0, 0, dstW, dstH);

    const pixels: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 250) continue;
      pixels.push(argbFromRgb(data[i], data[i + 1], data[i + 2]));
    }

    if (pixels.length === 0) {
      return [DEFAULT_SEED_HEX];
    }

    const quantized = QuantizerCelebi.quantize(pixels, MAX_QUANTIZE_COLORS);
    const scored = Score.score(quantized, {
      desired: 4,
      fallbackColorARGB: argbFromHex(DEFAULT_SEED_HEX),
      filter: true,
    });

    const unique: string[] = [];
    for (const argb of scored) {
      const hex = hexFromArgb(argb).toUpperCase();
      if (!unique.includes(hex)) {
        unique.push(hex);
      }
      if (unique.length >= 4) break;
    }

    return unique.length > 0 ? unique : [DEFAULT_SEED_HEX];
  } finally {
    decoded.cleanup();
  }
}
