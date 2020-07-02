/*
 * @file: constants
 * @author: GaoYYYang
 * @date: 06 30 2020 5:38:34
 */

const DEFAULT_INLINE_SYMBOL = '__inline';
const DEFAULT_ANTI_INLINE_SYMBOL = '__antiInline';
const DEFAULT_INLINE_LIMIT = 5000;
const DEFAULT_INLINE_ENCODING = 'base64';

const DEFAULT_ES_MODULE = false;
const DEFAULT_NAME = 'imgs/[name].[contenthash:8].[ext]';

const DEFAULT_INLINE_OPTION = {
  disable: false,
  symbol: DEFAULT_INLINE_SYMBOL,
  antiSymbol: DEFAULT_ANTI_INLINE_SYMBOL,
  limit: DEFAULT_INLINE_LIMIT,
  encoding: DEFAULT_INLINE_ENCODING,
};

const LOSSY_LOW_COMPRESS_OPTION = {
  disable: false,
  disableOnDevelopment: true,
  // default optimizers
  optipng: {
    optimizationLevel: 2,
  },

  svgo: true,

  pngquant: {
    quality: [0.5, 0.8],
  },
  gifsicle: {
    optimizationLevel: 2,
  },
  mozjpeg: {
    progressive: true,
    quality: 80,
  },
};
const LOSSY_HIGH_COMPRESS_OPTION = {
  disable: false,
  disableOnDevelopment: true,
  // default optimizers
  optipng: {
    optimizationLevel: 4,
  },

  svgo: true,

  pngquant: {
    quality: [0.2, 0.8],
  },
  gifsicle: {
    optimizationLevel: 3,
  },
  mozjpeg: {
    progressive: true,
    quality: 60,
  },
};

const LOSELESS_COMPRESS_OPTION = {
  disable: false,
  disableOnDevelopment: true,
  // default optimizers
  optipng: {
    optimizationLevel: 2,
  },

  svgo: true,
};

export {
  DEFAULT_INLINE_OPTION,
  LOSSY_HIGH_COMPRESS_OPTION,
  LOSSY_LOW_COMPRESS_OPTION,
  LOSELESS_COMPRESS_OPTION,
  DEFAULT_ES_MODULE,
  DEFAULT_NAME,
};
