/**
 * Decoupled seed color source abstraction for the Monet theme engine.
 *
 * Future providers (e.g., wallpaper/image palette extraction or user color pickers)
 * can implement {@link SeedColorProvider} without modifying {@link MonetThemeEngine}.
 */

export const DEFAULT_TEST_SEED_HEX = '#ADD8E6';

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
function normalizeSeedHex(rawHex: string): string {
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

export class HardcodedSeedColorProvider implements SeedColorProvider {
  readonly id = 'hardcoded';
  private readonly seedHex: string;

  constructor(seedHex: string = DEFAULT_TEST_SEED_HEX) {
    this.seedHex = normalizeSeedHex(seedHex);
  }

  getSeedColorHex(): string {
    return this.seedHex;
  }
}

export function createDefaultSeedProvider(): SeedColorProvider {
  return new HardcodedSeedColorProvider(DEFAULT_TEST_SEED_HEX);
}
