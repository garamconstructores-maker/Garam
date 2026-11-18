// Variantes de 640 y 1280 px que scripts/imagenes-responsivas.mjs genera junto a cada
// foto web de /obras/ (la original mide 1920 px). Las maestras 8K no tienen variantes.
export const VARIANT_WIDTHS = [640, 1280] as const;
type VariantWidth = (typeof VARIANT_WIDTHS)[number];

export const hasVariants = (url: string) =>
  url.startsWith('/obras/') && url.endsWith('.webp') && !/-(?:8k|640|1280)\.webp$/.test(url);

export const variantUrl = (url: string, width: VariantWidth) =>
  hasVariants(url) ? url.replace(/\.webp$/, `-${width}.webp`) : url;

/** srcset con las tres anchuras, o undefined si la foto no tiene variantes. */
export const responsiveSrcSet = (url: string) =>
  hasVariants(url)
    ? `${variantUrl(url, 640)} 640w, ${variantUrl(url, 1280)} 1280w, ${url} 1920w`
    : undefined;
