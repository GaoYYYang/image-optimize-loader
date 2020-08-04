/*
 * @file: use file-loader to emit files
 * @author: GaoYYYang
 * @date: 06 30 2020 3:55:59
 */

/* eslint-disable import/no-unresolved */
const fileLoader = require('file-loader');

export default function emit(content, options, callback) {
  const { name, esModule, outputPath, publicPath, postTransformPublicPath, context, emitFile } = options;
  const fallbackLoaderContext = Object.assign({}, this, {
    query: {
      esModule,
      name,
      outputPath,
      publicPath,
      postTransformPublicPath,
      context,
      emitFile,
    },
  });

  callback(null, fileLoader.call(fallbackLoaderContext, content));
}
