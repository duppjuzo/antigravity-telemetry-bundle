/**
 * Decoupled seed color source abstraction for the Monet theme engine.
 *
 * Supports manual seed color selection, dynamic OS accent sync, and
 * wallpaper-extracted palette providers without modifying {@link MonetThemeEngine}.
 */

export const DEFAULT_SEED_HEX = '#ADD8E6';
export const DEFAULT_TEST_SEED_HEX = DEFAULT_SEED_HEX;

export const PRESET_SEED_COLORS: ReadonlyArray<{ hex: string; label: string }> =
  Object.freeze([
    { hex: '#ADD8E6', label: '淡天蓝（默认）' },
    { hex: '#4285F4', label: 'Google 蓝' },
    { hex: '#00897B', label: '青碧绿' },
    { hex: '#2E7D32', label: '森林绿' },
    { hex: '#F9AB00', label: '琥珀金' },
    { hex: '#E65100', label: '暖橙橘' },
    { hex: '#C2185B', label: '洋红玫瑰' },
    { hex: '#6750A4', label: 'Material 紫' },
  ]);

export interface SeedColorProvider {
  readonly id: string;
  getSeedColorHex(): string;
  subscribe?(listener: (hex: string) => void): () => void;
}

const HEX_3_RE = /^#?([0-9a-fA-F]{3})$/;
const HEX_6_RE = /^#?([0-9a-fA-F]{6})$/;

/**
 * Validates and normalizes a CSS hex color string into canonical `#RRGGBB` uppercase form.
 */
export function normalizeSeedHex(rawHex: string): string {
  const trimmed = rawHex.trim();
  const match6 = HEX_6_RE.exec(trimmed);
  if (match6) {
    return `#${match6[1].toUpperCase()}`;
  }
  const match3 = HEX_3_RE.exec(trimmed);
  if (match3) {
    const [r, g, b] = match3[1].toUpperCase().split('');
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  throw new Error(`Invalid seed hex color "${rawHex}". Expected #RGB or #RRGGBB.`);
}

export function isValidSeedHex(rawHex: string): boolean {
  const trimmed = rawHex.trim();
  return HEX_6_RE.test(trimmed) || HEX_3_RE.test(trimmed);
}

export class DynamicSeedColorProvider implements SeedColorProvider {
  readonly id = 'dynamic';
  private seedHex: string;
  private readonly listeners = new Set<(hex: string) => void>();

  constructor(initialHex: string = DEFAULT_SEED_HEX) {
    this.seedHex = isValidSeedHex(initialHex)
      ? normalizeSeedHex(initialHex)
      : DEFAULT_SEED_HEX;
  }

  getSeedColorHex(): string {
    return this.seedHex;
  }

  setSeedColorHex(rawHex: string): boolean {
    if (!isValidSeedHex(rawHex)) {
      return false;
    }
    const normalized = normalizeSeedHex(rawHex);
    if (normalized === this.seedHex) {
      return false;
    }
    this.seedHex = normalized;
    for (const listener of this.listeners) {
      listener(normalized);
    }
    return true;
  }

  subscribe(listener: (hex: string) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export class HardcodedSeedColorProvider implements SeedColorProvider {
  readonly id = 'hardcoded';
  private readonly seedHex: string;

  constructor(seedHex: string = DEFAULT_SEED_HEX) {
    this.seedHex = normalizeSeedHex(seedHex);
  }

  getSeedColorHex(): string {
    return this.seedHex;
  }
}

export function createDefaultSeedProvider(): SeedColorProvider {
  return new HardcodedSeedColorProvider(DEFAULT_SEED_HEX);
}
