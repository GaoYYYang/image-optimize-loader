<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

# image-optimize-loader
Help you encode(inline) and compress images when loaded with webpack. 

Its encoding(inline) ability is stronger than [url-loader](https://github.com/webpack-contrib/url-loader), especially useful for performance-optimization scenarios. And it will compress images automatically both for emiting images or inlining images. without complicated configurations. 


## Getting Started

To begin, you'll need to install `img-optimize-loader`:

```console
$ npm install img-optimize-loader --save-dev
```

Then add the loader to your `webpack` config. For example:

**import images in index.js**

```js
import file from 'image.png';
```


**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp|git|svg|)$/i,
        use: [
          {
            loader: `img-optimize-loader`
          },
        ],
      },
    ],
  },
};
```
And run `webpack` via your preferred method.

## Features

### 1. Encode images and inline into js/css files.

When you use `url-loader` to encode images, you can only depend on [limit](https://github.com/webpack-contrib/url-loader#limit) configuration to decide whether to enable encodeing. **As we know, the image whose size was smaller than the limit, will always be encoded.**

But with `img-optimize-loader` you can take a more flexible control. You can specify every image whether to be encoded when you use it（using file query）. Still, you can use `limit` configuration to control it too.

**index.js**
```js
// this will let foo.png be encoded and inlined here
import encodedImage from './encode.png?__inline';

// this will emit true image file here
import fileImage from './emit.png?__antiInline';


```

The query symbol `__inline` and `__antiInline` can be customed by your self.

### 2. Compress your images
> The compress algorithm based on [imagemin](https://github.com/kevva/imagemin). Support images in png, jpg, gif, webp, svg format.

We support 3 levels for you to compress images automaticlly. 

| level | description| 
|-|-|
| loseless | Only use lossless compress algorithm. Only support png/webp/svg files|
| low | Cause less distortion，and get small files. It will compress png/jpg/svg/webp/gif|
| high | Cause more distortion，and get smaller files. It will compress png/jpg/svg/webp/gif|
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
                disableOnDevelopment: true
              }
            },
          },
        ],
      },
    ],
  },
};
``````
And you can also config the compression manually using more params.
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
                optipng: {
                  optimizationLevel: 4,
                },
                webp: {
                  quality: 100,
                  jpgQuality: 75,
                  pngQuality: 85,
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
              }
            },
          },
        ],
      },
    ],
  },
};
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
          inline:{
            symbol: '__inline'
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
          inline:{
            antiSymbol: '__antiInline'
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
          inline:{
            antiSymbol: '__antiInline'
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
          mimetype: false,
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
          mimetype: 'image/png',
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
              encoding: false,
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
          encoding: 'utf8',
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
| loseless | Only use lossless compress algorithm. Only support png/webp/svg files|
| low | Cause less distortion，and get small files. It will compress png/jpg/svg/webp/gif|
| high | Cause more distortion，and get smaller files. It will compress png/jpg/svg/webp/gif|

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        loader: `img-optimize-loader`,
        options: {
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
    ],
  },
};
```

### `compress.mozjpeg`
Type: `Object`

Compress jpg images.
See [mozjpeg configuration](https://github.com/imagemin/imagemin-mozjpeg) — *Compress JPEG images*

### `compress.optipng`
- [optipng](https://github.com/kevva/imagemin-optipng) — *Compress PNG images*

### `compress.pngquant`
- [pngquant](https://github.com/imagemin/imagemin-pngquant) — *Compress PNG images*

### `compress.svgo`
- [svgo](https://github.com/kevva/imagemin-svgo) — *Compress SVG images*

### `compress.gifsicle`
- [gifsicle](https://github.com/kevva/imagemin-gifsicle) — *Compress GIF images*


## Inspiration
* [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)
* [url-loader](https://github.com/webpack/url-loader)
* [imagemin](https://github.com/imagemin/imagemin)

## License

[MIT](./LICENSE)
