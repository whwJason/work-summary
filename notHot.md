## javascript:void(0) 含义

javascript:void(0) 中最关键的是 void 关键字， void 是 JavaScript 中非常重要的关键字，该操作符指定要计算一个表达式但是不返回值。

## href="#"与href="javascript:void(0)"的区别
“#”包含了一个位置信息，默认的锚是#top 也就是网页的上端。
而javascript:void(0), 仅仅表示一个死链接。
在页面很长的时候会使用 # 来定位页面的具体位置，格式为：“#” + id。
如果你要定义一个死链接请使用 javascript:void(0) 。
## HTTP协议
HTTP协议 ：Hyper Text Transfer Protocol（超文本传输协议）,是用于从万维网（WWW:World Wide Web）服务器传输超文本到本地浏览器的传送协议。是互联网上应用最为广泛的一种网络协议。所有的WWW文件都必须遵守这个标准。

HTTP是一个基于TCP/IP通信协议来传递数据（HTML 文件, 图片文件, 查询结果等）。

### HTTP/0.9
HTTP/0.9是第一个版本的HTTP协议，已过时。它的组成极其简单，只允许客户端发送GET这一种请求，且不支持请求头。由于没有协议头，造成了HTTP/0.9协议只支持一种内容，即纯文本。不过网页仍然支持用HTML语言格式化，同时无法插入图片。

HTTP/0.9具有典型的无状态性，每个事务独立进行处理，事务结束时就释放这个连接。由此可见，HTTP协议的无状态特点在其第一个版本0.9中已经成型。一次HTTP/0.9的传输首先要建立一个由客户端到Web服务器的TCP连接，由客户端发起一个请求，然后由Web服务器返回页面内容，然后连接会关闭。如果请求的页面不存在，也不会返回任何错误码。

### HTTP/1.0
HTTP协议的第二个版本，第一个在通讯中指定版本号的HTTP协议版本，至今仍被广泛采用。相对于HTTP/0.9增加了如下主要特性：

1. 请求与响应支持头域
2. 响应对象以一个响应状态行开始
3. 响应对象不只限于超文本
4. 开始支持客户端通过POST方法向Web服务器提交数据，支持GET、HEAD、POST方法
5. 支持长连接（但默认还是使用短连接），缓存机制，以及身份认证

### HTTP/1.1
HTTP协议的第三个版本是HTTP/1.1，是目前使用最广泛的协议版本。HTTP/1.1是目前主流的HTTP协议版本，相对于HTTP/1.0新增了以下内容：

#### 默认为长连接

HTTP 1.1支持长连接（PersistentConnection）和请求的流水线（Pipelining）处理，在一个TCP连接上可以传送多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟，在HTTP1.1中默认开启Connection：keep-alive，一定程度上弥补了HTTP1.0每次请求都要创建连接的缺点。

#### 提供了范围请求功能(宽带优化)

HTTP1.0中，存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象送过来了，并且不支持断点续传功能，HTTP1.1则在请求头引入了range头域，它允许只请求资源的某个部分，即返回码是206（Partial Content），这样就方便了开发者自由的选择以便于充分利用带宽和连接。这是支持文件断点续传的基础。

#### 提供了虚拟主机的功能(HOST域)

在HTTP1.0中认为每台服务器都绑定一个唯一的IP地址，因此，请求消息中的URL并没有传递主机名（hostname）。但随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机（Multi-homed Web Servers），并且它们共享一个IP地址。HTTP1.1的请求消息和响应消息都应支持Host头域，且请求消息中如果没有Host头域会报告一个错误（400 Bad Request）。

#### 多了一些缓存处理字段

HTTP/1.1在1.0的基础上加入了一些cache的新特性，引入了实体标签，一般被称为e-tags，新增更为强大的Cache-Control头。

#### 错误通知的管理

在HTTP1.1中新增了24个错误状态响应码，如409（Conflict）表示请求的资源与资源的当前状态发生冲突；410（Gone）表示服务器上的某个资源被永久性的删除。

### HTTP/2.0
HTTP协议的第四个版本是HTTP/2.0，相对于HTTP/1.1新增了以下内容：

二进制分帧

HTTP 2.0 的所有帧都采用二进制编码

帧：客户端与服务器通过交换帧来通信，帧是基于这个新协议通信的最小单位。
消息：是指逻辑上的 HTTP 消息，比如请求、响应等，由一或多个帧组成。
流：流是连接中的一个虚拟信道，可以承载双向的消息；每个流都有一个唯一的整数标识符（1、2 … N）；
#### 多路复用

多路复用允许同时通过单一的HTTP/2.0 连接发起多重的请求-响应消息。有了新的分帧机制后，HTTP/2.0不再依赖多个TCP 连接去处理更多并发的请求。每个数据流都拆分成很多互不依赖的帧，而这些帧可以交错（乱序发送），还可以分优先级。最后再在另一端根据每个帧首部的流标识符把它们重新组合起来。HTTP 2.0 连接都是持久化的，而且客户端与服务器之间也只需要一个连接（每个域名一个连接）即可。

#### 头部压缩

HTTP/1.1 的首部带有大量信息，而且每次都要重复发送。HTTP/2.0 要求通讯双方各自缓存一份首部字段表，从而避免了重复传输。

#### 请求优先级

浏览器可以在发现资源时立即分派请求，指定每个流的优先级，让服务器决定最优的响应次序。这样请求就不必排队了，既节省了时间，也最大限度地利用了每个连接。

#### 服务端推送

服务端推送能把客户端所需要的资源伴随着index.html一起发送到客户端，省去了客户端重复请求的步骤。正因为没有发起请求，建立连接等操作，所以静态资源通过服务端推送的方式可以极大地提升速度。

### 常用状态码
200 ：服务器已成功处理了请求并提供了请求的网页。
204 ：服务器成功处理了请求，但没有返回任何内容。

301 ：请求的网页已永久移动到新位置。当URLs发生变化时，使用301代码。搜索引擎索引中保存新的URL
302 ：请求的网页临时移动到新位置。搜索引擎索引中保存原来的URL
304 ：如果网页自请求者上次请求后没有更新，则用304代码告诉搜索引擎机器人，可节省带宽和开销

400 ：服务器不理解请求的语法
403 ：服务器拒绝请求
404 ：服务器找不到请求的网页。服务器上不存在的网页经常会返回此代码。
410 ：请求的资源永久删除后，服务器返回此响应。该代码与404（未找到）代码相似，但在资源以前存在而现在不存在的情况下，有时用来替代404 页面代码。如果资源已永久删除，应当使用301 指定资源的新位置。

500 ：服务器遇到错误，无法完成请求。
503 ：服务器目前无法使用（由于超载或停机维护）

### V8优化
在 V8 中并没有解释器, 但却有两个不同的编译器: 通用编译器和优化编译器. 这意味着你的 JavaScript 代码总是会被编译为机器码后直接运行. 这样一定很快咯? 并不是. 仅仅是编译为本地代码并不能明显提高性能. 它只是消除了解释器的开销, 但如果未被优化, 代码依旧很慢.


#### 目前不会被优化的有:

- generator 函数
- 包含 for⋯of 语句的函数
- 包含 try⋯catch 的函数
- 包含 try⋯finally 的函数
- 包含复合 let 赋值语句的函数 (原文为 compound let assignment)
- 包含复合 const 赋值语句的函数 (原文为 compound const assignment)
- 包含含有 __proto__ 或者 get/set 声明的对象字面量的函数



#### 可能永远不会被优化的有:

- 包含 debugger 语句的函数
- 包含字面调用 eval() 的函数
- 包含 with 语句的函数

### MIME类型是什么？ 
 
MIME(Multipurpose Internet Mail Extensions)多用途互联网邮件扩展类型。是设定某种扩展名的文件用一种应用程序来打开的方式类型，当该扩展名文件被访问的时候，浏览器会自动使用指定应用程序来打开。
了解更多：https://www.cnblogs.com/tjudzj/p/6528008.html

### Data URLs

Data URLs，即前缀为 data: 协议的的URL，其允许内容创建者向文档中嵌入小文件。
Data URLs 由四个部分组成：前缀(data:)、指示数据类型的MIME类型、如果非文本则为可选的base64标记、数据本身：
```js
data:[<mediatype>][;base64],<data>
```  
mediatype 是个 MIME 类型的字符串，例如 "image/jpeg" 表示 JPEG 图像文件。如果被省略，则默认值为 text/plain;charset=US-ASCII

如果数据是文本类型，你可以直接将文本嵌入 (根据文档类型，使用合适的实体字符或转义字符)。如果是二进制数据，你可以将数据进行base64编码之后再进行嵌入。
