/*
 * @file: main entry
 * @author: GaoYYYang
 * @date: 06 30 2020 4:51:22
 */

import { getOptions, interpolateName, parseQuery } from 'loader-utils';
import validateOptions from 'schema-utils';

import compress from './lib/compress';
import inline from './lib/inline';
import emit from './lib/emit';
import { INLINE_OPTION, LOSSY_COMPRESS_OPTION, LOSELESS_COMPRESS_OPTION } from './constants';
import schema from './options.json';

function checkNeedInline(option, size) {
  if (option.disable) {
    return false;
  }

  const { resourceQuery } = this;
  const { limit, symbol, antiSymbol } = option;
  const query = (resourceQuery && parseQuery(resourceQuery)) || {};

  if (query[symbol]) {
    return true;
  }

  if (query[antiSymbol]) {
    return false;
  }

  if (typeof limit === 'boolean') {
    return limit;
  }

  if (typeof limit === 'string') {
    return size <= parseInt(limit, 10);
  }

  if (typeof limit === 'number') {
    return size <= limit;
  }

  return true;
}

function inlineOrEmit(inlineOption, data) {
  if (checkNeedInline.call(this, inlineOption, data.length)) {
    inline.call(this, data, inlineOption);
  } else {
    emit.call(this, data, inlineOption);
  }
}

export default function loader(source) {
  const options = getOptions(this) || {};
  const { mode, resourcePath, resourceQuery } = this;
  validateOptions(schema, options, 'image-optimize-loader');

  let compressOption = LOSELESS_COMPRESS_OPTION;
  if (options.compress) {
    if (options.compress.mode === 'lossy') {
      compressOption = Object.assign(LOSSY_COMPRESS_OPTION, options.compress);
    } else {
      compressOption = Object.assign(compressOption, options.compress);
    }
  }

  let inlineOption = INLINE_OPTION;
  if (options.inline) {
    inlineOption = Object.assign(inlineOption, options.inline);
  }

  if (mode === 'production' || compressOption.bypassOnDebug === false || !compressOption.disable) {
    const callback = this.async();
    compress(source, compressOption)
      .then(data => {
        inlineOrEmit.call(this, inlineOption, data);
      })
      .catch(err => {
        callback(err);
      });
  } else {
    inlineOrEmit.call(this, inlineOption, source);
  }
}

module.exports.raw = true;
