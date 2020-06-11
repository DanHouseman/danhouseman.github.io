!function(window, document, undefined) {
    var tests = []
      , ModernizrProto = {
        _version: "3.8.0",
        _config: {
            classPrefix: "",
            enableClasses: !0,
            enableJSClass: !0,
            usePrefixes: !0
        },
        _q: [],
        on: function(e, t) {
            var r = this;
            setTimeout(function() {
                t(r[e])
            }, 0)
        },
        addTest: function(e, t, r) {
            tests.push({
                name: e,
                fn: t,
                options: r
            })
        },
        addAsyncTest: function(e) {
            tests.push({
                name: null,
                fn: e
            })
        }
    }
      , Modernizr = function() {};
    Modernizr.prototype = ModernizrProto,
    Modernizr = new Modernizr;
    var classes = [];
    function is(e, t) {
        return typeof e === t
    }
    function testRunner() {
        var e, t, r, n, o, i;
        for (var d in tests)
            if (tests.hasOwnProperty(d)) {
                if (e = [],
                (t = tests[d]).name && (e.push(t.name.toLowerCase()),
                t.options && t.options.aliases && t.options.aliases.length))
                    for (r = 0; r < t.options.aliases.length; r++)
                        e.push(t.options.aliases[r].toLowerCase());
                for (n = is(t.fn, "function") ? t.fn() : t.fn,
                o = 0; o < e.length; o++)
                    1 === (i = e[o].split(".")).length ? Modernizr[i[0]] = n : (Modernizr[i[0]] && (!Modernizr[i[0]] || Modernizr[i[0]]instanceof Boolean) || (Modernizr[i[0]] = new Boolean(Modernizr[i[0]])),
                    Modernizr[i[0]][i[1]] = n),
                    classes.push((n ? "" : "no-") + i.join("-"))
            }
    }
    var docElement = document.documentElement, isSVG = "svg" === docElement.nodeName.toLowerCase(), hasOwnProp, w;
    function setClasses(e) {
        var t = docElement.className
          , r = Modernizr._config.classPrefix || "";
        if (isSVG && (t = t.baseVal),
        Modernizr._config.enableJSClass) {
            var n = new RegExp("(^|\\s)" + r + "no-js(\\s|$)");
            t = t.replace(n, "$1" + r + "js$2")
        }
        Modernizr._config.enableClasses && (0 < e.length && (t += " " + r + e.join(" " + r)),
        isSVG ? docElement.className.baseVal = t : docElement.className = t)
    }
    function addTest(e, t) {
        if ("object" == typeof e)
            for (var r in e)
                hasOwnProp(e, r) && addTest(r, e[r]);
        else {
            var n = (e = e.toLowerCase()).split(".")
              , o = Modernizr[n[0]];
            if (2 === n.length && (o = o[n[1]]),
            void 0 !== o)
                return Modernizr;
            t = "function" == typeof t ? t() : t,
            1 === n.length ? Modernizr[n[0]] = t : (!Modernizr[n[0]] || Modernizr[n[0]]instanceof Boolean || (Modernizr[n[0]] = new Boolean(Modernizr[n[0]])),
            Modernizr[n[0]][n[1]] = t),
            setClasses([(t && !1 !== t ? "" : "no-") + n.join("-")]),
            Modernizr._trigger(e, t)
        }
        return Modernizr
    }
    w = {}.hasOwnProperty,
    hasOwnProp = is(w, "undefined") || is(w.call, "undefined") ? function(e, t) {
        return t in e && is(e.constructor.prototype[t], "undefined")
    }
    : function(e, t) {
        return w.call(e, t)
    }
    ,
    ModernizrProto._l = {},
    ModernizrProto.on = function(e, t) {
        this._l[e] || (this._l[e] = []),
        this._l[e].push(t),
        Modernizr.hasOwnProperty(e) && setTimeout(function() {
            Modernizr._trigger(e, Modernizr[e])
        }, 0)
    }
    ,
    ModernizrProto._trigger = function(e, t) {
        if (this._l[e]) {
            var r = this._l[e];
            setTimeout(function() {
                var e;
                for (e = 0; e < r.length; e++)
                    (0,
                    r[e])(t)
            }, 0),
            delete this._l[e]
        }
    }
    ,
    Modernizr._q.push(function() {
        ModernizrProto.addTest = addTest
    });
    var omPrefixes = "Moz O ms Webkit"
      , cssomPrefixes = ModernizrProto._config.usePrefixes ? omPrefixes.split(" ") : [];
    ModernizrProto._cssomPrefixes = cssomPrefixes;
    var atRule = function(e) {
        var t, r = prefixes.length, n = window.CSSRule;
        if (void 0 === n)
            return undefined;
        if (!e)
            return !1;
        if ((t = (e = e.replace(/^@/, "")).replace(/-/g, "_").toUpperCase() + "_RULE")in n)
            return "@" + e;
        for (var o = 0; o < r; o++) {
            var i = prefixes[o];
            if (i.toUpperCase() + "_" + t in n)
                return "@-" + i.toLowerCase() + "-" + e
        }
        return !1
    };
    ModernizrProto.atRule = atRule;
    var domPrefixes = ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(" ") : [];
    function createElement() {
        return "function" != typeof document.createElement ? document.createElement(arguments[0]) : isSVG ? document.createElementNS.call(document, "http://www.w3.org/2000/svg", arguments[0]) : document.createElement.apply(document, arguments)
    }
    ModernizrProto._domPrefixes = domPrefixes;
    var hasEvent = (U = !("onblur"in docElement),
    function(e, t) {
        var r;
        return !!e && (t && "string" != typeof t || (t = createElement(t || "div")),
        !(r = (e = "on" + e)in t) && U && (t.setAttribute || (t = createElement("div")),
        t.setAttribute(e, ""),
        r = "function" == typeof t[e],
        t[e] !== undefined && (t[e] = undefined),
        t.removeAttribute(e)),
        r)
    }
    ), U, html5;
    ModernizrProto.hasEvent = hasEvent,
    isSVG || function(e, d) {
        var o, a, t = e.html5 || {}, i = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, s = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, r = "_html5shiv", n = 0, l = {};
        function u(e, t) {
            var r = e.createElement("p")
              , n = e.getElementsByTagName("head")[0] || e.documentElement;
            return r.innerHTML = "x<style>" + t + "</style>",
            n.insertBefore(r.lastChild, n.firstChild)
        }
        function p() {
            var e = h.elements;
            return "string" == typeof e ? e.split(" ") : e
        }
        function m(e) {
            var t = l[e[r]];
            return t || (t = {},
            n++,
            e[r] = n,
            l[n] = t),
            t
        }
        function c(e, t, r) {
            return t = t || d,
            a ? t.createElement(e) : !(n = (r = r || m(t)).cache[e] ? r.cache[e].cloneNode() : s.test(e) ? (r.cache[e] = r.createElem(e)).cloneNode() : r.createElem(e)).canHaveChildren || i.test(e) || n.tagUrn ? n : r.frag.appendChild(n);
            var n
        }
        function f(e) {
            var t, r, n = m(e = e || d);
            return !h.shivCSS || o || n.hasCSS || (n.hasCSS = !!u(e, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),
            a || (t = e,
            (r = n).cache || (r.cache = {},
            r.createElem = t.createElement,
            r.createFrag = t.createDocumentFragment,
            r.frag = r.createFrag()),
            t.createElement = function(e) {
                return h.shivMethods ? c(e, t, r) : r.createElem(e)
            }
            ,
            t.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + p().join().replace(/[\w\-:]+/g, function(e) {
                return r.createElem(e),
                r.frag.createElement(e),
                'c("' + e + '")'
            }) + ");return n}")(h, r.frag)),
            e
        }
        !function() {
            try {
                var e = d.createElement("a");
                e.innerHTML = "<xyz></xyz>",
                o = "hidden"in e,
                a = 1 == e.childNodes.length || function() {
                    d.createElement("a");
                    var e = d.createDocumentFragment();
                    return void 0 === e.cloneNode || void 0 === e.createDocumentFragment || void 0 === e.createElement
                }()
            } catch (e) {
                a = o = !0
            }
        }();
        var h = {
            elements: t.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",
            version: "3.7.3",
            shivCSS: !1 !== t.shivCSS,
            supportsUnknownElements: a,
            shivMethods: !1 !== t.shivMethods,
            type: "default",
            shivDocument: f,
            createElement: c,
            createDocumentFragment: function(e, t) {
                if (e = e || d,
                a)
                    return e.createDocumentFragment();
                for (var r = (t = t || m(e)).frag.cloneNode(), n = 0, o = p(), i = o.length; n < i; n++)
                    r.createElement(o[n]);
                return r
            },
            addElements: function(e, t) {
                var r = h.elements;
                "string" != typeof r && (r = r.join(" ")),
                "string" != typeof e && (e = e.join(" ")),
                h.elements = r + " " + e,
                f(t)
            }
        };
        e.html5 = h,
        f(d);
        var y, v = /^$|\b(?:all|print)\b/, g = "html5shiv", w = !(a || (y = d.documentElement,
        void 0 === d.namespaces || void 0 === d.parentWindow || void 0 === y.applyElement || void 0 === y.removeNode || void 0 === e.attachEvent));
        function M(e) {
            for (var t, r = e.attributes, n = r.length, o = e.ownerDocument.createElement(g + ":" + e.nodeName); n--; )
                (t = r[n]).specified && o.setAttribute(t.nodeName, t.nodeValue);
            return o.style.cssText = e.style.cssText,
            o
        }
        h.type += " print",
        (h.shivPrint = function(a) {
            var s, l, e = m(a), t = a.namespaces, r = a.parentWindow;
            if (!w || a.printShived)
                return a;
            function c() {
                clearTimeout(e._removeSheetTimer),
                s && s.removeNode(!0),
                s = null
            }
            return void 0 === t[g] && t.add(g),
            r.attachEvent("onbeforeprint", function() {
                c();
                for (var e, t, r, n = a.styleSheets, i = [], o = n.length, d = Array(o); o--; )
                    d[o] = n[o];
                for (; r = d.pop(); )
                    if (!r.disabled && v.test(r.media)) {
                        try {
                            t = (e = r.imports).length
                        } catch (e) {
                            t = 0
                        }
                        for (o = 0; o < t; o++)
                            d.push(e[o]);
                        try {
                            i.push(r.cssText)
                        } catch (e) {}
                    }
                i = function() {
                    for (var e, t = i.reverse().join("").split("{"), r = t.length, n = RegExp("(^|[\\s,>+~])(" + p().join("|") + ")(?=[[\\s,>+~#.:]|$)", "gi"), o = "$1" + g + "\\:$2"; r--; )
                        (e = t[r] = t[r].split("}"))[e.length - 1] = e[e.length - 1].replace(n, o),
                        t[r] = e.join("}");
                    return t.join("{")
                }(),
                l = function() {
                    for (var e, t = a.getElementsByTagName("*"), r = t.length, n = RegExp("^(?:" + p().join("|") + ")$", "i"), o = []; r--; )
                        e = t[r],
                        n.test(e.nodeName) && o.push(e.applyElement(M(e)));
                    return o
                }(),
                s = u(a, i)
            }),
            r.attachEvent("onafterprint", function() {
                !function(e) {
                    for (var t = e.length; t--; )
                        e[t].removeNode()
                }(l),
                clearTimeout(e._removeSheetTimer),
                e._removeSheetTimer = setTimeout(c, 500)
            }),
            a.printShived = !0,
            a
        }
        )(d),
        "object" == typeof module && module.exports && (module.exports = h)
    }(void 0 !== window ? window : this, document);
    var err = function() {}
      , warn = function() {};
    function getBody() {
        var e = document.body;
        return e || ((e = createElement(isSVG ? "svg" : "body")).fake = !0),
        e
    }
    function injectElementWithStyles(e, t, r, n) {
        var o, i, d, a, s = "modernizr", l = createElement("div"), c = getBody();
        if (parseInt(r, 10))
            for (; r--; )
                (d = createElement("div")).id = n ? n[r] : s + (r + 1),
                l.appendChild(d);
        return (o = createElement("style")).type = "text/css",
        o.id = "s" + s,
        (c.fake ? c : l).appendChild(o),
        c.appendChild(l),
        o.styleSheet ? o.styleSheet.cssText = e : o.appendChild(document.createTextNode(e)),
        l.id = s,
        c.fake && (c.style.background = "",
        c.style.overflow = "hidden",
        a = docElement.style.overflow,
        docElement.style.overflow = "hidden",
        docElement.appendChild(c)),
        i = t(l, e),
        c.fake ? (c.parentNode.removeChild(c),
        docElement.style.overflow = a,
        docElement.offsetHeight) : l.parentNode.removeChild(l),
        !!i
    }
    window.console && (err = function() {
        var e = console.error ? "error" : "log";
        window.console[e].apply(window.console, Array.prototype.slice.call(arguments))
    }
    ,
    warn = function() {
        var e = console.warn ? "warn" : "log";
        window.console[e].apply(window.console, Array.prototype.slice.call(arguments))
    }
    ),
    ModernizrProto.load = function() {
        "yepnope"in window ? (warn("yepnope.js (aka Modernizr.load) is no longer included as part of Modernizr. yepnope appears to be available on the page, so we’ll use it to handle this call to Modernizr.load, but please update your code to use yepnope directly.\n See http://github.com/Modernizr/Modernizr/issues/1182 for more information."),
        window.yepnope.apply(window, [].slice.call(arguments, 0))) : err("yepnope.js (aka Modernizr.load) is no longer included as part of Modernizr. Get it from http://yepnopejs.com. See http://github.com/Modernizr/Modernizr/issues/1182 for more information.")
    }
    ;
    var mq = (Yb = window.matchMedia || window.msMatchMedia,
    Yb ? function(e) {
        var t = Yb(e);
        return t && t.matches || !1
    }
    : function(e) {
        var t = !1;
        return injectElementWithStyles("@media " + e + " { #modernizr { position: absolute; } }", function(e) {
            t = "absolute" === (window.getComputedStyle ? window.getComputedStyle(e, null) : e.currentStyle).position
        }),
        t
    }
    ), Yb;
    function contains(e, t) {
        return !!~("" + e).indexOf(t)
    }
    ModernizrProto.mq = mq;
    var modElem = {
        elem: createElement("modernizr")
    };
    Modernizr._q.push(function() {
        delete modElem.elem
    });
    var mStyle = {
        style: modElem.elem.style
    };
    function domToCSS(e) {
        return e.replace(/([A-Z])/g, function(e, t) {
            return "-" + t.toLowerCase()
        }).replace(/^ms-/, "-ms-")
    }
    function computedStyle(e, t, r) {
        var n;
        if ("getComputedStyle"in window) {
            n = getComputedStyle.call(window, e, t);
            var o = window.console;
            null !== n ? r && (n = n.getPropertyValue(r)) : o && o[o.error ? "error" : "log"].call(o, "getComputedStyle returning null, its possible modernizr test results are inaccurate")
        } else
            n = !t && e.currentStyle && e.currentStyle[r];
        return n
    }
    function nativeTestProps(e, t) {
        var r = e.length;
        if ("CSS"in window && "supports"in window.CSS) {
            for (; r--; )
                if (window.CSS.supports(domToCSS(e[r]), t))
                    return !0;
            return !1
        }
        if ("CSSSupportsRule"in window) {
            for (var n = []; r--; )
                n.push("(" + domToCSS(e[r]) + ":" + t + ")");
            return injectElementWithStyles("@supports (" + (n = n.join(" or ")) + ") { #modernizr { position: absolute; } }", function(e) {
                return "absolute" === computedStyle(e, null, "position")
            })
        }
        return undefined
    }
    function cssToDOM(e) {
        return e.replace(/([a-z])-([a-z])/g, function(e, t, r) {
            return t + r.toUpperCase()
        }).replace(/^-/, "")
    }
    function testProps(e, t, r, n) {
        if (n = !is(n, "undefined") && n,
        !is(r, "undefined")) {
            var o = nativeTestProps(e, r);
            if (!is(o, "undefined"))
                return o
        }
        for (var i, d, a, s, l, c = ["modernizr", "tspan", "samp"]; !mStyle.style && c.length; )
            i = !0,
            mStyle.modElem = createElement(c.shift()),
            mStyle.style = mStyle.modElem.style;
        function u() {
            i && (delete mStyle.style,
            delete mStyle.modElem)
        }
        for (a = e.length,
        d = 0; d < a; d++)
            if (s = e[d],
            l = mStyle.style[s],
            contains(s, "-") && (s = cssToDOM(s)),
            mStyle.style[s] !== undefined) {
                if (n || is(r, "undefined"))
                    return u(),
                    "pfx" !== t || s;
                try {
                    mStyle.style[s] = r
                } catch (e) {}
                if (mStyle.style[s] !== l)
                    return u(),
                    "pfx" !== t || s
            }
        return u(),
        !1
    }
    function fnBind(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    }
    function testDOMProps(e, t, r) {
        var n;
        for (var o in e)
            if (e[o]in t)
                return !1 === r ? e[o] : is(n = t[e[o]], "function") ? fnBind(n, r || t) : n;
        return !1
    }
    function testPropsAll(e, t, r, n, o) {
        var i = e.charAt(0).toUpperCase() + e.slice(1)
          , d = (e + " " + cssomPrefixes.join(i + " ") + i).split(" ");
        return is(t, "string") || is(t, "undefined") ? testProps(d, t, n, o) : testDOMProps(d = (e + " " + domPrefixes.join(i + " ") + i).split(" "), t, r)
    }
    Modernizr._q.unshift(function() {
        delete mStyle.style
    }),
    ModernizrProto.testAllProps = testPropsAll;
    var prefixed = ModernizrProto.prefixed = function(e, t, r) {
        return 0 === e.indexOf("@") ? atRule(e) : (-1 !== e.indexOf("-") && (e = cssToDOM(e)),
        t ? testPropsAll(e, t, r) : testPropsAll(e, "pfx"))
    }
      , prefixes = ModernizrProto._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : ["", ""];
    ModernizrProto._prefixes = prefixes;
    var prefixedCSS = ModernizrProto.prefixedCSS = function(e) {
        var t = prefixed(e);
        return t && domToCSS(t)
    }
    ;
    function testAllProps(e, t, r) {
        return testPropsAll(e, undefined, undefined, t, r)
    }
    ModernizrProto.testAllProps = testAllProps;
    var testProp = ModernizrProto.testProp = function(e, t, r) {
        return testProps([e], undefined, t, r)
    }
      , testStyles = ModernizrProto.testStyles = injectElementWithStyles;
    Modernizr.addTest("adownload", !window.externalHost && "download"in createElement("a")),
    Modernizr.addTest("ambientlight", hasEvent("devicelight", window)),
    Modernizr.addTest("applicationcache", "applicationCache"in window),
    function() {
        var t = createElement("audio");
        Modernizr.addTest("audio", function() {
            var e = !1;
            try {
                e = (e = !!t.canPlayType) && new Boolean(e)
            } catch (e) {}
            return e
        });
        try {
            t.canPlayType && (Modernizr.addTest("audio.ogg", t.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, "")),
            Modernizr.addTest("audio.mp3", t.canPlayType('audio/mpeg; codecs="mp3"').replace(/^no$/, "")),
            Modernizr.addTest("audio.opus", t.canPlayType('audio/ogg; codecs="opus"') || t.canPlayType('audio/webm; codecs="opus"').replace(/^no$/, "")),
            Modernizr.addTest("audio.wav", t.canPlayType('audio/wav; codecs="1"').replace(/^no$/, "")),
            Modernizr.addTest("audio.m4a", (t.canPlayType("audio/x-m4a;") || t.canPlayType("audio/aac;")).replace(/^no$/, "")))
        } catch (e) {}
    }(),
    Modernizr.addTest("audioloop", "loop"in createElement("audio")),
    Modernizr.addTest("webaudio", function() {
        var e = "webkitAudioContext"in window
          , t = "AudioContext"in window;
        return Modernizr._config.usePrefixes && e || t
    }),
    Modernizr.addTest("batteryapi", !!prefixed("battery", navigator) || !!prefixed("getBattery", navigator), {
        aliases: ["battery-api"]
    }),
    Modernizr.addTest("lowbattery", function() {
        var e = prefixed("battery", navigator);
        return !!(e && !e.charging && e.level <= .2)
    }),
    Modernizr.addTest("blobconstructor", function() {
        try {
            return !!new Blob
        } catch (e) {
            return !1
        }
    }, {
        aliases: ["blob-constructor"]
    }),
    Modernizr.addTest("canvas", function() {
        var e = createElement("canvas");
        return !(!e.getContext || !e.getContext("2d"))
    }),
    Modernizr.addTest("canvasblending", function() {
        if (!1 === Modernizr.canvas)
            return !1;
        var e = createElement("canvas").getContext("2d");
        try {
            e.globalCompositeOperation = "screen"
        } catch (e) {}
        return "screen" === e.globalCompositeOperation
    });
    var canvas = createElement("canvas");
    Modernizr.addTest("todataurljpeg", function() {
        return !!Modernizr.canvas && 0 === canvas.toDataURL("image/jpeg").indexOf("data:image/jpeg")
    }),
    Modernizr.addTest("todataurlpng", function() {
        return !!Modernizr.canvas && 0 === canvas.toDataURL("image/png").indexOf("data:image/png")
    }),
    Modernizr.addTest("todataurlwebp", function() {
        var e = !1;
        try {
            e = !!Modernizr.canvas && 0 === canvas.toDataURL("image/webp").indexOf("data:image/webp")
        } catch (e) {}
        return e
    }),
    Modernizr.addTest("canvaswinding", function() {
        if (!1 === Modernizr.canvas)
            return !1;
        var e = createElement("canvas").getContext("2d");
        return e.rect(0, 0, 10, 10),
        e.rect(2, 2, 6, 6),
        !1 === e.isPointInPath(5, 5, "evenodd")
    }),
    Modernizr.addTest("canvastext", function() {
        return !1 !== Modernizr.canvas && "function" == typeof createElement("canvas").getContext("2d").fillText
    }),
    Modernizr.addTest("contenteditable", function() {
        if ("contentEditable"in docElement) {
            var e = createElement("div");
            return e.contentEditable = !0,
            "true" === e.contentEditable
        }
    }),
    Modernizr.addTest("contextmenu", "contextMenu"in docElement && "HTMLMenuItemElement"in window),
    Modernizr.addTest("cookies", function() {
        try {
            document.cookie = "cookietest=1";
            var e = -1 !== document.cookie.indexOf("cookietest=");
            return document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT",
            e
        } catch (e) {
            return !1
        }
    }),
    Modernizr.addTest("cors", "XMLHttpRequest"in window && "withCredentials"in new XMLHttpRequest);
    var crypto = prefixed("crypto", window);
    Modernizr.addTest("crypto", !!prefixed("subtle", crypto));
    var crypto = prefixed("crypto", window), supportsGetRandomValues;
    if (crypto && "getRandomValues"in crypto && "Uint32Array"in window) {
        var array = new Uint32Array(10)
          , values = crypto.getRandomValues(array);
        supportsGetRandomValues = values && is(values[0], "number")
    }
    Modernizr.addTest("getrandomvalues", !!supportsGetRandomValues),
    Modernizr.addTest("cssall", "all"in docElement.style),
    Modernizr.addTest("cssanimations", testAllProps("animationName", "a", !0)),
    Modernizr.addTest("appearance", testAllProps("appearance")),
    Modernizr.addTest("backdropfilter", testAllProps("backdropFilter")),
    Modernizr.addTest("backgroundblendmode", prefixed("backgroundBlendMode", "text")),
    Modernizr.addTest("backgroundcliptext", function() {
        return testAllProps("backgroundClip", "text")
    }),
    Modernizr.addTest("bgpositionshorthand", function() {
        var e = createElement("a").style
          , t = "right 10px bottom 10px";
        return e.cssText = "background-position: " + t + ";",
        e.backgroundPosition === t
    }),
    Modernizr.addTest("bgpositionxy", function() {
        return testAllProps("backgroundPositionX", "3px", !0) && testAllProps("backgroundPositionY", "5px", !0)
    }),
    Modernizr.addTest("bgrepeatround", testAllProps("backgroundRepeat", "round")),
    Modernizr.addTest("bgrepeatspace", testAllProps("backgroundRepeat", "space")),
    Modernizr.addTest("backgroundsize", testAllProps("backgroundSize", "100%", !0)),
    Modernizr.addTest("bgsizecover", testAllProps("backgroundSize", "cover")),
    Modernizr.addTest("borderimage", testAllProps("borderImage", "url() 1", !0)),
    Modernizr.addTest("borderradius", testAllProps("borderRadius", "0px", !0)),
    Modernizr.addTest("boxdecorationbreak", testAllProps("boxDecorationBreak", "slice")),
    Modernizr.addTest("boxshadow", testAllProps("boxShadow", "1px 1px", !0)),
    Modernizr.addTest("boxsizing", testAllProps("boxSizing", "border-box", !0) && (document.documentMode === undefined || 7 < document.documentMode)),
    Modernizr.addTest("csscalc", function() {
        var e = createElement("a");
        return e.style.cssText = "width:" + prefixes.join("calc(10px);width:"),
        !!e.style.length
    }),
    Modernizr.addTest("checked", function() {
        return testStyles("#modernizr {position:absolute} #modernizr input {margin-left:10px} #modernizr :checked {margin-left:20px;display:block}", function(e) {
            var t = createElement("input");
            return t.setAttribute("type", "checkbox"),
            t.setAttribute("checked", "checked"),
            e.appendChild(t),
            20 === t.offsetLeft
        })
    }),
    Modernizr.addTest("csschunit", function() {
        var t, e = modElem.elem.style;
        try {
            e.fontSize = "3ch",
            t = -1 !== e.fontSize.indexOf("ch")
        } catch (e) {
            t = !1
        }
        return t
    }),
    function() {
        Modernizr.addTest("csscolumns", function() {
            var e = !1
              , t = testAllProps("columnCount");
            try {
                e = (e = !!t) && new Boolean(e)
            } catch (e) {}
            return e
        });
        for (var e, t, r = ["Width", "Span", "Fill", "Gap", "Rule", "RuleColor", "RuleStyle", "RuleWidth", "BreakBefore", "BreakAfter", "BreakInside"], n = 0; n < r.length; n++)
            e = r[n].toLowerCase(),
            t = testAllProps("column" + r[n]),
            "breakbefore" !== e && "breakafter" !== e && "breakinside" !== e || (t = t || testAllProps(r[n])),
            Modernizr.addTest("csscolumns." + e, t)
    }(),
    Modernizr.addTest("cssgridlegacy", testAllProps("grid-columns", "10px", !0)),
    Modernizr.addTest("cssgrid", testAllProps("grid-template-rows", "none", !0)),
    Modernizr.addTest("cubicbezierrange", function() {
        var e = createElement("a");
        return e.style.cssText = prefixes.join("transition-timing-function:cubic-bezier(1,0,0,1.1); "),
        !!e.style.length
    });
    var supportsFn = window.CSS && window.CSS.supports.bind(window.CSS) || window.supportsCSS;
    Modernizr.addTest("customproperties", !!supportsFn && (supportsFn("--f:0") || supportsFn("--f", 0))),
    Modernizr.addTest("displayrunin", testAllProps("display", "run-in"), {
        aliases: ["display-runin"]
    }),
    testStyles("#modernizr{display: table; direction: ltr}#modernizr div{display: table-cell; padding: 10px}", function(e) {
        var t, r = e.childNodes;
        t = r[0].offsetLeft < r[1].offsetLeft,
        Modernizr.addTest("displaytable", t, {
            aliases: ["display-table"]
        })
    }, 2),
    Modernizr.addTest("ellipsis", testAllProps("textOverflow", "ellipsis"));
    var CSS = window.CSS;
    Modernizr.addTest("cssescape", !!CSS && "function" == typeof CSS.escape),
    Modernizr.addTest("cssexunit", function() {
        var t, e = modElem.elem.style;
        try {
            e.fontSize = "3ex",
            t = -1 !== e.fontSize.indexOf("ex")
        } catch (e) {
            t = !1
        }
        return t
    });
    var newSyntax = "CSS"in window && "supports"in window.CSS
      , oldSyntax = "supportsCSS"in window;
    Modernizr.addTest("supports", newSyntax || oldSyntax),
    Modernizr.addTest("cssfilters", function() {
        if (Modernizr.supports)
            return testAllProps("filter", "blur(2px)");
        var e = createElement("a");
        return e.style.cssText = prefixes.join("filter:blur(2px); "),
        !!e.style.length && (document.documentMode === undefined || 9 < document.documentMode)
    }),
    Modernizr.addTest("flexbox", testAllProps("flexBasis", "1px", !0)),
    Modernizr.addTest("flexboxlegacy", testAllProps("boxDirection", "reverse", !0)),
    Modernizr.addTest("flexboxtweener", testAllProps("flexAlign", "end", !0)),
    Modernizr.addTest("flexwrap", testAllProps("flexWrap", "wrap", !0)),
    Modernizr.addTest("flexgap", function() {
        var e = createElement("div");
        e.style.display = "flex",
        e.style.flexDirection = "column",
        e.style.rowGap = "1px",
        e.appendChild(createElement("div")),
        e.appendChild(createElement("div")),
        docElement.appendChild(e);
        var t = 1 === e.scrollHeight;
        return e.parentNode.removeChild(e),
        t
    }),
    Modernizr.addTest("focuswithin", function() {
        try {
            document.querySelector(":focus-within")
        } catch (e) {
            return !1
        }
        return !0
    }),
    Modernizr.addTest("fontDisplay", testProp("font-display"));
    var blacklist = (_d = navigator.userAgent,
    ae = _d.match(/w(eb)?osbrowser/gi),
    be = _d.match(/windows phone/gi) && _d.match(/iemobile\/([0-9])+/gi) && 9 <= parseFloat(RegExp.$1),
    ae || be), _d, ae, be;
    function roundedEquals(e, t) {
        return e - 1 === t || e === t || e + 1 === t
    }
    blacklist ? Modernizr.addTest("fontface", !1) : testStyles('@font-face {font-family:"font";src:url("https://")}', function(e, t) {
        var r = document.getElementById("smodernizr")
          , n = r.sheet || r.styleSheet
          , o = n ? n.cssRules && n.cssRules[0] ? n.cssRules[0].cssText : n.cssText || "" : ""
          , i = /src/i.test(o) && 0 === o.indexOf(t.split(" ")[0]);
        Modernizr.addTest("fontface", i)
    }),
    testStyles('#modernizr{font:0/0 a}#modernizr:after{content:":)";visibility:hidden;font:7px/1 a}', function(e) {
        Modernizr.addTest("generatedcontent", 6 <= e.offsetHeight)
    }),
    Modernizr.addTest("cssgradients", function() {
        for (var e, t = "background-image:", r = "", n = 0, o = prefixes.length - 1; n < o; n++)
            e = 0 === n ? "to " : "",
            r += t + prefixes[n] + "linear-gradient(" + e + "left top, #9f9, white);";
        Modernizr._config.usePrefixes && (r += t + "-webkit-gradient(linear,left top,right bottom,from(#9f9),to(white));");
        var i = createElement("a").style;
        return i.cssText = r,
        -1 < ("" + i.backgroundImage).indexOf("gradient")
    }),
    Modernizr.addTest("hairline", function() {
        return testStyles("#modernizr {border:.5px solid transparent}", function(e) {
            return 1 === e.offsetHeight
        })
    }),
    Modernizr.addTest("hsla", function() {
        var e = createElement("a").style;
        return e.cssText = "background-color:hsla(120,40%,100%,.5)",
        contains(e.backgroundColor, "rgba") || contains(e.backgroundColor, "hsla")
    }),
    Modernizr.addTest("cssinvalid", function() {
        return testStyles("#modernizr input{height:0;border:0;padding:0;margin:0;width:10px} #modernizr input:invalid{width:50px}", function(e) {
            var t = createElement("input");
            return t.required = !0,
            e.appendChild(t),
            10 < t.clientWidth
        })
    }),
    testStyles("#modernizr div {width:100px} #modernizr :last-child{width:200px;display:block}", function(e) {
        Modernizr.addTest("lastchild", e.lastChild.offsetWidth > e.firstChild.offsetWidth)
    }, 2),
    Modernizr.addTest("cssmask", testAllProps("maskRepeat", "repeat-x", !0)),
    Modernizr.addTest("mediaqueries", mq("only all")),
    Modernizr.addTest("multiplebgs", function() {
        var e = createElement("a").style;
        return e.cssText = "background:url(https://),url(https://),red url(https://)",
        /(url\s*\(.*?){3}/.test(e.background)
    }),
    testStyles("#modernizr div {width:1px} #modernizr div:nth-child(2n) {width:2px;}", function(e) {
        for (var t = e.getElementsByTagName("div"), r = !0, n = 0; n < 5; n++)
            r = r && t[n].offsetWidth === n % 2 + 1;
        Modernizr.addTest("nthchild", r)
    }, 5),
    Modernizr.addTest("objectfit", !!prefixed("objectFit"), {
        aliases: ["object-fit"]
    }),
    Modernizr.addTest("opacity", function() {
        var e = createElement("a").style;
        return e.cssText = prefixes.join("opacity:.55;"),
        /^0.55$/.test(e.opacity)
    }),
    Modernizr.addTest("overflowscrolling", testAllProps("overflowScrolling", "touch", !0)),
    Modernizr.addTest("csspointerevents", function() {
        var e = createElement("a").style;
        return e.cssText = "pointer-events:auto",
        "auto" === e.pointerEvents
    }),
    Modernizr.addTest("csspositionsticky", function() {
        var e = "position:"
          , t = createElement("a").style;
        return t.cssText = e + prefixes.join("sticky;" + e).slice(0, -e.length),
        -1 !== t.position.indexOf("sticky")
    }),
    Modernizr.addTest("csspseudoanimations", function() {
        var t = !1;
        if (!Modernizr.cssanimations || !window.getComputedStyle)
            return t;
        var e = ["@", prefixes.join("keyframes csspseudoanimations { from { font-size: 10px; } }@").replace(/\@$/, ""), '#modernizr:before { content:" "; font-size:5px;', prefixes.join("animation:csspseudoanimations 1ms infinite;"), "}"].join("");
        return testStyles(e, function(e) {
            t = "10px" === window.getComputedStyle(e, ":before").getPropertyValue("font-size")
        }),
        t
    }),
    Modernizr.addTest("csstransitions", testAllProps("transition", "all", !0)),
    Modernizr.addTest("csspseudotransitions", function() {
        var t = !1;
        if (!Modernizr.csstransitions || !window.getComputedStyle)
            return t;
        var e = '#modernizr:before { content:" "; font-size:5px;' + prefixes.join("transition:0s 100s;") + "}#modernizr.trigger:before { font-size:10px; }";
        return testStyles(e, function(e) {
            window.getComputedStyle(e, ":before").getPropertyValue("font-size"),
            e.className += "trigger",
            t = "5px" === window.getComputedStyle(e, ":before").getPropertyValue("font-size")
        }),
        t
    }),
    Modernizr.addTest("cssreflections", testAllProps("boxReflect", "above", !0)),
    Modernizr.addTest("regions", function() {
        if (isSVG)
            return !1;
        var e = prefixed("flowFrom")
          , t = prefixed("flowInto")
          , r = !1;
        if (!e || !t)
            return r;
        var n, o, i = createElement("iframe"), d = createElement("div"), a = createElement("div"), s = createElement("div"), l = "modernizr_flow_for_regions_check";
        a.innerText = "M",
        d.style.cssText = "top: 150px; left: 150px; padding: 0px;",
        s.style.cssText = "width: 50px; height: 50px; padding: 42px;",
        s.style[e] = l,
        d.appendChild(a),
        d.appendChild(s),
        docElement.appendChild(d);
        var c = a.getBoundingClientRect();
        return a.style[t] = l,
        n = a.getBoundingClientRect(),
        o = parseInt(n.left - c.left, 10),
        docElement.removeChild(d),
        42 === o ? r = !0 : (docElement.appendChild(i),
        c = i.getBoundingClientRect(),
        i.style[t] = l,
        n = i.getBoundingClientRect(),
        0 < c.height && c.height !== n.height && 0 === n.height && (r = !0)),
        a = s = d = i = undefined,
        r
    }),
    Modernizr.addTest("cssremunit", function() {
        var e = createElement("a").style;
        try {
            e.fontSize = "3rem"
        } catch (e) {}
        return /rem/.test(e.fontSize)
    }),
    Modernizr.addTest("cssresize", testAllProps("resize", "both", !0)),
    Modernizr.addTest("rgba", function() {
        var e = createElement("a").style;
        return e.cssText = "background-color:rgba(150,255,150,.5)",
        -1 < ("" + e.backgroundColor).indexOf("rgba")
    }),
    testStyles("#modernizr{overflow: scroll; width: 40px; height: 40px; }#" + prefixes.join("scrollbar{width:10px} #modernizr::").split("#").slice(1).join("#") + "scrollbar{width:10px}", function(e) {
        Modernizr.addTest("cssscrollbar", "scrollWidth"in e && 30 === e.scrollWidth)
    }),
    Modernizr.addTest("scrollsnappoints", testAllProps("scrollSnapType")),
    Modernizr.addTest("shapes", testAllProps("shapeOutside", "content-box", !0)),
    Modernizr.addTest("siblinggeneral", function() {
        return testStyles("#modernizr div {width:100px} #modernizr div ~ div {width:200px;display:block}", function(e) {
            return 200 === e.lastChild.offsetWidth
        }, 2)
    }),
    testStyles("#modernizr{position: absolute; top: -10em; visibility:hidden; font: normal 10px arial;}#subpixel{float: left; font-size: 33.3333%;}", function(e) {
        var t = e.firstChild;
        t.innerHTML = "This is a text written in Arial",
        Modernizr.addTest("subpixelfont", !!window.getComputedStyle && "44px" !== window.getComputedStyle(t, null).getPropertyValue("width"))
    }, 1, ["subpixel"]),
    Modernizr.addTest("target", function() {
        var e = window.document;
        if (!("querySelectorAll"in e))
            return !1;
        try {
            return e.querySelectorAll(":target"),
            !0
        } catch (e) {
            return !1
        }
    }),
    Modernizr.addTest("textalignlast", testAllProps("textAlignLast")),
    function() {
        Modernizr.addTest("textdecoration", function() {
            var e = !1
              , t = testAllProps("textDecoration");
            try {
                e = (e = !!t) && new Boolean(e)
            } catch (e) {}
            return e
        });
        for (var e, t, r = ["Line", "Style", "Color", "Skip", "SkipInk"], n = 0; n < r.length; n++)
            e = r[n].toLowerCase(),
            t = testAllProps("textDecoration" + r[n]),
            Modernizr.addTest("textdecoration." + e, t)
    }(),
    Modernizr.addTest("textshadow", testProp("textShadow", "1px 1px")),
    Modernizr.addTest("csstransforms", function() {
        return -1 === navigator.userAgent.indexOf("Android 2.") && testAllProps("transform", "scale(1)", !0)
    }),
    Modernizr.addTest("csstransforms3d", function() {
        return !!testAllProps("perspective", "1px", !0)
    }),
    Modernizr.addTest("csstransformslevel2", function() {
        return testAllProps("translate", "45px", !0)
    }),
    Modernizr.addTest("preserve3d", function() {
        var e, t, r = window.CSS, n = !1;
        return !!(r && r.supports && r.supports("(transform-style: preserve-3d)")) || (e = createElement("a"),
        t = createElement("a"),
        e.style.cssText = "display: block; transform-style: preserve-3d; transform-origin: right; transform: rotateY(40deg);",
        t.style.cssText = "display: block; width: 9px; height: 1px; background: #000; transform-origin: right; transform: rotateY(40deg);",
        e.appendChild(t),
        docElement.appendChild(e),
        n = t.getBoundingClientRect(),
        docElement.removeChild(e),
        n.width && n.width < 4)
    }),
    Modernizr.addTest("userselect", testAllProps("userSelect", "none", !0)),
    Modernizr.addTest("cssvalid", function() {
        return testStyles("#modernizr input{height:0;border:0;padding:0;margin:0;width:10px} #modernizr input:valid{width:50px}", function(e) {
            var t = createElement("input");
            return e.appendChild(t),
            10 < t.clientWidth
        })
    }),
    Modernizr.addTest("variablefonts", testAllProps("fontVariationSettings")),
    testStyles("#modernizr { height: 50vh; max-height: 10px; }", function(e) {
        var t = parseInt(computedStyle(e, null, "height"), 10);
        Modernizr.addTest("cssvhunit", 10 === t)
    }),
    testStyles("#modernizr1{width: 50vmax}#modernizr2{width:50px;height:50px;overflow:scroll}#modernizr3{position:fixed;top:0;left:0;bottom:0;right:0}", function(e) {
        var t = e.childNodes[2]
          , r = e.childNodes[1]
          , n = e.childNodes[0]
          , o = parseInt((r.offsetWidth - r.clientWidth) / 2, 10)
          , i = n.clientWidth / 100
          , d = n.clientHeight / 100
          , a = parseInt(50 * Math.max(i, d), 10)
          , s = parseInt(computedStyle(t, null, "width"), 10);
        Modernizr.addTest("cssvmaxunit", roundedEquals(a, s) || roundedEquals(a, s - o))
    }, 3),
    testStyles("#modernizr1{width: 50vm;width:50vmin}#modernizr2{width:50px;height:50px;overflow:scroll}#modernizr3{position:fixed;top:0;left:0;bottom:0;right:0}", function(e) {
        var t = e.childNodes[2]
          , r = e.childNodes[1]
          , n = e.childNodes[0]
          , o = parseInt((r.offsetWidth - r.clientWidth) / 2, 10)
          , i = n.clientWidth / 100
          , d = n.clientHeight / 100
          , a = parseInt(50 * Math.min(i, d), 10)
          , s = parseInt(computedStyle(t, null, "width"), 10);
        Modernizr.addTest("cssvminunit", roundedEquals(a, s) || roundedEquals(a, s - o))
    }, 3),
    testStyles("#modernizr { width: 50vw; }", function(e) {
        var t = parseInt(window.innerWidth / 2, 10)
          , r = parseInt(computedStyle(e, null, "width"), 10);
        Modernizr.addTest("cssvwunit", roundedEquals(r, t))
    }),
    Modernizr.addTest("willchange", "willChange"in docElement.style),
    Modernizr.addTest("wrapflow", function() {
        var e = prefixed("wrapFlow");
        if (!e || isSVG)
            return !1;
        var t = e.replace(/([A-Z])/g, function(e, t) {
            return "-" + t.toLowerCase()
        }).replace(/^ms-/, "-ms-")
          , r = createElement("div")
          , n = createElement("div")
          , o = createElement("span");
        n.style.cssText = "position: absolute; left: 50px; width: 100px; height: 20px;" + t + ":end;",
        o.innerText = "X",
        r.appendChild(n),
        r.appendChild(o),
        docElement.appendChild(r);
        var i = o.offsetLeft;
        return docElement.removeChild(r),
        n = o = r = undefined,
        150 === i
    }),
    Modernizr.addTest("customelements", "customElements"in window),
    Modernizr.addTest("customprotocolhandler", function() {
        if (!navigator.registerProtocolHandler)
            return !1;
        try {
            navigator.registerProtocolHandler("thisShouldFail")
        } catch (e) {
            return e instanceof TypeError
        }
        return !1
    }),
    Modernizr.addTest("customevent", "CustomEvent"in window && "function" == typeof window.CustomEvent),
    Modernizr.addTest("dart", !!prefixed("startDart", navigator)),
    Modernizr.addTest("dataview", "undefined" != typeof DataView && "getFloat64"in DataView.prototype),
    Modernizr.addTest("classlist", "classList"in docElement),
    Modernizr.addTest("createelementattrs", function() {
        try {
            return "test" === createElement('<input name="test" />').getAttribute("name")
        } catch (e) {
            return !1
        }
    }, {
        aliases: ["createelement-attrs"]
    }),
    Modernizr.addTest("dataset", function() {
        var e = createElement("div");
        return e.setAttribute("data-a-b", "c"),
        !(!e.dataset || "c" !== e.dataset.aB)
    }),
    Modernizr.addTest("documentfragment", function() {
        return "createDocumentFragment"in document && "appendChild"in docElement
    }),
    Modernizr.addTest("hidden", "hidden"in createElement("a")),
    Modernizr.addTest("intersectionobserver", "IntersectionObserver"in window),
    Modernizr.addTest("microdata", "getItems"in document),
    Modernizr.addTest("mutationobserver", !!window.MutationObserver || !!window.WebKitMutationObserver),
    Modernizr.addTest("passiveeventlisteners", function() {
        var e = !1;
        try {
            function t() {}
            var r = Object.defineProperty({}, "passive", {
                get: function() {
                    e = !0
                }
            });
            window.addEventListener("testPassiveEventSupport", t, r),
            window.removeEventListener("testPassiveEventSupport", t, r)
        } catch (e) {}
        return e
    }),
    Modernizr.addTest("shadowroot", "attachShadow"in createElement("div")),
    Modernizr.addTest("shadowrootlegacy", "createShadowRoot"in createElement("div")),
    Modernizr.addTest("bdi", function() {
        var e = createElement("div")
          , t = createElement("bdi");
        t.innerHTML = "&#1573;",
        e.appendChild(t),
        docElement.appendChild(e);
        var r = "rtl" === computedStyle(t, null, "direction");
        return docElement.removeChild(e),
        r
    });
    var inputElem = createElement("input")
      , inputattrs = "autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")
      , attrs = {};
    Modernizr.input = function(e) {
        for (var t = 0, r = e.length; t < r; t++)
            attrs[e[t]] = !!(e[t]in inputElem);
        return attrs.list && (attrs.list = !(!createElement("datalist") || !window.HTMLDataListElement)),
        attrs
    }(inputattrs),
    Modernizr.addTest("datalistelem", Modernizr.input.list),
    Modernizr.addTest("details", function() {
        var t, r = createElement("details");
        return "open"in r && (testStyles("#modernizr details{display:block}", function(e) {
            e.appendChild(r),
            r.innerHTML = "<summary>a</summary>b",
            t = r.offsetHeight,
            r.open = !0,
            t = t !== r.offsetHeight
        }),
        t)
    }),
    Modernizr.addTest("outputelem", "value"in createElement("output")),
    Modernizr.addTest("picture", "HTMLPictureElement"in window),
    Modernizr.addTest("progressbar", createElement("progress").max !== undefined),
    Modernizr.addTest("meter", createElement("meter").max !== undefined),
    Modernizr.addTest("ruby", function() {
        var e = createElement("ruby")
          , t = createElement("rt")
          , r = createElement("rp")
          , n = "display"
          , o = "fontSize";
        return e.appendChild(r),
        e.appendChild(t),
        docElement.appendChild(e),
        "none" === i(r, n) || "ruby" === i(e, n) && "ruby-text" === i(t, n) || "6pt" === i(r, o) && "6pt" === i(t, o) ? (d(),
        !0) : (d(),
        !1);
        function i(e, t) {
            var r;
            return window.getComputedStyle ? r = document.defaultView.getComputedStyle(e, null).getPropertyValue(t) : e.currentStyle && (r = e.currentStyle[t]),
            r
        }
        function d() {
            docElement.removeChild(e),
            r = t = e = null
        }
    }),
    Modernizr.addTest("template", "content"in createElement("template")),
    Modernizr.addTest("time", "valueAsDate"in createElement("time")),
    Modernizr.addTest("texttrackapi", "function" == typeof createElement("video").addTextTrack),
    Modernizr.addTest("track", "kind"in createElement("track")),
    Modernizr.addTest("unknownelements", function() {
        var e = createElement("a");
        return e.innerHTML = "<xyz></xyz>",
        1 === e.childNodes.length
    }),
    Modernizr.addTest("emoji", function() {
        if (!Modernizr.canvastext)
            return !1;
        var e = createElement("canvas").getContext("2d")
          , t = 12 * (e.webkitBackingStorePixelRatio || e.mozBackingStorePixelRatio || e.msBackingStorePixelRatio || e.oBackingStorePixelRatio || e.backingStorePixelRatio || 1);
        return e.fillStyle = "#f00",
        e.textBaseline = "top",
        e.font = "32px Arial",
        e.fillText("🐨", 0, 0),
        0 !== e.getImageData(t, t, 1, 1).data[0]
    }),
    Modernizr.addTest("es5array", function() {
        return !!(Array.prototype && Array.prototype.every && Array.prototype.filter && Array.prototype.forEach && Array.prototype.indexOf && Array.prototype.lastIndexOf && Array.prototype.map && Array.prototype.some && Array.prototype.reduce && Array.prototype.reduceRight && Array.isArray)
    }),
    Modernizr.addTest("es5date", function() {
        var e = !1;
        try {
            e = !!Date.parse("2013-04-12T06:06:37.307Z")
        } catch (e) {}
        return !!(Date.now && Date.prototype && Date.prototype.toISOString && Date.prototype.toJSON && e)
    }),
    Modernizr.addTest("es5function", function() {
        return !(!Function.prototype || !Function.prototype.bind)
    }),
    Modernizr.addTest("es5object", function() {
        return !!(Object.keys && Object.create && Object.getPrototypeOf && Object.getOwnPropertyNames && Object.isSealed && Object.isFrozen && Object.isExtensible && Object.getOwnPropertyDescriptor && Object.defineProperty && Object.defineProperties && Object.seal && Object.freeze && Object.preventExtensions)
    }),
    Modernizr.addTest("strictmode", function() {
        "use strict";
        return !this
    }()),
    Modernizr.addTest("es5string", function() {
        return !(!String.prototype || !String.prototype.trim)
    }),
    Modernizr.addTest("json", "JSON"in window && "parse"in JSON && "stringify"in JSON),
    Modernizr.addTest("es5syntax", function() {
        var value, obj, stringAccess, getter, setter, reservedWords, zeroWidthChars;
        try {
            return stringAccess = eval('"foobar"[3] === "b"'),
            getter = eval("({ get x(){ return 1 } }).x === 1"),
            eval("({ set x(v){ value = v; } }).x = 1"),
            setter = 1 === value,
            eval("obj = ({ if: 1 })"),
            reservedWords = 1 === obj.if,
            zeroWidthChars = eval("_‌‍ = true"),
            stringAccess && getter && setter && reservedWords && zeroWidthChars
        } catch (e) {
            return !1
        }
    }),
    Modernizr.addTest("es5undefined", function() {
        var e, t;
        try {
            t = window.undefined,
            window.undefined = 12345,
            e = void 0 === window.undefined,
            window.undefined = t
        } catch (e) {
            return !1
        }
        return e
    }),
    Modernizr.addTest("es5", function() {
        return !!(Modernizr.es5array && Modernizr.es5date && Modernizr.es5function && Modernizr.es5object && Modernizr.strictmode && Modernizr.es5string && Modernizr.json && Modernizr.es5syntax && Modernizr.es5undefined)
    }),
    Modernizr.addTest("es6array", !!(Array.prototype && Array.prototype.copyWithin && Array.prototype.fill && Array.prototype.find && Array.prototype.findIndex && Array.prototype.keys && Array.prototype.entries && Array.prototype.values && Array.from && Array.of)),
    Modernizr.addTest("arrow", function() {
        try {
            eval("()=>{}")
        } catch (e) {
            return !1
        }
        return !0
    }),
    Modernizr.addTest("es6collections", !!(window.Map && window.Set && window.WeakMap && window.WeakSet)),
    Modernizr.addTest("contains", is(String.prototype.contains, "function")),
    Modernizr.addTest("generators", function() {
        try {
            new Function("function* test() {}")()
        } catch (e) {
            return !1
        }
        return !0
    }),
    Modernizr.addTest("es6math", !!(Math && Math.clz32 && Math.cbrt && Math.imul && Math.sign && Math.log10 && Math.log2 && Math.log1p && Math.expm1 && Math.cosh && Math.sinh && Math.tanh && Math.acosh && Math.asinh && Math.atanh && Math.hypot && Math.trunc && Math.fround)),
    Modernizr.addTest("es6number", !!(Number.isFinite && Number.isInteger && Number.isSafeInteger && Number.isNaN && Number.parseInt && Number.parseFloat && Number.isInteger(Number.MAX_SAFE_INTEGER) && Number.isInteger(Number.MIN_SAFE_INTEGER) && Number.isFinite(Number.EPSILON))),
    Modernizr.addTest("es6object", !!(Object.assign && Object.is && Object.setPrototypeOf)),
    Modernizr.addTest("promises", function() {
        return "Promise"in window && "resolve"in window.Promise && "reject"in window.Promise && "all"in window.Promise && "race"in window.Promise && (new window.Promise(function(e) {
            t = e
        }
        ),
        "function" == typeof t);
        var t
    }),
    Modernizr.addTest("es6string", !!(String.fromCodePoint && String.raw && String.prototype.codePointAt && String.prototype.repeat && String.prototype.startsWith && String.prototype.endsWith && String.prototype.includes)),
    Modernizr.addTest("es6symbol", !!(Symbol && Symbol.for && Symbol.hasInstance && Symbol.isConcatSpreadable && Symbol.iterator && Symbol.keyFor && Symbol.match && Symbol.prototype && Symbol.replace && Symbol.search && Symbol.species && Symbol.split && Symbol.toPrimitive && Symbol.toStringTag && Symbol.unscopables)),
    Modernizr.addTest("devicemotion", "DeviceMotionEvent"in window),
    Modernizr.addTest("deviceorientation", "DeviceOrientationEvent"in window),
    Modernizr.addTest("oninput", function() {
        var t, e = createElement("input");
        if (e.setAttribute("oninput", "return"),
        hasEvent("oninput", docElement) || "function" == typeof e.oninput)
            return !0;
        try {
            var r = document.createEvent("KeyboardEvent");
            function n(e) {
                t = !0,
                e.preventDefault(),
                e.stopPropagation()
            }
            t = !1,
            r.initKeyEvent("keypress", !0, !0, window, !1, !1, !1, !1, 0, "e".charCodeAt(0)),
            docElement.appendChild(e),
            e.addEventListener("input", n, !1),
            e.focus(),
            e.dispatchEvent(r),
            e.removeEventListener("input", n, !1),
            docElement.removeChild(e)
        } catch (e) {
            t = !1
        }
        return t
    }),
    Modernizr.addTest("eventlistener", "addEventListener"in window),
    Modernizr.addTest("filereader", !!(window.File && window.FileList && window.FileReader)),
    Modernizr.addTest("filesystem", !!prefixed("requestFileSystem", window)),
    Modernizr.addTest("forcetouch", function() {
        return !!hasEvent(prefixed("mouseforcewillbegin", window, !1), window) && MouseEvent.WEBKIT_FORCE_AT_MOUSE_DOWN && MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN
    }),
    Modernizr.addTest("capture", "capture"in createElement("input")),
    Modernizr.addTest("fileinput", function() {
        var e = navigator.userAgent;
        if (e.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/) || e.match(/\swv\).+(chrome)\/([\w\.]+)/i))
            return !1;
        var t = createElement("input");
        return t.type = "file",
        !t.disabled
    });
    var domPrefixesAll = [""].concat(domPrefixes);
    ModernizrProto._domPrefixesAll = domPrefixesAll,
    Modernizr.addTest("fileinputdirectory", function() {
        var e = createElement("input");
        e.type = "file";
        for (var t = 0, r = domPrefixesAll.length; t < r; t++)
            if (domPrefixesAll[t] + "directory"in e)
                return !0;
        return !1
    }),
    Modernizr.addTest("formattribute", function() {
        var t, e, r = createElement("form"), n = createElement("input"), o = createElement("div"), i = "formtest" + (new Date).getTime();
        r.id = i;
        try {
            n.setAttribute("form", i)
        } catch (e) {
            document.createAttribute && ((t = document.createAttribute("form")).nodeValue = i,
            n.setAttributeNode(t))
        }
        return o.appendChild(r),
        o.appendChild(n),
        docElement.appendChild(o),
        e = r.elements && 1 === r.elements.length && n.form === r,
        o.parentNode.removeChild(o),
        e
    }),
    Modernizr.addTest("placeholder", "placeholder"in createElement("input") && "placeholder"in createElement("textarea")),
    Modernizr.addTest("requestautocomplete", !!prefixed("requestAutocomplete", createElement("form"))),
    Modernizr.addTest("formvalidation", function() {
        var t = createElement("form");
        if (!("checkValidity"in t && "addEventListener"in t))
            return !1;
        if ("reportValidity"in t)
            return !0;
        var r, n = !1;
        return Modernizr.formvalidationapi = !0,
        t.addEventListener("submit", function(e) {
            window.opera && !window.operamini || e.preventDefault(),
            e.stopPropagation()
        }, !1),
        t.innerHTML = '<input name="modTest" required="required" /><button></button>',
        testStyles("#modernizr form{position:absolute;top:-99999em}", function(e) {
            e.appendChild(t),
            (r = t.getElementsByTagName("input")[0]).addEventListener("invalid", function(e) {
                n = !0,
                e.preventDefault(),
                e.stopPropagation()
            }, !1),
            Modernizr.formvalidationmessage = !!r.validationMessage,
            t.getElementsByTagName("button")[0].click()
        }),
        n
    }),
    Modernizr.addTest("fullscreen", !(!prefixed("exitFullscreen", document, !1) && !prefixed("cancelFullScreen", document, !1))),
    Modernizr.addTest("gamepads", !!prefixed("getGamepads", navigator)),
    Modernizr.addTest("geolocation", "geolocation"in navigator),
    Modernizr.addTest("hashchange", function() {
        return !1 !== hasEvent("hashchange", window) && (document.documentMode === undefined || 7 < document.documentMode)
    }),
    Modernizr.addTest("hiddenscroll", function() {
        return testStyles("#modernizr {width:100px;height:100px;overflow:scroll}", function(e) {
            return e.offsetWidth === e.clientWidth
        })
    }),
    Modernizr.addTest("history", function() {
        var e = navigator.userAgent;
        return !!e && (-1 === e.indexOf("Android 2.") && -1 === e.indexOf("Android 4.0") || -1 === e.indexOf("Mobile Safari") || -1 !== e.indexOf("Chrome") || -1 !== e.indexOf("Windows Phone") || "file:" === location.protocol) && window.history && "pushState"in window.history
    }),
    Modernizr.addTest("htmlimports", "import"in createElement("link")),
    Modernizr.addTest("ie8compat", !window.addEventListener && !!document.documentMode && 7 === document.documentMode),
    Modernizr.addTest("sandbox", "sandbox"in createElement("iframe")),
    Modernizr.addTest("seamless", "seamless"in createElement("iframe")),
    Modernizr.addTest("srcdoc", "srcdoc"in createElement("iframe")),
    Modernizr.addTest("imgcrossorigin", "crossOrigin"in createElement("img")),
    Modernizr.addTest("lazyloading", "loading"in HTMLImageElement.prototype),
    Modernizr.addTest("srcset", "srcset"in createElement("img")),
    Modernizr.addTest("inputformaction", !!("formAction"in createElement("input")), {
        aliases: ["input-formaction"]
    }),
    Modernizr.addTest("inputformenctype", !!("formEnctype"in createElement("input")), {
        aliases: ["input-formenctype"]
    }),
    Modernizr.addTest("inputformmethod", !!("formMethod"in createElement("input"))),
    Modernizr.addTest("inputformnovalidate", !!("formNoValidate"in createElement("input")), {
        aliases: ["input-formnovalidate"]
    }),
    Modernizr.addTest("inputformtarget", !!("formTarget"in createElement("input")), {
        aliases: ["input-formtarget"]
    }),
    Modernizr.addTest("inputsearchevent", hasEvent("search")),
    function() {
        for (var e, t, r, n = ["search", "tel", "url", "email", "datetime", "date", "month", "week", "time", "datetime-local", "number", "range", "color"], o = 0; o < n.length; o++)
            inputElem.setAttribute("type", e = n[o]),
            (r = "text" !== inputElem.type && "style"in inputElem) && (inputElem.value = "1)",
            inputElem.style.cssText = "position:absolute;visibility:hidden;",
            /^range$/.test(e) && inputElem.style.WebkitAppearance !== undefined ? (docElement.appendChild(inputElem),
            r = (t = document.defaultView).getComputedStyle && "textfield" !== t.getComputedStyle(inputElem, null).WebkitAppearance && 0 !== inputElem.offsetHeight,
            docElement.removeChild(inputElem)) : /^(search|tel)$/.test(e) || (r = /^(url|email)$/.test(e) ? inputElem.checkValidity && !1 === inputElem.checkValidity() : "1)" !== inputElem.value)),
            Modernizr.addTest("inputtypes." + e, !!r)
    }(),
    Modernizr.addTest("intl", !!prefixed("Intl", window)),
    Modernizr.addTest("ligatures", testAllProps("fontFeatureSettings", '"liga" 1')),
    Modernizr.addTest("olreversed", "reversed"in createElement("ol")),
    Modernizr.addTest("mathml", function() {
        var t;
        return testStyles("#modernizr{position:absolute;display:inline-block}", function(e) {
            e.innerHTML += "<math><mfrac><mi>xx</mi><mi>yy</mi></mfrac></math>",
            t = e.offsetHeight > e.offsetWidth
        }),
        t
    }),
    Modernizr.addTest("hovermq", mq("(hover)")),
    Modernizr.addTest("pointermq", mq("(pointer:coarse),(pointer:fine),(pointer:none)")),
    Modernizr.addTest("mediasource", "MediaSource"in window),
    Modernizr.addTest("messagechannel", "MessageChannel"in window),
    Modernizr.addTest("beacon", "sendBeacon"in navigator),
    Modernizr.addTest("lowbandwidth", function() {
        var e = navigator.connection || {
            type: 0
        };
        return 3 === e.type || 4 === e.type || /^[23]g$/.test(e.type)
    }),
    Modernizr.addTest("effectiveType", function() {
        return 0 !== (navigator.connection || {
            effectiveType: 0
        }).effectiveType
    }),
    Modernizr.addTest("eventsource", "EventSource"in window),
    Modernizr.addTest("fetch", "fetch"in window),
    Modernizr.addTest("xhr2", "XMLHttpRequest"in window && "withCredentials"in new XMLHttpRequest),
    Modernizr.addTest("xhrresponsetype", function() {
        if ("undefined" == typeof XMLHttpRequest)
            return !1;
        var e = new XMLHttpRequest;
        return e.open("get", "/", !0),
        "response"in e
    }());
    var testXhrType = function(e) {
        if ("undefined" == typeof XMLHttpRequest)
            return !1;
        var t = new XMLHttpRequest;
        t.open("get", "/", !0);
        try {
            t.responseType = e
        } catch (e) {
            return !1
        }
        return "response"in t && t.responseType === e
    };
    Modernizr.addTest("xhrresponsetypearraybuffer", testXhrType("arraybuffer")),
    Modernizr.addTest("xhrresponsetypeblob", testXhrType("blob")),
    Modernizr.addTest("xhrresponsetypedocument", testXhrType("document")),
    Modernizr.addTest("xhrresponsetypejson", testXhrType("json")),
    Modernizr.addTest("xhrresponsetypetext", testXhrType("text")),
    Modernizr.addTest("notification", function() {
        if (!window.Notification || !window.Notification.requestPermission)
            return !1;
        if ("granted" === window.Notification.permission)
            return !0;
        try {
            new window.Notification("")
        } catch (e) {
            if ("TypeError" === e.name)
                return !1
        }
        return !0
    }),
    Modernizr.addTest("pagevisibility", !!prefixed("hidden", document, !1)),
    Modernizr.addTest("performance", !!prefixed("performance", window)),
    Modernizr.addTest("pointerevents", function() {
        for (var e = 0, t = domPrefixesAll.length; e < t; e++)
            if (hasEvent(domPrefixesAll[e] + "pointerdown"))
                return !0;
        return !1
    }),
    Modernizr.addTest("pointerlock", !!prefixed("exitPointerLock", document));
    var bool = !0;
    try {
        window.postMessage({
            toString: function() {
                bool = !1
            }
        }, "*")
    } catch (e) {}
    Modernizr.addTest("postmessage", new Boolean("postMessage"in window)),
    Modernizr.addTest("postmessage.structuredclones", bool),
    Modernizr.addTest("proxy", "Proxy"in window),
    Modernizr.addTest("queryselector", "querySelector"in document && "querySelectorAll"in document),
    Modernizr.addTest("quotamanagement", function() {
        var e = prefixed("temporaryStorage", navigator)
          , t = prefixed("persistentStorage", navigator);
        return !(!e || !t)
    }),
    Modernizr.addTest("requestanimationframe", !!prefixed("requestAnimationFrame", window), {
        aliases: ["raf"]
    }),
    Modernizr.addTest("scriptasync", "async"in createElement("script")),
    Modernizr.addTest("scriptdefer", "defer"in createElement("script")),
    Modernizr.addTest("serviceworker", "serviceWorker"in navigator),
    Modernizr.addTest("speechrecognition", function() {
        try {
            return !!prefixed("SpeechRecognition", window)
        } catch (e) {
            return !1
        }
    }),
    Modernizr.addTest("speechsynthesis", function() {
        try {
            return "SpeechSynthesisUtterance"in window
        } catch (e) {
            return !1
        }
    }),
    Modernizr.addTest("localstorage", function() {
        var e = "modernizr";
        try {
            return localStorage.setItem(e, e),
            localStorage.removeItem(e),
            !0
        } catch (e) {
            return !1
        }
    }),
    Modernizr.addTest("sessionstorage", function() {
        var e = "modernizr";
        try {
            return sessionStorage.setItem(e, e),
            sessionStorage.removeItem(e),
            !0
        } catch (e) {
            return !1
        }
    }),
    Modernizr.addTest("websqldatabase", "openDatabase"in window),
    Modernizr.addTest("stylescoped", "scoped"in createElement("style")),
    Modernizr.addTest("svg", !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect),
    Modernizr.addTest("svgasimg", document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1"));
    var toStringFn = {}.toString;
    Modernizr.addTest("svgclippaths", function() {
        return !!document.createElementNS && /SVGClipPath/.test(toStringFn.call(document.createElementNS("http://www.w3.org/2000/svg", "clipPath")))
    }),
    Modernizr.addTest("svgfilters", function() {
        var e = !1;
        try {
            e = "SVGFEColorMatrixElement"in window && 2 === SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE
        } catch (e) {}
        return e
    }),
    Modernizr.addTest("svgforeignobject", function() {
        return !!document.createElementNS && /SVGForeignObject/.test(toStringFn.call(document.createElementNS("http://www.w3.org/2000/svg", "foreignObject")))
    }),
    Modernizr.addTest("inlinesvg", function() {
        var e = createElement("div");
        return e.innerHTML = "<svg/>",
        "http://www.w3.org/2000/svg" === ("undefined" != typeof SVGRect && e.firstChild && e.firstChild.namespaceURI)
    }),
    Modernizr.addTest("smil", function() {
        return !!document.createElementNS && /SVGAnimate/.test(toStringFn.call(document.createElementNS("http://www.w3.org/2000/svg", "animate")))
    }),
    Modernizr.addTest("templatestrings", function() {
        var supports;
        try {
            eval("``"),
            supports = !0
        } catch (e) {}
        return !!supports
    }),
    Modernizr.addTest("textareamaxlength", !!("maxLength"in createElement("textarea"))),
    Modernizr.addTest("typedarrays", "ArrayBuffer"in window),
    Modernizr.addTest("unicoderange", function() {
        return testStyles('@font-face{font-family:"unicodeRange";src:local("Arial");unicode-range:U+0020,U+002E}#modernizr span{font-size:20px;display:inline-block;font-family:"unicodeRange",monospace}#modernizr .mono{font-family:monospace}', function(e) {
            for (var t = [".", ".", "m", "m"], r = 0; r < t.length; r++) {
                var n = createElement("span");
                n.innerHTML = t[r],
                n.className = r % 2 ? "mono" : "",
                e.appendChild(n),
                t[r] = n.clientWidth
            }
            return t[0] !== t[1] && t[2] === t[3]
        })
    });
    var url = prefixed("URL", window, !1);
    url = url && window[url],
    Modernizr.addTest("bloburls", url && "revokeObjectURL"in url && "createObjectURL"in url),
    Modernizr.addTest("urlparser", function() {
        try {
            return "http://modernizr.com/" === new URL("http://modernizr.com/").href
        } catch (e) {
            return !1
        }
    }),
    Modernizr.addTest("urlsearchparams", "URLSearchParams"in window),
    Modernizr.addTest("userdata", !!createElement("div").addBehavior),
    Modernizr.addTest("vibrate", !!prefixed("vibrate", navigator)),
    function() {
        var t = createElement("video");
        Modernizr.addTest("video", function() {
            var e = !1;
            try {
                e = (e = !!t.canPlayType) && new Boolean(e)
            } catch (e) {}
            return e
        });
        try {
            t.canPlayType && (Modernizr.addTest("video.ogg", t.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, "")),
            Modernizr.addTest("video.h264", t.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, "")),
            Modernizr.addTest("video.webm", t.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, "")),
            Modernizr.addTest("video.vp9", t.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, "")),
            Modernizr.addTest("video.hls", t.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, "")))
        } catch (e) {}
    }(),
    Modernizr.addTest("videocrossorigin", "crossOrigin"in createElement("video")),
    Modernizr.addTest("videoloop", "loop"in createElement("video")),
    Modernizr.addTest("videopreload", "preload"in createElement("video")),
    Modernizr.addTest("vml", function() {
        var e, t = createElement("div"), r = !1;
        return isSVG || (t.innerHTML = '<v:shape id="vml_flag1" adj="1" />',
        "style"in (e = t.firstChild) && (e.style.behavior = "url(#default#VML)"),
        r = !e || "object" == typeof e.adj),
        r
    }),
    Modernizr.addTest("webintents", !!prefixed("startActivity", navigator)),
    Modernizr.addTest("webanimations", "animate"in createElement("div")),
    Modernizr.addTest("publicKeyCredential", function() {
        return !!window.PublicKeyCredential
    }),
    Modernizr.addTest("peerconnection", !!prefixed("RTCPeerConnection", window)),
    Modernizr.addTest("datachannel", function() {
        if (!Modernizr.peerconnection)
            return !1;
        for (var e = 0, t = domPrefixesAll.length; e < t; e++) {
            var r = window[domPrefixesAll[e] + "RTCPeerConnection"];
            if (r)
                return "createDataChannel"in new r(null)
        }
        return !1
    }),
    Modernizr.addTest("getUserMedia", "mediaDevices"in navigator && "getUserMedia"in navigator.mediaDevices);
    var supports = !1;
    try {
        supports = "WebSocket"in window && 2 === window.WebSocket.CLOSING
    } catch (e) {}
    Modernizr.addTest("websockets", supports),
    Modernizr.addTest("websocketsbinary", function() {
        var e, t = "https:" === location.protocol ? "wss" : "ws";
        if ("WebSocket"in window) {
            if (e = "binaryType"in WebSocket.prototype)
                return e;
            try {
                return !!new WebSocket(t + "://.").binaryType
            } catch (e) {}
        }
        return !1
    }),
    Modernizr.addTest("atobbtoa", "atob"in window && "btoa"in window, {
        aliases: ["atob-btoa"]
    }),
    Modernizr.addTest("framed", window.location !== top.location),
    Modernizr.addTest("matchmedia", !!prefixed("matchMedia", window)),
    Modernizr.addTest("sharedworkers", "SharedWorker"in window),
    Modernizr.addTest("webworkers", "Worker"in window),
    Modernizr.addTest("xdomainrequest", "XDomainRequest"in window),
    Modernizr.addTest("touchevents", function() {
        if ("ontouchstart"in window || window.TouchEvent || window.DocumentTouch && document instanceof DocumentTouch)
            return !0;
        var e = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("");
        return mq(e)
    }),
    Modernizr.addTest("unicode", function() {
        var t, r = createElement("span"), n = createElement("span");
        return testStyles("#modernizr{font-family:Arial,sans;font-size:300em;}", function(e) {
            r.innerHTML = isSVG ? "妇" : "&#5987;",
            n.innerHTML = isSVG ? "☆" : "&#9734;",
            e.appendChild(r),
            e.appendChild(n),
            t = "offsetWidth"in r && r.offsetWidth !== n.offsetWidth
        }),
        t
    }),
    testRunner(),
    setClasses(classes),
    delete ModernizrProto.addTest,
    delete ModernizrProto.addAsyncTest;
    for (var i = 0; i < Modernizr._q.length; i++)
        Modernizr._q[i]();
    window.Modernizr = Modernizr
}(window, document);
;(function(root, factory) {
    if (typeof define === 'function ' && define.amd) {
        define(factory)
    } else if (typeof exports === 'object') {
        module.exports = factory()
    } else {
        root.md5 = factory()
    }
}(this, function() {
    function md5cycle(x, k) {
        var a = x[0]
          , b = x[1]
          , c = x[2]
          , d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);
        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3])
    }
    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b)
    }
    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t)
    }
    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t)
    }
    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t)
    }
    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t)
    }
    function md51(s) {
        txt = '';
        var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
        for (i = 64; i <= s.length; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)))
        }
        s = s.substring(i - 64);
        var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < s.length; i++)
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i++)
                tail[i] = 0
        }
        tail[14] = n * 8;
        md5cycle(state, tail);
        return state
    }
    function md5blk(s) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24)
        }
        return md5blks
    }
    var hex_chr = '0123456789abcdef'.split('');
    function rhex(n) {
        var s = ''
          , j = 0;
        for (; j < 4; j++)
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
        return s
    }
    function hex(x) {
        for (var i = 0; i < x.length; i++)
            x[i] = rhex(x[i]);
        return x.join('')
    }
    function md5(s) {
        return hex(md51(s))
    }
    function add32(a, b) {
        return (a + b) & 0xFFFFFFFF
    }
    if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
        function add32(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF)
              , msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF)
        }
    }
    return md5
}));
!function() {
    var l = $("#ft_table")
      , d = l.find("tr.thead")
      , u = l.find("tr.row")
      , c = u.length
      , h = l.find("tr.results")
      , _ = $("#ft_keyword")
      , v = $("#ft_count")
      , p = $(".ft_total")
      , m = $("#ft_permalink")
      , e = $("#ft_input")
      , C = "/features";
    e.prop("disabled", !1),
    v.text(c),
    p.text(c),
    $("#ft_answer").removeClass("n"),
    u.on("click", function() {
        $(".row").removeClass("ft_focused");
        var t = $(this).next(".ft_after");
        t.hasClass("n") ? ($(this).addClass("ft_focused"),
        $(".ft_after").addClass("n"),
        t.removeClass("n")) : t.addClass("n")
    });
    var x = {};
    $("#ft_table .row td:nth-child(2)").each(function() {
        var t, e, r, a, n, s = $(this).attr("class"), o = (n = typeof (t = (a = s.split("_"))[1] && "object" == typeof Modernizr[a[0]] ? Modernizr[a[0]][a[1]] : Modernizr[a[0]]),
        r = !1 === t || "" == t ? (e = 0,
        "false") : "string" == n ? (e = 2,
        t) : "undefined" == n ? (e = 2,
        "undefined") : (e = 1,
        "true"),
        [e, r]);
        $(this).html(ico(o[0]) + o[1]),
        x[s] = o[1];
        var i = {
            spec: "Specification",
            docs: "Tutorial",
            caniuse: "Compatibility",
            github: "Detector Source Code"
        }
          , f = '<tr class="ft_after n"><td colspan="2"><ul>';
        for (var l in i)
            f += '<li class="ft_' + l + '"><a href="/features/' + s.replace("_", ".") + "/" + l + '" target="_blank" rel="noopener nofollow">' + i[l] + "</a></li>";
        f += "</ul></td></tr>",
        $(this).parent().after(f)
    });
    var r = {};
    Object.keys(x).sort().forEach(function(t) {
        r[t] = x[t]
    });
    var t = JSON.stringify(r);
    $("#ft_hash").text("" + md5(t)),
    $("#ft_json_button").removeClass("n").on("click", function() {
        $(".ft_output").hasClass("n") && "" == $(".ft_output textarea").text() && $(".ft_output textarea").text(t),
        $(".ft_output").toggleClass("n")
    });
    var g = null;
    function w(t) {
        return t.toLowerCase().replace(/[\W]/g, "")
    }
    function b(t) {
        Modernizr.history && window.history.replaceState(null, null, t)
    }
    e.on("keyup submit input", function() {
        $(".ft_after").addClass("n"),
        $(".ft_focused").removeClass("ft_focused");
        var t = $(this).val();
        if (t == g)
            return !1;
        g = t;
        var e = 0;
        if (0 < (t = $.trim(t.substr(0, 64))).length) {
            d.hide(),
            u.hide(),
            l.addClass("filtered");
            var r = t.split("+")
              , a = r.length
              , n = [];
            10 < a && (a = 10);
            for (var s, o = "", i = 0; i < a; i++)
                if (r[i] = w(r[i]),
                0 != r[i].length) {
                    s = !1;
                    for (var f = 0; f < c; f++)
                        void 0 === n[f] && 0 <= w($(u[f]).text()).indexOf(r[i]) && (s = !0,
                        e++,
                        n[f] = !0,
                        $(u[f]).show());
                    1 == s && ("" != o && (o += "+"),
                    o += w(r[i]))
                }
            _.text(t),
            v.text(e),
            p.text(c)
        } else
            b(C),
            v.text(c),
            p.text(c),
            _.text(""),
            d.show(),
            u.show(),
            l.removeClass("filtered"),
            h.hide();
        0 < e ? (b("#" + o),
        h.removeClass("n").show(),
        m.attr("href", C + "#" + o),
        $("#ft_permalink_container").removeClass("n")) : (m.attr("href", C),
        b(C),
        $("#ft_permalink_container").addClass("n"))
    }),
    $(window).on("load hashchange", function() {
        var t = (history.location || document.location).hash;
        "" != t && "#further-reading" != t && "#comments" != t && e.val(t.substr(1)).trigger("submit")
    })
}();
