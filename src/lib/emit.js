/*
 * @file: use file-loader to emit files
 * @author: GaoYYYang
 * @date: 06 30 2020 3:55:59
 */

const fileLoader = require('file-loader');

export default function emit(content, options) {
  const { name, esModule } = options;
  const { callback } = this;
  const fallbackLoaderContext = Object.assign({}, this, {
    query: {
      esModule,
      name,
    },
  });

  callback(null, fileLoader.call(fallbackLoaderContext, content));
}
