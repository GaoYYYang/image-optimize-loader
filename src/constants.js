/*
 * @file: constants
 * @author: GaoYYYang
 * @date: 06 30 2020 5:38:34
 */

const DEFAULT_INLINE_SYMBOL = '__inline';
const DEFAULT_ANTI_INLINE_SYMBOL = '__antiInline';
const DEFAULT_INLINE_LIMIT = 5000;
const DEFAULT_INLINE_ENCODING = 'base64';

const INLINE_OPTION = {
  disable: false,
  symbol: DEFAULT_INLINE_SYMBOL,
  antiSymbol: DEFAULT_ANTI_INLINE_SYMBOL,
  limit: DEFAULT_INLINE_LIMIT,
  encoding: DEFAULT_INLINE_ENCODING,
  esModule: false,
};

const LOSSY_COMPRESS_OPTION = {
  disable: false,
  bypassOnDebug: true,
  // default optimizers
  optipng: {
    optimizationLevel: 2,
  },
  webp: {
    quality: 100,
    jpgQuality: 75,
    pngQuality: 85,
  },
  svgo: true,

  pngquant: true,
  gifsicle: true,
  mozjpeg: true,
};

const LOSELESS_COMPRESS_OPTION = {
  disable: false,
  bypassOnDebug: true,
  // default optimizers
  optipng: {
    optimizationLevel: 2,
  },
  webp: {
    quality: 100,
    jpgQuality: 75,
    pngQuality: 85,
  },
  svgo: true,
};

export { INLINE_OPTION, LOSSY_COMPRESS_OPTION, LOSELESS_COMPRESS_OPTION };
