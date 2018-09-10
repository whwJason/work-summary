# iframe的优缺点
**iframe的缺点**

1、页面样式调试麻烦，出现多个滚动条；
2、浏览器的后退按钮失效；

3、过多会增加服务器的HTTP请求；

4、小型的移动设备无法完全显示框架；
5、产生多个页面，不易管理；
6、不容易打印；
7、代码复杂，无法被一些搜索引擎解读。

**iframe的优点：**

1.iframe能够原封不动的把嵌入的网页展现出来。

2.如果有多个网页引用iframe，那么你只需要修改iframe的内容，就可以实现调用的每一个页面内容的更改，方便快捷。

3.网页如果为了统一风格，头部和版本都是一样的，就可以写成一个页面，用iframe来嵌套，可以增加代码的可重用。

4.如果遇到加载缓慢的第三方内容如图标和广告，这些问题可以由iframe来解决。

5.重载页面时不需要重载整个页面，只需要重载页面中的一个框架页(减少了数据的传输，增加了网页下载速度)

**iframe 的常用属性：**

1.name ：  规定 iframe 标签 的名称。
2.width： 规定 iframe 标签 的宽度。
3.height ：规定 iframe 标签 的高度。
4.src ：规定在 iframe 标签 中显示的文档的 URL。
5.frameborder ： 规定是否显示 iframe 标签 周围的边框。 (0为无边框，1位有边框)。
6.align：规定如何根据周围的元素来对齐 iframe 标签。(left,right,top,middle,bottom)。
7.scrolling：规定是否在 iframe 标签 中显示滚动条。 (yes,no,auto)

**获取iframe里面的内容：**
```js
var iframe = document.getElementById("myrame"); //获取iframe标签
var iwindow = iframe.contentWindow; //获取iframe的window对象
var idoc = iwindow.document; //获取iframe的document对象
```  
