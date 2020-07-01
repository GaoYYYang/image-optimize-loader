/*
 * @file: convert buffer to encoding format
 * @author: GaoYYYang
 * @date: 06 30 2020 4:43:36
 */
import path from 'path';
import mime from 'mime-types';
import { encode } from 'punycode';
function getMimetype(mimetype, resourcePath) {
  if (typeof mimetype === 'boolean') {
    if (mimetype) {
      const resolvedMimeType = mime.contentType(path.extname(resourcePath));

      if (!resolvedMimeType) {
        return '';
      }

      return resolvedMimeType.replace(/;\s+charset/i, ';charset');
    }

    return '';
  }

  if (typeof mimetype === 'string') {
    return mimetype;
  }

  const resolvedMimeType = mime.contentType(path.extname(resourcePath));

  if (!resolvedMimeType) {
    return '';
  }

  return resolvedMimeType.replace(/;\s+charset/i, ';charset');
}

function getEncoding(encoding) {
  if (typeof encoding === 'boolean') {
    return encoding ? 'base64' : '';
  }

  if (typeof encoding === 'string') {
    return encoding;
  }

  return 'base64';
}

function getEncodedData(generator, mimetype, encoding, content, resourcePath) {
  if (generator) {
    return generator(content, mimetype, encoding, resourcePath);
  }

  return `data:${mimetype}${encoding ? `;${encoding}` : ''},${content.toString(encoding || undefined)}`;
}

export default function inline(data, inlineOption, callback) {
  const { generator, esModule } = inlineOption;
  let { mimetype, encoding } = inlineOption;
  const { resourcePath } = this;

  mimetype = getMimetype(inlineOption.mimetype, resourcePath);
  encoding = getEncoding(inlineOption.encoding);

  let content = data;
  if (typeof content === 'string') {
    // eslint-disable-next-line no-param-reassign
    content = Buffer.from(content);
  }
  content = getEncodedData(generator, mimetype, encoding, data, resourcePath);

  callback(null, `${esModule ? 'export default' : 'module.exports ='} ${JSON.stringify(content)}`);
  return;
}
