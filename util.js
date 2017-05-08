/**
 * 非业务相关的util通用处理方法
 */
var $ = require('./yocto'),
    Detect = require('@ali/anima-detect'),
    win = window;

const chars = {
    '&#39;': '\'',
    '&amp;': '&',
    '&gt;': '>',
    '&lt;': '<',
    '&quot;': '"'
};

const Util = {
    //窗口高度
    winH: function () {
        return win.innerHeight;
    },

    winW: function () {
        return win.innerWidth;
    },

    appName: function () {
        var app = Detect.app || {},
            appName = Detect.app.name || '';
        return appName.toLowerCase();
    },

    isIos: function () {
        return (Detect.os && Detect.os.name === 'ios');
    },

    alipayVer: function () {
        return Detect.app && Detect.app.version;
    },

    isAndroid: function () {
        return (Detect.os && Detect.os.name === 'android');
    },

    csmobileUrl: function (url) {
        return window.MOBILE_SERVER + url;
    },

    cschannelUrl: function (url) {
        return window.CHANNEL_SERVER + url;
    },

    cliveUrl: function (url) {
        return window.CLIVE_SERVER + url;
    },

    ua: function () {
        return navigator.userAgent.toLowerCase();
    },

    isAlipay: function () {
        return this.ua().indexOf("alipayclient") > -1;
    },

    /**
     * 是否支持支付宝app的jsbridge
     * @returns {*}
     */
    supportAlipayJSBridge: function () {
        return window.AlipayJSBridge;
    },


    //聚宝app
    isAfwealth: function () {
        return this.ua().indexOf("afwealth") > -1;
    },

    //唤起支付宝app
    landing: function (url) {
        return 'https://ds.alipay.com/?scheme=' + encodeURIComponent(url);
    },
    /**
     * 判断是否引流场景
     * @param value
     * @returns {boolean}
     */
    isHydrops: function (value) {
        if (!value) return false;
        var reg = /(_yinliu)/;
        return reg.test(value);
    },

    /**
     *
     * @param url
     * @param method
     * @param data  注意：data是string类型，要encode转码
     */
    appHttpRequest: function (url, method, data) {
        var params = {
            url: url
        };
        if (method === 'POST') {
            params.method = 'POST';
            params.data = data || '';
        }
        try {
            AlipayJSBridge.call('httpRequest', params, function (d) {
                console.log(d)
            });
        } catch (e) {

        }
    },
    // 将字符串深度解析成JSON
    parseStr2Json: function (obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                var cur = obj[i];
                try {
                    obj[i] = JSON.parse(cur);

                    if (typeof cur === 'object') {
                        obj[i] = parseObj(cur);
                    }
                } catch (e) {

                }
            }
        }

        return obj;
    },

    /**
     * html转义成实体，防止xss
     * @param str
     * @returns {string}
     */
    escape: function (str) {
        var escapeStr = str ? str.replace(/<|>|'|"|&/g, function (i) {
            var c = i.charCodeAt(0),
                r = ["&#"];
            c = (c == 0x20) ? 0xA0 : c;
            r.push(c);
            r.push(";");
            return r.join("");
        }) : '';
        return escapeStr;
    },

    unEscapeAnd: function (content) {
        if (!content) return '';
        var reg = /&amp;/;
        if (reg.test(content)) {
            content = content.replace(/&amp;/g, '&');
        }
        return content;
    },

    /**
     * html反转义
     * @param str
     * @returns {*}
     */
    unEscape: function (input) {
        if (!input) return '';
        input = Util.unEscapeAnd(input);
        var el = document.createElement('div');
        el.innerHTML = input;
        return el.childNodes[0].nodeValue;
    },

    unEscapeHtml: function (str) {
        if (str == null) return '';

        var re = new RegExp('(' + Object.keys(chars)
            .join('|') + ')', 'g');

        return String(str).replace(re, function (match) {
            return chars[match];
        });
    },

    /**
     * hack 安卓下知识点里的图片设置100%时可能被拉伸
     * @param $content
     */
    hackStressImgInKnowledge: function ($content) {
        if (Detect.os.name === 'android') {
            var imgList = $content.find('img');
            imgList.forEach(function (img) {
                $(img).css({
                    "vertical-align": "top"
                });
            });
        }
    },

    /**
     * 渲染知识点的时候先渲染图片，保证页面高度不错乱
     * @param imgQueue
     * @param callback
     * @returns {*}
     */
    imgLoad: function (imgQueue, callback) {
        var that = this;
        if (!imgQueue || !imgQueue.length) {
            return callback && callback();
        }
        var loadedArr = [];
        imgQueue.each(function (i) {
            loadedArr[i] = false;
            var img = new Image();
            img.onabort = function () {
                that._loadContent(loadedArr, i, callback);
            };
            img.onerror = function () {
                that._loadContent(loadedArr, i, callback);
            };
            img.onload = function () {
                that._loadContent(loadedArr, i, callback);
            };
            img.src = this.src;
        })
    },

    _loadContent: function (loadedArr, index, callback) {
        loadedArr[index] = true;
        var allLoaded = true;
        loadedArr.forEach(function (item) {
            if (!item) allLoaded = false
        });
        if (allLoaded) {
            callback && callback();
        }
    },
    getLocation: function () {
        var cInfo = {
            province: '',
            city: ''
        };
        if (window.AlipayJSBridge && typeof (AlipayJSBridge.call) === 'function') {
            AlipayJSBridge.call('getLocation', function (result) {
                if (result.error) {
                    cInfo.province = window.CHATCONFIG.province;
                    cInfo.city = window.CHATCONFIG.city;
                } else {
                    cInfo.province = result.province;
                    cInfo.city = result.city ? result.city : result.province;
                }
            });
        } else {
            cInfo.province = window.CHATCONFIG.province;
            cInfo.city = window.CHATCONFIG.city;
        }
        return cInfo;
    },
    /**
     * 解析消息列表字符串为消息数组
     * @param str
     * @returns Array
     */
    messageStrToArr: function (str) {
        if (str) {
            var reg = /<\/section>/g;
            var resultStr = reg.test(str) ? str.replace(/<\/section>/g, "</section>@&@").replace(/<\/section>@&@$/g, "</section>") : str;
            return resultStr.split("@&@");
        } else {
            return [];
        }
    },

    chunk: function (array, count) {
        if (count == null || count < 1) return [];

        var result = [];
        var i = 0,
            length = array.length;
        while (i < length) {
            result.push(Array.prototype.slice.call(array, i, i += count));
        }
        return result;
    },

    getUrlData: function (url) {
        var data = {};
        var ditem = "";
        if (url) {
            url = url.substring(url.indexOf('?'))
        } else {
            url = location.search;
        }
        url.slice(1).split("&").forEach(function (item) {
            item = item.split("=");
            if (item[0] != null && item[1] != null) {
                try {
                    ditem = decodeURI(item[1])
                } catch (e) {
                    ditem = "";
                    console.log("getUrlData", e);
                }
                data[item[0]] = ditem;
            }
        })
        return data;
    },

    startApp: function (url) {
        url = decodeURI(url);
        url = encodeURI(url);
        var self = this;
        if (this.isAlipay()) {
            this.getStartupParams(function (data) {
                if (data.appId === '20000067') {
                    self.pushWindowFn(url);
                } else {
                    AlipayJSBridge.call('startApp', {
                        appId: '20000067',
                        param: {
                            url: url
                        },
                        closeCurrentApp: false
                    }, function (result) {

                    });
                }
            });
        } else {
            url = 'https://ds.alipay.com/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000067%26action%3DWebView%26url=' + url;
            window.location.href = url;
        }
    },

    getStartupParams: function (callback) {
        this.bridgeReady(function () {
            AlipayJSBridge = AlipayJSBridge || {};
            callback && callback(AlipayJSBridge.startupParams);
        });
    },

    bridgeReady: function (callback) {
        document.addEventListener("AlipayJSBridgeReady", function () {
            callback && callback();
        });
    },

    goto: function (href, opts) {
        // 有不少场景下因为支付宝客户端容器的原因， 对 pushWindow 支持不好，比如安全、收银台的容器，更具体的原因可以找 @定风波 或者 @仈爪 了解
        var scene = this.getUrlData('scene') || window.SCENE_CODE;
        opts = opts || {};
        if (!href) return
        var pushParams = $.extend({
            readTitle: true,
            showOptionMenu: false,
            showToolBar: false,
            showLoading: true,
            showTitleBar: true
        }, opts);
        // http 协议调用 pushWindow
        if (window.AlipayJSBridge && /https?/.test(href) && scene !== 'app_authcenter' && scene !== 'app_paymentpage') {
            try {
                AlipayJSBridge.call('pushWindow', {
                    url: href,
                    param: pushParams
                });
            } catch (e) {
                location.href = href
            }
            // 支付宝、聚宝或者其它的协议或者不支持 alipayJSBridge 直接 location 跳转
        } else {
            location.href = href
        }
    },
    pushWindowFn: function (href) {
        var scene = this.getUrlData('scene') || window.SCENE_CODE;

        //pushWindowFn通常是点击的时候调用，AlipayJSBridge已经初始化完毕
        //钱包登陆场景的页面链接不能用pushwindow，否则内存无法释放，可找@定风波了解原理
        if (typeof AlipayJSBridge !== 'undefined' && scene !== 'app_authcenter') {
            try {
                AlipayJSBridge.call('pushWindow', {
                    url: href,
                    param: {
                        readTitle: true,
                        showOptionMenu: false,
                        showToolBar: false,
                        showLoading: true,
                        showTitleBar: true
                    }
                });
            } catch (e) {
                location.href = href
            }
        } else {
            window.location.href = href;
        }
    },
    supportKbase: function (content) {
        var self = this;
        var script = content.find('script');
        var i = 0,
            len = script.length;
        if (!len) return;
        for (; i < len; i++) {
            var src = script[i].src;
            if (/(kbase-static)/.test(src)) {
                //检查kbase-static有没有加载过
                var $kbaseStatic = $('body').find('#J-kbaseStatic');
                if ($kbaseStatic.length) {
                    $kbaseStatic.remove();
                }
                var ns = document.createElement('script');
                // 去除随机数,修复加载问题 http://gitlab.alipay-inc.com/x-platform/misc/issues/693
                //   ns.src = src + '?' + Math.random();
                ns.src = src;
                ns.id = 'J-kbaseStatic';
                ns.charset = 'utf-8';
                document.body.appendChild(ns);
            }
        }
    }
};
module.exports = Util;