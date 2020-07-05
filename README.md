<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

# image-optimize-loader

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
![test](https://github.com/GaoYYYang/image-optimize-loader/workflows/test/badge.svg?branch=master&event=push)

This special **image optimize webpack loader** can:

- Help you [**encode image** / **inline image**] and [**compress image** / **minify image**] when loaded with webpack.

- Help you **tranform PNG/JPG images into WEBP** when needed.

Its special encoding(inlining) ability is stronger than [url-loader](https://github.com/webpack-contrib/url-loader), especially useful for performance-optimization scenarios. And it will compress images automatically both for `emited image file` or `inlined images string`, without complicated configurations.

## Getting Started

To begin, you'll need to install `img-optimize-loader`:

```console
$ npm install img-optimize-loader --save-dev
```

Then, all you need to do is adding the `img-optimize-loader` to your `webpack` config.

> You don't need to specify extra loaders like `file-loader` or `url-loader` for your images. `img-optimize-loader` will automaticlly handle everything.

For example:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp|git|svg|)$/i,
        use: [
          {
            loader: 'img-optimize-loader',
          },
        ],
      },
    ],
  },
};
```

**You can import your image. Compression and encoding will happen according to your configuration.**

```js
import file from 'image.png';
```

## Features

### 1. Encode images and inline them into js/css files.

> **Encode image with `base64`, `utf8`, `latin1`, `hex`, `ascii`, `binary`,`ucs2`**

> **Inline image into JS / CSS files**

When I use `url-loader` to encode images, I can only depend on [limit](https://github.com/webpack-contrib/url-loader#limit) configuration to decide whether to enable encodeing. **As we know, the image whose size was smaller than the limit, will always be encoded.**

But I found problems when i want to inline a large size image into my entry jsbundle because this image is so important to my first screen rendering; Or when I don't want to inline trivial small images because there is no need to load them in time. I can't improve my page performance in this scene with `url-loader`.

Now with `img-optimize-loader` we can take more flexible control on this. We can specify every image whether or not to be encoded easily（using file query）regardless of `limit` configuration. Still, if we don't specify it, `limit` configuration will take control.

**index.js**

```js
// Always let foo.png be encoded and inlined here regardless of 'limit configuration'
import encodedImage from './encode.png?__inline';

// Always emit real image file regardless of 'limit configuration'
import fileImage from './emit.png?__antiInline';
```

The query symbol `__inline` and `__antiInline` can be customed by your self.

### 2. Compress your images

> The compression algorithm is based on [imagemin](https://github.com/kevva/imagemin). It supports images in png, jpg, gif, webp, svg format.
>
> - **minify JPEG image**
> - **minify PNG image**
> - **minify GIF image**
> - **minify WEBP image**
> - **minify SVG image**

We support 3 levels for you to compress images automaticlly.

| level    | description                                                                             |
| -------- | --------------------------------------------------------------------------------------- |
| loseless | Only use lossless compress algorithm. Only support png/webp/svg images                  |
| low      | Cause a little distortion，and get small files. It will compress png/jpg/svg/gif images |
| high     | Cause more distortion，and get smaller files. It will compress png/jpg/svg/gif images   |

> To deal with webp images, please refer [webp](https://github.com/GaoYYYang/image-optimize-loader#3-transform-your-pngjpg-into-webp)

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp|git|svg|)$/i,
        use: [
          {
            loader: `img-optimize-loader`,
            options: {
              compress: {
                // This will take more time and get smaller images.
                mode: 'high', // 'lossless', 'low'
                disableOnDevelopment: true,
              },
            },
          },
        ],
      },
    ],
  },
};
```

And you can also adjust the compression manually using [more params](https://github.com/GaoYYYang/image-optimize-loader#compressmozjpeg).

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp|git|svg|)$/i,
        use: [
          {
            loader: 'img-optimize-loader',
            options: {
              compress: {
                // loseless compression for png
                optipng: {
                  optimizationLevel: 4,
                },
                // lossy compression for png. This will generate smaller file than optipng.
                pngquant: {
                  quality: [0.2, 0.8],
                },
                // Compression for webp.
                // You can also tranform jpg/png into webp.
                webp: {
                  quality: 100,
                },
                // Compression for svg.
                svgo: true,
                // Compression for gif.
                gifsicle: {
                  optimizationLevel: 3,
                },
                // Compression for jpg.
                mozjpeg: {
                  progressive: true,
                  quality: 60,
                },
              },
            },
          },
        ],
      },
    ],
  },
};
```

### 3. Transform your png/jpg into webp

When you enable `compress.webp`, it will transform your png/jpg into webp files, and there will be no png/jpg files generated. Your source code will directly use webp file instead of png/jpg.

Generally, when you can use webp without incompatibility problem
, there will be no need to use png or jpg any more, because webp files are always smaller than their png/jpg origin.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp|git|svg|)$/i,
        use: [
          {
            loader: `img-optimize-loader`,
            options: {
              compress: {
                // This will transform your png/jpg into webp.
                webp: true,
                disableOnDevelopment: true,
              },
            },
          },
        ],
      },
    ],
  },
};
```

Referer to [webp configuration](https://github.com/GaoYYYang/image-optimize-loader#compresswebp) for details.

**index.js**

```js
// This two images will be transformed into webp and your source code will use the webp format.
import encodedImage from './encode.png';

import fileImage from './test.jpg';
```

## Options

### `name`

Type: `[string]`
Default: `'imgs/[contenthash].[ext]'`

Specifies a custom filename template for the target images(s) using the query parameter name. For example, to emit a image from your context directory into the output directory retaining the full directory structure, you might use:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
};
```

### `esModule`

Type: `[Boolean]`
Default: `false`

Decides js modules generated from image. Whether to use the ES modules or commonjs.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          esModule: false,
        },
      },
    ],
  },
};
```

### `inline.symbol`

Type: `[String]`
Default: `__inline`

Query symbol used to specify the image that should be encoded and inlined.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          inline: {
            symbol: '__inline',
          },
        },
      },
    ],
  },
};
```

### `inline.antiSymbol`

Type: `[String]`
Default: `__antiInline`

Query symbol used to specify the image that should not be encoded and inlined.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          inline: {
            antiSymbol: '__antiInline',
          },
        },
      },
    ],
  },
};
```

### `inline.limit`

Type: `[Boolean|Number|String]`
Default: `5000`

A Number or String specifying the maximum size of a encoded image in bytes. If the image size is equal or greater than the limit `file-loader` will be used (by default) and all query parameters are passed to it.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          inline: {
            antiSymbol: '__antiInline',
          },
        },
      },
    ],
  },
};
```

### `inline.mimetype`

Type: `Boolean|String`
Default: based from [mime-types](https://github.com/jshttp/mime-types)

Specify the `mimetype` which the file will be inlined with.
If unspecified the `mimetype` value will be used from [mime-types](https://github.com/jshttp/mime-types).

#### `Boolean`

The `true` value allows to generation the `mimetype` part from [mime-types](https://github.com/jshttp/mime-types).
The `false` value removes the `mediatype` part from a Data URL (if omitted, defaults to `text/plain;charset=US-ASCII`).

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          inline: {
            mimetype: false,
          },
        },
      },
    ],
  },
};
```

#### `String`

Sets the MIME type for the file to be transformed.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          inline: {
            mimetype: 'image/png',
          },
        },
      },
    ],
  },
};
```

### `inline.encoding`

Type: `Boolean|String`
Default: `base64`

Specify the `encoding` which the file will be inlined with.
If unspecified the `encoding` will be `base64`.

#### `Boolean`

If you don't want to use any encoding you can set `encoding` to `false` however if you set it to `true` it will use the default encoding `base64`.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/i,
        use: [
          {
            loader: `img-optimize-loader`,
            options: {
              inline: {
                encoding: false,
              },
            },
          },
        ],
      },
    ],
  },
};
```

#### `String`

It supports [Node.js Buffers and Character Encodings](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings) which are `["utf8","utf16le","latin1","base64","hex","ascii","binary","ucs2"]`.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          inline: {
            encoding: 'utf8',
          },
        },
      },
    ],
  },
};
```

### `inline.generator`

Type: `Function`
Default: `(mimetype, encoding, content, resourcePath) => mimetype;encoding,base64_content`

You can create you own custom implementation for encoding data.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          inline: {
            // The `mimetype` and `encoding` arguments will be obtained from your options
            // The `resourcePath` argument is path to file.
            generator: (content, mimetype, encoding, resourcePath) => {
              if (/\.html$/i.test(resourcePath)) {
                return `data:${mimetype},${content.toString()}`;
              }

              return `data:${mimetype}${
                encoding ? `;${encoding}` : ''
              },${content.toString(encoding)}`;
            },
          },
        },
      },
    ],
  },
};
```

### `compress.mode`

Type: `string`
Default: `low`

Specify the compress level.
| level | description|
|-|-|
| loseless | Only use lossless compress algorithm. Only support png/webp/svg images|
| low | Cause a little distortion，and get small files. It will compress png/jpg/svg/webp/gif images|
| high | Cause more distortion，and get smaller files. It will compress png/jpg/svg/webp/gif images|

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          compress: {
            mode: 'high',
          },
        },
      },
    ],
  },
};
```

### `compress.mozjpeg`

Type: `[Object|Boolean]`

Compress jpg images.

#### `Boolean`

If you don't want to compress jpg files, you can set `mozjpeg` to `false` however if you set it to `true` it will generator the settings according to `compress.mode` configuration.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          compress: {
            mozjpeg: false,
          },
        },
      },
    ],
  },
};
```

#### `Object`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          compress: {
            mozjpeg: {},
          },
        },
      },
    ],
  },
};
```

Link to [mozjpeg configuration](https://github.com/imagemin/imagemin-mozjpeg)

### `compress.optipng`

Type: `[Object|Boolean]`

Compress png images.

#### `Boolean`

If you don't want to use optipng to compress png files, you can set `optipng` to `false` however if you set it to `true` it will generator the settings according to `compress.mode` configuration.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          compress: {
            optipng: false,
          },
        },
      },
    ],
  },
};
```

#### `Object`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          compress: {
            optipng: {},
          },
        },
      },
    ],
  },
};
```

Link to [optipng configuration](https://github.com/kevva/imagemin-optipng)

### `compress.pngquant`

Type: `[Object|Boolean]`

Compress png images.

#### `Boolean`

If you don't want to use pngquant to compress png files, you can set `pngquant` to `false` however if you set it to `true` it will generator the settings according to `compress.mode` configuration.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          compress: {
            pngquant: false,
          },
        },
      },
    ],
  },
};
```

#### `Object`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          compress: {
            pngquant: {},
          },
        },
      },
    ],
  },
};
```

Link to [pngquant configuration](https://github.com/imagemin/imagemin-pngquant)

### `compress.svgo`

Type: `[Object|Boolean]`

Compress svg images.

#### `Boolean`

If you don't want to compress svg files, you can set `svgo` to `false` however if you set it to `true` it will generator the settings according to `compress.mode` configuration.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          compress: {
            svgo: false,
          },
        },
      },
    ],
  },
};
```

#### `Object`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          compress: {
            svgo: {},
          },
        },
      },
    ],
  },
};
```

Link to [svgo configuration](https://github.com/kevva/imagemin-svgo)

### `compress.gifsicle`

Type: `[Object|Boolean]`

Compress gif images.

#### `Boolean`

If you don't want to compress gif files, you can set `gifsicle` to `false` however if you set it to `true` it will generator the settings according to `compress.mode` configuration.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          compress: {
            gifsicle: false,
          },
        },
      },
    ],
  },
};
```

#### `Object`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          compress: {
            gifsicle: {},
          },
        },
      },
    ],
  },
};
```

### `compress.webp`

Type: `[Object|Boolean]`
Default: `false`

Transform png/jpg into webp. Compress webp files.

#### `Boolean`

If you want to transform png/jpg into webp, you can set `webp` to `true`.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          compress: {
            webp: true,
          },
        },
      },
    ],
  },
};
```

#### `Object`

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
          compress: {
            webp: {},
          },
        },
      },
    ],
  },
};
```

Link to [webp configuration](https://github.com/imagemin/imagemin-webp#options)

## Inspiration

- [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)
- [url-loader](https://github.com/webpack/url-loader)
- [imagemin](https://github.com/imagemin/imagemin)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/img-optimize-loader.svg
[npm-url]: https://npmjs.com/package/img-optimize-loader
[node]: https://img.shields.io/node/v/img-optimize-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/GaoYYYang/image-optimize-loader.svg
[deps-url]: https://david-dm.org/GaoYYYang/image-optimize-loader
[tests]: https://github.com/GaoYYYang/image-optimize-loader/workflows/test/badge.svg
[tests-url]: https://github.com/GaoYYYang/image-optimize-loader/actions
[size]: https://packagephobia.now.sh/badge?p=img-optimize-loader
[size-url]: https://packagephobia.now.sh/result?p=img-optimize-loader