/*
 * @file: use imagemin to compress images
 * @author: GaoYYYang
 * @date: 06 30 2020 4:49:54
 */

import imagemin from 'imagemin';

export default function compress(content, options) {
  const plugins = [];
  Object.keys(options).forEach(type => {
    let thisOption = options[type];
    if (typeof thisOption === 'boolean' && thisOption) {
      thisOption = {};
    } else if (typeof thisOption !== 'object') {
      thisOption = false;
    }
    if (thisOption) {
      plugins.push(require(`imagemin-${type}`)(thisOption));
    }
  });

  return imagemin.buffer(content, {
    plugins,
  });
}
