import {
  argbFromHex,
  DynamicScheme,
  Hct,
  hexFromArgb,
  MaterialDynamicColors,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeFruitSalad,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeRainbow,
  SchemeTonalSpot,
  SchemeVibrant,
  Variant,
} from '@material/material-color-utilities';
import type { SeedColorProvider } from './seed-provider';

export type ThemeMode = 'light' | 'dark' | 'follow-gui';

export type MonetVariantId =
  | 'tonal_spot'
  | 'neutral'
  | 'vibrant'
  | 'expressive'
  | 'monochrome'
  | 'fidelity'
  | 'content'
  | 'rainbow'
  | 'fruit_salad';

export type MonetSpecVersion = '2021' | '2025';

export interface MonetVariantOption {
  id: MonetVariantId;
  label: string;
  supportsSpec2025: boolean;
}

export interface HostThemePayload {
  theme_mode?: string;
  scheme?: string;
  contrast?: string;
  high_contrast?: boolean;
}

export interface MonetThemeConfig {
  themeMode: ThemeMode;
  variant: MonetVariantId;
  specVersion: MonetSpecVersion;
}

export interface AppliedPaletteInfo {
  seedHex: string;
  isDark: boolean;
  contrastLevel: number;
  requestedSpecVersion: MonetSpecVersion;
  effectiveSpecVersion: MonetSpecVersion;
  variant: MonetVariantId;
}

export interface HudM3Palette {
  surface_container_low: string;
  surface_container: string;
  surface_container_high: string;
  surface_container_highest: string;
  on_surface: string;
  on_surface_variant: string;
  outline: string;
  outline_variant: string;
  primary: string;
  on_primary: string;
  primary_container: string;
  on_primary_container: string;
  secondary_container: string;
  on_secondary_container: string;
  tertiary: string;
  tertiary_container: string;
  on_tertiary_container: string;
  error: string;
  error_container: string;
  on_error_container: string;
}

export interface HudThemeSyncPayload {
  theme: 'dark' | 'light';
  palettes: {
    dark: HudM3Palette;
    light: HudM3Palette;
  };
  variant: MonetVariantId;
  spec_version: MonetSpecVersion;
  seed_hex: string;
}

type SchemeConstructor = new (
  sourceColorHct: Hct,
  isDark: boolean,
  contrastLevel: number,
  specVersion?: MonetSpecVersion
) => DynamicScheme;

interface VariantMeta {
  readonly option: MonetVariantOption;
  readonly variant: Variant;
  readonly SchemeClass: SchemeConstructor;
}

const VARIANT_TABLE: Record<MonetVariantId, VariantMeta> = {
  tonal_spot: {
    option: { id: 'tonal_spot', label: 'Tonal Spot', supportsSpec2025: true },
    variant: Variant.TONAL_SPOT,
    SchemeClass: SchemeTonalSpot,
  },
  neutral: {
    option: { id: 'neutral', label: 'Neutral', supportsSpec2025: true },
    variant: Variant.NEUTRAL,
    SchemeClass: SchemeNeutral,
  },
  vibrant: {
    option: { id: 'vibrant', label: 'Vibrant', supportsSpec2025: true },
    variant: Variant.VIBRANT,
    SchemeClass: SchemeVibrant,
  },
  expressive: {
    option: { id: 'expressive', label: 'Expressive', supportsSpec2025: true },
    variant: Variant.EXPRESSIVE,
    SchemeClass: SchemeExpressive,
  },
  monochrome: {
    option: { id: 'monochrome', label: 'Monochrome', supportsSpec2025: false },
    variant: Variant.MONOCHROME,
    SchemeClass: SchemeMonochrome,
  },
  fidelity: {
    option: { id: 'fidelity', label: 'Fidelity', supportsSpec2025: false },
    variant: Variant.FIDELITY,
    SchemeClass: SchemeFidelity,
  },
  content: {
    option: { id: 'content', label: 'Content', supportsSpec2025: false },
    variant: Variant.CONTENT,
    SchemeClass: SchemeContent,
  },
  rainbow: {
    option: { id: 'rainbow', label: 'Rainbow', supportsSpec2025: false },
    variant: Variant.RAINBOW,
    SchemeClass: SchemeRainbow,
  },
  fruit_salad: {
    option: { id: 'fruit_salad', label: 'Fruit Salad', supportsSpec2025: false },
    variant: Variant.FRUIT_SALAD,
    SchemeClass: SchemeFruitSalad,
  },
};

export const MONET_VARIANT_OPTIONS: readonly MonetVariantOption[] = Object.freeze([
  VARIANT_TABLE.tonal_spot.option,
  VARIANT_TABLE.neutral.option,
  VARIANT_TABLE.vibrant.option,
  VARIANT_TABLE.expressive.option,
  VARIANT_TABLE.monochrome.option,
  VARIANT_TABLE.fidelity.option,
  VARIANT_TABLE.content.option,
  VARIANT_TABLE.rainbow.option,
  VARIANT_TABLE.fruit_salad.option,
]);

const DEFAULT_CONFIG: MonetThemeConfig = {
  themeMode: 'follow-gui',
  variant: 'tonal_spot',
  specVersion: '2025',
};

const M3_COLOR_TOKENS: ReadonlyArray<
  readonly [cssName: string, getter: (colors: MaterialDynamicColors) => ReturnType<MaterialDynamicColors['primary']>]
> = [
  ['--md-sys-color-background', (c) => c.background()],
  ['--md-sys-color-on-background', (c) => c.onBackground()],
  ['--md-sys-color-surface', (c) => c.surface()],
  ['--md-sys-color-surface-dim', (c) => c.surfaceDim()],
  ['--md-sys-color-surface-bright', (c) => c.surfaceBright()],
  ['--md-sys-color-surface-container-lowest', (c) => c.surfaceContainerLowest()],
  ['--md-sys-color-surface-container-low', (c) => c.surfaceContainerLow()],
  ['--md-sys-color-surface-container', (c) => c.surfaceContainer()],
  ['--md-sys-color-surface-container-high', (c) => c.surfaceContainerHigh()],
  ['--md-sys-color-surface-container-highest', (c) => c.surfaceContainerHighest()],
  ['--md-sys-color-on-surface', (c) => c.onSurface()],
  ['--md-sys-color-surface-variant', (c) => c.surfaceVariant()],
  ['--md-sys-color-on-surface-variant', (c) => c.onSurfaceVariant()],
  ['--md-sys-color-inverse-surface', (c) => c.inverseSurface()],
  ['--md-sys-color-inverse-on-surface', (c) => c.inverseOnSurface()],
  ['--md-sys-color-outline', (c) => c.outline()],
  ['--md-sys-color-outline-variant', (c) => c.outlineVariant()],
  ['--md-sys-color-shadow', (c) => c.shadow()],
  ['--md-sys-color-scrim', (c) => c.scrim()],
  ['--md-sys-color-surface-tint', (c) => c.surfaceTint()],
  ['--md-sys-color-primary', (c) => c.primary()],
  ['--md-sys-color-on-primary', (c) => c.onPrimary()],
  ['--md-sys-color-primary-container', (c) => c.primaryContainer()],
  ['--md-sys-color-on-primary-container', (c) => c.onPrimaryContainer()],
  ['--md-sys-color-inverse-primary', (c) => c.inversePrimary()],
  ['--md-sys-color-secondary', (c) => c.secondary()],
  ['--md-sys-color-on-secondary', (c) => c.onSecondary()],
  ['--md-sys-color-secondary-container', (c) => c.secondaryContainer()],
  ['--md-sys-color-on-secondary-container', (c) => c.onSecondaryContainer()],
  ['--md-sys-color-tertiary', (c) => c.tertiary()],
  ['--md-sys-color-on-tertiary', (c) => c.onTertiary()],
  ['--md-sys-color-tertiary-container', (c) => c.tertiaryContainer()],
  ['--md-sys-color-on-tertiary-container', (c) => c.onTertiaryContainer()],
  ['--md-sys-color-error', (c) => c.error()],
  ['--md-sys-color-on-error', (c) => c.onError()],
  ['--md-sys-color-error-container', (c) => c.errorContainer()],
  ['--md-sys-color-on-error-container', (c) => c.onErrorContainer()],
  ['--md-sys-color-primary-fixed', (c) => c.primaryFixed()],
  ['--md-sys-color-primary-fixed-dim', (c) => c.primaryFixedDim()],
  ['--md-sys-color-on-primary-fixed', (c) => c.onPrimaryFixed()],
  ['--md-sys-color-on-primary-fixed-variant', (c) => c.onPrimaryFixedVariant()],
  ['--md-sys-color-secondary-fixed', (c) => c.secondaryFixed()],
  ['--md-sys-color-secondary-fixed-dim', (c) => c.secondaryFixedDim()],
  ['--md-sys-color-on-secondary-fixed', (c) => c.onSecondaryFixed()],
  ['--md-sys-color-on-secondary-fixed-variant', (c) => c.onSecondaryFixedVariant()],
  ['--md-sys-color-tertiary-fixed', (c) => c.tertiaryFixed()],
  ['--md-sys-color-tertiary-fixed-dim', (c) => c.tertiaryFixedDim()],
  ['--md-sys-color-on-tertiary-fixed', (c) => c.onTertiaryFixed()],
  ['--md-sys-color-on-tertiary-fixed-variant', (c) => c.onTertiaryFixedVariant()],
];

type PaletteRole = 'primaryPalette' | 'tertiaryPalette' | 'secondaryPalette' | 'errorPalette';

/**
 * Eight chart series slots sampled across scheme TonalPalettes with distinct
 * tones in both light and dark modes so series remain distinguishable even in
 * low-chroma variants such as Monochrome or Neutral.
 */
const CHART_SERIES_SPEC: ReadonlyArray<
  readonly [palette: PaletteRole, lightTone: number, darkTone: number]
> = [
  ['primaryPalette', 40, 80],
  ['tertiaryPalette', 48, 72],
  ['secondaryPalette', 56, 64],
  ['errorPalette', 44, 76],
  ['primaryPalette', 64, 56],
  ['tertiaryPalette', 32, 88],
  ['secondaryPalette', 72, 48],
  ['primaryPalette', 24, 40],
];

const HEATMAP_TONES_LIGHT = [85, 70, 52, 35] as const;
const HEATMAP_TONES_DARK = [30, 45, 62, 78] as const;

function hostThemeEquals(a: HostThemePayload | null, b: HostThemePayload | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    (a.theme_mode ?? '') === (b.theme_mode ?? '') &&
    (a.scheme ?? '') === (b.scheme ?? '') &&
    (a.contrast ?? '') === (b.contrast ?? '') &&
    Boolean(a.high_contrast) === Boolean(b.high_contrast)
  );
}

export class MonetThemeEngine {
  private readonly target: HTMLElement;
  private readonly colors = new MaterialDynamicColors();
  private seedProvider: SeedColorProvider;
  private seedUnsubscribe: (() => void) | null = null;
  private hostTheme: HostThemePayload | null = null;
  private config: MonetThemeConfig = { ...DEFAULT_CONFIG };
  private lastApplied: AppliedPaletteInfo | null = null;
  private observer: MutationObserver | null = null;
  private darkMediaQuery: MediaQueryList | null = null;
  private isApplying = false;
  private destroyed = false;

  constructor(seedProvider: SeedColorProvider, target: HTMLElement = document.documentElement) {
    this.target = target;
    this.seedProvider = seedProvider;
    this.attachSeedProvider(seedProvider);
    this.setupHostListeners();
  }

  setSeedProvider(provider: SeedColorProvider): void {
    this.detachSeedProvider();
    this.seedProvider = provider;
    this.attachSeedProvider(provider);
    this.apply();
  }

  setHostTheme(hostTheme: HostThemePayload | null): void {
    const normalized: HostThemePayload | null = hostTheme ? { ...hostTheme } : null;
    if (hostThemeEquals(this.hostTheme, normalized) && this.lastApplied !== null) {
      return;
    }
    this.hostTheme = normalized;
    this.apply();
  }

  setConfig(config: MonetThemeConfig): AppliedPaletteInfo {
    this.config = { ...config };
    return this.apply();
  }

  apply(): AppliedPaletteInfo {
    const seedHex = this.seedProvider.getSeedColorHex();
    const isDark = this.resolveIsDark();
    const contrastLevel = this.resolveContrastLevel();
    const variantMeta = VARIANT_TABLE[this.config.variant] ?? VARIANT_TABLE.tonal_spot;
    const requestedSpecVersion = this.config.specVersion;

    const sourceHct = Hct.fromInt(argbFromHex(seedHex));
    const scheme = new variantMeta.SchemeClass(
      sourceHct,
      isDark,
      contrastLevel,
      requestedSpecVersion
    );

    const effectiveSpecVersion: MonetSpecVersion = scheme.specVersion;
    const info: AppliedPaletteInfo = {
      seedHex,
      isDark,
      contrastLevel,
      requestedSpecVersion,
      effectiveSpecVersion,
      variant: variantMeta.option.id,
    };

    this.writeTokensToTarget(scheme, info);
    this.lastApplied = info;
    return info;
  }

  getLastApplied(): AppliedPaletteInfo | null {
    return this.lastApplied ? { ...this.lastApplied } : null;
  }

  exportHudThemePayload(): HudThemeSyncPayload {
    const seedHex = this.seedProvider.getSeedColorHex();
    const isDark = this.resolveIsDark();
    const contrastLevel = this.resolveContrastLevel();
    const variantMeta = VARIANT_TABLE[this.config.variant] ?? VARIANT_TABLE.tonal_spot;
    const requestedSpecVersion = this.config.specVersion;
    const sourceHct = Hct.fromInt(argbFromHex(seedHex));

    const darkScheme = new variantMeta.SchemeClass(
      sourceHct,
      true,
      contrastLevel,
      requestedSpecVersion
    );
    const lightScheme = new variantMeta.SchemeClass(
      sourceHct,
      false,
      contrastLevel,
      requestedSpecVersion
    );

    return {
      theme: isDark ? 'dark' : 'light',
      palettes: {
        dark: this.extractHudPalette(darkScheme),
        light: this.extractHudPalette(lightScheme),
      },
      variant: variantMeta.option.id,
      spec_version: darkScheme.specVersion,
      seed_hex: seedHex,
    };
  }

  private extractHudPalette(scheme: DynamicScheme): HudM3Palette {
    const c = this.colors;
    const hex = (dc: ReturnType<MaterialDynamicColors['primary']>) =>
      hexFromArgb(dc.getArgb(scheme));
    return {
      surface_container_low: hex(c.surfaceContainerLow()),
      surface_container: hex(c.surfaceContainer()),
      surface_container_high: hex(c.surfaceContainerHigh()),
      surface_container_highest: hex(c.surfaceContainerHighest()),
      on_surface: hex(c.onSurface()),
      on_surface_variant: hex(c.onSurfaceVariant()),
      outline: hex(c.outline()),
      outline_variant: hex(c.outlineVariant()),
      primary: hex(c.primary()),
      on_primary: hex(c.onPrimary()),
      primary_container: hex(c.primaryContainer()),
      on_primary_container: hex(c.onPrimaryContainer()),
      secondary_container: hex(c.secondaryContainer()),
      on_secondary_container: hex(c.onSecondaryContainer()),
      tertiary: hex(c.tertiary()),
      tertiary_container: hex(c.tertiaryContainer()),
      on_tertiary_container: hex(c.onTertiaryContainer()),
      error: hex(c.error()),
      error_container: hex(c.errorContainer()),
      on_error_container: hex(c.onErrorContainer()),
    };
  }

  destroy(): void {
    this.destroyed = true;
    this.detachSeedProvider();
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.darkMediaQuery) {
      if (this.darkMediaQuery.removeEventListener) {
        this.darkMediaQuery.removeEventListener('change', this.handleMediaChange);
      } else if (this.darkMediaQuery.removeListener) {
        this.darkMediaQuery.removeListener(this.handleMediaChange);
      }
      this.darkMediaQuery = null;
    }
  }

  private attachSeedProvider(provider: SeedColorProvider): void {
    if (provider.subscribe) {
      this.seedUnsubscribe = provider.subscribe(() => {
        if (!this.destroyed) {
          this.apply();
        }
      });
    }
  }

  private detachSeedProvider(): void {
    if (this.seedUnsubscribe) {
      this.seedUnsubscribe();
      this.seedUnsubscribe = null;
    }
  }

  private setupHostListeners(): void {
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(this.handleTargetMutation);
      this.observeTarget();
    }
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      this.darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (this.darkMediaQuery.addEventListener) {
        this.darkMediaQuery.addEventListener('change', this.handleMediaChange);
      } else if (this.darkMediaQuery.addListener) {
        this.darkMediaQuery.addListener(this.handleMediaChange);
      }
    }
  }

  private observeTarget(): void {
    if (!this.observer || this.destroyed) {
      return;
    }
    this.observer.observe(this.target, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
  }

  private readonly handleTargetMutation = (): void => {
    if (this.destroyed || this.isApplying || this.config.themeMode !== 'follow-gui') {
      return;
    }
    const nextIsDark = this.resolveIsDark();
    if (this.lastApplied === null || this.lastApplied.isDark !== nextIsDark) {
      this.apply();
    }
  };

  private readonly handleMediaChange = (): void => {
    if (this.destroyed || this.config.themeMode !== 'follow-gui') {
      return;
    }
    this.apply();
  };

  private resolveContrastLevel(): number {
    if (this.hostTheme?.high_contrast) {
      return 1.0;
    }
    const contrast = typeof this.hostTheme?.contrast === 'string'
      ? this.hostTheme.contrast.toLowerCase()
      : '';
    if (contrast.includes('high')) {
      return 1.0;
    }
    if (contrast.includes('medium')) {
      return 0.5;
    }
    return 0.0;
  }

  private resolveIsDark(): boolean {
    if (this.config.themeMode === 'dark') {
      return true;
    }
    if (this.config.themeMode === 'light') {
      return false;
    }
    return this.resolveHostThemeScheme() === 'dark';
  }

  private resolveHostThemeScheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlThemeOverride = (urlParams.get('theme') || '').trim().toLowerCase();
      if (urlThemeOverride === 'light' || urlThemeOverride === 'dark') {
        return urlThemeOverride;
      }
    }

    const sidecar = typeof window !== 'undefined'
      ? (window as Window & { sidecar?: { theme?: unknown } }).sidecar
      : undefined;
    const sidecarTheme = typeof sidecar?.theme === 'string'
      ? sidecar.theme.trim().toLowerCase()
      : '';
    if (sidecarTheme === 'light' || sidecarTheme === 'dark') {
      return sidecarTheme;
    }

    const hostLumTheme = this.probeHostBgLuminance();
    if (hostLumTheme) {
      return hostLumTheme;
    }

    const cfgScheme = typeof this.hostTheme?.scheme === 'string'
      ? this.hostTheme.scheme.trim().toLowerCase()
      : '';
    if (cfgScheme === 'light' || cfgScheme === 'dark') {
      return cfgScheme;
    }

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  private probeHostBgLuminance(): 'light' | 'dark' | null {
    if (typeof document === 'undefined' || typeof getComputedStyle === 'undefined') {
      return null;
    }
    const inlineBg = this.target.style.getPropertyValue('--background').trim();
    if (!inlineBg) {
      return null;
    }
    const doc = this.target.ownerDocument || document;
    const probe = doc.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;color:var(--background)';
    this.target.appendChild(probe);
    let computed = '';
    try {
      computed = getComputedStyle(probe).color;
    } finally {
      probe.remove();
    }
    const nums = (computed.match(/[\d.]+/g) || []).map(Number);
    if (nums.length < 3) {
      return null;
    }
    const scale = computed.startsWith('color(') ? 1 : 255;
    const [r, g, b] = nums.slice(0, 3).map((v) => v / scale);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.5 ? 'dark' : 'light';
  }

  private writeTokensToTarget(scheme: DynamicScheme, info: AppliedPaletteInfo): void {
    this.isApplying = true;
    // Disconnect around target mutations so async MutationObserver microtasks never re-trigger apply().
    this.observer?.disconnect();
    try {
      const style = this.target.style;
      for (const [cssVar, getDynamicColor] of M3_COLOR_TOKENS) {
        style.setProperty(cssVar, hexFromArgb(getDynamicColor(this.colors).getArgb(scheme)));
      }

      CHART_SERIES_SPEC.forEach(([paletteRole, lightTone, darkTone], idx) => {
        const tone = info.isDark ? darkTone : lightTone;
        style.setProperty(`--tm-chart-${idx}`, hexFromArgb(scheme[paletteRole].tone(tone)));
      });

      style.setProperty(
        '--tm-hm-0',
        hexFromArgb(this.colors.surfaceContainerHigh().getArgb(scheme))
      );
      const hmTones = info.isDark ? HEATMAP_TONES_DARK : HEATMAP_TONES_LIGHT;
      hmTones.forEach((tone, idx) => {
        style.setProperty(`--tm-hm-${idx + 1}`, hexFromArgb(scheme.primaryPalette.tone(tone)));
      });

      style.setProperty('--tm-status-ok', hexFromArgb(this.colors.primary().getArgb(scheme)));
      style.setProperty('--tm-status-warn', hexFromArgb(this.colors.tertiary().getArgb(scheme)));
      style.setProperty('--tm-status-danger', hexFromArgb(this.colors.error().getArgb(scheme)));
      style.setProperty(
        '--tm-scrim-disabled',
        'color-mix(in srgb, var(--md-sys-color-surface) 76%, transparent)'
      );

      const themeAttr = info.isDark ? 'dark' : 'light';
      style.colorScheme = themeAttr;
      if (this.target.dataset.theme !== themeAttr) {
        this.target.dataset.theme = themeAttr;
      }
      const contrastAttr = info.contrastLevel > 0 ? 'high' : 'default';
      if (this.target.dataset.contrast !== contrastAttr) {
        this.target.dataset.contrast = contrastAttr;
      }
    } finally {
      this.isApplying = false;
      this.observeTarget();
    }
  }
}
