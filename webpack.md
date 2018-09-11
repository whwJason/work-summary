webpack.config.js文件通常放在项目的根目录中，它本身也是一个标准的Commonjs规范的模块。

```js
var webpack = require('webpack');
module.exports = {
    entry: [
        'webpack/hot/only-dev-server',
        './js/app.js'
    ],
    output: {
        path: './build',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
        { test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude:     /node_modules/ },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
        { test: /\.css$/, loader: "style!css" },
        {test: /\.less/,loader: 'style-loader!css-loader!less-loader'}
        ]
    },
    resolve:{
        extensions:['','.js','.json']
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ]
};
```  


### entry

entry可以是个字符串或数组或者是对象。
当entry是个字符串的时候，用来定义入口文件：

```js
entry: './js/main.js'
```  


当entry是个数组的时候，里面同样包含入口js文件，另外一个参数可以是用来配置webpack提供的一个静态资源服务器，webpack-dev-server。webpack-dev-server会监控项目中每一个文件的变化，实时的进行构建，并且自动刷新页面：

```js
entry: [
  'webpack/hot/only-dev-server',
  './js/app.js'
]
```  


当entry是个对象的时候，我们可以将不同的文件构建成不同的文件，按需使用，比如在我的hello页面中只要\引入hello.js即可：

```js
entry: {
  hello: './js/hello.js',
  form: './js/form.js'
 }
```  

### output
output参数是个对象，用于定义构建后的文件的输出。其中包含path和filename：

```js
output: {
  path: './build',
  filename: 'bundle.js'
 }
```  


当我们在entry中定义构建多个文件时，filename可以对应的更改为[name].js用于定义不同文件构建后的名字。

### module
关于模块的加载相关，我们就定义在module.loaders中。这里通过正则表达式去匹配不同后缀的文件名，然后给它们定义不同的加载器。比如说给less文件定义串联的三个加载器（！用来定义级联关系）：

```js
module: {
    loaders: [
        { test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
        { test: /\.css$/, loader: "style!css" },
        { test: /\.less/, loader: 'style-loader!css-loader!less-loader'}
    ]
}
```  


此外，还可以添加用来定义png、jpg这样的图片资源在小于10k时自动处理为base64图片的加载器：
```js
{ test: /\.(png|jpg)$/,loader: 'url-loader?limit=10000'}
```  


给css和less还有图片添加了loader之后，我们不仅可以像在node中那样require js文件了，我们还可以require css、less甚至图片文件：

```js
require('./bootstrap.css');
require('./myapp.less');
var img = document.createElement('img');
img.src = require('./glyph.png');
```  


但是需要知道的是，这样require来的文件会内联到 js bundle中。如果我们需要把保留require的写法又想把css文件单独拿出来，可以使用下面提到的[extract-text-webpack-plugin]插件。
在上面示例代码中配置的第一个loaders我们可以看到一个叫做React-hot的加载器。我的项目是用来学习react写相关代码的，所以配置了一个react-hot加载器，通过它，可以实现对react组件的热替换。我们已经在entry参数中配置了webpack/hot/only-dev-server,所以我们只要在启动webpack开发服务器时开启–hot参数，就可以使用react-hot-loader了。在package.json文件中这样定义：

```js
"scripts": {
   "start": "webpack-dev-server --hot --progress --colors",
   "build": "webpack --progress --colors"
 }
```  


### resolve
webpack在构建包的时候会按目录的进行文件的查找，resolve属性中的extensions数组中用于配置程序可以自行补全哪些文件后缀：

```js
resolve:{
   extensions:['','.js','.json']
 }
```  


然后我们想要加载一个js文件时，只要require(‘common’)就可以加载common.js文件了。

### externals
当我们想在项目中require一些其他的类库或者API，而又不想让这些类库的源码被构建到运行时文件中，这在实际开发中很有必要。此时我们就可以通过配置externals参数来解决这个问题：

```js
externals: {
  "jquery": "jQuery"
 }
```  


这样我们就可以放心的在项目中使用这些API了：

```js
var jQuery = require(“jquery”);
```  
