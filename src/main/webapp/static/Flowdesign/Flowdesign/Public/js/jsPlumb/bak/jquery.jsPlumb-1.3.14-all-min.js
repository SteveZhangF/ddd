jsPlumbUtil = {
    isArray: function (t) {
        return Object.prototype.toString.call(t) === "[object Array]"
    },
    isString: function (t) {
        return typeof t === "string"
    },
    isBoolean: function (t) {
        return typeof t === "boolean"
    },
    isObject: function (t) {
        return Object.prototype.toString.call(t) === "[object Object]"
    },
    isDate: function (t) {
        return Object.prototype.toString.call(t) === "[object Date]"
    },
    isFunction: function (t) {
        return Object.prototype.toString.call(t) === "[object Function]"
    },
    clone: function (t) {
        if (this.isString(t)) {
            return new String(t)
        } else {
            if (this.isBoolean(t)) {
                return new Boolean(t)
            } else {
                if (this.isDate(t)) {
                    return new Date(t.getTime())
                } else {
                    if (this.isFunction(t)) {
                        return t
                    } else {
                        if (this.isArray(t)) {
                            var e = [];
                            for (var n = 0; n < t.length; n++) {
                                e.push(this.clone(t[n]))
                            }
                            return e
                        } else {
                            if (this.isObject(t)) {
                                var e = {};
                                for (var n in t) {
                                    e[n] = this.clone(t[n])
                                }
                                return e
                            } else {
                                return t
                            }
                        }
                    }
                }
            }
        }
    },
    merge: function (t, e) {
        var n = this.clone(t);
        for (var r in e) {
            if (n[r] == null || this.isString(e[r]) || this.isBoolean(e[r])) {
                n[r] = e[r]
            } else {
                if (this.isArray(e[r]) && this.isArray(n[r])) {
                    var i = [];
                    i.push.apply(i, n[r]);
                    i.push.apply(i, e[r]);
                    n[r] = i
                } else {
                    if (this.isObject(n[r]) && this.isObject(e[r])) {
                        for (var o in e[r]) {
                            n[r][o] = e[r][o]
                        }
                    }
                }
            }
        }
        return n
    },
    convertStyle: function (t, e) {
        if ("transparent" === t) {
            return t
        }
        var n = t, r = function (t) {
            return t.length == 1 ? "0" + t : t
        }, i = function (t) {
            return r(Number(t).toString(16))
        }, o = /(rgb[a]?\()(.*)(\))/;
        if (t.match(o)) {
            var a = t.match(o)[2].split(",");
            n = "#" + i(a[0]) + i(a[1]) + i(a[2]);
            if (!e && a.length == 4) {
                n = n + i(a[3])
            }
        }
        return n
    },
    gradient: function (t, e) {
        t = jsPlumbUtil.isArray(t) ? t : [t.x, t.y];
        e = jsPlumbUtil.isArray(e) ? e : [e.x, e.y];
        return (e[1] - t[1]) / (e[0] - t[0])
    },
    normal: function (t, e) {
        return -1 / jsPlumbUtil.gradient(t, e)
    },
    lineLength: function (t, e) {
        t = jsPlumbUtil.isArray(t) ? t : [t.x, t.y];
        e = jsPlumbUtil.isArray(e) ? e : [e.x, e.y];
        return Math.sqrt(Math.pow(e[1] - t[1], 2) + Math.pow(e[0] - t[0], 2))
    },
    segment: function (t, e) {
        t = jsPlumbUtil.isArray(t) ? t : [t.x, t.y];
        e = jsPlumbUtil.isArray(e) ? e : [e.x, e.y];
        if (e[0] > t[0]) {
            return e[1] > t[1] ? 2 : 1
        } else {
            return e[1] > t[1] ? 3 : 4
        }
    },
    intersects: function (t, e) {
        var n = t.x, r = t.x + t.w, i = t.y, o = t.y + t.h, a = e.x, s = e.x + e.w, l = e.y, u = e.y + e.h;
        return n <= a && a <= r && i <= l && l <= o || n <= s && s <= r && i <= l && l <= o || n <= a && a <= r && i <= u && u <= o || n <= s && a <= r && i <= u && u <= o || a <= n && n <= s && l <= i && i <= u || a <= r && r <= s && l <= i && i <= u || a <= n && n <= s && l <= o && o <= u || a <= r && n <= s && l <= o && o <= u
    },
    segmentMultipliers: [null, [1, -1], [1, 1], [-1, 1], [-1, -1]],
    inverseSegmentMultipliers: [null, [-1, -1], [-1, 1], [1, 1], [1, -1]],
    pointOnLine: function (t, e, n) {
        var r = jsPlumbUtil.gradient(t, e), i = jsPlumbUtil.segment(t, e), o = n > 0 ? jsPlumbUtil.segmentMultipliers[i] : jsPlumbUtil.inverseSegmentMultipliers[i], a = Math.atan(r), s = Math.abs(n * Math.sin(a)) * o[1], l = Math.abs(n * Math.cos(a)) * o[0];
        return {x: t.x + l, y: t.y + s}
    },
    perpendicularLineTo: function (t, e, n) {
        var r = jsPlumbUtil.gradient(t, e), i = Math.atan(-1 / r), o = n / 2 * Math.sin(i), a = n / 2 * Math.cos(i);
        return [{x: e.x + a, y: e.y + o}, {x: e.x - a, y: e.y - o}]
    },
    findWithFunction: function (t, e) {
        if (t) {
            for (var n = 0; n < t.length; n++) {
                if (e(t[n])) {
                    return n
                }
            }
        }
        return -1
    },
    indexOf: function (t, e) {
        return jsPlumbUtil.findWithFunction(t, function (t) {
            return t == e
        })
    },
    removeWithFunction: function (t, e) {
        var n = jsPlumbUtil.findWithFunction(t, e);
        if (n > -1) {
            t.splice(n, 1)
        }
        return n != -1
    },
    remove: function (t, e) {
        var n = jsPlumbUtil.indexOf(t, e);
        if (n > -1) {
            t.splice(n, 1)
        }
        return n != -1
    },
    addWithFunction: function (t, e, n) {
        if (jsPlumbUtil.findWithFunction(t, n) == -1) {
            t.push(e)
        }
    },
    addToList: function (t, e, n) {
        var r = t[e];
        if (r == null) {
            r = [], t[e] = r
        }
        r.push(n);
        return r
    },
    EventGenerator: function () {
        var t = {}, e = this;
        var n = ["ready"];
        this.bind = function (n, r) {
            jsPlumbUtil.addToList(t, n, r);
            return e
        };
        this.fire = function (r, i, o) {
            if (t[r]) {
                for (var a = 0; a < t[r].length; a++) {
                    if (jsPlumbUtil.findWithFunction(n, function (t) {
                            return t === r
                        }) != -1) {
                        t[r][a](i, o)
                    } else {
                        try {
                            t[r][a](i, o)
                        } catch (s) {
                            jsPlumbUtil.log("jsPlumb: fire failed for event " + r + " : " + s)
                        }
                    }
                }
            }
            return e
        };
        this.unbind = function (n) {
            if (n) {
                delete t[n]
            } else {
                t = {}
            }
            return e
        };
        this.getListener = function (e) {
            return t[e]
        }
    },
    logEnabled: true,
    log: function () {
        if (jsPlumbUtil.logEnabled && typeof console != "undefined") {
            try {
                var t = arguments[arguments.length - 1];
                console.log(t)
            } catch (e) {
            }
        }
    },
    group: function (t) {
        if (jsPlumbUtil.logEnabled && typeof console != "undefined") {
            console.group(t)
        }
    },
    groupEnd: function (t) {
        if (jsPlumbUtil.logEnabled && typeof console != "undefined") {
            console.groupEnd(t)
        }
    },
    time: function (t) {
        if (jsPlumbUtil.logEnabled && typeof console != "undefined") {
            console.time(t)
        }
    },
    timeEnd: function (t) {
        if (jsPlumbUtil.logEnabled && typeof console != "undefined") {
            console.timeEnd(t)
        }
    }
};
(function () {
    var t = !!document.createElement("canvas").getContext, e = !!window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"), n = function () {
        if (n.vml == undefined) {
            var t = document.body.appendChild(document.createElement("div"));
            t.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
            var e = t.firstChild;
            e.style.behavior = "url(#default#VML)";
            n.vml = e ? typeof e.adj == "object" : true;
            t.parentNode.removeChild(t)
        }
        return n.vml
    };
    var r = function (t) {
        var e = {}, n = [], r = {}, i = {};
        this.register = function (o) {
            var a = jsPlumb.CurrentLibrary;
            o = a.getElementObject(o);
            var s = t.getId(o), l = a.getDOMElement(o), u = a.getOffset(o);
            if (!e[s]) {
                e[s] = o;
                n.push(o);
                r[s] = {}
            }
            var c = function (e, n) {
                if (e) {
                    for (var o = 0; o < e.childNodes.length; o++) {
                        if (e.childNodes[o].nodeType != 3) {
                            var l = a.getElementObject(e.childNodes[o]), f = t.getId(l, null, true);
                            if (f && i[f] && i[f] > 0) {
                                var h = a.getOffset(l);
                                r[s][f] = {id: f, offset: {left: h.left - u.left, top: h.top - u.top}}
                            }
                            c(e.childNodes[o])
                        }
                    }
                }
            };
            c(l)
        };
        this.endpointAdded = function (n) {
            var o = jsPlumb.CurrentLibrary, a = document.body, s = t.getId(n), l = o.getDOMElement(n), u = l.parentNode, c = u == a;
            i[s] = i[s] ? i[s] + 1 : 1;
            while (u != a) {
                var f = t.getId(u, null, true);
                if (f && e[f]) {
                    var h = -1, p = o.getElementObject(u), d = o.getOffset(p);
                    if (r[f][s] == null) {
                        var v = jsPlumb.CurrentLibrary.getOffset(n);
                        r[f][s] = {id: s, offset: {left: v.left - d.left, top: v.top - d.top}}
                    }
                    break
                }
                u = u.parentNode
            }
        };
        this.endpointDeleted = function (t) {
            if (i[t.elementId]) {
                i[t.elementId]--;
                if (i[t.elementId] <= 0) {
                    for (var e in r) {
                        delete r[e][t.elementId]
                    }
                }
            }
        };
        this.getElementsForDraggable = function (t) {
            return r[t]
        };
        this.reset = function () {
            e = {};
            n = [];
            r = {};
            i = {}
        }
    };
    if (!window.console) {
        window.console = {
            time: function () {
            }, timeEnd: function () {
            }, group: function () {
            }, groupEnd: function () {
            }, log: function () {
            }
        }
    }
    window.jsPlumbAdapter = {
        headless: false, appendToRoot: function (t) {
            document.body.appendChild(t)
        }, getRenderModes: function () {
            return ["canvas", "svg", "vml"]
        }, isRenderModeAvailable: function (r) {
            return {canvas: t, svg: e, vml: n()}[r]
        }, getDragManager: function (t) {
            return new r(t)
        }, setRenderMode: function (t) {
            var e;
            if (t) {
                t = t.toLowerCase();
                var n = this.isRenderModeAvailable("canvas"), r = this.isRenderModeAvailable("svg"), i = this.isRenderModeAvailable("vml");
                if (t === "svg") {
                    if (r) {
                        e = "svg"
                    } else {
                        if (n) {
                            e = "canvas"
                        } else {
                            if (i) {
                                e = "vml"
                            }
                        }
                    }
                } else {
                    if (t === "canvas" && n) {
                        e = "canvas"
                    } else {
                        if (i) {
                            e = "vml"
                        }
                    }
                }
            }
            return e
        }
    }
})();
(function () {
    var t = jsPlumbUtil.findWithFunction, e = jsPlumbUtil.indexOf, n = jsPlumbUtil.removeWithFunction, r = jsPlumbUtil.remove, i = jsPlumbUtil.addWithFunction, o = jsPlumbUtil.addToList, a = jsPlumbUtil.isArray, s = jsPlumbUtil.isString, l = jsPlumbUtil.isObject;
    var u = null, c = function (t, e) {
        return M.CurrentLibrary.getAttribute(v(t), e)
    }, f = function (t, e, n) {
        M.CurrentLibrary.setAttribute(v(t), e, n)
    }, h = function (t, e) {
        M.CurrentLibrary.addClass(v(t), e)
    }, p = function (t, e) {
        return M.CurrentLibrary.hasClass(v(t), e)
    }, d = function (t, e) {
        M.CurrentLibrary.removeClass(v(t), e)
    }, v = function (t) {
        return M.CurrentLibrary.getElementObject(t)
    }, m = function (t, e) {
        var n = M.CurrentLibrary.getOffset(v(t));
        if (e != null) {
            var r = e.getZoom();
            return {left: n.left / r, top: n.top / r}
        } else {
            return n
        }
    }, g = function (t) {
        return M.CurrentLibrary.getSize(v(t))
    }, y = jsPlumbUtil.log, b = jsPlumbUtil.group, P = jsPlumbUtil.groupEnd, C = jsPlumbUtil.time, j = jsPlumbUtil.timeEnd, E = function () {
        return "" + (new Date).getTime()
    }, x = function (t) {
        var e = this, n = arguments, r = false, i = t.parameters || {}, o = e.idPrefix, a = o + (new Date).getTime(), s = null, l = null;
        e._jsPlumb = t._jsPlumb;
        e.getId = function () {
            return a
        };
        e.tooltip = t.tooltip;
        e.hoverClass = t.hoverClass || e._jsPlumb.Defaults.HoverClass || M.Defaults.HoverClass;
        jsPlumbUtil.EventGenerator.apply(this);
        this.clone = function () {
            var t = new Object;
            e.constructor.apply(t, n);
            return t
        };
        this.getParameter = function (t) {
            return i[t]
        }, this.getParameters = function () {
            return i
        }, this.setParameter = function (t, e) {
            i[t] = e
        }, this.setParameters = function (t) {
            i = t
        }, this.overlayPlacements = [];
        var u = t.beforeDetach;
        this.isDetachAllowed = function (t) {
            var n = e._jsPlumb.checkCondition("beforeDetach", t);
            if (u) {
                try {
                    n = u(t)
                } catch (r) {
                    y("jsPlumb: beforeDetach callback failed", r)
                }
            }
            return n
        };
        var c = t.beforeDrop;
        this.isDropAllowed = function (t, n, r, i, o) {
            var a = e._jsPlumb.checkCondition("beforeDrop", {
                sourceId: t,
                targetId: n,
                scope: r,
                connection: i,
                dropEndpoint: o
            });
            if (c) {
                try {
                    a = c({sourceId: t, targetId: n, scope: r, connection: i, dropEndpoint: o})
                } catch (s) {
                    y("jsPlumb: beforeDrop callback failed", s)
                }
            }
            return a
        };
        var f = function () {
            if (s && l) {
                var t = {};
                M.extend(t, s);
                M.extend(t, l);
                delete e.hoverPaintStyle;
                if (t.gradient && s.fillStyle) {
                    delete t.gradient
                }
                l = t
            }
        };
        this.setPaintStyle = function (t, n) {
            s = t;
            e.paintStyleInUse = s;
            f();
            if (!n) {
                e.repaint()
            }
        };
        this.getPaintStyle = function () {
            return s
        };
        this.setHoverPaintStyle = function (t, n) {
            l = t;
            f();
            if (!n) {
                e.repaint()
            }
        };
        this.getHoverPaintStyle = function () {
            return l
        };
        this.setHover = function (t, n, i) {
            if (!e._jsPlumb.currentlyDragging && !e._jsPlumb.isHoverSuspended()) {
                r = t;
                if (e.hoverClass != null && e.canvas != null) {
                    if (t) {
                        p.addClass(e.canvas, e.hoverClass)
                    } else {
                        p.removeClass(e.canvas, e.hoverClass)
                    }
                }
                if (l != null) {
                    e.paintStyleInUse = t ? l : s;
                    i = i || E();
                    e.repaint({timestamp: i, recalc: false})
                }
                if (e.getAttachedElements && !n) {
                    b(t, E(), e)
                }
            }
        };
        this.isHover = function () {
            return r
        };
        var h = null;
        this.setZIndex = function (t) {
            h = t
        };
        this.getZIndex = function () {
            return h
        };
        var p = M.CurrentLibrary, d = ["click", "dblclick", "mouseenter", "mouseout", "mousemove", "mousedown", "mouseup", "contextmenu"], v = {mouseout: "mouseexit"}, m = function (t, e, n) {
            var r = v[n] || n;
            p.bind(t, n, function (t) {
                e.fire(r, e, t)
            })
        }, g = function (t, e) {
            var n = v[e] || e;
            p.unbind(t, e)
        };
        this.attachListeners = function (t, e) {
            for (var n = 0; n < d.length; n++) {
                m(t, e, d[n])
            }
        };
        var b = function (t, n, r) {
            var i = e.getAttachedElements();
            if (i) {
                for (var o = 0; o < i.length; o++) {
                    if (!r || r != i[o]) {
                        i[o].setHover(t, true, n)
                    }
                }
            }
        };
        this.reattachListenersForElement = function (t) {
            if (arguments.length > 1) {
                for (var n = 0; n < d.length; n++) {
                    g(t, d[n])
                }
                for (var n = 1; n < arguments.length; n++) {
                    e.attachListeners(t, arguments[n])
                }
            }
        };
        var P = [], C = function (t) {
            return t == null ? null : t.split(" ")
        }, j = function (t) {
            if (e.getDefaultType) {
                var n = e.getTypeDescriptor();
                var r = jsPlumbUtil.merge({}, e.getDefaultType());
                for (var i = 0; i < P.length; i++) {
                    r = jsPlumbUtil.merge(r, e._jsPlumb.getType(P[i], n))
                }
                e.applyType(r);
                if (!t) {
                    e.repaint()
                }
            }
        };
        e.setType = function (t, e) {
            P = C(t) || [];
            j(e)
        };
        e.getType = function () {
            return P
        };
        e.hasType = function (t) {
            return jsPlumbUtil.indexOf(P, t) != -1
        };
        e.addType = function (t, n) {
            var r = C(t), i = false;
            if (r != null) {
                for (var o = 0; o < r.length; o++) {
                    if (!e.hasType(r[o])) {
                        P.push(r[o]);
                        i = true
                    }
                }
                if (i) {
                    j(n)
                }
            }
        };
        e.removeType = function (t, e) {
            var n = C(t), r = false, i = function (t) {
                var e = jsPlumbUtil.indexOf(P, t);
                if (e != -1) {
                    P.splice(e, 1);
                    return true
                }
                return false
            };
            if (n != null) {
                for (var o = 0; o < n.length; o++) {
                    r = i(n[o]) || r
                }
                if (r) {
                    j(e)
                }
            }
        };
        e.toggleType = function (t, e) {
            var n = C(t);
            if (n != null) {
                for (var r = 0; r < n.length; r++) {
                    var i = jsPlumbUtil.indexOf(P, n[r]);
                    if (i != -1) {
                        P.splice(i, 1)
                    } else {
                        P.push(n[r])
                    }
                }
                j(e)
            }
        };
        this.applyType = function (t) {
            e.setPaintStyle(t.paintStyle);
            e.setHoverPaintStyle(t.hoverPaintStyle);
            if (t.parameters) {
                for (var n in t.parameters) {
                    e.setParameter(n, t.parameters[n])
                }
            }
        }
    }, D = function (t) {
        x.apply(this, arguments);
        var e = this;
        this.overlays = [];
        var n = function (t) {
            var n = null;
            if (a(t)) {
                var r = t[0], i = M.extend({component: e, _jsPlumb: e._jsPlumb}, t[1]);
                if (t.length == 3) {
                    M.extend(i, t[2])
                }
                n = new (M.Overlays[e._jsPlumb.getRenderMode()][r])(i);
                if (i.events) {
                    for (var o in i.events) {
                        n.bind(o, i.events[o])
                    }
                }
            } else {
                if (t.constructor == String) {
                    n = new (M.Overlays[e._jsPlumb.getRenderMode()][t])({component: e, _jsPlumb: e._jsPlumb})
                } else {
                    n = t
                }
            }
            e.overlays.push(n)
        }, r = function (t) {
            var n = e.defaultOverlayKeys || [], r = t.overlays, i = function (t) {
                return e._jsPlumb.Defaults[t] || M.Defaults[t] || []
            };
            if (!r) {
                r = []
            }
            for (var o = 0; o < n.length; o++) {
                r.unshift.apply(r, i(n[o]))
            }
            return r
        };
        var i = r(t);
        if (i) {
            for (var o = 0; o < i.length; o++) {
                n(i[o])
            }
        }
        var s = function (t) {
            var n = -1;
            for (var r = 0; r < e.overlays.length; r++) {
                if (t === e.overlays[r].id) {
                    n = r;
                    break
                }
            }
            return n
        };
        this.addOverlay = function (t, r) {
            n(t);
            if (!r) {
                e.repaint()
            }
        };
        this.getOverlay = function (t) {
            var n = s(t);
            return n >= 0 ? e.overlays[n] : null
        };
        this.getOverlays = function () {
            return e.overlays
        };
        this.hideOverlay = function (t) {
            var n = e.getOverlay(t);
            if (n) {
                n.hide()
            }
        };
        this.hideOverlays = function () {
            for (var t = 0; t < e.overlays.length; t++) {
                e.overlays[t].hide()
            }
        };
        this.showOverlay = function (t) {
            var n = e.getOverlay(t);
            if (n) {
                n.show()
            }
        };
        this.showOverlays = function () {
            for (var t = 0; t < e.overlays.length; t++) {
                e.overlays[t].show()
            }
        };
        this.removeAllOverlays = function () {
            for (var t = 0; t < e.overlays.length; t++) {
                if (e.overlays[t].cleanup) {
                    e.overlays[t].cleanup()
                }
            }
            e.overlays.splice(0, e.overlays.length);
            e.repaint()
        };
        this.removeOverlay = function (t) {
            var n = s(t);
            if (n != -1) {
                var r = e.overlays[n];
                if (r.cleanup) {
                    r.cleanup()
                }
                e.overlays.splice(n, 1)
            }
        };
        this.removeOverlays = function () {
            for (var t = 0; t < arguments.length; t++) {
                e.removeOverlay(arguments[t])
            }
        };
        var l = "__label", u = function (t) {
            var n = {
                cssClass: t.cssClass,
                labelStyle: this.labelStyle,
                id: l,
                component: e,
                _jsPlumb: e._jsPlumb
            }, r = M.extend(n, t);
            return new (M.Overlays[e._jsPlumb.getRenderMode()].Label)(r)
        };
        if (t.label) {
            var c = t.labelLocation || e.defaultLabelLocation || .5, f = t.labelStyle || e._jsPlumb.Defaults.LabelStyle || M.Defaults.LabelStyle;
            this.overlays.push(u({label: t.label, location: c, labelStyle: f}))
        }
        this.setLabel = function (t) {
            var n = e.getOverlay(l);
            if (!n) {
                var r = t.constructor == String || t.constructor == Function ? {label: t} : t;
                n = u(r);
                this.overlays.push(n)
            } else {
                if (t.constructor == String || t.constructor == Function) {
                    n.setLabel(t)
                } else {
                    if (t.label) {
                        n.setLabel(t.label)
                    }
                    if (t.location) {
                        n.setLocation(t.location)
                    }
                }
            }
            if (!e._jsPlumb.isSuspendDrawing()) {
                e.repaint()
            }
        };
        this.getLabel = function () {
            var t = e.getOverlay(l);
            return t != null ? t.getLabel() : null
        };
        this.getLabelOverlay = function () {
            return e.getOverlay(l)
        };
        var h = this.applyType;
        this.applyType = function (t) {
            h(t);
            e.removeAllOverlays();
            if (t.overlays) {
                for (var n = 0; n < t.overlays.length; n++) {
                    e.addOverlay(t.overlays[n], true)
                }
            }
        }
    }, S = function (t, e, n) {
        t.bind("click", function (t, n) {
            e.fire("click", e, n)
        });
        t.bind("dblclick", function (t, n) {
            e.fire("dblclick", e, n)
        });
        t.bind("contextmenu", function (t, n) {
            e.fire("contextmenu", e, n)
        });
        t.bind("mouseenter", function (t, r) {
            if (!e.isHover()) {
                n(true);
                e.fire("mouseenter", e, r)
            }
        });
        t.bind("mouseexit", function (t, r) {
            if (e.isHover()) {
                n(false);
                e.fire("mouseexit", e, r)
            }
        })
    };
    var I = 0, O = function () {
        var t = I + 1;
        I++;
        return t
    };
    var L = function (r) {
        this.Defaults = {
            Anchor: "BottomCenter",
            Anchors: [null, null],
            ConnectionsDetachable: true,
            ConnectionOverlays: [],
            Connector: "Bezier",
            ConnectorZIndex: null,
            Container: null,
            DragOptions: {},
            DropOptions: {},
            Endpoint: "Dot",
            EndpointOverlays: [],
            Endpoints: [null, null],
            EndpointStyle: {fillStyle: "#456"},
            EndpointStyles: [null, null],
            EndpointHoverStyle: null,
            EndpointHoverStyles: [null, null],
            HoverPaintStyle: null,
            LabelStyle: {color: "black"},
            LogEnabled: false,
            Overlays: [],
            MaxConnections: 1,
            PaintStyle: {lineWidth: 8, strokeStyle: "#456"},
            RenderMode: "svg",
            Scope: "jsPlumb_DefaultScope"
        };
        if (r) {
            M.extend(this.Defaults, r)
        }
        this.logEnabled = this.Defaults.LogEnabled;
        var o = {}, p = {};
        this.registerConnectionType = function (t, e) {
            o[t] = M.extend({}, e)
        };
        this.registerConnectionTypes = function (t) {
            for (var e in t) {
                o[e] = M.extend({}, t[e])
            }
        };
        this.registerEndpointType = function (t, e) {
            p[t] = M.extend({}, e)
        };
        this.registerEndpointTypes = function (t) {
            for (var e in t) {
                p[e] = M.extend({}, t[e])
            }
        };
        this.getType = function (t, e) {
            return e === "connection" ? o[t] : p[t]
        };
        jsPlumbUtil.EventGenerator.apply(this);
        var b = this, P = O(), C = b.bind, j = {}, I = 1;
        this.setZoom = function (t, e) {
            I = t;
            if (e) {
                b.repaintEverything()
            }
        };
        this.getZoom = function () {
            return I
        };
        for (var L in this.Defaults) {
            j[L] = this.Defaults[L]
        }
        this.bind = function (t, e) {
            if ("ready" === t && k) {
                e()
            } else {
                C.apply(b, [t, e])
            }
        };
        b.importDefaults = function (t) {
            for (var e in t) {
                b.Defaults[e] = t[e]
            }
        };
        b.restoreDefaults = function () {
            b.Defaults = M.extend({}, j)
        };
        var A = null, w = null, k = false, T = {}, _ = {}, U = {}, F = {}, H = {}, N = {}, W = {}, V = [], R = [], B = this.Defaults.Scope, z = null, G = function (t, e, n) {
            var r = t[e];
            if (r == null) {
                r = [];
                t[e] = r
            }
            r.push(n);
            return r
        }, Z = function (t, e) {
            if (b.Defaults.Container) {
                M.CurrentLibrary.appendElement(t, b.Defaults.Container)
            } else {
                if (!e) {
                    jsPlumbAdapter.appendToRoot(t)
                } else {
                    M.CurrentLibrary.appendElement(t, e)
                }
            }
        }, q = 1, Y = function () {
            return "" + q++
        }, X = function (t) {
            return t._nodes ? t._nodes : t
        }, K = function (t, e, n) {
            if (!jsPlumbAdapter.headless && !Xe) {
                var r = c(t, "id"), i = b.dragManager.getElementsForDraggable(r);
                if (n == null) {
                    n = E()
                }
                b.anchorManager.redraw(r, e, n);
                if (i) {
                    for (var o in i) {
                        b.anchorManager.redraw(i[o].id, e, n, i[o].offset)
                    }
                }
            }
        }, Q = function (t, e) {
            var n = null;
            if (a(t)) {
                n = [];
                for (var r = 0; r < t.length; r++) {
                    var i = v(t[r]), o = c(i, "id");
                    n.push(e(i, o))
                }
            } else {
                var i = v(t), o = c(i, "id");
                n = e(i, o)
            }
            return n
        }, J = function (t) {
            return U[t]
        }, $ = function (t, e, n) {
            if (!jsPlumbAdapter.headless) {
                var r = e == null ? false : e, i = M.CurrentLibrary;
                if (r) {
                    if (i.isDragSupported(t) && !i.isAlreadyDraggable(t)) {
                        var o = n || b.Defaults.DragOptions || M.Defaults.DragOptions;
                        o = M.extend({}, o);
                        var a = i.dragEvents.drag, s = i.dragEvents.stop, l = i.dragEvents.start;
                        o[l] = ge(o[l], function () {
                            b.setHoverSuspended(true)
                        });
                        o[a] = ge(o[a], function () {
                            var e = i.getUIPosition(arguments, b.getZoom());
                            K(t, e);
                            h(t, "jsPlumb_dragged")
                        });
                        o[s] = ge(o[s], function () {
                            var e = i.getUIPosition(arguments, b.getZoom());
                            K(t, e);
                            d(t, "jsPlumb_dragged");
                            b.setHoverSuspended(false)
                        });
                        var u = me(t);
                        W[u] = true;
                        var r = W[u];
                        o.disabled = r == null ? false : !r;
                        i.initDraggable(t, o, false);
                        b.dragManager.register(t)
                    }
                }
            }
        }, te = function (t, e) {
            var n = M.extend({}, t);
            if (e) {
                M.extend(n, e)
            }
            if (n.source && n.source.endpoint) {
                n.sourceEndpoint = n.source
            }
            if (n.source && n.target.endpoint) {
                n.targetEndpoint = n.target
            }
            if (t.uuids) {
                n.sourceEndpoint = J(t.uuids[0]);
                n.targetEndpoint = J(t.uuids[1])
            }
            if (n.sourceEndpoint && n.sourceEndpoint.isFull()) {
                y(b, "could not add connection; source endpoint is full");
                return
            }
            if (n.targetEndpoint && n.targetEndpoint.isFull()) {
                y(b, "could not add connection; target endpoint is full");
                return
            }
            if (!n.type && n.sourceEndpoint) {
                n.type = n.sourceEndpoint.connectionType
            }
            if (n.sourceEndpoint && n.sourceEndpoint.connectorOverlays) {
                n.overlays = n.overlays || [];
                for (var r = 0; r < n.sourceEndpoint.connectorOverlays.length; r++) {
                    n.overlays.push(n.sourceEndpoint.connectorOverlays[r])
                }
            }
            n.tooltip = t.tooltip;
            if (!n.tooltip && n.sourceEndpoint && n.sourceEndpoint.connectorTooltip) {
                n.tooltip = n.sourceEndpoint.connectorTooltip
            }
            if (n.target && !n.target.endpoint && !n.targetEndpoint && !n.newConnection) {
                var i = me(n.target), o = Te[i], a = _e[i];
                if (o) {
                    if (!Ge[i]) {
                        return
                    }
                    var s = a != null ? a : b.addEndpoint(n.target, o);
                    if (Ue[i]) {
                        _e[i] = s
                    }
                    n.targetEndpoint = s;
                    s._makeTargetCreator = true
                }
            }
            if (n.source && !n.source.endpoint && !n.sourceEndpoint && !n.newConnection) {
                var i = me(n.source), o = Ne[i], a = We[i];
                if (o) {
                    if (!Re[i]) {
                        return
                    }
                    var s = a != null ? a : b.addEndpoint(n.source, o);
                    if (Ve[i]) {
                        We[i] = s
                    }
                    n.sourceEndpoint = s
                }
            }
            return n
        }, ee = function (t) {
            var e = b.Defaults.ConnectionType || b.getDefaultConnectionType(), n = b.Defaults.EndpointType || bn, r = M.CurrentLibrary.getParent;
            if (t.container) {
                t.parent = t.container
            } else {
                if (t.sourceEndpoint) {
                    t.parent = t.sourceEndpoint.parent
                } else {
                    if (t.source.constructor == n) {
                        t.parent = t.source.parent
                    } else {
                        t.parent = r(t.source)
                    }
                }
            }
            t._jsPlumb = b;
            var i = new e(t);
            i.id = "con_" + Y();
            re("click", "click", i);
            re("dblclick", "dblclick", i);
            re("contextmenu", "contextmenu", i);
            return i
        }, ne = function (t, e, n) {
            e = e || {};
            if (!t.suspendedEndpoint) {
                G(T, t.scope, t)
            }
            if (!e.doNotFireConnectionEvent && e.fireEvent !== false) {
                var r = {
                    connection: t,
                    source: t.source,
                    target: t.target,
                    sourceId: t.sourceId,
                    targetId: t.targetId,
                    sourceEndpoint: t.endpoints[0],
                    targetEndpoint: t.endpoints[1]
                };
                b.fire("jsPlumbConnection", r, n);
                b.fire("connection", r, n)
            }
            b.anchorManager.newConnection(t);
            K(t.source)
        }, re = function (t, e, n) {
            n.bind(t, function (t, r) {
                b.fire(e, n, r)
            })
        }, ie = function (t) {
            if (t.container) {
                return t.container
            } else {
                var e = M.CurrentLibrary.getTagName(t.source), n = M.CurrentLibrary.getParent(t.source);
                if (e && e.toLowerCase() === "td") {
                    return M.CurrentLibrary.getParent(n)
                } else {
                    return n
                }
            }
        }, oe = function (t) {
            var e = b.Defaults.EndpointType || bn;
            t.parent = ie(t);
            t._jsPlumb = b;
            var n = new e(t);
            n.id = "ep_" + Y();
            re("click", "endpointClick", n);
            re("dblclick", "endpointDblClick", n);
            re("contextmenu", "contextmenu", n);
            if (!jsPlumbAdapter.headless) {
                b.dragManager.endpointAdded(t.source)
            }
            return n
        }, ae = function (t, e, n) {
            var r = _[t];
            if (r && r.length) {
                for (var i = 0; i < r.length; i++) {
                    for (var o = 0; o < r[i].connections.length; o++) {
                        var a = e(r[i].connections[o]);
                        if (a) {
                            return
                        }
                    }
                    if (n) {
                        n(r[i])
                    }
                }
            }
        }, se = function (t) {
            for (var e in _) {
                ae(e, t)
            }
        }, le = function (t, e) {
            if (t != null && t.parentNode != null) {
                t.parentNode.removeChild(t)
            }
        }, ue = function (t, e) {
            for (var n = 0; n < t.length; n++) {
                le(t[n], e)
            }
        }, ce = function (t, e) {
            return Q(t, function (t, n) {
                W[n] = e;
                if (M.CurrentLibrary.isDragSupported(t)) {
                    M.CurrentLibrary.setDraggable(t, e)
                }
            })
        }, fe = function (t, e, n) {
            e = e === "block";
            var r = null;
            if (n) {
                if (e) {
                    r = function (t) {
                        t.setVisible(true, true, true)
                    }
                } else {
                    r = function (t) {
                        t.setVisible(false, true, true)
                    }
                }
            }
            var i = c(t, "id");
            ae(i, function (t) {
                if (e && n) {
                    var r = t.sourceId === i ? 1 : 0;
                    if (t.endpoints[r].isVisible()) {
                        t.setVisible(true)
                    }
                } else {
                    t.setVisible(e)
                }
            }, r)
        }, he = function (t) {
            return Q(t, function (t, e) {
                var n = W[e] == null ? false : W[e];
                n = !n;
                W[e] = n;
                M.CurrentLibrary.setDraggable(t, n);
                return n
            })
        }, pe = function (t, e) {
            var n = null;
            if (e) {
                n = function (t) {
                    var e = t.isVisible();
                    t.setVisible(!e)
                }
            }
            ae(t, function (t) {
                var e = t.isVisible();
                t.setVisible(!e)
            }, n)
        }, de = function (t) {
            var e = t.timestamp, n = t.recalc, r = t.offset, i = t.elId;
            if (Xe && !e) {
                e = Ke
            }
            if (!n) {
                if (e && e === H[i]) {
                    return F[i]
                }
            }
            if (n || !r) {
                var o = v(i);
                if (o != null) {
                    R[i] = g(o);
                    F[i] = m(o, b);
                    H[i] = e
                }
            } else {
                F[i] = r;
                if (R[i] == null) {
                    var o = v(i);
                    if (o != null) {
                        R[i] = g(o)
                    }
                }
            }
            if (F[i] && !F[i].right) {
                F[i].right = F[i].left + R[i][0];
                F[i].bottom = F[i].top + R[i][1];
                F[i].width = R[i][0];
                F[i].height = R[i][1];
                F[i].centerx = F[i].left + F[i].width / 2;
                F[i].centery = F[i].top + F[i].height / 2
            }
            return F[i]
        }, ve = function (t) {
            var e = F[t];
            if (!e) {
                e = de({elId: t})
            }
            return {o: e, s: R[t]}
        }, me = function (t, e, n) {
            var r = v(t);
            var i = c(r, "id");
            if (!i || i == "undefined") {
                if (arguments.length == 2 && arguments[1] != undefined) {
                    i = e
                } else {
                    if (arguments.length == 1 || arguments.length == 3 && !arguments[2]) {
                        i = "jsPlumb_" + P + "_" + Y()
                    }
                }
                if (!n) {
                    f(r, "id", i)
                }
            }
            return i
        }, ge = function (t, e, n) {
            t = t || function () {
                };
            e = e || function () {
                };
            return function () {
                var r = null;
                try {
                    r = e.apply(this, arguments)
                } catch (i) {
                    y(b, "jsPlumb function failed : " + i)
                }
                if (n == null || r !== n) {
                    try {
                        t.apply(this, arguments)
                    } catch (i) {
                        y(b, "wrapped function failed : " + i)
                    }
                }
                return r
            }
        };
        this.connectorClass = "_jsPlumb_connector";
        this.endpointClass = "_jsPlumb_endpoint";
        this.overlayClass = "_jsPlumb_overlay";
        this.Anchors = {};
        this.Connectors = {canvas: {}, svg: {}, vml: {}};
        this.Endpoints = {canvas: {}, svg: {}, vml: {}};
        this.Overlays = {canvas: {}, svg: {}, vml: {}};
        this.addClass = function (t, e) {
            return M.CurrentLibrary.addClass(t, e)
        };
        this.removeClass = function (t, e) {
            return M.CurrentLibrary.removeClass(t, e)
        };
        this.hasClass = function (t, e) {
            return M.CurrentLibrary.hasClass(t, e)
        };
        this.addEndpoint = function (t, e, n) {
            n = n || {};
            var r = M.extend({}, n);
            M.extend(r, e);
            r.endpoint = r.endpoint || b.Defaults.Endpoint || M.Defaults.Endpoint;
            r.paintStyle = r.paintStyle || b.Defaults.EndpointStyle || M.Defaults.EndpointStyle;
            t = X(t);
            var i = [], o = t.length && t.constructor != String ? t : [t];
            for (var a = 0; a < o.length; a++) {
                var s = v(o[a]), l = me(s);
                r.source = s;
                de({elId: l, timestamp: Ke});
                var u = oe(r);
                if (r.parentAnchor) {
                    u.parentAnchor = r.parentAnchor
                }
                G(_, l, u);
                var c = F[l], f = R[l];
                var h = u.anchor.compute({xy: [c.left, c.top], wh: f, element: u, timestamp: Ke});
                var p = {anchorLoc: h, timestamp: Ke};
                if (Xe) {
                    p.recalc = false
                }
                u.paint(p);
                i.push(u)
            }
            return i.length == 1 ? i[0] : i
        };
        this.addEndpoints = function (t, e, n) {
            var r = [];
            for (var i = 0; i < e.length; i++) {
                var o = b.addEndpoint(t, e[i], n);
                if (a(o)) {
                    Array.prototype.push.apply(r, o)
                } else {
                    r.push(o)
                }
            }
            return r
        };
        this.animate = function (t, e, n) {
            var r = v(t), i = c(t, "id");
            n = n || {};
            var o = M.CurrentLibrary.dragEvents.step;
            var a = M.CurrentLibrary.dragEvents.complete;
            n[o] = ge(n[o], function () {
                b.repaint(i)
            });
            n[a] = ge(n[a], function () {
                b.repaint(i)
            });
            M.CurrentLibrary.animate(r, e, n)
        };
        this.checkCondition = function (t, e) {
            var n = b.getListener(t);
            var r = true;
            if (n && n.length > 0) {
                try {
                    for (var i = 0; i < n.length; i++) {
                        r = r && n[i](e)
                    }
                } catch (o) {
                    y(b, "cannot check condition [" + t + "]" + o)
                }
            }
            return r
        };
        this.connect = function (t, e) {
            var n = te(t, e), r;
            if (n) {
                if (n.deleteEndpointsOnDetach == null) {
                    n.deleteEndpointsOnDetach = true
                }
                r = ee(n);
                ne(r, n)
            }
            return r
        };
        this.deleteEndpoint = function (t) {
            var e = typeof t == "string" ? U[t] : t;
            if (e) {
                var n = e.getUuid();
                if (n) {
                    U[n] = null
                }
                e.detachAll();
                if (e.endpoint.cleanup) {
                    e.endpoint.cleanup()
                }
                ue(e.endpoint.getDisplayElements());
                b.anchorManager.deleteEndpoint(e);
                for (var r in _) {
                    var i = _[r];
                    if (i) {
                        var o = [];
                        for (var a = 0; a < i.length; a++) {
                            if (i[a] != e) {
                                o.push(i[a])
                            }
                        }
                        _[r] = o
                    }
                }
                if (!jsPlumbAdapter.headless) {
                    b.dragManager.endpointDeleted(e)
                }
            }
        };
        this.deleteEveryEndpoint = function () {
            b.setSuspendDrawing(true);
            for (var t in _) {
                var e = _[t];
                if (e && e.length) {
                    for (var n = 0; n < e.length; n++) {
                        b.deleteEndpoint(e[n])
                    }
                }
            }
            delete _;
            _ = {};
            delete U;
            U = {};
            b.setSuspendDrawing(false, true)
        };
        var ye = function (t, e, n) {
            var r = b.Defaults.ConnectionType || b.getDefaultConnectionType(), i = t.constructor == r, o = i ? {
                connection: t,
                source: t.source,
                target: t.target,
                sourceId: t.sourceId,
                targetId: t.targetId,
                sourceEndpoint: t.endpoints[0],
                targetEndpoint: t.endpoints[1]
            } : t;
            if (e) {
                b.fire("jsPlumbConnectionDetached", o, n);
                b.fire("connectionDetached", o, n)
            }
            b.anchorManager.connectionDetached(o)
        }, be = function (t) {
            b.fire("connectionDrag", t)
        }, Pe = function (t) {
            b.fire("connectionDragStop", t)
        };
        this.detach = function () {
            if (arguments.length == 0) {
                return
            }
            var t = b.Defaults.ConnectionType || b.getDefaultConnectionType(), e = arguments[0].constructor == t, n = arguments.length == 2 ? e ? arguments[1] || {} : arguments[0] : arguments[0], r = n.fireEvent !== false, i = n.forceDetach, o = e ? arguments[0] : n.connection;
            if (o) {
                if (i || o.isDetachAllowed(o) && o.endpoints[0].isDetachAllowed(o) && o.endpoints[1].isDetachAllowed(o)) {
                    if (i || b.checkCondition("beforeDetach", o)) {
                        o.endpoints[0].detach(o, false, true, r)
                    }
                }
            } else {
                var a = M.extend({}, n);
                if (a.uuids) {
                    J(a.uuids[0]).detachFrom(J(a.uuids[1]), r)
                } else {
                    if (a.sourceEndpoint && a.targetEndpoint) {
                        a.sourceEndpoint.detachFrom(a.targetEndpoint)
                    } else {
                        var s = me(a.source), l = me(a.target);
                        ae(s, function (t) {
                            if (t.sourceId == s && t.targetId == l || t.targetId == s && t.sourceId == l) {
                                if (b.checkCondition("beforeDetach", t)) {
                                    t.endpoints[0].detach(t, false, true, r)
                                }
                            }
                        })
                    }
                }
            }
        };
        this.detachAllConnections = function (t, e) {
            e = e || {};
            t = v(t);
            var n = c(t, "id"), r = _[n];
            if (r && r.length) {
                for (var i = 0; i < r.length; i++) {
                    r[i].detachAll(e.fireEvent)
                }
            }
        };
        this.detachEveryConnection = function (t) {
            t = t || {};
            for (var e in _) {
                var n = _[e];
                if (n && n.length) {
                    for (var r = 0; r < n.length; r++) {
                        n[r].detachAll(t.fireEvent)
                    }
                }
            }
            delete T;
            T = {}
        };
        this.draggable = function (t, e) {
            if (typeof t == "object" && t.length) {
                for (var n = 0; n < t.length; n++) {
                    var r = v(t[n]);
                    if (r) {
                        $(r, true, e)
                    }
                }
            } else {
                if (t._nodes) {
                    for (var n = 0; n < t._nodes.length; n++) {
                        var r = v(t._nodes[n]);
                        if (r) {
                            $(r, true, e)
                        }
                    }
                } else {
                    var r = v(t);
                    if (r) {
                        $(r, true, e)
                    }
                }
            }
        };
        this.extend = function (t, e) {
            return M.CurrentLibrary.extend(t, e)
        };
        this.getDefaultEndpointType = function () {
            return bn
        };
        this.getDefaultConnectionType = function () {
            return vn
        };
        var Ce = function (t, e, n, r) {
            for (var i = 0; i < t.length; i++) {
                t[i][e].apply(t[i], n)
            }
            return r(t)
        }, je = function (t, e, n) {
            var r = [];
            for (var i = 0; i < t.length; i++) {
                r.push([t[i][e].apply(t[i], n), t[i]])
            }
            return r
        }, Ee = function (t, e, n) {
            return function () {
                return Ce(t, e, arguments, n)
            }
        }, xe = function (t, e) {
            return function () {
                return je(t, e, arguments)
            }
        }, De = function (t, e) {
            var n = [];
            if (t) {
                if (typeof t == "string") {
                    if (t === "*") {
                        return t
                    }
                    n.push(t)
                } else {
                    if (e) {
                        n = t
                    } else {
                        for (var r = 0; r < t.length; r++) {
                            n.push(me(v(t[r])))
                        }
                    }
                }
            }
            return n
        }, Se = function (t, n, r) {
            if (t === "*") {
                return true
            }
            return t.length > 0 ? e(t, n) != -1 : !r
        };
        this.getConnections = function (t, e) {
            if (!t) {
                t = {}
            } else {
                if (t.constructor == String) {
                    t = {scope: t}
                }
            }
            var n = t.scope || b.getDefaultScope(), r = De(n, true), i = De(t.source), o = De(t.target), a = !e && r.length > 1 ? {} : [], s = function (t, n) {
                if (!e && r.length > 1) {
                    var i = a[t];
                    if (i == null) {
                        i = [];
                        a[t] = i
                    }
                    i.push(n)
                } else {
                    a.push(n)
                }
            };
            for (var l in T) {
                if (Se(r, l)) {
                    for (var u = 0; u < T[l].length; u++) {
                        var c = T[l][u];
                        if (Se(i, c.sourceId) && Se(o, c.targetId)) {
                            s(l, c)
                        }
                    }
                }
            }
            return a
        };
        var Ie = function (t, e) {
            return function (n) {
                for (var r = 0; r < t.length; r++) {
                    n(t[r])
                }
                return e(t)
            }
        }, Oe = function (t) {
            return function (e) {
                return t[e]
            }
        };
        var Le = function (t, e) {
            return {
                setHover: Ee(t, "setHover", e),
                removeAllOverlays: Ee(t, "removeAllOverlays", e),
                setLabel: Ee(t, "setLabel", e),
                addOverlay: Ee(t, "addOverlay", e),
                removeOverlay: Ee(t, "removeOverlay", e),
                removeOverlays: Ee(t, "removeOverlays", e),
                showOverlay: Ee(t, "showOverlay", e),
                hideOverlay: Ee(t, "hideOverlay", e),
                showOverlays: Ee(t, "showOverlays", e),
                hideOverlays: Ee(t, "hideOverlays", e),
                setPaintStyle: Ee(t, "setPaintStyle", e),
                setHoverPaintStyle: Ee(t, "setHoverPaintStyle", e),
                setParameter: Ee(t, "setParameter", e),
                setParameters: Ee(t, "setParameters", e),
                setVisible: Ee(t, "setVisible", e),
                setZIndex: Ee(t, "setZIndex", e),
                repaint: Ee(t, "repaint", e),
                addType: Ee(t, "addType", e),
                toggleType: Ee(t, "toggleType", e),
                removeType: Ee(t, "removeType", e),
                getLabel: xe(t, "getLabel"),
                getOverlay: xe(t, "getOverlay"),
                isHover: xe(t, "isHover"),
                getParameter: xe(t, "getParameter"),
                getParameters: xe(t, "getParameters"),
                getPaintStyle: xe(t, "getPaintStyle"),
                getHoverPaintStyle: xe(t, "getHoverPaintStyle"),
                isVisible: xe(t, "isVisible"),
                getZIndex: xe(t, "getZIndex"),
                hasType: xe(t, "hasType"),
                getType: xe(t, "getType"),
                length: t.length,
                each: Ie(t, e),
                get: Oe(t)
            }
        };
        var Me = function (t) {
            var e = Le(t, Me);
            return M.CurrentLibrary.extend(e, {
                setDetachable: Ee(t, "setDetachable", Me),
                setConnector: Ee(t, "setConnector", Me),
                detach: function () {
                    for (var e = 0; e < t.length; e++) {
                        b.detach(t[e])
                    }
                },
                isDetachable: xe(t, "isDetachable")
            })
        };
        var Ae = function (t) {
            var e = Le(t, Ae);
            return M.CurrentLibrary.extend(e, {
                setEnabled: Ee(t, "setEnabled", Ae),
                isEnabled: xe(t, "isEnabled"),
                detachAll: function () {
                    for (var e = 0; e < t.length; e++) {
                        t[e].detachAll()
                    }
                },
                "delete": function () {
                    for (var e = 0; e < t.length; e++) {
                        b.deleteEndpoint(t[e])
                    }
                }
            })
        };
        this.select = function (t) {
            t = t || {};
            t.scope = t.scope || "*";
            var e = b.getConnections(t, true);
            return Me(e)
        };
        this.selectEndpoints = function (t) {
            t = t || {};
            t.scope = t.scope || "*";
            var e = !t.element && !t.source && !t.target, n = e ? "*" : De(t.element), r = e ? "*" : De(t.source), i = e ? "*" : De(t.target), o = De(t.scope, true);
            var a = [];
            for (var s in _) {
                var l = Se(n, s, true), u = Se(r, s, true), c = r != "*", f = Se(i, s, true), h = i != "*";
                if (l || u || f) {
                    t:for (var p = 0; p < _[s].length; p++) {
                        var d = _[s][p];
                        if (Se(o, d.scope, true)) {
                            var v = c && r.length > 0 && !d.isSource, m = h && i.length > 0 && !d.isTarget;
                            if (v || m) {
                                continue t
                            }
                            a.push(d)
                        }
                    }
                }
            }
            return Ae(a)
        };
        this.getAllConnections = function () {
            return T
        };
        this.getDefaultScope = function () {
            return B
        };
        this.getEndpoint = J;
        this.getEndpoints = function (t) {
            return _[me(t)]
        };
        this.getId = me;
        this.getOffset = function (t) {
            var e = F[t];
            return de({elId: t})
        };
        this.getSelector = function (t) {
            return M.CurrentLibrary.getSelector(t)
        };
        this.getSize = function (t) {
            var e = R[t];
            if (!e) {
                de({elId: t})
            }
            return R[t]
        };
        this.appendElement = Z;
        var we = false;
        this.isHoverSuspended = function () {
            return we
        };
        this.setHoverSuspended = function (t) {
            we = t
        };
        var ke = function (t) {
            return function () {
                return jsPlumbAdapter.isRenderModeAvailable(t)
            }
        };
        this.isCanvasAvailable = ke("canvas");
        this.isSVGAvailable = ke("svg");
        this.isVMLAvailable = ke("vml");
        this.hide = function (t, e) {
            fe(t, "none", e)
        };
        this.idstamp = Y;
        this.init = function () {
            if (!k) {
                b.setRenderMode(b.Defaults.RenderMode);
                var t = function (t) {
                    M.CurrentLibrary.bind(document, t, function (e) {
                        if (!b.currentlyDragging && z == M.CANVAS) {
                            for (var n in T) {
                                var r = T[n];
                                for (var i = 0; i < r.length; i++) {
                                    var o = r[i].connector[t](e);
                                    if (o) {
                                        return
                                    }
                                }
                            }
                            for (var a in _) {
                                var s = _[a];
                                for (var i = 0; i < s.length; i++) {
                                    if (s[i].endpoint[t](e)) {
                                        return
                                    }
                                }
                            }
                        }
                    })
                };
                t("click");
                t("dblclick");
                t("mousemove");
                t("mousedown");
                t("mouseup");
                t("contextmenu");
                k = true;
                b.fire("ready")
            }
        };
        this.log = A;
        this.jsPlumbUIComponent = x;
        this.makeAnchor = function () {
            if (arguments.length == 0) {
                return null
            }
            var t = arguments[0], e = arguments[1], n = arguments[2], r = null;
            if (t.compute && t.getOrientation) {
                return t
            } else {
                if (typeof t == "string") {
                    r = M.Anchors[arguments[0]]({elementId: e, jsPlumbInstance: b})
                } else {
                    if (a(t)) {
                        if (a(t[0]) || s(t[0])) {
                            if (t.length == 2 && s(t[0]) && l(t[1])) {
                                var i = M.extend({elementId: e, jsPlumbInstance: b}, t[1]);
                                r = M.Anchors[t[0]](i)
                            } else {
                                r = new tn(t, null, e)
                            }
                        } else {
                            var o = {
                                x: t[0],
                                y: t[1],
                                orientation: t.length >= 4 ? [t[2], t[3]] : [0, 0],
                                offsets: t.length == 6 ? [t[4], t[5]] : [0, 0],
                                elementId: e
                            };
                            r = new Je(o);
                            r.clone = function () {
                                return new Je(o)
                            }
                        }
                    }
                }
            }
            if (!r.id) {
                r.id = "anchor_" + Y()
            }
            return r
        };
        this.makeAnchors = function (t, e, n) {
            var r = [];
            for (var i = 0; i < t.length; i++) {
                if (typeof t[i] == "string") {
                    r.push(M.Anchors[t[i]]({elementId: e, jsPlumbInstance: n}))
                } else {
                    if (a(t[i])) {
                        r.push(b.makeAnchor(t[i], e, n))
                    }
                }
            }
            return r
        };
        this.makeDynamicAnchor = function (t, e) {
            return new tn(t, e)
        };
        var Te = {}, _e = {}, Ue = {}, Fe = {}, He = function (t, e) {
            t.paintStyle = t.paintStyle || b.Defaults.EndpointStyles[e] || b.Defaults.EndpointStyle || M.Defaults.EndpointStyles[e] || M.Defaults.EndpointStyle;
            t.hoverPaintStyle = t.hoverPaintStyle || b.Defaults.EndpointHoverStyles[e] || b.Defaults.EndpointHoverStyle || M.Defaults.EndpointHoverStyles[e] || M.Defaults.EndpointHoverStyle;
            t.anchor = t.anchor || b.Defaults.Anchors[e] || b.Defaults.Anchor || M.Defaults.Anchors[e] || M.Defaults.Anchor;
            t.endpoint = t.endpoint || b.Defaults.Endpoints[e] || b.Defaults.Endpoint || M.Defaults.Endpoints[e] || M.Defaults.Endpoint
        };
        this.makeTarget = function (t, e, n) {
            var r = M.extend({_jsPlumb: b}, n);
            M.extend(r, e);
            He(r, 1);
            var i = M.CurrentLibrary, o = r.scope || b.Defaults.Scope, a = !(r.deleteEndpointsOnDetach === false), s = r.maxConnections || -1, l = r.onMaxConnections;
            _doOne = function (t) {
                var e = me(t);
                Te[e] = r;
                Ue[e] = r.uniqueEndpoint, Fe[e] = s, Ge[e] = true, proxyComponent = new x(r);
                var n = M.extend({}, r.dropOptions || {}), u = function () {
                    var n = M.CurrentLibrary.getDropEvent(arguments), o = b.select({target: e}).length;
                    b.currentlyDragging = false;
                    var s = v(i.getDragObject(arguments)), u = c(s, "dragId"), f = c(s, "originalScope"), h = N[u], p = h.endpoints[0], d = r.endpoint ? M.extend({}, r.endpoint) : {};
                    if (!Ge[e] || Fe[e] > 0 && o >= Fe[e]) {
                        if (l) {
                            l({element: t, connection: h}, n)
                        }
                        return false
                    }
                    p.anchor.locked = false;
                    if (f) {
                        i.setDragScope(s, f)
                    }
                    var y = proxyComponent.isDropAllowed(h.sourceId, me(t), h.scope, h, null);
                    if (h.endpointsToDeleteOnDetach) {
                        if (p === h.endpointsToDeleteOnDetach[0]) {
                            h.endpointsToDeleteOnDetach[0] = null
                        } else {
                            if (p === h.endpointsToDeleteOnDetach[1]) {
                                h.endpointsToDeleteOnDetach[1] = null
                            }
                        }
                    }
                    if (h.suspendedEndpoint) {
                        h.targetId = h.suspendedEndpoint.elementId;
                        h.target = i.getElementObject(h.suspendedEndpoint.elementId);
                        h.endpoints[1] = h.suspendedEndpoint
                    }
                    if (y) {
                        p.detach(h, false, true, false);
                        var P = _e[e] || b.addEndpoint(t, r);
                        if (r.uniqueEndpoint) {
                            _e[e] = P
                        }
                        P._makeTargetCreator = true;
                        if (P.anchor.positionFinder != null) {
                            var C = i.getUIPosition(arguments, b.getZoom()), j = m(t, b), E = g(t), x = P.anchor.positionFinder(C, j, E, P.anchor.constructorParams);
                            P.anchor.x = x[0];
                            P.anchor.y = x[1]
                        }
                        var D = b.connect({
                            source: p,
                            target: P,
                            scope: f,
                            previousConnection: h,
                            container: h.parent,
                            deleteEndpointsOnDetach: a,
                            doNotFireConnectionEvent: p.endpointWillMoveAfterConnection
                        });
                        if (h.endpoints[1]._makeTargetCreator && h.endpoints[1].connections.length < 2) {
                            b.deleteEndpoint(h.endpoints[1])
                        }
                        if (a) {
                            D.endpointsToDeleteOnDetach = [p, P]
                        }
                        D.repaint()
                    } else {
                        if (h.suspendedEndpoint) {
                            if (p.isReattach) {
                                h.setHover(false);
                                h.floatingAnchorIndex = null;
                                h.suspendedEndpoint.addConnection(h);
                                b.repaint(p.elementId)
                            } else {
                                p.detach(h, false, true, true, n)
                            }
                        }
                    }
                };
                var f = i.dragEvents.drop;
                n.scope = n.scope || o;
                n[f] = ge(n[f], u);
                i.initDroppable(t, n, true)
            };
            t = X(t);
            var u = t.length && t.constructor != String ? t : [t];
            for (var f = 0; f < u.length; f++) {
                _doOne(v(u[f]))
            }
            return b
        };
        this.unmakeTarget = function (t, e) {
            t = M.CurrentLibrary.getElementObject(t);
            var n = me(t);
            if (!e) {
                delete Te[n];
                delete Ue[n];
                delete Fe[n];
                delete Ge[n]
            }
            return b
        };
        this.makeTargets = function (t, e, n) {
            for (var r = 0; r < t.length; r++) {
                b.makeTarget(t[r], e, n)
            }
        };
        var Ne = {}, We = {}, Ve = {}, Re = {}, Be = {}, ze = {}, Ge = {};
        this.makeSource = function (t, e, r) {
            var i = M.extend({}, r);
            M.extend(i, e);
            He(i, 0);
            var o = M.CurrentLibrary, a = i.maxConnections || -1, s = i.onMaxConnections, l = function (t) {
                var r = me(t), l = i.parent, u = l != null ? b.getId(o.getElementObject(l)) : r;
                Ne[u] = i;
                Ve[u] = i.uniqueEndpoint;
                Re[u] = true;
                var c = o.dragEvents.stop, f = o.dragEvents.drag, h = M.extend({}, i.dragOptions || {}), p = h.drag, d = h.stop, v = null, m = false;
                ze[u] = a;
                h.scope = h.scope || i.scope;
                h[f] = ge(h[f], function () {
                    if (p) {
                        p.apply(this, arguments)
                    }
                    m = false
                });
                h[c] = ge(h[c], function () {
                    if (d) {
                        d.apply(this, arguments)
                    }
                    b.currentlyDragging = false;
                    if (v.connections.length == 0) {
                        b.deleteEndpoint(v)
                    } else {
                        o.unbind(v.canvas, "mousedown");
                        var t = i.anchor || b.Defaults.Anchor, e = v.anchor, a = v.connections[0];
                        v.anchor = b.makeAnchor(t, r, b);
                        if (i.parent) {
                            var s = o.getElementObject(i.parent);
                            if (s) {
                                var l = v.elementId;
                                var u = i.container || b.Defaults.Container || M.Defaults.Container;
                                v.setElement(s, u);
                                v.endpointWillMoveAfterConnection = false;
                                b.anchorManager.rehomeEndpoint(l, s);
                                a.previousConnection = null;
                                n(T[a.scope], function (t) {
                                    return t.id === a.id
                                });
                                b.anchorManager.connectionDetached({
                                    sourceId: a.sourceId,
                                    targetId: a.targetId,
                                    connection: a
                                });
                                ne(a)
                            }
                        }
                        v.repaint();
                        b.repaint(v.elementId);
                        b.repaint(a.targetId)
                    }
                });
                var g = function (n) {
                    if (!Re[u]) {
                        return
                    }
                    var l = b.select({source: u}).length;
                    if (ze[u] >= 0 && l >= ze[u]) {
                        if (s) {
                            s({element: t, maxConnections: a}, n)
                        }
                        return false
                    }
                    if (e.filter) {
                        var c = e.filter(o.getOriginalEvent(n), t);
                        if (c === false) {
                            return
                        }
                    }
                    var f = de({elId: r});
                    var p = ((n.pageX || n.page.x) - f.left) / f.width, d = ((n.pageY || n.page.y) - f.top) / f.height, g = p, y = d;
                    if (i.parent) {
                        var P = o.getElementObject(i.parent), C = me(P);
                        f = de({elId: C});
                        g = ((n.pageX || n.page.x) - f.left) / f.width, y = ((n.pageY || n.page.y) - f.top) / f.height
                    }
                    var j = {};
                    M.extend(j, i);
                    j.isSource = true;
                    j.anchor = [p, d, 0, 0];
                    j.parentAnchor = [g, y, 0, 0];
                    j.dragOptions = h;
                    if (i.parent) {
                        var E = j.container || b.Defaults.Container || M.Defaults.Container;
                        if (E) {
                            j.container = E
                        } else {
                            j.container = M.CurrentLibrary.getParent(i.parent)
                        }
                    }
                    v = b.addEndpoint(r, j);
                    m = true;
                    v.endpointWillMoveAfterConnection = i.parent != null;
                    v.endpointWillMoveTo = i.parent ? o.getElementObject(i.parent) : null;
                    var x = function () {
                        if (m) {
                            b.deleteEndpoint(v)
                        }
                    };
                    b.registerListener(v.canvas, "mouseup", x);
                    b.registerListener(t, "mouseup", x);
                    o.trigger(v.canvas, "mousedown", n)
                };
                b.registerListener(t, "mousedown", g);
                Be[r] = g
            };
            t = X(t);
            var u = t.length && t.constructor != String ? t : [t];
            for (var c = 0; c < u.length; c++) {
                l(v(u[c]))
            }
            return b
        };
        this.unmakeSource = function (t, e) {
            t = M.CurrentLibrary.getElementObject(t);
            var n = me(t), r = Be[n];
            if (r) {
                b.unregisterListener(_el, "mousedown", r)
            }
            if (!e) {
                delete Ne[n];
                delete Ve[n];
                delete Re[n];
                delete Be[n];
                delete ze[n]
            }
            return b
        };
        this.unmakeEverySource = function () {
            for (var t in Re) {
                b.unmakeSource(t, true)
            }
            Ne = {};
            Ve = {};
            Re = {};
            Be = {}
        };
        this.unmakeEveryTarget = function () {
            for (var t in Ge) {
                b.unmakeTarget(t, true)
            }
            Te = {};
            Ue = {};
            Fe = {};
            Ge = {};
            return b
        };
        this.makeSources = function (t, e, n) {
            for (var r = 0; r < t.length; r++) {
                b.makeSource(t[r], e, n)
            }
            return b
        };
        var Ze = function (t, e, n, r) {
            var i = t == "source" ? Re : Ge;
            if (s(e)) {
                i[e] = r ? !i[e] : n
            } else {
                if (e.length) {
                    e = X(e);
                    for (var o = 0; o < e.length; o++) {
                        var a = _el = M.CurrentLibrary.getElementObject(e[o]), a = me(_el);
                        i[a] = r ? !i[a] : n
                    }
                }
            }
            return b
        };
        this.setSourceEnabled = function (t, e) {
            return Ze("source", t, e)
        };
        this.toggleSourceEnabled = function (t) {
            Ze("source", t, null, true);
            return b.isSourceEnabled(t)
        };
        this.isSource = function (t) {
            t = M.CurrentLibrary.getElementObject(t);
            return Re[me(t)] != null
        };
        this.isSourceEnabled = function (t) {
            t = M.CurrentLibrary.getElementObject(t);
            return Re[me(t)] === true
        };
        this.setTargetEnabled = function (t, e) {
            return Ze("target", t, e)
        };
        this.toggleTargetEnabled = function (t) {
            return Ze("target", t, null, true);
            return b.isTargetEnabled(t)
        };
        this.isTarget = function (t) {
            t = M.CurrentLibrary.getElementObject(t);
            return Ge[me(t)] != null
        };
        this.isTargetEnabled = function (t) {
            t = M.CurrentLibrary.getElementObject(t);
            return Ge[me(t)] === true
        };
        this.ready = function (t) {
            b.bind("ready", t)
        }, this.repaint = function (t, e, n) {
            if (typeof t == "object") {
                for (var r = 0; r < t.length; r++) {
                    K(v(t[r]), e, n)
                }
            } else {
                K(v(t), e, n)
            }
        };
        this.repaintEverything = function () {
            for (var t in _) {
                K(v(t))
            }
        };
        this.removeAllEndpoints = function (t) {
            var e = c(t, "id"), n = _[e];
            if (n) {
                for (var r = 0; r < n.length; r++) {
                    b.deleteEndpoint(n[r])
                }
            }
            _[e] = []
        };
        this.removeEveryEndpoint = this.deleteEveryEndpoint;
        this.removeEndpoint = function (t, e) {
            b.deleteEndpoint(e)
        };
        var qe = {}, Ye = function () {
            for (var t in qe) {
                for (var e = 0; e < qe[t].length; e++) {
                    var n = qe[t][e];
                    M.CurrentLibrary.unbind(n.el, n.event, n.listener)
                }
            }
            qe = {}
        };
        this.registerListener = function (t, e, n) {
            M.CurrentLibrary.bind(t, e, n);
            G(qe, e, {el: t, event: e, listener: n})
        };
        this.unregisterListener = function (t, e, r) {
            M.CurrentLibrary.unbind(t, e, r);
            n(qe, function (t) {
                return t.type == e && t.listener == r
            })
        };
        this.reset = function () {
            b.deleteEveryEndpoint();
            b.unbind();
            Te = {};
            _e = {};
            Ue = {};
            Fe = {};
            Ne = {};
            We = {};
            Ve = {};
            ze = {};
            Ye();
            b.anchorManager.reset();
            if (!jsPlumbAdapter.headless) {
                b.dragManager.reset()
            }
        };
        this.setDefaultScope = function (t) {
            B = t
        };
        this.setDraggable = ce;
        this.setId = function (t, e, n) {
            var r = t.constructor == String ? t : b.getId(t), i = b.getConnections({
                source: r,
                scope: "*"
            }, true), o = b.getConnections({target: r, scope: "*"}, true);
            e = "" + e;
            if (!n) {
                t = M.CurrentLibrary.getElementObject(r);
                M.CurrentLibrary.setAttribute(t, "id", e)
            }
            t = M.CurrentLibrary.getElementObject(e);
            _[e] = _[r] || [];
            for (var a = 0; a < _[e].length; a++) {
                _[e][a].elementId = e;
                _[e][a].element = t;
                _[e][a].anchor.elementId = e
            }
            delete _[r];
            b.anchorManager.changeId(r, e);
            var s = function (n, r, i) {
                for (var o = 0; o < n.length; o++) {
                    n[o].endpoints[r].elementId = e;
                    n[o].endpoints[r].element = t;
                    n[o][i + "Id"] = e;
                    n[o][i] = t
                }
            };
            s(i, 0, "source");
            s(o, 1, "target")
        };
        this.setIdChanged = function (t, e) {
            b.setId(t, e, true)
        };
        this.setDebugLog = function (t) {
            A = t
        };
        var Xe = false, Ke = null;
        this.setSuspendDrawing = function (t, e) {
            Xe = t;
            if (t) {
                Ke = (new Date).getTime()
            } else {
                Ke = null
            }
            if (e) {
                b.repaintEverything()
            }
        };
        this.isSuspendDrawing = function () {
            return Xe
        };
        this.CANVAS = "canvas";
        this.SVG = "svg";
        this.VML = "vml";
        this.setRenderMode = function (t) {
            z = jsPlumbAdapter.setRenderMode(t);
            return z
        };
        this.getRenderMode = function () {
            return z
        };
        this.show = function (t, e) {
            fe(t, "block", e)
        };
        this.sizeCanvas = function (t, e, n, r, i) {
            if (t) {
                t.style.height = i + "px";
                t.height = i;
                t.style.width = r + "px";
                t.width = r;
                t.style.left = e + "px";
                t.style.top = n + "px"
            }
        };
        this.getTestHarness = function () {
            return {
                endpointsByElement: _, endpointCount: function (t) {
                    var e = _[t];
                    return e ? e.length : 0
                }, connectionCount: function (t) {
                    t = t || B;
                    var e = T[t];
                    return e ? e.length : 0
                }, getId: me, makeAnchor: self.makeAnchor, makeDynamicAnchor: self.makeDynamicAnchor
            }
        };
        this.toggle = pe;
        this.toggleVisible = pe;
        this.toggleDraggable = he;
        this.wrap = ge;
        this.addListener = this.bind;
        var Qe = function (t, e) {
            var n = null, r = t;
            if (e.tagName.toLowerCase() === "svg" && e.parentNode) {
                n = e.parentNode
            } else {
                if (e.offsetParent) {
                    n = e.offsetParent
                }
            }
            if (n != null) {
                var i = n.tagName.toLowerCase() === "body" ? {
                    left: 0,
                    top: 0
                } : m(n, b), o = n.tagName.toLowerCase() === "body" ? {left: 0, top: 0} : {
                    left: n.scrollLeft,
                    top: n.scrollTop
                };
                r[0] = t[0] - i.left + o.left;
                r[1] = t[1] - i.top + o.top
            }
            return r
        };
        var Je = function (t) {
            var e = this;
            this.x = t.x || 0;
            this.y = t.y || 0;
            this.elementId = t.elementId;
            var n = t.orientation || [0, 0];
            var r = null, i = null;
            this.offsets = t.offsets || [0, 0];
            e.timestamp = null;
            this.compute = function (t) {
                var n = t.xy, r = t.wh, o = t.element, a = t.timestamp;
                if (a && a === e.timestamp) {
                    return i
                }
                i = [n[0] + e.x * r[0] + e.offsets[0], n[1] + e.y * r[1] + e.offsets[1]];
                i = Qe(i, o.canvas);
                e.timestamp = a;
                return i
            };
            this.getOrientation = function (t) {
                return n
            };
            this.equals = function (t) {
                if (!t) {
                    return false
                }
                var e = t.getOrientation();
                var n = this.getOrientation();
                return this.x == t.x && this.y == t.y && this.offsets[0] == t.offsets[0] && this.offsets[1] == t.offsets[1] && n[0] == e[0] && n[1] == e[1]
            };
            this.getCurrentLocation = function () {
                return i
            }
        };
        var $e = function (t) {
            var e = t.reference, n = t.referenceCanvas, r = g(v(n)), i = 0, o = 0, a = null, s = null;
            this.x = 0;
            this.y = 0;
            this.isFloating = true;
            this.compute = function (t) {
                var e = t.xy, n = t.element, i = [e[0] + r[0] / 2, e[1] + r[1] / 2];
                i = Qe(i, n.canvas);
                s = i;
                return i
            };
            this.getOrientation = function (t) {
                if (a) {
                    return a
                } else {
                    var n = e.getOrientation(t);
                    return [Math.abs(n[0]) * i * -1, Math.abs(n[1]) * o * -1]
                }
            };
            this.over = function (t) {
                a = t.getOrientation()
            };
            this.out = function () {
                a = null
            };
            this.getCurrentLocation = function () {
                return s
            }
        };
        var tn = function (t, e, n) {
            this.isSelective = true;
            this.isDynamic = true;
            var r = [], i = this, o = function (t) {
                return t.constructor == Je ? t : b.makeAnchor(t, n, b)
            };
            for (var a = 0; a < t.length; a++) {
                r[a] = o(t[a])
            }
            this.addAnchor = function (t) {
                r.push(o(t))
            };
            this.getAnchors = function () {
                return r
            };
            this.locked = false;
            var s = r.length > 0 ? r[0] : null, l = r.length > 0 ? 0 : -1, i = this, u = function (t, e, n, r, i) {
                var o = r[0] + t.x * i[0], a = r[1] + t.y * i[1];
                return Math.sqrt(Math.pow(e - o, 2) + Math.pow(n - a, 2))
            }, c = e || function (t, e, n, r, i) {
                    var o = n[0] + r[0] / 2, a = n[1] + r[1] / 2;
                    var s = -1, l = Infinity;
                    for (var c = 0; c < i.length; c++) {
                        var f = u(i[c], o, a, t, e);
                        if (f < l) {
                            s = c + 0;
                            l = f
                        }
                    }
                    return i[s]
                };
            this.compute = function (t) {
                var e = t.xy, n = t.wh, o = t.timestamp, a = t.txy, l = t.twh;
                if (i.locked || a == null || l == null) {
                    return s.compute(t)
                } else {
                    t.timestamp = null
                }
                s = c(e, n, a, l, r);
                i.x = s.x;
                i.y = s.y;
                return s.compute(t)
            };
            this.getCurrentLocation = function () {
                return s != null ? s.getCurrentLocation() : null
            };
            this.getOrientation = function (t) {
                return s != null ? s.getOrientation(t) : [0, 0]
            };
            this.over = function (t) {
                if (s != null) {
                    s.over(t)
                }
            };
            this.out = function () {
                if (s != null) {
                    s.out()
                }
            }
        };
        var en = {}, nn = {}, rn = {}, on = {
            HORIZONTAL: "horizontal",
            VERTICAL: "vertical",
            DIAGONAL: "diagonal",
            IDENTITY: "identity"
        }, an = function (t, e, n, r) {
            if (t === e) {
                return {orientation: on.IDENTITY, a: ["top", "top"]}
            }
            var i = Math.atan2(r.centery - n.centery, r.centerx - n.centerx), o = Math.atan2(n.centery - r.centery, n.centerx - r.centerx), a = n.left <= r.left && n.right >= r.left || n.left <= r.right && n.right >= r.right || n.left <= r.left && n.right >= r.right || r.left <= n.left && r.right >= n.right, s = n.top <= r.top && n.bottom >= r.top || n.top <= r.bottom && n.bottom >= r.bottom || n.top <= r.top && n.bottom >= r.bottom || r.top <= n.top && r.bottom >= n.bottom;
            if (!(a || s)) {
                var l = null, u = false, c = false, f = null;
                if (r.left > n.left && r.top > n.top) {
                    l = ["right", "top"]
                } else {
                    if (r.left > n.left && n.top > r.top) {
                        l = ["top", "left"]
                    } else {
                        if (r.left < n.left && r.top < n.top) {
                            l = ["top", "right"]
                        } else {
                            if (r.left < n.left && r.top > n.top) {
                                l = ["left", "top"]
                            }
                        }
                    }
                }
                return {orientation: on.DIAGONAL, a: l, theta: i, theta2: o}
            } else {
                if (a) {
                    return {
                        orientation: on.HORIZONTAL,
                        a: n.top < r.top ? ["bottom", "top"] : ["top", "bottom"],
                        theta: i,
                        theta2: o
                    }
                } else {
                    return {
                        orientation: on.VERTICAL,
                        a: n.left < r.left ? ["right", "left"] : ["left", "right"],
                        theta: i,
                        theta2: o
                    }
                }
            }
        }, sn = function (t, e, n, r, i, o, a) {
            var s = [], l = e[i ? 0 : 1] / (r.length + 1);
            for (var u = 0; u < r.length; u++) {
                var c = (u + 1) * l, f = o * e[i ? 1 : 0];
                if (a) {
                    c = e[i ? 0 : 1] - c
                }
                var h = i ? c : f, p = n[0] + h, d = h / e[0], v = i ? f : c, m = n[1] + v, g = v / e[1];
                s.push([p, m, d, g, r[u][1], r[u][2]])
            }
            return s
        }, ln = function (t, e) {
            return t[0] > e[0] ? 1 : -1
        }, un = function (t) {
            return function (e, n) {
                var r = true;
                if (t) {
                    if (e[0][0] < n[0][0]) {
                        r = true
                    } else {
                        r = e[0][1] > n[0][1]
                    }
                } else {
                    if (e[0][0] > n[0][0]) {
                        r = true
                    } else {
                        r = e[0][1] > n[0][1]
                    }
                }
                return r === false ? -1 : 1
            }
        }, cn = function (t, e) {
            var n = t[0][0] < 0 ? -Math.PI - t[0][0] : Math.PI - t[0][0], r = e[0][0] < 0 ? -Math.PI - e[0][0] : Math.PI - e[0][0];
            if (n > r) {
                return 1
            } else {
                return t[0][1] > e[0][1] ? 1 : -1
            }
        }, fn = {top: ln, right: un(true), bottom: un(true), left: cn}, hn = function (t, e) {
            return t.sort(e)
        }, pn = function (t, e) {
            var n = R[t], r = F[t], i = function (e, n, r, i, o, a, s) {
                if (i.length > 0) {
                    var l = hn(i, fn[e]), u = e === "right" || e === "top", c = sn(e, n, r, l, o, a, u);
                    var f = function (t, e) {
                        var n = Qe([e[0], e[1]], t.canvas);
                        nn[t.id] = [n[0], n[1], e[2], e[3]];
                        rn[t.id] = s
                    };
                    for (var h = 0; h < c.length; h++) {
                        var p = c[h][4], d = p.endpoints[0].elementId === t, v = p.endpoints[1].elementId === t;
                        if (d) {
                            f(p.endpoints[0], c[h])
                        } else {
                            if (v) {
                                f(p.endpoints[1], c[h])
                            }
                        }
                    }
                }
            };
            i("bottom", n, [r.left, r.top], e.bottom, true, 1, [0, 1]);
            i("top", n, [r.left, r.top], e.top, true, 0, [0, -1]);
            i("left", n, [r.left, r.top], e.left, false, 0, [-1, 0]);
            i("right", n, [r.left, r.top], e.right, false, 1, [1, 0])
        }, dn = function () {
            var e = {}, r = {}, o = this, a = {};
            this.reset = function () {
                e = {};
                r = {};
                a = {}
            };
            this.newConnection = function (t) {
                var e = t.sourceId, n = t.targetId, i = t.endpoints, o = true, a = function (t, a, s, l, u) {
                    if (e == n && s.isContinuous) {
                        M.CurrentLibrary.removeElement(i[1].canvas);
                        o = false
                    }
                    G(r, l, [u, a, s.constructor == tn])
                };
                a(0, i[0], i[0].anchor, n, t);
                if (o) {
                    a(1, i[1], i[1].anchor, e, t)
                }
            };
            this.connectionDetached = function (t) {
                var e = t.connection || t;
                var i = e.sourceId, s = e.targetId, l = e.endpoints, u = function (t, e, i, o, a) {
                    if (i.constructor == $e) {
                    } else {
                        n(r[o], function (t) {
                            return t[0].id == a.id
                        })
                    }
                };
                u(1, l[1], l[1].anchor, i, e);
                u(0, l[0], l[0].anchor, s, e);
                var c = e.sourceId, f = e.targetId, h = e.endpoints[0].id, p = e.endpoints[1].id, d = function (t, e) {
                    if (t) {
                        var r = function (t) {
                            return t[4] == e
                        };
                        n(t.top, r);
                        n(t.left, r);
                        n(t.bottom, r);
                        n(t.right, r)
                    }
                };
                d(a[c], h);
                d(a[f], p);
                o.redraw(c);
                o.redraw(f)
            };
            this.add = function (t, n) {
                G(e, n, t)
            };
            this.changeId = function (t, n) {
                r[n] = r[t];
                e[n] = e[t];
                delete r[t];
                delete e[t]
            };
            this.getConnectionsFor = function (t) {
                return r[t] || []
            };
            this.getEndpointsFor = function (t) {
                return e[t] || []
            };
            this.deleteEndpoint = function (t) {
                n(e[t.elementId], function (e) {
                    return e.id == t.id
                })
            };
            this.clearFor = function (t) {
                delete e[t];
                e[t] = []
            };
            var s = function (e, n, r, o, a, s, l, u, c, f, h, p) {
                var d = -1, v = -1, m = o.endpoints[l], g = m.id, y = [1, 0][l], b = [[n, r], o, a, s, g], P = e[c], C = m._continuousAnchorEdge ? e[m._continuousAnchorEdge] : null;
                if (C) {
                    var j = t(C, function (t) {
                        return t[4] == g
                    });
                    if (j != -1) {
                        C.splice(j, 1);
                        for (var E = 0; E < C.length; E++) {
                            i(h, C[E][1], function (t) {
                                return t.id == C[E][1].id
                            });
                            i(p, C[E][1].endpoints[l], function (t) {
                                return t.id == C[E][1].endpoints[l].id
                            })
                        }
                    }
                }
                for (var E = 0; E < P.length; E++) {
                    if (l == 1 && P[E][3] === s && v == -1) {
                        v = E
                    }
                    i(h, P[E][1], function (t) {
                        return t.id == P[E][1].id
                    });
                    i(p, P[E][1].endpoints[l], function (t) {
                        return t.id == P[E][1].endpoints[l].id
                    })
                }
                if (d != -1) {
                    P[d] = b
                } else {
                    var x = u ? v != -1 ? v : 0 : P.length;
                    P.splice(x, 0, b)
                }
                m._continuousAnchorEdge = c
            };
            this.redraw = function (t, n, o, l) {
                if (!Xe) {
                    var u = e[t] || [], c = r[t] || [], f = [], h = [], p = [];
                    o = o || E();
                    l = l || {left: 0, top: 0};
                    if (n) {
                        n = {left: n.left + l.left, top: n.top + l.top}
                    }
                    de({elId: t, offset: n, recalc: false, timestamp: o});
                    var d = F[t], v = R[t], m = {};
                    for (var g = 0; g < c.length; g++) {
                        var y = c[g][0], b = y.sourceId, P = y.targetId, C = y.endpoints[0].anchor.isContinuous, j = y.endpoints[1].anchor.isContinuous;
                        if (C || j) {
                            var x = b + "_" + P, D = P + "_" + b, S = m[x], I = y.sourceId == t ? 1 : 0;
                            if (C && !a[b]) {
                                a[b] = {top: [], right: [], bottom: [], left: []}
                            }
                            if (j && !a[P]) {
                                a[P] = {top: [], right: [], bottom: [], left: []}
                            }
                            if (t != P) {
                                de({elId: P, timestamp: o})
                            }
                            if (t != b) {
                                de({elId: b, timestamp: o})
                            }
                            var O = ve(P), L = ve(b);
                            if (P == b && (C || j)) {
                                s(a[b], -Math.PI / 2, 0, y, false, P, 0, false, "top", b, f, h)
                            } else {
                                if (!S) {
                                    S = an(b, P, L.o, O.o);
                                    m[x] = S
                                }
                                if (C) {
                                    s(a[b], S.theta, 0, y, false, P, 0, false, S.a[0], b, f, h)
                                }
                                if (j) {
                                    s(a[P], S.theta2, -1, y, true, b, 1, true, S.a[1], P, f, h)
                                }
                            }
                            if (C) {
                                i(p, b, function (t) {
                                    return t === b
                                })
                            }
                            if (j) {
                                i(p, P, function (t) {
                                    return t === P
                                })
                            }
                            i(f, y, function (t) {
                                return t.id == y.id
                            });
                            if (C && I == 0 || j && I == 1) {
                                i(h, y.endpoints[I], function (t) {
                                    return t.id == y.endpoints[I].id
                                })
                            }
                        }
                    }
                    for (var g = 0; g < u.length; g++) {
                        if (u[g].connections.length == 0 && u[g].anchor.isContinuous) {
                            if (!a[t]) {
                                a[t] = {top: [], right: [], bottom: [], left: []}
                            }
                            s(a[t], -Math.PI / 2, 0, {
                                endpoints: [u[g], u[g]], paint: function () {
                                }
                            }, false, t, 0, false, "top", t, f, h);
                            i(p, t, function (e) {
                                return e === t
                            })
                        }
                    }
                    for (var g = 0; g < p.length; g++) {
                        pn(p[g], a[p[g]])
                    }
                    for (var g = 0; g < u.length; g++) {
                        u[g].paint({timestamp: o, offset: d, dimensions: v})
                    }
                    for (var g = 0; g < h.length; g++) {
                        h[g].paint({timestamp: o, offset: d, dimensions: v})
                    }
                    for (var g = 0; g < c.length; g++) {
                        var M = c[g][1];
                        if (M.anchor.constructor == tn) {
                            M.paint({elementWithPrecedence: t});
                            i(f, c[g][0], function (t) {
                                return t.id == c[g][0].id
                            });
                            for (var A = 0; A < M.connections.length; A++) {
                                if (M.connections[A] !== c[g][0]) {
                                    i(f, M.connections[A], function (t) {
                                        return t.id == M.connections[A].id
                                    })
                                }
                            }
                        } else {
                            if (M.anchor.constructor == Je) {
                                i(f, c[g][0], function (t) {
                                    return t.id == c[g][0].id
                                })
                            }
                        }
                    }
                    var w = N[t];
                    if (w) {
                        w.paint({timestamp: o, recalc: false, elId: t})
                    }
                    for (var g = 0; g < f.length; g++) {
                        f[g].paint({elId: t, timestamp: o, recalc: false})
                    }
                }
            };
            this.rehomeEndpoint = function (t, n) {
                var r = e[t] || [], i = b.getId(n);
                for (var a = 0; a < r.length; a++) {
                    o.add(r[a], i)
                }
                r.splice(0, r.length)
            }
        };
        b.anchorManager = new dn;
        b.continuousAnchorFactory = {
            get: function (t) {
                var e = en[t.elementId];
                if (!e) {
                    e = {
                        type: "Continuous", compute: function (t) {
                            return nn[t.element.id] || [0, 0]
                        }, getCurrentLocation: function (t) {
                            return nn[t.id] || [0, 0]
                        }, getOrientation: function (t) {
                            return rn[t.id] || [0, 0]
                        }, isDynamic: true, isContinuous: true
                    };
                    en[t.elementId] = e
                }
                return e
            }
        };
        if (!jsPlumbAdapter.headless) {
            b.dragManager = jsPlumbAdapter.getDragManager(b)
        }
        var vn = function (t) {
            var e = this, n = true, r, i;
            e.idPrefix = "_jsplumb_c_";
            e.defaultLabelLocation = .5;
            e.defaultOverlayKeys = ["Overlays", "ConnectionOverlays"];
            this.parent = t.parent;
            D.apply(this, arguments);
            this.isVisible = function () {
                return n
            };
            this.setVisible = function (t) {
                n = t;
                e[t ? "showOverlays" : "hideOverlays"]();
                if (e.connector && e.connector.canvas) {
                    e.connector.canvas.style.display = t ? "block" : "none"
                }
                e.repaint()
            };
            this.getTypeDescriptor = function () {
                return "connection"
            };
            this.getDefaultType = function () {
                return {
                    parameters: {},
                    scope: null,
                    detachable: e._jsPlumb.Defaults.ConnectionsDetachable,
                    paintStyle: e._jsPlumb.Defaults.PaintStyle || M.Defaults.PaintStyle,
                    connector: e._jsPlumb.Defaults.Connector || M.Defaults.Connector,
                    hoverPaintStyle: e._jsPlumb.Defaults.HoverPaintStyle || M.Defaults.HoverPaintStyle,
                    overlays: e._jsPlumb.Defaults.ConnectorOverlays || M.Defaults.ConnectorOverlays
                }
            };
            var o = this.applyType;
            this.applyType = function (t) {
                o(t);
                if (t.detachable != null) {
                    e.setDetachable(t.detachable)
                }
                if (t.scope) {
                    e.scope = t.scope
                }
                e.setConnector(t.connector)
            };
            i = e.setHover;
            e.setHover = function (t) {
                var n = b.ConnectorZIndex || M.Defaults.ConnectorZIndex;
                if (n) {
                    e.connector.setZIndex(n + (t ? 1 : 0))
                }
                e.connector.setHover.apply(e.connector, arguments);
                i.apply(e, arguments)
            };
            r = function (t) {
                if (u == null) {
                    e.setHover(t, false)
                }
            };
            this.setConnector = function (n, i) {
                if (e.connector != null) {
                    ue(e.connector.getDisplayElements(), e.parent)
                }
                var o = {
                    _jsPlumb: e._jsPlumb,
                    parent: t.parent,
                    cssClass: t.cssClass,
                    container: t.container,
                    tooltip: e.tooltip
                };
                if (s(n)) {
                    this.connector = new M.Connectors[z][n](o)
                } else {
                    if (a(n)) {
                        if (n.length == 1) {
                            this.connector = new M.Connectors[z][n[0]](o)
                        } else {
                            this.connector = new M.Connectors[z][n[0]](M.extend(n[1], o))
                        }
                    }
                }
                e.canvas = e.connector.canvas;
                S(e.connector, e, r);
                var l = b.ConnectorZIndex || M.Defaults.ConnectorZIndex;
                if (l) {
                    e.connector.setZIndex(l)
                }
                if (!i) {
                    e.repaint()
                }
            };
            this.source = v(t.source);
            this.target = v(t.target);
            if (t.sourceEndpoint) {
                this.source = t.sourceEndpoint.endpointWillMoveTo || t.sourceEndpoint.getElement()
            }
            if (t.targetEndpoint) {
                this.target = t.targetEndpoint.getElement()
            }
            e.previousConnection = t.previousConnection;
            this.sourceId = c(this.source, "id");
            this.targetId = c(this.target, "id");
            this.scope = t.scope;
            this.endpoints = [];
            this.endpointStyles = [];
            var l = function (t, e) {
                return t ? b.makeAnchor(t, e, b) : null
            }, f = function (t, n, r, i, o, a, s) {
                var u;
                if (t) {
                    e.endpoints[n] = t;
                    t.addConnection(e)
                } else {
                    if (!r.endpoints) {
                        r.endpoints = [null, null]
                    }
                    var c = r.endpoints[n] || r.endpoint || b.Defaults.Endpoints[n] || M.Defaults.Endpoints[n] || b.Defaults.Endpoint || M.Defaults.Endpoint;
                    if (!r.endpointStyles) {
                        r.endpointStyles = [null, null]
                    }
                    if (!r.endpointHoverStyles) {
                        r.endpointHoverStyles = [null, null]
                    }
                    var f = r.endpointStyles[n] || r.endpointStyle || b.Defaults.EndpointStyles[n] || M.Defaults.EndpointStyles[n] || b.Defaults.EndpointStyle || M.Defaults.EndpointStyle;
                    if (f.fillStyle == null && a != null) {
                        f.fillStyle = a.strokeStyle
                    }
                    if (f.outlineColor == null && a != null) {
                        f.outlineColor = a.outlineColor
                    }
                    if (f.outlineWidth == null && a != null) {
                        f.outlineWidth = a.outlineWidth
                    }
                    var h = r.endpointHoverStyles[n] || r.endpointHoverStyle || b.Defaults.EndpointHoverStyles[n] || M.Defaults.EndpointHoverStyles[n] || b.Defaults.EndpointHoverStyle || M.Defaults.EndpointHoverStyle;
                    if (s != null) {
                        if (h == null) {
                            h = {}
                        }
                        if (h.fillStyle == null) {
                            h.fillStyle = s.strokeStyle
                        }
                    }
                    var p = r.anchors ? r.anchors[n] : r.anchor ? r.anchor : l(b.Defaults.Anchors[n], o) || l(M.Defaults.Anchors[n], o) || l(b.Defaults.Anchor, o) || l(M.Defaults.Anchor, o), d = r.uuids ? r.uuids[n] : null;
                    u = oe({
                        paintStyle: f,
                        hoverPaintStyle: h,
                        endpoint: c,
                        connections: [e],
                        uuid: d,
                        anchor: p,
                        source: i,
                        scope: r.scope,
                        container: r.container,
                        reattach: r.reattach,
                        detachable: r.detachable
                    });
                    e.endpoints[n] = u;
                    if (r.drawEndpoints === false) {
                        u.setVisible(false, true, true)
                    }
                }
                return u
            };
            var h = f(t.sourceEndpoint, 0, t, e.source, e.sourceId, t.paintStyle, t.hoverPaintStyle);
            if (h) {
                G(_, this.sourceId, h)
            }
            var p = f(t.targetEndpoint, 1, t, e.target, e.targetId, t.paintStyle, t.hoverPaintStyle);
            if (p) {
                G(_, this.targetId, p)
            }
            if (!this.scope) {
                this.scope = this.endpoints[0].scope
            }
            if (t.deleteEndpointsOnDetach) {
                e.endpointsToDeleteOnDetach = [h, p]
            }
            e.setConnector(this.endpoints[0].connector || this.endpoints[1].connector || t.connector || b.Defaults.Connector || M.Defaults.Connector, true);
            this.setPaintStyle(this.endpoints[0].connectorStyle || this.endpoints[1].connectorStyle || t.paintStyle || b.Defaults.PaintStyle || M.Defaults.PaintStyle, true);
            this.setHoverPaintStyle(this.endpoints[0].connectorHoverStyle || this.endpoints[1].connectorHoverStyle || t.hoverPaintStyle || b.Defaults.HoverPaintStyle || M.Defaults.HoverPaintStyle, true);
            this.paintStyleInUse = this.getPaintStyle();
            de({elId: this.sourceId, timestamp: Ke});
            de({elId: this.targetId, timestamp: Ke});
            var d = F[this.sourceId], m = R[this.sourceId], g = F[this.targetId], y = R[this.targetId], P = Ke || E(), C = this.endpoints[0].anchor.compute({
                xy: [d.left, d.top],
                wh: m,
                element: this.endpoints[0],
                elementId: this.endpoints[0].elementId,
                txy: [g.left, g.top],
                twh: y,
                tElement: this.endpoints[1],
                timestamp: P
            });
            this.endpoints[0].paint({anchorLoc: C, timestamp: P});
            C = this.endpoints[1].anchor.compute({
                xy: [g.left, g.top],
                wh: y,
                element: this.endpoints[1],
                elementId: this.endpoints[1].elementId,
                txy: [d.left, d.top],
                twh: m,
                tElement: this.endpoints[0],
                timestamp: P
            });
            this.endpoints[1].paint({anchorLoc: C, timestamp: P});
            var j = b.Defaults.ConnectionsDetachable;
            if (t.detachable === false) {
                j = false
            }
            if (e.endpoints[0].connectionsDetachable === false) {
                j = false
            }
            if (e.endpoints[1].connectionsDetachable === false) {
                j = false
            }
            this.isDetachable = function () {
                return j === true
            };
            this.setDetachable = function (t) {
                j = t === true
            };
            var x = t.cost || e.endpoints[0].getConnectionCost();
            e.getCost = function () {
                return x
            };
            e.setCost = function (t) {
                x = t
            };
            var I = !(t.bidirectional === false);
            if (t.bidirectional == null) {
                I = e.endpoints[0].areConnectionsBidirectional()
            }
            e.isBidirectional = function () {
                return I
            };
            var O = M.extend({}, this.endpoints[0].getParameters());
            M.extend(O, this.endpoints[1].getParameters());
            M.extend(O, e.getParameters());
            e.setParameters(O);
            this.getAttachedElements = function () {
                return e.endpoints
            };
            this.moveParent = function (t) {
                var n = M.CurrentLibrary, r = n.getParent(e.connector.canvas);
                if (e.connector.bgCanvas) {
                    n.removeElement(e.connector.bgCanvas, r);
                    n.appendElement(e.connector.bgCanvas, t)
                }
                n.removeElement(e.connector.canvas, r);
                n.appendElement(e.connector.canvas, t);
                for (var i = 0; i < e.overlays.length; i++) {
                    if (e.overlays[i].isAppendedAtTopLevel) {
                        n.removeElement(e.overlays[i].canvas, r);
                        n.appendElement(e.overlays[i].canvas, t);
                        if (e.overlays[i].reattachListeners) {
                            e.overlays[i].reattachListeners(e.connector)
                        }
                    }
                }
                if (e.connector.reattachListeners) {
                    e.connector.reattachListeners()
                }
            };
            var L = null;
            this.paint = function (t) {
                if (n) {
                    t = t || {};
                    var r = t.elId, i = t.ui, o = t.recalc, a = t.timestamp, s = false, l = s ? this.sourceId : this.targetId, u = s ? this.targetId : this.sourceId, c = s ? 0 : 1, f = s ? 1 : 0;
                    if (a == null || a != L) {
                        var h = de({elId: r, offset: i, recalc: o, timestamp: a}), p = de({elId: l, timestamp: a});
                        var d = this.endpoints[f], v = this.endpoints[c], m = d.anchor.getCurrentLocation(d), g = v.anchor.getCurrentLocation(v);
                        var y = 0;
                        for (var b = 0; b < e.overlays.length; b++) {
                            var P = e.overlays[b];
                            if (P.isVisible()) {
                                y = Math.max(y, P.computeMaxSize())
                            }
                        }
                        var C = this.connector.compute(m, g, this.endpoints[f], this.endpoints[c], this.endpoints[f].anchor, this.endpoints[c].anchor, e.paintStyleInUse.lineWidth, y, h, p);
                        e.connector.paint(C, e.paintStyleInUse);
                        for (var b = 0; b < e.overlays.length; b++) {
                            var P = e.overlays[b];
                            if (P.isVisible) {
                                e.overlayPlacements[b] = P.draw(e.connector, e.paintStyleInUse, C, a)
                            }
                        }
                    }
                    L = a
                }
            };
            this.repaint = function (t) {
                t = t || {};
                var e = !(t.recalc === false);
                this.paint({elId: this.sourceId, recalc: e, timestamp: t.timestamp})
            };
            var A = t.type || e.endpoints[0].connectionType || e.endpoints[1].connectionType;
            if (A) {
                e.addType(A)
            }
        };
        var mn = function (t) {
            var e = false;
            return {
                drag: function () {
                    if (e) {
                        e = false;
                        return true
                    }
                    var n = M.CurrentLibrary.getUIPosition(arguments, b.getZoom()), r = t.element;
                    if (r) {
                        M.CurrentLibrary.setOffset(r, n);
                        K(v(r), n)
                    }
                }, stopDrag: function () {
                    e = true
                }
            }
        };
        var gn = function (t, e, n, r, i) {
            var o = new $e({reference: e, referenceCanvas: r});
            return oe({paintStyle: t, endpoint: n, anchor: o, source: i, scope: "__floating"})
        };
        var yn = function (t, e) {
            var n = document.createElement("div");
            n.style.position = "absolute";
            var r = v(n);
            Z(n, e);
            var i = me(r);
            de({elId: i});
            t.id = i;
            t.element = r
        };
        var bn = function (e) {
            var r = this;
            r.idPrefix = "_jsplumb_e_";
            r.defaultLabelLocation = [.5, .5];
            r.defaultOverlayKeys = ["Overlays", "EndpointOverlays"];
            this.parent = e.parent;
            D.apply(this, arguments);
            e = e || {};
            this.getTypeDescriptor = function () {
                return "endpoint"
            };
            this.getDefaultType = function () {
                return {
                    parameters: {},
                    scope: null,
                    maxConnections: r._jsPlumb.Defaults.MaxConnections,
                    paintStyle: r._jsPlumb.Defaults.EndpointStyle || M.Defaults.EndpointStyle,
                    endpoint: r._jsPlumb.Defaults.Endpoint || M.Defaults.Endpoint,
                    hoverPaintStyle: r._jsPlumb.Defaults.EndpointHoverStyle || M.Defaults.EndpointHoverStyle,
                    overlays: r._jsPlumb.Defaults.EndpointOverlays || M.Defaults.EndpointOverlays,
                    connectorStyle: e.connectorStyle,
                    connectorHoverStyle: e.connectorHoverStyle,
                    connectorClass: e.connectorClass,
                    connectorHoverClass: e.connectorHoverClass,
                    connectorOverlays: e.connectorOverlays,
                    connector: e.connector,
                    connectorTooltip: e.connectorTooltip
                }
            };
            var i = this.applyType;
            this.applyType = function (t) {
                i(t);
                if (t.maxConnections != null) {
                    O = t.maxConnections
                }
                if (t.scope) {
                    r.scope = t.scope
                }
                r.connectorStyle = t.connectorStyle;
                r.connectorHoverStyle = t.connectorHoverStyle;
                r.connectorOverlays = t.connectorOverlays;
                r.connector = t.connector;
                r.connectorTooltip = t.connectorTooltip;
                r.connectionType = t.connectionType;
                r.connectorClass = t.connectorClass;
                r.connectorHoverClass = t.connectorHoverClass
            };
            var o = true, l = !(e.enabled === false);
            this.isVisible = function () {
                return o
            };
            this.setVisible = function (t, e, n) {
                o = t;
                if (r.canvas) {
                    r.canvas.style.display = t ? "block" : "none"
                }
                r[t ? "showOverlays" : "hideOverlays"]();
                if (!e) {
                    for (var i = 0; i < r.connections.length; i++) {
                        r.connections[i].setVisible(t);
                        if (!n) {
                            var a = r === r.connections[i].endpoints[0] ? 1 : 0;
                            if (r.connections[i].endpoints[a].connections.length == 1) {
                                r.connections[i].endpoints[a].setVisible(t, true, true)
                            }
                        }
                    }
                }
            };
            this.isEnabled = function () {
                return l
            };
            this.setEnabled = function (t) {
                l = t
            };
            var u = e.source, h = e.uuid, p = null, d = null;
            if (h) {
                U[h] = r
            }
            var g = c(u, "id");
            this.elementId = g;
            this.element = u;
            var y = e.connectionCost;
            this.getConnectionCost = function () {
                return y
            };
            this.setConnectionCost = function (t) {
                y = t
            };
            var P = e.connectionsBidirectional === false ? false : true;
            this.areConnectionsBidirectional = function () {
                return P
            };
            this.setConnectionsBidirectional = function (t) {
                P = t
            };
            r.anchor = e.anchor ? b.makeAnchor(e.anchor, g, b) : e.anchors ? b.makeAnchor(e.anchors, g, b) : b.makeAnchor(b.Defaults.Anchor || "TopCenter", g, b);
            if (!e._transient) {
                b.anchorManager.add(r, g)
            }
            var C = null, j = null;
            this.setEndpoint = function (t) {
                var n = {
                    _jsPlumb: r._jsPlumb,
                    parent: e.parent,
                    container: e.container,
                    tooltip: e.tooltip,
                    connectorTooltip: e.connectorTooltip,
                    endpoint: r
                };
                if (s(t)) {
                    C = new M.Endpoints[z][t](n)
                } else {
                    if (a(t)) {
                        n = M.extend(t[1], n);
                        C = new M.Endpoints[z][t[0]](n)
                    } else {
                        C = t.clone()
                    }
                }
                var i = M.extend({}, n);
                C.clone = function () {
                    var t = new Object;
                    C.constructor.apply(t, [i]);
                    return t
                };
                r.endpoint = C;
                r.type = r.endpoint.type
            };
            this.setEndpoint(e.endpoint || b.Defaults.Endpoint || M.Defaults.Endpoint || "Dot");
            j = C;
            var E = r.setHover;
            r.setHover = function () {
                r.endpoint.setHover.apply(r.endpoint, arguments);
                E.apply(r, arguments)
            };
            var x = function (t) {
                if (r.connections.length > 0) {
                    r.connections[0].setHover(t, false)
                } else {
                    r.setHover(t)
                }
            };
            S(r.endpoint, r, x);
            this.setPaintStyle(e.paintStyle || e.style || b.Defaults.EndpointStyle || M.Defaults.EndpointStyle, true);
            this.setHoverPaintStyle(e.hoverPaintStyle || b.Defaults.EndpointHoverStyle || M.Defaults.EndpointHoverStyle, true);
            this.paintStyleInUse = this.getPaintStyle();
            var I = this.getPaintStyle();
            this.connectorStyle = e.connectorStyle;
            this.connectorHoverStyle = e.connectorHoverStyle;
            this.connectorOverlays = e.connectorOverlays;
            this.connector = e.connector;
            this.connectorTooltip = e.connectorTooltip;
            this.connectorClass = e.connectorClass;
            this.connectorHoverClass = e.connectorHoverClass;
            this.isSource = e.isSource || false;
            this.isTarget = e.isTarget || false;
            var O = e.maxConnections || b.Defaults.MaxConnections;
            this.getAttachedElements = function () {
                return r.connections
            };
            this.canvas = this.endpoint.canvas;
            this.connections = e.connections || [];
            this.scope = e.scope || B;
            this.connectionType = e.connectionType;
            this.timestamp = null;
            r.isReattach = e.reattach || false;
            r.connectionsDetachable = b.Defaults.ConnectionsDetachable;
            if (e.connectionsDetachable === false || e.detachable === false) {
                r.connectionsDetachable = false
            }
            var L = e.dragAllowedWhenFull || true;
            if (e.onMaxConnections) {
                r.bind("maxConnections", e.onMaxConnections)
            }
            this.computeAnchor = function (t) {
                return r.anchor.compute(t)
            };
            this.addConnection = function (t) {
                r.connections.push(t)
            };
            this.detach = function (e, i, o, a, s) {
                var l = t(r.connections, function (t) {
                    return t.id == e.id
                }), u = false;
                a = a !== false;
                if (l >= 0) {
                    if (o || e._forceDetach || e.isDetachable() || e.isDetachAllowed(e)) {
                        var c = e.endpoints[0] == r ? e.endpoints[1] : e.endpoints[0];
                        if (o || e._forceDetach || r.isDetachAllowed(e)) {
                            r.connections.splice(l, 1);
                            if (!i) {
                                c.detach(e, true, o);
                                if (e.endpointsToDeleteOnDetach) {
                                    for (var f = 0; f < e.endpointsToDeleteOnDetach.length; f++) {
                                        var h = e.endpointsToDeleteOnDetach[f];
                                        if (h && h.connections.length == 0) {
                                            b.deleteEndpoint(h)
                                        }
                                    }
                                }
                            }
                            ue(e.connector.getDisplayElements(), e.parent);
                            n(T[e.scope], function (t) {
                                return t.id == e.id
                            });
                            u = true;
                            var p = !i && a;
                            ye(e, p, s)
                        }
                    }
                }
                return u
            };
            this.detachAll = function (t, e) {
                while (r.connections.length > 0) {
                    r.detach(r.connections[0], false, true, t, e)
                }
            };
            this.detachFrom = function (t, e, n) {
                var i = [];
                for (var o = 0; o < r.connections.length; o++) {
                    if (r.connections[o].endpoints[1] == t || r.connections[o].endpoints[0] == t) {
                        i.push(r.connections[o])
                    }
                }
                for (var o = 0; o < i.length; o++) {
                    if (r.detach(i[o], false, true, e, n)) {
                        i[o].setHover(false, false)
                    }
                }
            };
            this.detachFromConnection = function (e) {
                var n = t(r.connections, function (t) {
                    return t.id == e.id
                });
                if (n >= 0) {
                    r.connections.splice(n, 1)
                }
            };
            this.getElement = function () {
                return u
            };
            this.setElement = function (t, e) {
                var i = me(t);
                n(_[r.elementId], function (t) {
                    return t.id == r.id
                });
                u = v(t);
                g = me(u);
                r.elementId = g;
                var o = ie({source: i, container: e}), a = q.getParent(r.canvas);
                q.removeElement(r.canvas, a);
                q.appendElement(r.canvas, o);
                for (var s = 0; s < r.connections.length; s++) {
                    r.connections[s].moveParent(o);
                    r.connections[s].sourceId = g;
                    r.connections[s].source = u
                }
                G(_, i, r)
            };
            this.getUuid = function () {
                return h
            };
            this.makeInPlaceCopy = function () {
                var t = r.anchor.getCurrentLocation(r), e = r.anchor.getOrientation(r), n = {
                    compute: function () {
                        return [t[0], t[1]]
                    }, getCurrentLocation: function () {
                        return [t[0], t[1]]
                    }, getOrientation: function () {
                        return e
                    }
                };
                return oe({
                    anchor: n,
                    source: u,
                    paintStyle: this.getPaintStyle(),
                    endpoint: C,
                    _transient: true,
                    scope: r.scope
                })
            };
            this.isConnectedTo = function (t) {
                var e = false;
                if (t) {
                    for (var n = 0; n < r.connections.length; n++) {
                        if (r.connections[n].endpoints[1] == t) {
                            e = true;
                            break
                        }
                    }
                }
                return e
            };
            this.isFloating = function () {
                return p != null
            };
            this.connectorSelector = function () {
                var t = r.connections[0];
                if (r.isTarget && t) {
                    return t
                } else {
                    return r.connections.length < O || O == -1 ? null : t
                }
            };
            this.isFull = function () {
                return !(r.isFloating() || O < 1 || r.connections.length < O)
            };
            this.setDragAllowedWhenFull = function (t) {
                L = t
            };
            this.setStyle = r.setPaintStyle;
            this.equals = function (t) {
                return this.anchor.equals(t.anchor)
            };
            var A = function (t) {
                var e = 0;
                if (t != null) {
                    for (var n = 0; n < r.connections.length; n++) {
                        if (r.connections[n].sourceId == t || r.connections[n].targetId == t) {
                            e = n;
                            break
                        }
                    }
                }
                return r.connections[e]
            };
            this.paint = function (t) {
                t = t || {};
                var e = t.timestamp, n = !(t.recalc === false);
                if (!e || r.timestamp !== e) {
                    de({elId: g, timestamp: e, recalc: n});
                    var i = t.offset || F[g];
                    if (i) {
                        var o = t.anchorPoint, a = t.connectorPaintStyle;
                        if (o == null) {
                            var s = t.dimensions || R[g];
                            if (i == null || s == null) {
                                de({elId: g, timestamp: e});
                                i = F[g];
                                s = R[g]
                            }
                            var l = {xy: [i.left, i.top], wh: s, element: r, timestamp: e};
                            if (n && r.anchor.isDynamic && r.connections.length > 0) {
                                var u = A(t.elementWithPrecedence), c = u.endpoints[0] == r ? 1 : 0, f = c == 0 ? u.sourceId : u.targetId, h = F[f], p = R[f];
                                l.txy = [h.left, h.top];
                                l.twh = p;
                                l.tElement = u.endpoints[c]
                            }
                            o = r.anchor.compute(l)
                        }
                        var d = C.compute(o, r.anchor.getOrientation(r), r.paintStyleInUse, a || r.paintStyleInUse);
                        C.paint(d, r.paintStyleInUse, r.anchor);
                        r.timestamp = e;
                        for (var v = 0; v < r.overlays.length; v++) {
                            var m = r.overlays[v];
                            if (m.isVisible) {
                                r.overlayPlacements[v] = m.draw(r.endpoint, r.paintStyleInUse, d)
                            }
                        }
                    }
                }
            };
            this.repaint = this.paint;
            this.removeConnection = this.detach;
            if (M.CurrentLibrary.isDragSupported(u)) {
                var w = {id: null, element: null}, k = null, H = false, W = null, V = mn(w);
                var Z = function () {
                    k = r.connectorSelector();
                    var t = true;
                    if (!r.isEnabled()) {
                        t = false
                    }
                    if (k == null && !e.isSource) {
                        t = false
                    }
                    if (e.isSource && r.isFull() && !L) {
                        t = false
                    }
                    if (k != null && !k.isDetachable()) {
                        t = false
                    }
                    if (t === false) {
                        if (M.CurrentLibrary.stopDrag) {
                            M.CurrentLibrary.stopDrag()
                        }
                        V.stopDrag();
                        return false
                    }
                    if (k && !r.isFull() && e.isSource) {
                        k = null
                    }
                    de({elId: g});
                    d = r.makeInPlaceCopy();
                    d.paint();
                    yn(w, r.parent);
                    var n = v(d.canvas), i = m(n, b), o = Qe([i.left, i.top], d.canvas);
                    M.CurrentLibrary.setOffset(w.element, {left: o[0], top: o[1]});
                    if (r.parentAnchor) {
                        r.anchor = b.makeAnchor(r.parentAnchor, r.elementId, b)
                    }
                    f(v(r.canvas), "dragId", w.id);
                    f(v(r.canvas), "elId", g);
                    if (e.proxy) {
                        r.setPaintStyle(e.proxy.paintStyle)
                    }
                    p = gn(r.getPaintStyle(), r.anchor, C, r.canvas, w.element);
                    if (k == null) {
                        r.anchor.locked = true;
                        r.setHover(false, false);
                        k = ee({
                            sourceEndpoint: r,
                            targetEndpoint: p,
                            source: r.endpointWillMoveTo || v(u),
                            target: w.element,
                            anchors: [r.anchor, p.anchor],
                            paintStyle: e.connectorStyle,
                            hoverPaintStyle: e.connectorHoverStyle,
                            connector: e.connector,
                            overlays: e.connectorOverlays,
                            type: r.connectionType,
                            cssClass: r.connectorClass,
                            hoverClass: r.connectorHoverClass
                        })
                    } else {
                        H = true;
                        k.connector.setHover(false, false);
                        te(v(d.canvas), false, true);
                        var a = k.endpoints[0].id == r.id ? 0 : 1;
                        k.floatingAnchorIndex = a;
                        r.detachFromConnection(k);
                        var s = v(r.canvas), l = M.CurrentLibrary.getDragScope(s);
                        f(s, "originalScope", l);
                        var c = M.CurrentLibrary.getDropScope(s);
                        M.CurrentLibrary.setDragScope(s, c);
                        if (a == 0) {
                            W = [k.source, k.sourceId, $, l];
                            k.source = w.element;
                            k.sourceId = w.id
                        } else {
                            W = [k.target, k.targetId, $, l];
                            k.target = w.element;
                            k.targetId = w.id
                        }
                        k.endpoints[a == 0 ? 1 : 0].anchor.locked = true;
                        k.suspendedEndpoint = k.endpoints[a];
                        k.suspendedEndpoint.setHover(false);
                        k.endpoints[a] = p;
                        be(k)
                    }
                    N[w.id] = k;
                    p.addConnection(k);
                    G(_, w.id, p);
                    b.currentlyDragging = true
                };
                var q = M.CurrentLibrary, Y = e.dragOptions || {}, X = M.extend({}, q.defaultDragOptions), K = q.dragEvents.start, Q = q.dragEvents.stop, J = q.dragEvents.drag;
                Y = M.extend(X, Y);
                Y.scope = Y.scope || r.scope;
                Y[K] = ge(Y[K], Z);
                Y[J] = ge(Y[J], V.drag);
                Y[Q] = ge(Y[Q], function () {
                    var t = q.getDropEvent(arguments);
                    b.currentlyDragging = false;
                    n(_[w.id], function (t) {
                        return t.id == p.id
                    });
                    ue([w.element[0], p.canvas], u);
                    le(d.canvas, u);
                    b.anchorManager.clearFor(w.id);
                    var e = k.floatingAnchorIndex == null ? 1 : k.floatingAnchorIndex;
                    k.endpoints[e == 0 ? 1 : 0].anchor.locked = false;
                    r.setPaintStyle(I);
                    if (k.endpoints[e] == p) {
                        if (H && k.suspendedEndpoint) {
                            if (e == 0) {
                                k.source = W[0];
                                k.sourceId = W[1]
                            } else {
                                k.target = W[0];
                                k.targetId = W[1]
                            }
                            M.CurrentLibrary.setDragScope(W[2], W[3]);
                            k.endpoints[e] = k.suspendedEndpoint;
                            if (r.isReattach || k._forceDetach || !k.endpoints[e == 0 ? 1 : 0].detach(k, false, false, true, t)) {
                                k.setHover(false);
                                k.floatingAnchorIndex = null;
                                k.suspendedEndpoint.addConnection(k);
                                b.repaint(W[1])
                            }
                            k._forceDetach = null
                        } else {
                            ue(k.connector.getDisplayElements(), r.parent);
                            r.detachFromConnection(k)
                        }
                    }
                    r.anchor.locked = false;
                    r.paint({recalc: false});
                    k.setHover(false, false);
                    Pe(k);
                    k = null;
                    d = null;
                    delete _[p.elementId];
                    p.anchor = null;
                    p = null;
                    b.currentlyDragging = false
                });
                var $ = v(r.canvas);
                M.CurrentLibrary.initDraggable($, Y, true)
            }
            var te = function (t, n, i, o) {
                if ((e.isTarget || n) && M.CurrentLibrary.isDropSupported(u)) {
                    var a = e.dropOptions || b.Defaults.DropOptions || M.Defaults.DropOptions;
                    a = M.extend({}, a);
                    a.scope = a.scope || r.scope;
                    var s = M.CurrentLibrary.dragEvents.drop, l = M.CurrentLibrary.dragEvents.over, f = M.CurrentLibrary.dragEvents.out, h = function () {
                        var t = M.CurrentLibrary.getDropEvent(arguments), e = v(M.CurrentLibrary.getDragObject(arguments)), n = c(e, "dragId"), i = c(e, "elId"), a = c(e, "originalScope"), s = N[n];
                        if (s != null) {
                            var l = s.floatingAnchorIndex == null ? 1 : s.floatingAnchorIndex, u = l == 0 ? 1 : 0;
                            if (a) {
                                M.CurrentLibrary.setDragScope(e, a)
                            }
                            var f = o != null ? o.isEnabled() : true;
                            if (r.isFull()) {
                                r.fire("maxConnections", {endpoint: r, connection: s, maxConnections: O}, t)
                            }
                            if (!r.isFull() && !(l == 0 && !r.isSource) && !(l == 1 && !r.isTarget) && f) {
                                var h = true;
                                if (s.suspendedEndpoint && s.suspendedEndpoint.id != r.id) {
                                    if (l == 0) {
                                        s.source = s.suspendedEndpoint.element;
                                        s.sourceId = s.suspendedEndpoint.elementId
                                    } else {
                                        s.target = s.suspendedEndpoint.element;
                                        s.targetId = s.suspendedEndpoint.elementId
                                    }
                                    if (!s.isDetachAllowed(s) || !s.endpoints[l].isDetachAllowed(s) || !s.suspendedEndpoint.isDetachAllowed(s) || !b.checkCondition("beforeDetach", s)) {
                                        h = false
                                    }
                                }
                                if (l == 0) {
                                    s.source = r.element;
                                    s.sourceId = r.elementId
                                } else {
                                    s.target = r.element;
                                    s.targetId = r.elementId
                                }
                                h = h && r.isDropAllowed(s.sourceId, s.targetId, s.scope, s, r);
                                if (h) {
                                    s.endpoints[l].detachFromConnection(s);
                                    if (s.suspendedEndpoint) {
                                        s.suspendedEndpoint.detachFromConnection(s)
                                    }
                                    s.endpoints[l] = r;
                                    r.addConnection(s);
                                    var p = r.getParameters();
                                    for (var d in p) {
                                        s.setParameter(d, p[d])
                                    }
                                    if (!s.suspendedEndpoint) {
                                        if (p.draggable) {
                                            M.CurrentLibrary.initDraggable(r.element, Y, true)
                                        }
                                    } else {
                                        var m = s.suspendedEndpoint.getElement(), g = s.suspendedEndpoint.elementId;
                                        ye({
                                            source: l == 0 ? m : s.source,
                                            target: l == 1 ? m : s.target,
                                            sourceId: l == 0 ? g : s.sourceId,
                                            targetId: l == 1 ? g : s.targetId,
                                            sourceEndpoint: l == 0 ? s.suspendedEndpoint : s.endpoints[0],
                                            targetEndpoint: l == 1 ? s.suspendedEndpoint : s.endpoints[1],
                                            connection: s
                                        }, true, t)
                                    }
                                    ne(s, null, t)
                                } else {
                                    if (s.suspendedEndpoint) {
                                        s.endpoints[l] = s.suspendedEndpoint;
                                        s.setHover(false);
                                        s._forceDetach = true;
                                        if (l == 0) {
                                            s.source = s.suspendedEndpoint.element;
                                            s.sourceId = s.suspendedEndpoint.elementId
                                        } else {
                                            s.target = s.suspendedEndpoint.element;
                                            s.targetId = s.suspendedEndpoint.elementId
                                        }
                                        s.suspendedEndpoint.addConnection(s);
                                        s.endpoints[0].repaint();
                                        s.repaint();
                                        b.repaint(s.source.elementId);
                                        s._forceDetach = false
                                    }
                                }
                                s.floatingAnchorIndex = null
                            }
                            b.currentlyDragging = false;
                            delete N[n]
                        }
                    };
                    a[s] = ge(a[s], h);
                    a[l] = ge(a[l], function () {
                        if (r.isTarget) {
                            var t = M.CurrentLibrary.getDragObject(arguments), e = c(v(t), "dragId"), n = N[e];
                            if (n != null) {
                                var i = n.floatingAnchorIndex == null ? 1 : n.floatingAnchorIndex;
                                n.endpoints[i].anchor.over(r.anchor)
                            }
                        }
                    });
                    a[f] = ge(a[f], function () {
                        if (r.isTarget) {
                            var t = M.CurrentLibrary.getDragObject(arguments), e = c(v(t), "dragId"), n = N[e];
                            if (n != null) {
                                var i = n.floatingAnchorIndex == null ? 1 : n.floatingAnchorIndex;
                                n.endpoints[i].anchor.out()
                            }
                        }
                    });
                    M.CurrentLibrary.initDroppable(t, a, true, i)
                }
            };
            te(v(r.canvas), true, !(e._transient || r.anchor.isFloating), r);
            if (e.type) {
                r.addType(e.type)
            }
            return r
        }
    };
    var M = new L;
    if (typeof window != "undefined") {
        window.jsPlumb = M
    }
    M.getInstance = function (t) {
        var e = new L(t);
        e.init();
        return e
    };
    var A = function (t, e, n, r, i, o) {
        return function (a) {
            a = a || {};
            var s = a.jsPlumbInstance.makeAnchor([t, e, n, r, 0, 0], a.elementId, a.jsPlumbInstance);
            s.type = i;
            if (o) {
                o(s, a)
            }
            return s
        }
    };
    M.Anchors.TopCenter = A(.5, 0, 0, -1, "TopCenter");
    M.Anchors.BottomCenter = A(.5, 1, 0, 1, "BottomCenter");
    M.Anchors.LeftMiddle = A(0, .5, -1, 0, "LeftMiddle");
    M.Anchors.RightMiddle = A(1, .5, 1, 0, "RightMiddle");
    M.Anchors.Center = A(.5, .5, 0, 0, "Center");
    M.Anchors.TopRight = A(1, 0, 0, -1, "TopRight");
    M.Anchors.BottomRight = A(1, 1, 0, 1, "BottomRight");
    M.Anchors.TopLeft = A(0, 0, 0, -1, "TopLeft");
    M.Anchors.BottomLeft = A(0, 1, 0, 1, "BottomLeft");
    M.Defaults.DynamicAnchors = function (t) {
        return t.jsPlumbInstance.makeAnchors(["TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"], t.elementId, t.jsPlumbInstance)
    };
    M.Anchors.AutoDefault = function (t) {
        var e = t.jsPlumbInstance.makeDynamicAnchor(M.Defaults.DynamicAnchors(t));
        e.type = "AutoDefault";
        return e
    };
    M.Anchors.Assign = A(0, 0, 0, 0, "Assign", function (t, e) {
        var n = e.position || "Fixed";
        t.positionFinder = n.constructor == String ? e.jsPlumbInstance.AnchorPositionFinders[n] : n;
        t.constructorParams = e
    });
    M.Anchors.Continuous = function (t) {
        return t.jsPlumbInstance.continuousAnchorFactory.get(t)
    };
    M.AnchorPositionFinders = {
        Fixed: function (t, e, n, r) {
            return [(t.left - e.left) / n[0], (t.top - e.top) / n[1]]
        }, Grid: function (t, e, n, r) {
            var i = t.left - e.left, o = t.top - e.top, a = n[0] / r.grid[0], s = n[1] / r.grid[1], l = Math.floor(i / a), u = Math.floor(o / s);
            return [(l * a + a / 2) / n[0], (u * s + s / 2) / n[1]]
        }
    };
    M.Anchors.Perimeter = function (t) {
        t = t || {};
        var e = t.anchorCount || 60, n = t.shape;
        if (!n) {
            throw new Error("no shape supplied to Perimeter Anchor type")
        }
        var r = function () {
            var t = .5, n = Math.PI * 2 / e, r = 0, i = [];
            for (var o = 0; o < e; o++) {
                var a = t + t * Math.sin(r), s = t + t * Math.cos(r);
                i.push([a, s, 0, 0]);
                r += n
            }
            return i
        }, i = function (t) {
            var n = e / t.length, r = [], i = function (t, i, o, a, s) {
                n = e * s;
                var l = (o - t) / n, u = (a - i) / n;
                for (var c = 0; c < n; c++) {
                    r.push([t + l * c, i + u * c, 0, 0])
                }
            };
            for (var o = 0; o < t.length; o++) {
                i.apply(null, t[o])
            }
            return r
        }, o = function (t) {
            var e = [];
            for (var n = 0; n < t.length; n++) {
                e.push([t[n][0], t[n][1], t[n][2], t[n][3], 1 / t.length])
            }
            return i(e)
        }, a = function () {
            return o([[0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0]])
        };
        var s = {
            circle: r, ellipse: r, diamond: function () {
                return o([[.5, 0, 1, .5], [1, .5, .5, 1], [.5, 1, 0, .5], [0, .5, .5, 0]])
            }, rectangle: a, square: a, triangle: function () {
                return o([[.5, 0, 1, 1], [1, 1, 0, 1], [0, 1, .5, 0]])
            }, path: function (t) {
                var e = t.points;
                var n = [], r = 0;
                for (var o = 0; o < e.length - 1; o++) {
                    var a = Math.sqrt(Math.pow(e[o][2] - e[o][0]) + Math.pow(e[o][3] - e[o][1]));
                    r += a;
                    n.push([e[o][0], e[o][1], e[o + 1][0], e[o + 1][1], a])
                }
                for (var o = 0; o < n.length; o++) {
                    n[o][4] = n[o][4] / r
                }
                return i(n)
            }
        }, l = function (t, e) {
            var n = [], r = e / 180 * Math.PI;
            for (var i = 0; i < t.length; i++) {
                var o = t[i][0] - .5, a = t[i][1] - .5;
                n.push([.5 + (o * Math.cos(r) - a * Math.sin(r)), .5 + (o * Math.sin(r) + a * Math.cos(r)), t[i][2], t[i][3]])
            }
            return n
        };
        if (!s[n]) {
            throw new Error("Shape [" + n + "] is unknown by Perimeter Anchor type")
        }
        var u = s[n](t);
        if (t.rotation) {
            u = l(u, t.rotation)
        }
        var c = t.jsPlumbInstance.makeDynamicAnchor(u);
        c.type = "Perimeter";
        return c
    }
})();
(function () {
    jsPlumb.DOMElementComponent = function (t) {
        jsPlumb.jsPlumbUIComponent.apply(this, arguments);
        this.mousemove = this.dblclick = this.click = this.mousedown = this.mouseup = function (t) {
        }
    };
    jsPlumb.Connectors.Straight = function () {
        this.type = "Straight";
        var t = this, e = null, n, r, i, o, a, s, l, u, c, f, h, p, d;
        this.compute = function (t, p, v, m, g, y, b, P) {
            var C = Math.abs(t[0] - p[0]), j = Math.abs(t[1] - p[1]), E = .45 * C, x = .45 * j;
            C *= 1.9;
            j *= 1.9;
            var D = Math.min(t[0], p[0]) - E;
            var S = Math.min(t[1], p[1]) - x;
            var I = Math.max(2 * b, P);
            if (C < I) {
                C = I;
                D = t[0] + (p[0] - t[0]) / 2 - I / 2;
                E = (C - Math.abs(t[0] - p[0])) / 2
            }
            if (j < I) {
                j = I;
                S = t[1] + (p[1] - t[1]) / 2 - I / 2;
                x = (j - Math.abs(t[1] - p[1])) / 2
            }
            u = t[0] < p[0] ? E : C - E;
            c = t[1] < p[1] ? x : j - x;
            f = t[0] < p[0] ? C - E : E;
            h = t[1] < p[1] ? j - x : x;
            e = [D, S, C, j, u, c, f, h];
            o = f - u, a = h - c;
            n = jsPlumbUtil.gradient({x: u, y: c}, {x: f, y: h}), r = -1 / n;
            i = -1 * (n * u - c);
            s = Math.atan(n);
            l = Math.atan(r);
            d = Math.sqrt(o * o + a * a);
            return e
        };
        this.pointOnPath = function (t, e) {
            if (t == 0 && !e) {
                return {x: u, y: c}
            } else {
                if (t == 1 && !e) {
                    return {x: f, y: h}
                } else {
                    var n = e ? t > 0 ? t : d + t : t * d;
                    return jsPlumbUtil.pointOnLine({x: u, y: c}, {x: f, y: h}, n)
                }
            }
        };
        this.gradientAtPoint = function (t) {
            return n
        };
        this.pointAlongPathFrom = function (e, n, r) {
            var i = t.pointOnPath(e, r), o = e == 1 ? {x: u + (f - u) * 10, y: c + (c - h) * 10} : {x: f, y: h};
            return jsPlumbUtil.pointOnLine(i, o, n)
        }
    };
    jsPlumb.Connectors.Bezier = function (t) {
        var e = this;
        t = t || {};
        this.majorAnchor = t.curviness || 150;
        this.minorAnchor = 10;
        var n = null;
        this.type = "Bezier";
        this._findControlPoint = function (t, n, r, i, o, a, s) {
            var l = a.getOrientation(i), u = s.getOrientation(o), c = l[0] != u[0] || l[1] == u[1], f = [], h = e.majorAnchor, p = e.minorAnchor;
            if (!c) {
                if (l[0] == 0) {
                    f.push(n[0] < r[0] ? t[0] + p : t[0] - p)
                } else {
                    f.push(t[0] - h * l[0])
                }
                if (l[1] == 0) {
                    f.push(n[1] < r[1] ? t[1] + p : t[1] - p)
                } else {
                    f.push(t[1] + h * u[1])
                }
            } else {
                if (u[0] == 0) {
                    f.push(r[0] < n[0] ? t[0] + p : t[0] - p)
                } else {
                    f.push(t[0] + h * u[0])
                }
                if (u[1] == 0) {
                    f.push(r[1] < n[1] ? t[1] + p : t[1] - p)
                } else {
                    f.push(t[1] + h * l[1])
                }
            }
            return f
        };
        var r, i, o, a, s, o, l, u, c, f, h, p, d, v, m;
        this.compute = function (t, p, d, v, m, g, y, b) {
            y = y || 0;
            f = Math.abs(t[0] - p[0]) + y;
            h = Math.abs(t[1] - p[1]) + y;
            u = Math.min(t[0], p[0]) - y / 2;
            c = Math.min(t[1], p[1]) - y / 2;
            o = t[0] < p[0] ? f - y / 2 : y / 2;
            l = t[1] < p[1] ? h - y / 2 : y / 2;
            a = t[0] < p[0] ? y / 2 : f - y / 2;
            s = t[1] < p[1] ? y / 2 : h - y / 2;
            r = e._findControlPoint([o, l], t, p, d, v, m, g);
            i = e._findControlPoint([a, s], p, t, v, d, g, m);
            var P = Math.min(o, a), C = Math.min(r[0], i[0]), j = Math.min(P, C), E = Math.max(o, a), x = Math.max(r[0], i[0]), D = Math.max(E, x);
            if (D > f) {
                f = D
            }
            if (j < 0) {
                u += j;
                var S = Math.abs(j);
                f += S;
                r[0] += S;
                o += S;
                a += S;
                i[0] += S
            }
            var I = Math.min(l, s), O = Math.min(r[1], i[1]), L = Math.min(I, O), M = Math.max(l, s), A = Math.max(r[1], i[1]), w = Math.max(M, A);
            if (w > h) {
                h = w
            }
            if (L < 0) {
                c += L;
                var k = Math.abs(L);
                h += k;
                r[1] += k;
                l += k;
                s += k;
                i[1] += k
            }
            if (b && f < b) {
                var T = (b - f) / 2;
                f = b;
                u -= T;
                o = o + T;
                a = a + T;
                r[0] = r[0] + T;
                i[0] = i[0] + T
            }
            if (b && h < b) {
                var T = (b - h) / 2;
                h = b;
                c -= T;
                l = l + T;
                s = s + T;
                r[1] = r[1] + T;
                i[1] = i[1] + T
            }
            n = [u, c, f, h, o, l, a, s, r[0], r[1], i[0], i[1]];
            return n
        };
        var g = function () {
            return [{x: o, y: l}, {x: r[0], y: r[1]}, {x: i[0], y: i[1]}, {x: a, y: s}]
        };
        var y = function (t, e, n) {
            if (n) {
                e = jsBezier.locationAlongCurveFrom(t, e > 0 ? 0 : 1, e)
            }
            return e
        };
        this.pointOnPath = function (t, e) {
            var n = g();
            t = y(n, t, e);
            return jsBezier.pointOnCurve(n, t)
        };
        this.gradientAtPoint = function (t, e) {
            var n = g();
            t = y(n, t, e);
            return jsBezier.gradientAtPoint(n, t)
        };
        this.pointAlongPathFrom = function (t, e, n) {
            var r = g();
            t = y(r, t, n);
            return jsBezier.pointAlongCurveFrom(r, t, e)
        }
    };
    jsPlumb.Connectors.Flowchart = function (t) {
        this.type = "Flowchart";
        t = t || {};
        var e = this, n = t.stub || t.minStubLength || 30, r = jsPlumbUtil.isArray(n) ? n[0] : n, i = jsPlumbUtil.isArray(n) ? n[1] : n, o = t.gap || 0, a = [], s = 0, l = [], u = [], c = [], f, h, p = -Infinity, d = -Infinity, v = Infinity, m = Infinity, g = t.grid, y = function (t, e) {
            var n = t % e, r = Math.floor(t / e), i = n > e / 2 ? 1 : 0;
            return (r + i) * e
        }, b = function (t, e, n, r) {
            return [n || g == null ? t : y(t, g[0]), r || g == null ? e : y(e, g[1])]
        }, P = function (t, e, n, r) {
            var i = 0;
            for (var o = 0; o < a.length; o++) {
                u[o] = a[o][5] / s;
                l[o] = [i, i += a[o][5] / s]
            }
        }, C = function () {
            c.push(a.length);
            for (var t = 0; t < a.length; t++) {
                c.push(a[t][0]);
                c.push(a[t][1])
            }
        }, j = function (t, e, n, r, i, o) {
            var l = a.length == 0 ? n : a[a.length - 1][0], u = a.length == 0 ? r : a[a.length - 1][1], c = t == l ? Infinity : 0, f = Math.abs(t == l ? e - u : t - l);
            a.push([t, e, l, u, c, f]);
            s += f;
            p = Math.max(p, t);
            d = Math.max(d, e);
            v = Math.min(v, t);
            m = Math.min(m, e)
        }, E = function (t, e) {
            if (e) {
                t = t > 0 ? t / s : (s + t) / s
            }
            var n = l.length - 1, r = 1;
            for (var i = 0; i < l.length; i++) {
                if (l[i][1] >= t) {
                    n = i;
                    r = (t - l[i][0]) / u[i];
                    break
                }
            }
            return {segment: a[n], proportion: r, index: n}
        };
        this.compute = function (t, e, n, g, y, b, E, x, D, S) {
            a = [];
            l = [];
            s = 0;
            u = [];
            p = d = -Infinity;
            v = m = Infinity;
            f = e[0] < t[0];
            h = e[1] < t[1];
            var I = E || 1, O = I / 2 + (r + i), L = I / 2 + (i + r), M = I / 2 + (r + i), A = I / 2 + (i + r), w = y.orientation || y.getOrientation(n), k = b.orientation || b.getOrientation(g), T = f ? e[0] : t[0], _ = h ? e[1] : t[1], U = Math.abs(e[0] - t[0]) + O + L, F = Math.abs(e[1] - t[1]) + M + A;
            if (w[0] == 0 && w[1] == 0 || k[0] == 0 && k[1] == 0) {
                var H = U > F ? 0 : 1, N = [1, 0][H];
                w = [];
                k = [];
                w[H] = t[H] > e[H] ? -1 : 1;
                k[H] = t[H] > e[H] ? 1 : -1;
                w[N] = 0;
                k[N] = 0
            }
            var W = f ? U - L + o * w[0] : O + o * w[0], V = h ? F - A + o * w[1] : M + o * w[1], R = f ? O + o * k[0] : U - L + o * k[0], B = h ? M + o * k[1] : F - A + o * k[1], z = W + w[0] * r, G = V + w[1] * r, Z = R + k[0] * i, q = B + k[1] * i, Y = Math.abs(W - R) > r + i, X = Math.abs(V - B) > r + i, K = z + (Z - z) / 2, Q = G + (q - G) / 2, J = w[0] * k[0] + w[1] * k[1], $ = J == -1, te = J == 0, ee = J == 1;
            T -= O;
            _ -= M;
            c = [T, _, U, F, W, V, R, B];
            var ne = [];
            var re = w[0] == 0 ? "y" : "x", ie = $ ? "opposite" : ee ? "orthogonal" : "perpendicular", oe = jsPlumbUtil.segment([W, V], [R, B]), ae = w[re == "x" ? 0 : 1] == -1, se = {
                x: [null, 4, 3, 2, 1],
                y: [null, 2, 1, 4, 3]
            };
            if (ae) {
                oe = se[re][oe]
            }
            j(z, G, W, V, R, B);
            var le = function (t, e, n, o) {
                return t + (e * (1 - n) * o + Math.max(r, i))
            }, ue = {
                oppositex: function () {
                    if (n.elementId == g.elementId) {
                        var t = G + (1 - y.y) * D.height + Math.max(r, i);
                        return [[z, t], [Z, t]]
                    } else {
                        if (Y && (oe == 1 || oe == 2)) {
                            return [[K, V], [K, B]]
                        } else {
                            return [[z, Q], [Z, Q]]
                        }
                    }
                }, orthogonalx: function () {
                    if (oe == 1 || oe == 2) {
                        return [[Z, G]]
                    } else {
                        return [[z, q]]
                    }
                }, perpendicularx: function () {
                    var t = (B + V) / 2;
                    if (oe == 1 && k[1] == 1 || oe == 2 && k[1] == -1) {
                        if (Math.abs(R - W) > Math.max(r, i)) {
                            return [[Z, G]]
                        } else {
                            return [[z, G], [z, t], [Z, t]]
                        }
                    } else {
                        if (oe == 3 && k[1] == -1 || oe == 4 && k[1] == 1) {
                            return [[z, t], [Z, t]]
                        } else {
                            if (oe == 3 && k[1] == 1 || oe == 4 && k[1] == -1) {
                                return [[z, q]]
                            } else {
                                if (oe == 1 && k[1] == -1 || oe == 2 && k[1] == 1) {
                                    if (Math.abs(R - W) > Math.max(r, i)) {
                                        return [[K, G], [K, q]]
                                    } else {
                                        return [[z, q]]
                                    }
                                }
                            }
                        }
                    }
                }, oppositey: function () {
                    if (n.elementId == g.elementId) {
                        var t = z + (1 - y.x) * D.width + Math.max(r, i);
                        return [[t, G], [t, q]]
                    } else {
                        if (X && (oe == 2 || oe == 3)) {
                            return [[W, Q], [R, Q]]
                        } else {
                            return [[K, G], [K, q]]
                        }
                    }
                }, orthogonaly: function () {
                    if (oe == 2 || oe == 3) {
                        return [[z, q]]
                    } else {
                        return [[Z, G]]
                    }
                }, perpendiculary: function () {
                    var t = (R + W) / 2;
                    if (oe == 2 && k[0] == -1 || oe == 3 && k[0] == 1) {
                        if (Math.abs(R - W) > Math.max(r, i)) {
                            return [[z, q]]
                        } else {
                            return [[z, Q], [Z, Q]]
                        }
                    } else {
                        if (oe == 1 && k[0] == -1 || oe == 4 && k[0] == 1) {
                            var t = (R + W) / 2;
                            return [[t, G], [t, q]]
                        } else {
                            if (oe == 1 && k[0] == 1 || oe == 4 && k[0] == -1) {
                                return [[Z, G]]
                            } else {
                                if (oe == 2 && k[0] == 1 || oe == 3 && k[0] == -1) {
                                    if (Math.abs(B - V) > Math.max(r, i)) {
                                        return [[z, Q], [Z, Q]]
                                    } else {
                                        return [[Z, G]]
                                    }
                                }
                            }
                        }
                    }
                }
            };
            var ce = ue[ie + re]();
            if (ce) {
                for (var fe = 0; fe < ce.length; fe++) {
                    j(ce[fe][0], ce[fe][1], W, V, R, B)
                }
            }
            j(Z, q, W, V, R, B);
            j(R, B, W, V, R, B);
            C();
            P(W, V, R, B);
            if (d > c[3]) {
                c[3] = d + E * 2
            }
            if (p > c[2]) {
                c[2] = p + E * 2
            }
            return c
        };
        this.pointOnPath = function (t, n) {
            return e.pointAlongPathFrom(t, 0, n)
        };
        this.gradientAtPoint = function (t, e) {
            return a[E(t, e)["index"]][4]
        };
        this.pointAlongPathFrom = function (t, e, n) {
            var r = E(t, n), i = r.segment, o = r.proportion, s = a[r.index][5], l = a[r.index][4];
            var u = {
                x: l == Infinity ? i[2] : i[2] > i[0] ? i[0] + (1 - o) * s - e : i[2] + o * s + e,
                y: l == 0 ? i[3] : i[3] > i[1] ? i[1] + (1 - o) * s - e : i[3] + o * s + e,
                segmentInfo: r
            };
            return u
        }
    };
    jsPlumb.Endpoints.Dot = function (t) {
        this.type = "Dot";
        var e = this;
        t = t || {};
        this.radius = t.radius || 10;
        this.defaultOffset = .5 * this.radius;
        this.defaultInnerRadius = this.radius / 3;
        this.compute = function (t, n, r, i) {
            var o = r.radius || e.radius, a = t[0] - o, s = t[1] - o;
            return [a, s, o * 2, o * 2, o]
        }
    };
    jsPlumb.Endpoints.Rectangle = function (t) {
        this.type = "Rectangle";
        var e = this;
        t = t || {};
        this.width = t.width || 20;
        this.height = t.height || 20;
        this.compute = function (t, n, r, i) {
            var o = r.width || e.width, a = r.height || e.height, s = t[0] - o / 2, l = t[1] - a / 2;
            return [s, l, o, a]
        }
    };
    var t = function (t) {
        jsPlumb.DOMElementComponent.apply(this, arguments);
        var e = this;
        var n = [];
        this.getDisplayElements = function () {
            return n
        };
        this.appendDisplayElement = function (t) {
            n.push(t)
        }
    };
    jsPlumb.Endpoints.Image = function (e) {
        this.type = "Image";
        t.apply(this, arguments);
        var n = this, r = false, i = false, o = e.width, a = e.height, s = null, l = e.endpoint;
        this.img = new Image;
        n.ready = false;
        this.img.onload = function () {
            n.ready = true;
            o = o || n.img.width;
            a = a || n.img.height;
            if (s) {
                s(n)
            }
        };
        l.setImage = function (t, e) {
            var r = t.constructor == String ? t : t.src;
            s = e;
            n.img.src = t;
            if (n.canvas != null) {
                n.canvas.setAttribute("src", t)
            }
        };
        l.setImage(e.src || e.url, e.onload);
        this.compute = function (t, e, r, i) {
            n.anchorPoint = t;
            if (n.ready) {
                return [t[0] - o / 2, t[1] - a / 2, o, a]
            } else {
                return [0, 0, 0, 0]
            }
        };
        n.canvas = document.createElement("img"), r = false;
        n.canvas.style.margin = 0;
        n.canvas.style.padding = 0;
        n.canvas.style.outline = 0;
        n.canvas.style.position = "absolute";
        var u = e.cssClass ? " " + e.cssClass : "";
        n.canvas.className = jsPlumb.endpointClass + u;
        if (o) {
            n.canvas.setAttribute("width", o)
        }
        if (a) {
            n.canvas.setAttribute("height", a)
        }
        jsPlumb.appendElement(n.canvas, e.parent);
        n.attachListeners(n.canvas, n);
        n.cleanup = function () {
            i = true
        };
        var c = function (t, e, s) {
            if (!i) {
                if (!r) {
                    n.canvas.setAttribute("src", n.img.src);
                    n.appendDisplayElement(n.canvas);
                    r = true
                }
                var l = n.anchorPoint[0] - o / 2, u = n.anchorPoint[1] - a / 2;
                jsPlumb.sizeCanvas(n.canvas, l, u, o, a)
            }
        };
        this.paint = function (t, e, r) {
            if (n.ready) {
                c(t, e, r)
            } else {
                window.setTimeout(function () {
                    n.paint(t, e, r)
                }, 200)
            }
        }
    };
    jsPlumb.Endpoints.Blank = function (e) {
        var n = this;
        this.type = "Blank";
        t.apply(this, arguments);
        this.compute = function (t, e, n, r) {
            return [t[0], t[1], 10, 0]
        };
        n.canvas = document.createElement("div");
        n.canvas.style.display = "block";
        n.canvas.style.width = "1px";
        n.canvas.style.height = "1px";
        n.canvas.style.background = "transparent";
        n.canvas.style.position = "absolute";
        n.canvas.className = n._jsPlumb.endpointClass;
        jsPlumb.appendElement(n.canvas, e.parent);
        this.paint = function (t, e, r) {
            jsPlumb.sizeCanvas(n.canvas, t[0], t[1], t[2], t[3])
        }
    };
    jsPlumb.Endpoints.Triangle = function (t) {
        this.type = "Triangle";
        t = t || {};
        t.width = t.width || 55;
        t.height = t.height || 55;
        this.width = t.width;
        this.height = t.height;
        this.compute = function (t, e, n, r) {
            var i = n.width || self.width, o = n.height || self.height, a = t[0] - i / 2, s = t[1] - o / 2;
            return [a, s, i, o]
        }
    };
    var e = function (t) {
        var e = true, n = this;
        this.isAppendedAtTopLevel = true;
        this.component = t.component;
        this.loc = t.location == null ? .5 : t.location;
        this.endpointLoc = t.endpointLocation == null ? [.5, .5] : t.endpointLocation;
        this.setVisible = function (t) {
            e = t;
            n.component.repaint()
        };
        this.isVisible = function () {
            return e
        };
        this.hide = function () {
            n.setVisible(false)
        };
        this.show = function () {
            n.setVisible(true)
        };
        this.incrementLocation = function (t) {
            n.loc += t;
            n.component.repaint()
        };
        this.setLocation = function (t) {
            n.loc = t;
            n.component.repaint()
        };
        this.getLocation = function () {
            return n.loc
        }
    };
    jsPlumb.Overlays.Arrow = function (t) {
        this.type = "Arrow";
        e.apply(this, arguments);
        this.isAppendedAtTopLevel = false;
        t = t || {};
        var n = this;
        this.length = t.length || 20;
        this.width = t.width || 20;
        this.id = t.id;
        var r = (t.direction || 1) < 0 ? -1 : 1, i = t.paintStyle || {lineWidth: 1}, o = t.foldback || .623;
        this.computeMaxSize = function () {
            return n.width * 1.5
        };
        this.cleanup = function () {
        };
        this.draw = function (t, e, a) {
            var s, l, u, c, f;
            if (t.pointAlongPathFrom) {
                if (jsPlumbUtil.isString(n.loc) || n.loc > 1 || n.loc < 0) {
                    var h = parseInt(n.loc);
                    s = t.pointAlongPathFrom(h, r * n.length / 2, true), l = t.pointOnPath(h, true), u = jsPlumbUtil.pointOnLine(s, l, n.length)
                } else {
                    if (n.loc == 1) {
                        s = t.pointOnPath(n.loc);
                        l = t.pointAlongPathFrom(n.loc, -1);
                        u = jsPlumbUtil.pointOnLine(s, l, n.length)
                    } else {
                        if (n.loc == 0) {
                            u = t.pointOnPath(n.loc);
                            l = t.pointAlongPathFrom(n.loc, 1);
                            s = jsPlumbUtil.pointOnLine(u, l, n.length)
                        } else {
                            s = t.pointAlongPathFrom(n.loc, r * n.length / 2), l = t.pointOnPath(n.loc), u = jsPlumbUtil.pointOnLine(s, l, n.length)
                        }
                    }
                }
                c = jsPlumbUtil.perpendicularLineTo(s, u, n.width);
                f = jsPlumbUtil.pointOnLine(s, u, o * n.length);
                var p = Math.min(s.x, c[0].x, c[1].x), d = Math.max(s.x, c[0].x, c[1].x), v = Math.min(s.y, c[0].y, c[1].y), m = Math.max(s.y, c[0].y, c[1].y);
                var g = {
                    hxy: s,
                    tail: c,
                    cxy: f
                }, y = i.strokeStyle || e.strokeStyle, b = i.fillStyle || e.strokeStyle, P = i.lineWidth || e.lineWidth;
                n.paint(t, g, P, y, b, a);
                return [p, d, v, m]
            } else {
                return [0, 0, 0, 0]
            }
        }
    };
    jsPlumb.Overlays.PlainArrow = function (t) {
        t = t || {};
        var e = jsPlumb.extend(t, {foldback: 1});
        jsPlumb.Overlays.Arrow.call(this, e);
        this.type = "PlainArrow"
    };
    jsPlumb.Overlays.Diamond = function (t) {
        t = t || {};
        var e = t.length || 40, n = jsPlumb.extend(t, {length: e / 2, foldback: 2});
        jsPlumb.Overlays.Arrow.call(this, n);
        this.type = "Diamond"
    };
    var n = function (t) {
        jsPlumb.DOMElementComponent.apply(this, arguments);
        e.apply(this, arguments);
        var n = this, r = false;
        t = t || {};
        this.id = t.id;
        var i;
        var o = function () {
            i = t.create(t.component);
            i = jsPlumb.CurrentLibrary.getDOMElement(i);
            i.style.position = "absolute";
            var e = t._jsPlumb.overlayClass + " " + (n.cssClass ? n.cssClass : t.cssClass ? t.cssClass : "");
            i.className = e;
            jsPlumb.appendElement(i, t.component.parent);
            t._jsPlumb.getId(i);
            n.attachListeners(i, n);
            n.canvas = i
        };
        this.getElement = function () {
            if (i == null) {
                o()
            }
            return i
        };
        this.getDimensions = function () {
            return jsPlumb.CurrentLibrary.getSize(jsPlumb.CurrentLibrary.getElementObject(n.getElement()))
        };
        var a = null, s = function (t) {
            if (a == null) {
                a = n.getDimensions()
            }
            return a
        };
        this.clearCachedDimensions = function () {
            a = null
        };
        this.computeMaxSize = function () {
            var t = s();
            return Math.max(t[0], t[1])
        };
        var l = n.setVisible;
        n.setVisible = function (t) {
            l(t);
            i.style.display = t ? "block" : "none"
        };
        this.cleanup = function () {
            if (i != null) {
                jsPlumb.CurrentLibrary.removeElement(i)
            }
        };
        this.paint = function (t, e, o) {
            if (!r) {
                n.getElement();
                t.appendDisplayElement(i);
                n.attachListeners(i, t);
                r = true
            }
            i.style.left = o[0] + e.minx + "px";
            i.style.top = o[1] + e.miny + "px"
        };
        this.draw = function (t, e, r) {
            var i = s();
            if (i != null && i.length == 2) {
                var o = {x: 0, y: 0};
                if (t.pointOnPath) {
                    var a = n.loc, l = false;
                    if (jsPlumbUtil.isString(n.loc) || n.loc < 0 || n.loc > 1) {
                        a = parseInt(n.loc);
                        l = true
                    }
                    o = t.pointOnPath(a, l)
                } else {
                    var u = n.loc.constructor == Array ? n.loc : n.endpointLoc;
                    o = {x: u[0] * r[2], y: u[1] * r[3]}
                }
                minx = o.x - i[0] / 2, miny = o.y - i[1] / 2;
                n.paint(t, {minx: minx, miny: miny, td: i, cxy: o}, r);
                return [minx, minx + i[0], miny, miny + i[1]]
            } else {
                return [0, 0, 0, 0]
            }
        };
        this.reattachListeners = function (t) {
            if (i) {
                n.reattachListenersForElement(i, n, t)
            }
        }
    };
    jsPlumb.Overlays.Custom = function (t) {
        this.type = "Custom";
        n.apply(this, arguments)
    };
    jsPlumb.Overlays.Label = function (t) {
        var e = this;
        this.labelStyle = t.labelStyle || jsPlumb.Defaults.LabelStyle;
        this.cssClass = this.labelStyle != null ? this.labelStyle.cssClass : null;
        t.create = function () {
            return document.createElement("div")
        };
        jsPlumb.Overlays.Custom.apply(this, arguments);
        this.type = "Label";
        var n = t.label || "", e = this, r = null;
        this.setLabel = function (t) {
            n = t;
            r = null;
            e.clearCachedDimensions();
            i();
            e.component.repaint()
        };
        var i = function () {
            if (typeof n == "function") {
                var t = n(e);
                e.getElement().innerHTML = t.replace(/\r\n/g, "<br/>")
            } else {
                if (r == null) {
                    r = n;
                    e.getElement().innerHTML = r.replace(/\r\n/g, "<br/>")
                }
            }
        };
        this.getLabel = function () {
            return n
        };
        var o = this.getDimensions;
        this.getDimensions = function () {
            i();
            return o()
        }
    }
})();
(function () {
    var t = function (t, e, n, r) {
        this.m = (r - e) / (n - t);
        this.b = -1 * (this.m * t - e);
        this.rectIntersect = function (t, e, n, r) {
            var i = [];
            var o = (e - this.b) / this.m;
            if (o >= t && o <= t + n) {
                i.push([o, this.m * o + this.b])
            }
            var a = this.m * (t + n) + this.b;
            if (a >= e && a <= e + r) {
                i.push([(a - this.b) / this.m, a])
            }
            var o = (e + r - this.b) / this.m;
            if (o >= t && o <= t + n) {
                i.push([o, this.m * o + this.b])
            }
            var a = this.m * t + this.b;
            if (a >= e && a <= e + r) {
                i.push([(a - this.b) / this.m, a])
            }
            if (i.length == 2) {
                var s = (i[0][0] + i[1][0]) / 2, l = (i[0][1] + i[1][1]) / 2;
                i.push([s, l]);
                var u = s <= t + n / 2 ? -1 : 1, c = l <= e + r / 2 ? -1 : 1;
                i.push([u, c]);
                return i
            }
            return null
        }
    }, e = function (t, e, n, r) {
        if (t <= n && r <= e) {
            return 1
        } else {
            if (t <= n && e <= r) {
                return 2
            } else {
                if (n <= t && r >= e) {
                    return 3
                }
            }
        }
        return 4
    }, n = function (t, e, n, r, i, o, a, s, l) {
        if (s <= l) {
            return [t, e]
        }
        if (n == 1) {
            if (r[3] <= 0 && i[3] >= 1) {
                return [t + (r[2] < .5 ? -1 * o : o), e]
            } else {
                if (r[2] >= 1 && i[2] <= 0) {
                    return [t, e + (r[3] < .5 ? -1 * a : a)]
                } else {
                    return [t + -1 * o, e + -1 * a]
                }
            }
        } else {
            if (n == 2) {
                if (r[3] >= 1 && i[3] <= 0) {
                    return [t + (r[2] < .5 ? -1 * o : o), e]
                } else {
                    if (r[2] >= 1 && i[2] <= 0) {
                        return [t, e + (r[3] < .5 ? -1 * a : a)]
                    } else {
                        return [t + 1 * o, e + -1 * a]
                    }
                }
            } else {
                if (n == 3) {
                    if (r[3] >= 1 && i[3] <= 0) {
                        return [t + (r[2] < .5 ? -1 * o : o), e]
                    } else {
                        if (r[2] <= 0 && i[2] >= 1) {
                            return [t, e + (r[3] < .5 ? -1 * a : a)]
                        } else {
                            return [t + -1 * o, e + -1 * a]
                        }
                    }
                } else {
                    if (n == 4) {
                        if (r[3] <= 0 && i[3] >= 1) {
                            return [t + (r[2] < .5 ? -1 * o : o), e]
                        } else {
                            if (r[2] <= 0 && i[2] >= 1) {
                                return [t, e + (r[3] < .5 ? -1 * a : a)]
                            } else {
                                return [t + 1 * o, e + -1 * a]
                            }
                        }
                    }
                }
            }
        }
    };
    jsPlumb.Connectors.StateMachine = function (t) {
        var r = this, i = null, o, a, s, l, u = [], c = t.curviness || 10, f = t.margin || 5, h = t.proximityLimit || 80, p = t.orientation && t.orientation == "clockwise", d = t.loopbackRadius || 25, v = false, m = t.showLoopback !== false;
        this.type = "StateMachine";
        t = t || {};
        this.compute = function (t, r, g, y, b, P, C, j) {
            var E = Math.abs(t[0] - r[0]), x = Math.abs(t[1] - r[1]), D = .45 * E, S = .45 * x;
            E *= 1.9;
            x *= 1.9;
            C = C || 1;
            var I = Math.min(t[0], r[0]) - D, O = Math.min(t[1], r[1]) - S;
            if (!m || g.elementId != y.elementId) {
                v = false;
                o = t[0] < r[0] ? D : E - D;
                a = t[1] < r[1] ? S : x - S;
                s = t[0] < r[0] ? E - D : D;
                l = t[1] < r[1] ? x - S : S;
                if (t[2] == 0) {
                    o -= f
                }
                if (t[2] == 1) {
                    o += f
                }
                if (t[3] == 0) {
                    a -= f
                }
                if (t[3] == 1) {
                    a += f
                }
                if (r[2] == 0) {
                    s -= f
                }
                if (r[2] == 1) {
                    s += f
                }
                if (r[3] == 0) {
                    l -= f
                }
                if (r[3] == 1) {
                    l += f
                }
                var L = (o + s) / 2, M = (a + l) / 2, A = -1 * L / M, w = Math.atan(A), k = A == Infinity || A == -Infinity ? 0 : Math.abs(c / 2 * Math.sin(w)), T = A == Infinity || A == -Infinity ? 0 : Math.abs(c / 2 * Math.cos(w)), _ = e(o, a, s, l), U = Math.sqrt(Math.pow(s - o, 2) + Math.pow(l - a, 2));
                u = n(L, M, _, t, r, c, c, U, h);
                var F = Math.max(Math.abs(u[0] - o) * 3, Math.abs(u[0] - s) * 3, Math.abs(s - o), 2 * C, j), H = Math.max(Math.abs(u[1] - a) * 3, Math.abs(u[1] - l) * 3, Math.abs(l - a), 2 * C, j);
                if (E < F) {
                    var N = F - E;
                    I -= N / 2;
                    o += N / 2;
                    s += N / 2;
                    E = F;
                    u[0] += N / 2
                }
                if (x < H) {
                    var W = H - x;
                    O -= W / 2;
                    a += W / 2;
                    l += W / 2;
                    x = H;
                    u[1] += W / 2
                }
                i = [I, O, E, x, o, a, s, l, u[0], u[1]]
            } else {
                v = true;
                var V = t[0], R = t[0], B = t[1] - f, z = t[1] - f, G = V, Z = B - d;
                E = 2 * C + 4 * d, x = 2 * C + 4 * d;
                I = G - d - C - d, O = Z - d - C - d;
                i = [I, O, E, x, G - I, Z - O, d, p, V - I, B - O, R - I, z - O]
            }
            return i
        };
        var g = function () {
            return [{x: s, y: l}, {x: u[0], y: u[1]}, {x: u[0] + 1, y: u[1] + 1}, {x: o, y: a}]
        };
        var y = function (t, e, n) {
            if (n) {
                e = jsBezier.locationAlongCurveFrom(t, e > 0 ? 0 : 1, e)
            }
            return e
        };
        this.pointOnPath = function (t, e) {
            if (v) {
                if (e) {
                    var n = Math.PI * 2 * d;
                    t = t / n
                }
                if (t > 0 && t < 1) {
                    t = 1 - t
                }
                var r = t * 2 * Math.PI + Math.PI / 2, o = i[4] + i[6] * Math.cos(r), a = i[5] + i[6] * Math.sin(r);
                return {x: o, y: a}
            } else {
                var s = g();
                t = y(s, t, e);
                return jsBezier.pointOnCurve(s, t)
            }
        };
        this.gradientAtPoint = function (t, e) {
            if (v) {
                if (e) {
                    var n = Math.PI * 2 * d;
                    t = t / n
                }
                return Math.atan(t * 2 * Math.PI)
            } else {
                var r = g();
                t = y(r, t, e);
                return jsBezier.gradientAtPoint(r, t)
            }
        };
        this.pointAlongPathFrom = function (t, e, n) {
            if (v) {
                if (n) {
                    var r = Math.PI * 2 * d;
                    t = t / r
                }
                if (t > 0 && t < 1) {
                    t = 1 - t
                }
                var r = 2 * Math.PI * i[6], o = e / r * 2 * Math.PI, a = t * 2 * Math.PI - o + Math.PI / 2, s = i[4] + i[6] * Math.cos(a), l = i[5] + i[6] * Math.sin(a);
                return {x: s, y: l}
            } else {
                var u = g();
                t = y(u, t, n);
                return jsBezier.pointAlongCurveFrom(u, t, e)
            }
        }
    };
    jsPlumb.Connectors.canvas.StateMachine = function (t) {
        t = t || {};
        var e = this, n = t.drawGuideline || true, r = t.avoidSelector;
        jsPlumb.Connectors.StateMachine.apply(this, arguments);
        jsPlumb.CanvasConnector.apply(this, arguments);
        this._paint = function (t) {
            if (t.length == 10) {
                e.ctx.beginPath();
                e.ctx.moveTo(t[4], t[5]);
                e.ctx.bezierCurveTo(t[8], t[9], t[8], t[9], t[6], t[7]);
                e.ctx.stroke()
            } else {
                e.ctx.save();
                e.ctx.beginPath();
                var n = 0, r = 2 * Math.PI, i = t[7];
                e.ctx.arc(t[4], t[5], t[6], 0, r, i);
                e.ctx.stroke();
                e.ctx.closePath();
                e.ctx.restore()
            }
        };
        this.createGradient = function (t, e) {
            return e.createLinearGradient(t[4], t[5], t[6], t[7])
        }
    };
    jsPlumb.Connectors.svg.StateMachine = function () {
        var t = this;
        jsPlumb.Connectors.StateMachine.apply(this, arguments);
        jsPlumb.SvgConnector.apply(this, arguments);
        this.getPath = function (t) {
            if (t.length == 10) {
                return "M " + t[4] + " " + t[5] + " C " + t[8] + " " + t[9] + " " + t[8] + " " + t[9] + " " + t[6] + " " + t[7]
            } else {
                return "M" + (t[8] + 4) + " " + t[9] + " A " + t[6] + " " + t[6] + " 0 1,0 " + (t[8] - 4) + " " + t[9]
            }
        }
    };
    jsPlumb.Connectors.vml.StateMachine = function () {
        jsPlumb.Connectors.StateMachine.apply(this, arguments);
        jsPlumb.VmlConnector.apply(this, arguments);
        var t = jsPlumb.vml.convertValue;
        this.getPath = function (e) {
            if (e.length == 10) {
                return "m" + t(e[4]) + "," + t(e[5]) + " c" + t(e[8]) + "," + t(e[9]) + "," + t(e[8]) + "," + t(e[9]) + "," + t(e[6]) + "," + t(e[7]) + " e"
            } else {
                var n = t(e[8] - e[6]), r = t(e[9] - 2 * e[6]), i = n + t(2 * e[6]), o = r + t(2 * e[6]), a = n + "," + r + "," + i + "," + o;
                var s = "ar " + a + "," + t(e[8]) + "," + t(e[9]) + "," + t(e[8]) + "," + t(e[9]) + " e";
                return s
            }
        }
    }
})();
(function () {
    var t = {
        "stroke-linejoin": "joinstyle",
        joinstyle: "joinstyle",
        endcap: "endcap",
        miterlimit: "miterlimit"
    }, e = null;
    if (document.createStyleSheet && document.namespaces) {
        var n = [".jsplumb_vml", "jsplumb\\:textbox", "jsplumb\\:oval", "jsplumb\\:rect", "jsplumb\\:stroke", "jsplumb\\:shape", "jsplumb\\:group"], r = "behavior:url(#default#VML);position:absolute;";
        e = document.createStyleSheet();
        for (var i = 0; i < n.length; i++) {
            e.addRule(n[i], r)
        }
        document.namespaces.add("jsplumb", "urn:schemas-microsoft-com:vml")
    }
    jsPlumb.vml = {};
    var o = 1e3, a = {}, s = function (t, e) {
        var n = jsPlumb.getId(t), r = a[n];
        if (!r) {
            r = u("group", [0, 0, o, o], {"class": e});
            r.style.backgroundColor = "red";
            a[n] = r;
            jsPlumb.appendElement(r, t)
        }
        return r
    }, l = function (t, e) {
        for (var n in e) {
            t[n] = e[n]
        }
    }, u = function (t, e, n, r, i, o) {
        n = n || {};
        var a = document.createElement("jsplumb:" + t);
        if (o) {
            i.appendElement(a, r)
        } else {
            jsPlumb.CurrentLibrary.appendElement(a, r)
        }
        a.className = (n["class"] ? n["class"] + " " : "") + "jsplumb_vml";
        c(a, e);
        l(a, n);
        return a
    }, c = function (t, e, n) {
        t.style.left = e[0] + "px";
        t.style.top = e[1] + "px";
        t.style.width = e[2] + "px";
        t.style.height = e[3] + "px";
        t.style.position = "absolute";
        if (n) {
            t.style.zIndex = n
        }
    }, f = jsPlumb.vml.convertValue = function (t) {
        return Math.floor(t * o)
    }, h = function (t, e, n, r) {
        if ("transparent" === e) {
            r.setOpacity(n, "0.0")
        } else {
            r.setOpacity(n, "1.0")
        }
    }, p = function (t, e, n, r) {
        var i = {};
        if (e.strokeStyle) {
            i.stroked = "true";
            var o = jsPlumbUtil.convertStyle(e.strokeStyle, true);
            i.strokecolor = o;
            h(i, o, "stroke", n);
            i.strokeweight = e.lineWidth + "px"
        } else {
            i.stroked = "false"
        }
        if (e.fillStyle) {
            i.filled = "true";
            var a = jsPlumbUtil.convertStyle(e.fillStyle, true);
            i.fillcolor = a;
            h(i, a, "fill", n)
        } else {
            i.filled = "false"
        }
        if (e.dashstyle) {
            if (n.strokeNode == null) {
                n.strokeNode = u("stroke", [0, 0, 0, 0], {dashstyle: e.dashstyle}, t, r)
            } else {
                n.strokeNode.dashstyle = e.dashstyle
            }
        } else {
            if (e["stroke-dasharray"] && e.lineWidth) {
                var s = e["stroke-dasharray"].indexOf(",") == -1 ? " " : ",", c = e["stroke-dasharray"].split(s), f = "";
                for (var p = 0; p < c.length; p++) {
                    f += Math.floor(c[p] / e.lineWidth) + s
                }
                if (n.strokeNode == null) {
                    n.strokeNode = u("stroke", [0, 0, 0, 0], {dashstyle: f}, t, r)
                } else {
                    n.strokeNode.dashstyle = f
                }
            }
        }
        l(t, i)
    }, d = function () {
        var t = this;
        jsPlumb.jsPlumbUIComponent.apply(this, arguments);
        this.opacityNodes = {stroke: null, fill: null};
        this.initOpacityNodes = function (e) {
            t.opacityNodes.stroke = u("stroke", [0, 0, 1, 1], {opacity: "0.0"}, e, t._jsPlumb);
            t.opacityNodes.fill = u("fill", [0, 0, 1, 1], {opacity: "0.0"}, e, t._jsPlumb)
        };
        this.setOpacity = function (e, n) {
            var r = t.opacityNodes[e];
            if (r) {
                r.opacity = "" + n
            }
        };
        var e = [];
        this.getDisplayElements = function () {
            return e
        };
        this.appendDisplayElement = function (n, r) {
            if (!r) {
                t.canvas.parentNode.appendChild(n)
            }
            e.push(n)
        }
    }, v = jsPlumb.VmlConnector = function (e) {
        var n = this;
        n.strokeNode = null;
        n.canvas = null;
        d.apply(this, arguments);
        var r = n._jsPlumb.connectorClass + (e.cssClass ? " " + e.cssClass : "");
        this.paint = function (i, a, s) {
            if (a != null) {
                var f = n.getPath(i), h = {path: f};
                if (a.outlineColor) {
                    var d = a.outlineWidth || 1, v = a.lineWidth + 2 * d, m = {
                        strokeStyle: jsPlumbUtil.convertStyle(a.outlineColor),
                        lineWidth: v
                    };
                    for (var g in t) {
                        m[g] = a[g]
                    }
                    if (n.bgCanvas == null) {
                        h["class"] = r;
                        h.coordsize = i[2] * o + "," + i[3] * o;
                        n.bgCanvas = u("shape", i, h, e.parent, n._jsPlumb, true);
                        c(n.bgCanvas, i, n.getZIndex());
                        n.appendDisplayElement(n.bgCanvas, true);
                        n.attachListeners(n.bgCanvas, n);
                        n.initOpacityNodes(n.bgCanvas, ["stroke"])
                    } else {
                        h.coordsize = i[2] * o + "," + i[3] * o;
                        c(n.bgCanvas, i, n.getZIndex());
                        l(n.bgCanvas, h)
                    }
                    p(n.bgCanvas, m, n)
                }
                if (n.canvas == null) {
                    h["class"] = r;
                    h.coordsize = i[2] * o + "," + i[3] * o;
                    if (n.tooltip) {
                        h.label = n.tooltip
                    }
                    n.canvas = u("shape", i, h, e.parent, n._jsPlumb, true);
                    n.appendDisplayElement(n.canvas, true);
                    n.attachListeners(n.canvas, n);
                    n.initOpacityNodes(n.canvas, ["stroke"])
                } else {
                    h.coordsize = i[2] * o + "," + i[3] * o;
                    c(n.canvas, i, n.getZIndex());
                    l(n.canvas, h)
                }
                p(n.canvas, a, n, n._jsPlumb)
            }
        };
        this.reattachListeners = function () {
            if (n.canvas) {
                n.reattachListenersForElement(n.canvas, n)
            }
        }
    }, m = window.VmlEndpoint = function (t) {
        d.apply(this, arguments);
        var e = null, n = this, r = null, i = null;
        n.canvas = document.createElement("div");
        n.canvas.style.position = "absolute";
        var o = n._jsPlumb.endpointClass + (t.cssClass ? " " + t.cssClass : "");
        t._jsPlumb.appendElement(n.canvas, t.parent);
        if (n.tooltip) {
            n.canvas.setAttribute("label", n.tooltip)
        }
        this.paint = function (t, r, i) {
            var a = {};
            jsPlumb.sizeCanvas(n.canvas, t[0], t[1], t[2], t[3]);
            if (e == null) {
                a["class"] = o;
                e = n.getVml([0, 0, t[2], t[3]], a, i, n.canvas, n._jsPlumb);
                n.attachListeners(e, n);
                n.appendDisplayElement(e, true);
                n.appendDisplayElement(n.canvas, true);
                n.initOpacityNodes(e, ["fill"])
            } else {
                c(e, [0, 0, t[2], t[3]]);
                l(e, a)
            }
            p(e, r, n)
        };
        this.reattachListeners = function () {
            if (e) {
                n.reattachListenersForElement(e, n)
            }
        }
    };
    jsPlumb.Connectors.vml.Bezier = function () {
        jsPlumb.Connectors.Bezier.apply(this, arguments);
        v.apply(this, arguments);
        this.getPath = function (t) {
            return "m" + f(t[4]) + "," + f(t[5]) + " c" + f(t[8]) + "," + f(t[9]) + "," + f(t[10]) + "," + f(t[11]) + "," + f(t[6]) + "," + f(t[7]) + " e"
        }
    };
    jsPlumb.Connectors.vml.Straight = function () {
        jsPlumb.Connectors.Straight.apply(this, arguments);
        v.apply(this, arguments);
        this.getPath = function (t) {
            return "m" + f(t[4]) + "," + f(t[5]) + " l" + f(t[6]) + "," + f(t[7]) + " e"
        }
    };
    jsPlumb.Connectors.vml.Flowchart = function () {
        jsPlumb.Connectors.Flowchart.apply(this, arguments);
        v.apply(this, arguments);
        this.getPath = function (t) {
            var e = "m " + f(t[4]) + "," + f(t[5]) + " l";
            for (var n = 0; n < t[8]; n++) {
                e = e + " " + f(t[9 + n * 2]) + "," + f(t[10 + n * 2])
            }
            e = e + " " + f(t[6]) + "," + f(t[7]) + " e";
            return e
        }
    };
    jsPlumb.Endpoints.vml.Dot = function () {
        jsPlumb.Endpoints.Dot.apply(this, arguments);
        m.apply(this, arguments);
        this.getVml = function (t, e, n, r, i) {
            return u("oval", t, e, r, i)
        }
    };
    jsPlumb.Endpoints.vml.Rectangle = function () {
        jsPlumb.Endpoints.Rectangle.apply(this, arguments);
        m.apply(this, arguments);
        this.getVml = function (t, e, n, r, i) {
            return u("rect", t, e, r, i)
        }
    };
    jsPlumb.Endpoints.vml.Image = jsPlumb.Endpoints.Image;
    jsPlumb.Endpoints.vml.Blank = jsPlumb.Endpoints.Blank;
    jsPlumb.Overlays.vml.Label = jsPlumb.Overlays.Label;
    jsPlumb.Overlays.vml.Custom = jsPlumb.Overlays.Custom;
    var g = function (t, e) {
        t.apply(this, e);
        d.apply(this, e);
        var n = this, r = null;
        n.canvas = null;
        n.isAppendedAtTopLevel = true;
        var i = function (t, e) {
            return "m " + f(t.hxy.x) + "," + f(t.hxy.y) + " l " + f(t.tail[0].x) + "," + f(t.tail[0].y) + " " + f(t.cxy.x) + "," + f(t.cxy.y) + " " + f(t.tail[1].x) + "," + f(t.tail[1].y) + " x e"
        };
        this.paint = function (t, e, r, a, s, f) {
            var h = {};
            if (a) {
                h.stroked = "true";
                h.strokecolor = jsPlumbUtil.convertStyle(a, true)
            }
            if (r) {
                h.strokeweight = r + "px"
            }
            if (s) {
                h.filled = "true";
                h.fillcolor = s
            }
            var p = Math.min(e.hxy.x, e.tail[0].x, e.tail[1].x, e.cxy.x), d = Math.min(e.hxy.y, e.tail[0].y, e.tail[1].y, e.cxy.y), v = Math.max(e.hxy.x, e.tail[0].x, e.tail[1].x, e.cxy.x), m = Math.max(e.hxy.y, e.tail[0].y, e.tail[1].y, e.cxy.y), g = Math.abs(v - p), y = Math.abs(m - d), b = [p, d, g, y];
            h.path = i(e, f);
            h.coordsize = f[2] * o + "," + f[3] * o;
            b[0] = f[0];
            b[1] = f[1];
            b[2] = f[2];
            b[3] = f[3];
            if (n.canvas == null) {
                n.canvas = u("shape", b, h, t.canvas.parentNode, t._jsPlumb, true);
                t.appendDisplayElement(n.canvas, true);
                n.attachListeners(n.canvas, t);
                n.attachListeners(n.canvas, n)
            } else {
                c(n.canvas, b);
                l(n.canvas, h)
            }
        };
        this.reattachListeners = function () {
            if (n.canvas) {
                n.reattachListenersForElement(n.canvas, n)
            }
        };
        this.cleanup = function () {
            if (n.canvas != null) {
                jsPlumb.CurrentLibrary.removeElement(n.canvas)
            }
        }
    };
    jsPlumb.Overlays.vml.Arrow = function () {
        g.apply(this, [jsPlumb.Overlays.Arrow, arguments])
    };
    jsPlumb.Overlays.vml.PlainArrow = function () {
        g.apply(this, [jsPlumb.Overlays.PlainArrow, arguments])
    };
    jsPlumb.Overlays.vml.Diamond = function () {
        g.apply(this, [jsPlumb.Overlays.Diamond, arguments])
    }
})();
(function () {
    var t = {
        joinstyle: "stroke-linejoin",
        "stroke-linejoin": "stroke-linejoin",
        "stroke-dashoffset": "stroke-dashoffset",
        "stroke-linecap": "stroke-linecap"
    }, e = "stroke-dasharray", n = "dashstyle", r = "linearGradient", i = "radialGradient", o = "fill", a = "stop", s = "stroke", l = "stroke-width", u = "style", c = "none", f = "jsplumb_gradient_", h = "lineWidth", p = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: "http://www.w3.org/1999/xhtml"
    }, d = function (t, e) {
        for (var n in e) {
            t.setAttribute(n, "" + e[n])
        }
    }, v = function (t, e) {
        var n = document.createElementNS(p.svg, t);
        e = e || {};
        e.version = "1.1";
        e.xmlns = p.xhtml;
        d(n, e);
        return n
    }, m = function (t) {
        return "position:absolute;left:" + t[0] + "px;top:" + t[1] + "px"
    }, g = function (t) {
        for (var e = 0; e < t.childNodes.length; e++) {
            if (t.childNodes[e].tagName == r || t.childNodes[e].tagName == i) {
                t.removeChild(t.childNodes[e])
            }
        }
    }, y = function (t, e, n, l, c) {
        var h = f + c._jsPlumb.idstamp();
        g(t);
        if (!n.gradient.offset) {
            var p = v(r, {id: h, gradientUnits: "userSpaceOnUse"});
            t.appendChild(p)
        } else {
            var p = v(i, {id: h});
            t.appendChild(p)
        }
        for (var d = 0; d < n.gradient.stops.length; d++) {
            var m = d;
            if (l.length == 8) {
                m = l[4] < l[6] ? d : n.gradient.stops.length - 1 - d
            } else {
                m = l[4] < l[6] ? n.gradient.stops.length - 1 - d : d
            }
            var y = jsPlumbUtil.convertStyle(n.gradient.stops[m][1], true);
            var b = v(a, {offset: Math.floor(n.gradient.stops[d][0] * 100) + "%", "stop-color": y});
            p.appendChild(b)
        }
        var P = n.strokeStyle ? s : o;
        e.setAttribute(u, P + ":url(#" + h + ")")
    }, b = function (r, i, a, f, p) {
        if (a.gradient) {
            y(r, i, a, f, p)
        } else {
            g(r);
            i.setAttribute(u, "")
        }
        i.setAttribute(o, a.fillStyle ? jsPlumbUtil.convertStyle(a.fillStyle, true) : c);
        i.setAttribute(s, a.strokeStyle ? jsPlumbUtil.convertStyle(a.strokeStyle, true) : c);
        if (a.lineWidth) {
            i.setAttribute(l, a.lineWidth)
        }
        if (a[n] && a[h] && !a[e]) {
            var d = a[n].indexOf(",") == -1 ? " " : ",", v = a[n].split(d), m = "";
            v.forEach(function (t) {
                m += Math.floor(t * a.lineWidth) + d
            });
            i.setAttribute(e, m)
        } else {
            if (a[e]) {
                i.setAttribute(e, a[e])
            }
        }
        for (var b in t) {
            if (a[b]) {
                i.setAttribute(t[b], a[b])
            }
        }
    }, P = function (t) {
        var e = /([0-9].)(p[xt])\s(.*)/;
        var n = t.match(e);
        return {size: n[1] + n[2], font: n[3]}
    }, C = function (t, e, n) {
        var r = n.split(" "), i = t.className, o = i.baseVal.split(" ");
        for (var a = 0; a < r.length; a++) {
            if (e) {
                if (o.indexOf(r[a]) == -1) {
                    o.push(r[a])
                }
            } else {
                var s = o.indexOf(r[a]);
                if (s != -1) {
                    o.splice(s, 1)
                }
            }
        }
        t.className.baseVal = o.join(" ")
    }, j = function (t, e) {
        C(t, true, e)
    }, E = function (t, e) {
        C(t, false, e)
    };
    jsPlumbUtil.svg = {addClass: j, removeClass: E, node: v, attr: d, pos: m};
    var x = function (t) {
        var e = this, n = t.pointerEventsSpec || "all";
        jsPlumb.jsPlumbUIComponent.apply(this, t.originalArgs);
        e.canvas = null, e.path = null, e.svg = null;
        var r = t.cssClass + " " + (t.originalArgs[0].cssClass || ""), i = {
            style: "",
            width: 0,
            height: 0,
            "pointer-events": n,
            position: "absolute"
        };
        if (e.tooltip) {
            i.title = e.tooltip
        }
        e.svg = v("svg", i);
        if (t.useDivWrapper) {
            e.canvas = document.createElement("div");
            e.canvas.style.position = "absolute";
            jsPlumb.sizeCanvas(e.canvas, 0, 0, 1, 1);
            e.canvas.className = r;
            if (e.tooltip) {
                e.canvas.setAttribute("title", e.tooltip)
            }
        } else {
            d(e.svg, {"class": r});
            e.canvas = e.svg
        }
        t._jsPlumb.appendElement(e.canvas, t.originalArgs[0]["parent"]);
        if (t.useDivWrapper) {
            e.canvas.appendChild(e.svg)
        }
        var o = [e.canvas];
        this.getDisplayElements = function () {
            return o
        };
        this.appendDisplayElement = function (t) {
            o.push(t)
        };
        this.paint = function (n, r, i) {
            if (r != null) {
                var o = n[0], a = n[1];
                if (t.useDivWrapper) {
                    jsPlumb.sizeCanvas(e.canvas, n[0], n[1], n[2], n[3]);
                    o = 0, a = 0
                }
                var s = m([o, a, n[2], n[3]]);
                if (e.getZIndex()) {
                    s += ";z-index:" + e.getZIndex() + ";"
                }
                d(e.svg, {style: s, width: n[2], height: n[3]});
                e._paint.apply(this, arguments)
            }
        }
    };
    var D = jsPlumb.SvgConnector = function (t) {
        var e = this;
        x.apply(this, [{
            cssClass: t._jsPlumb.connectorClass,
            originalArgs: arguments,
            pointerEventsSpec: "none",
            tooltip: t.tooltip,
            _jsPlumb: t._jsPlumb
        }]);
        this._paint = function (t, n) {
            var r = e.getPath(t), i = {d: r}, o = null;
            i["pointer-events"] = "all";
            if (n.outlineColor) {
                var a = n.outlineWidth || 1, s = n.lineWidth + 2 * a, o = jsPlumb.CurrentLibrary.extend({}, n);
                o.strokeStyle = jsPlumbUtil.convertStyle(n.outlineColor);
                o.lineWidth = s;
                if (e.bgPath == null) {
                    e.bgPath = v("path", i);
                    e.svg.appendChild(e.bgPath);
                    e.attachListeners(e.bgPath, e)
                } else {
                    d(e.bgPath, i)
                }
                b(e.svg, e.bgPath, o, t, e)
            }
            if (e.path == null) {
                e.path = v("path", i);
                e.svg.appendChild(e.path);
                e.attachListeners(e.path, e)
            } else {
                d(e.path, i)
            }
            b(e.svg, e.path, n, t, e)
        };
        this.reattachListeners = function () {
            if (e.bgPath) {
                e.reattachListenersForElement(e.bgPath, e)
            }
            if (e.path) {
                e.reattachListenersForElement(e.path, e)
            }
        }
    };
    jsPlumb.Connectors.svg.Bezier = function (t) {
        jsPlumb.Connectors.Bezier.apply(this, arguments);
        D.apply(this, arguments);
        this.getPath = function (t) {
            var e = "M " + t[4] + " " + t[5];
            e += " C " + t[8] + " " + t[9] + " " + t[10] + " " + t[11] + " " + t[6] + " " + t[7];
            return e
        }
    };
    jsPlumb.Connectors.svg.Straight = function (t) {
        jsPlumb.Connectors.Straight.apply(this, arguments);
        D.apply(this, arguments);
        this.getPath = function (t) {
            return "M " + t[4] + " " + t[5] + " L " + t[6] + " " + t[7]
        }
    };
    jsPlumb.Connectors.svg.Flowchart = function () {
        var t = this;
        jsPlumb.Connectors.Flowchart.apply(this, arguments);
        D.apply(this, arguments);
        this.getPath = function (t) {
            var e = "M " + t[4] + "," + t[5];
            for (var n = 0; n < t[8]; n++) {
                e = e + " L " + t[9 + n * 2] + " " + t[10 + n * 2]
            }
            e = e + " " + t[6] + "," + t[7];
            return e
        }
    };
    var S = window.SvgEndpoint = function (t) {
        var e = this;
        x.apply(this, [{
            cssClass: t._jsPlumb.endpointClass,
            originalArgs: arguments,
            pointerEventsSpec: "all",
            useDivWrapper: true,
            _jsPlumb: t._jsPlumb
        }]);
        this._paint = function (t, n) {
            var r = jsPlumb.extend({}, n);
            if (r.outlineColor) {
                r.strokeWidth = r.outlineWidth;
                r.strokeStyle = jsPlumbUtil.convertStyle(r.outlineColor, true)
            }
            if (e.node == null) {
                e.node = e.makeNode(t, r);
                e.svg.appendChild(e.node);
                e.attachListeners(e.node, e)
            }
            b(e.svg, e.node, r, t, e);
            m(e.node, t)
        };
        this.reattachListeners = function () {
            if (e.node) {
                e.reattachListenersForElement(e.node, e)
            }
        }
    };
    jsPlumb.Endpoints.svg.Dot = function () {
        jsPlumb.Endpoints.Dot.apply(this, arguments);
        S.apply(this, arguments);
        this.makeNode = function (t, e) {
            return v("circle", {cx: t[2] / 2, cy: t[3] / 2, r: t[2] / 2})
        }
    };
    jsPlumb.Endpoints.svg.Rectangle = function () {
        jsPlumb.Endpoints.Rectangle.apply(this, arguments);
        S.apply(this, arguments);
        this.makeNode = function (t, e) {
            return v("rect", {width: t[2], height: t[3]})
        }
    };
    jsPlumb.Endpoints.svg.Image = jsPlumb.Endpoints.Image;
    jsPlumb.Endpoints.svg.Blank = jsPlumb.Endpoints.Blank;
    jsPlumb.Overlays.svg.Label = jsPlumb.Overlays.Label;
    jsPlumb.Overlays.svg.Custom = jsPlumb.Overlays.Custom;
    var I = function (t, e) {
        t.apply(this, e);
        jsPlumb.jsPlumbUIComponent.apply(this, e);
        this.isAppendedAtTopLevel = false;
        var n = this, r = null;
        this.paint = function (t, o, a, s, l) {
            if (r == null) {
                r = v("path", {"pointer-events": "all"});
                t.svg.appendChild(r);
                n.attachListeners(r, t);
                n.attachListeners(r, n)
            }
            var u = e && e.length == 1 ? e[0].cssClass || "" : "";
            d(r, {d: i(o), "class": u, stroke: s ? s : null, fill: l ? l : null})
        };
        var i = function (t) {
            return "M" + t.hxy.x + "," + t.hxy.y + " L" + t.tail[0].x + "," + t.tail[0].y + " L" + t.cxy.x + "," + t.cxy.y + " L" + t.tail[1].x + "," + t.tail[1].y + " L" + t.hxy.x + "," + t.hxy.y
        };
        this.reattachListeners = function () {
            if (r) {
                n.reattachListenersForElement(r, n)
            }
        };
        this.cleanup = function () {
            if (r != null) {
                jsPlumb.CurrentLibrary.removeElement(r)
            }
        }
    };
    jsPlumb.Overlays.svg.Arrow = function () {
        I.apply(this, [jsPlumb.Overlays.Arrow, arguments])
    };
    jsPlumb.Overlays.svg.PlainArrow = function () {
        I.apply(this, [jsPlumb.Overlays.PlainArrow, arguments])
    };
    jsPlumb.Overlays.svg.Diamond = function () {
        I.apply(this, [jsPlumb.Overlays.Diamond, arguments])
    };
    jsPlumb.Overlays.svg.GuideLines = function () {
        var t = null, e = this, n = null, r, i;
        jsPlumb.Overlays.GuideLines.apply(this, arguments);
        this.paint = function (n, a, s, l, u) {
            if (t == null) {
                t = v("path");
                n.svg.appendChild(t);
                e.attachListeners(t, n);
                e.attachListeners(t, e);
                r = v("path");
                n.svg.appendChild(r);
                e.attachListeners(r, n);
                e.attachListeners(r, e);
                i = v("path");
                n.svg.appendChild(i);
                e.attachListeners(i, n);
                e.attachListeners(i, e)
            }
            d(t, {d: o(a[0], a[1]), stroke: "red", fill: null});
            d(r, {d: o(a[2][0], a[2][1]), stroke: "blue", fill: null});
            d(i, {d: o(a[3][0], a[3][1]), stroke: "green", fill: null})
        };
        var o = function (t, e) {
            return "M " + t.x + "," + t.y + " L" + e.x + "," + e.y
        }
    }
})();
(function () {
    var t = null, e = function (t, e) {
        return jsPlumb.CurrentLibrary.hasClass(n(t), e)
    }, n = function (t) {
        return jsPlumb.CurrentLibrary.getElementObject(t)
    }, r = function (t) {
        return jsPlumb.CurrentLibrary.getOffset(n(t))
    }, i = function (t) {
        return jsPlumb.CurrentLibrary.getPageXY(t)
    }, o = function (t) {
        return jsPlumb.CurrentLibrary.getClientXY(t)
    };
    var a = function () {
        var a = this;
        a.overlayPlacements = [];
        jsPlumb.jsPlumbUIComponent.apply(this, arguments);
        jsPlumbUtil.EventGenerator.apply(this, arguments);
        this._over = function (t) {
            var e = r(n(a.canvas)), o = i(t), s = o[0] - e.left, l = o[1] - e.top;
            if (s > 0 && l > 0 && s < a.canvas.width && l < a.canvas.height) {
                for (var u = 0; u < a.overlayPlacements.length; u++) {
                    var c = a.overlayPlacements[u];
                    if (c && c[0] <= s && c[1] >= s && c[2] <= l && c[3] >= l) {
                        return true
                    }
                }
                var f = a.canvas.getContext("2d").getImageData(parseInt(s), parseInt(l), 1, 1);
                return f.data[0] != 0 || f.data[1] != 0 || f.data[2] != 0 || f.data[3] != 0
            }
            return false
        };
        var s = false, l = false, u = null, c = false, f = function (t, n) {
            return t != null && e(t, n)
        };
        this.mousemove = function (e) {
            var n = i(e), r = o(e), l = document.elementFromPoint(r[0], r[1]), u = f(l, "_jsPlumb_overlay");
            var c = t == null && (f(l, "_jsPlumb_endpoint") || f(l, "_jsPlumb_connector"));
            if (!s && c && a._over(e)) {
                s = true;
                a.fire("mouseenter", a, e);
                return true
            } else {
                if (s && (!a._over(e) || !c) && !u) {
                    s = false;
                    a.fire("mouseexit", a, e)
                }
            }
            a.fire("mousemove", a, e)
        };
        this.click = function (t) {
            if (s && a._over(t) && !c) {
                a.fire("click", a, t)
            }
            c = false
        };
        this.dblclick = function (t) {
            if (s && a._over(t) && !c) {
                a.fire("dblclick", a, t)
            }
            c = false
        };
        this.mousedown = function (t) {
            if (a._over(t) && !l) {
                l = true;
                u = r(n(a.canvas));
                a.fire("mousedown", a, t)
            }
        };
        this.mouseup = function (t) {
            l = false;
            a.fire("mouseup", a, t)
        };
        this.contextmenu = function (t) {
            if (s && a._over(t) && !c) {
                a.fire("contextmenu", a, t)
            }
            c = false
        }
    };
    var s = function (t) {
        var e = document.createElement("canvas");
        t._jsPlumb.appendElement(e, t.parent);
        e.style.position = "absolute";
        if (t["class"]) {
            e.className = t["class"]
        }
        t._jsPlumb.getId(e, t.uuid);
        if (t.tooltip) {
            e.setAttribute("title", t.tooltip)
        }
        return e
    };
    var l = function (t) {
        a.apply(this, arguments);
        var e = [];
        this.getDisplayElements = function () {
            return e
        };
        this.appendDisplayElement = function (t) {
            e.push(t)
        }
    };
    var u = jsPlumb.CanvasConnector = function (t) {
        l.apply(this, arguments);
        var e = function (t, e) {
            n.ctx.save();
            jsPlumb.extend(n.ctx, e);
            if (e.gradient) {
                var r = n.createGradient(t, n.ctx);
                for (var i = 0; i < e.gradient.stops.length; i++) {
                    r.addColorStop(e.gradient.stops[i][0], e.gradient.stops[i][1])
                }
                n.ctx.strokeStyle = r
            }
            n._paint(t, e);
            n.ctx.restore()
        };
        var n = this, r = n._jsPlumb.connectorClass + " " + (t.cssClass || "");
        n.canvas = s({"class": r, _jsPlumb: n._jsPlumb, parent: t.parent, tooltip: t.tooltip});
        n.ctx = n.canvas.getContext("2d");
        n.appendDisplayElement(n.canvas);
        n.paint = function (t, r) {
            if (r != null) {
                jsPlumb.sizeCanvas(n.canvas, t[0], t[1], t[2], t[3]);
                if (n.getZIndex()) {
                    n.canvas.style.zIndex = n.getZIndex()
                }
                if (r.outlineColor != null) {
                    var i = r.outlineWidth || 1, o = r.lineWidth + 2 * i, a = {
                        strokeStyle: r.outlineColor,
                        lineWidth: o
                    };
                    e(t, a)
                }
                e(t, r)
            }
        }
    };
    var c = function (t) {
        var e = this;
        l.apply(this, arguments);
        var n = e._jsPlumb.endpointClass + " " + (t.cssClass || ""), r = {
            "class": n,
            _jsPlumb: e._jsPlumb,
            parent: t.parent,
            tooltip: e.tooltip
        };
        e.canvas = s(r);
        e.ctx = e.canvas.getContext("2d");
        e.appendDisplayElement(e.canvas);
        this.paint = function (t, n, r) {
            jsPlumb.sizeCanvas(e.canvas, t[0], t[1], t[2], t[3]);
            if (n.outlineColor != null) {
                var i = n.outlineWidth || 1, o = n.lineWidth + 2 * i;
                var a = {strokeStyle: n.outlineColor, lineWidth: o}
            }
            e._paint.apply(this, arguments)
        }
    };
    jsPlumb.Endpoints.canvas.Dot = function (t) {
        jsPlumb.Endpoints.Dot.apply(this, arguments);
        c.apply(this, arguments);
        var e = this, n = function (t) {
            try {
                return parseInt(t)
            } catch (e) {
                if (t.substring(t.length - 1) == "%") {
                    return parseInt(t.substring(0, t - 1))
                }
            }
        }, r = function (t) {
            var r = e.defaultOffset, i = e.defaultInnerRadius;
            t.offset && (r = n(t.offset));
            t.innerRadius && (i = n(t.innerRadius));
            return [r, i]
        };
        this._paint = function (t, n, i) {
            if (n != null) {
                var o = e.canvas.getContext("2d"), a = i.getOrientation(e);
                jsPlumb.extend(o, n);
                if (n.gradient) {
                    var s = r(n.gradient), l = a[1] == 1 ? s[0] * -1 : s[0], u = a[0] == 1 ? s[0] * -1 : s[0], c = o.createRadialGradient(t[4], t[4], t[4], t[4] + u, t[4] + l, s[1]);
                    for (var f = 0; f < n.gradient.stops.length; f++) {
                        c.addColorStop(n.gradient.stops[f][0], n.gradient.stops[f][1])
                    }
                    o.fillStyle = c
                }
                o.beginPath();
                o.arc(t[4], t[4], t[4], 0, Math.PI * 2, true);
                o.closePath();
                if (n.fillStyle || n.gradient) {
                    o.fill()
                }
                if (n.strokeStyle) {
                    o.stroke()
                }
            }
        }
    };
    jsPlumb.Endpoints.canvas.Rectangle = function (t) {
        var e = this;
        jsPlumb.Endpoints.Rectangle.apply(this, arguments);
        c.apply(this, arguments);
        this._paint = function (t, n, r) {
            var i = e.canvas.getContext("2d"), o = r.getOrientation(e);
            jsPlumb.extend(i, n);
            if (n.gradient) {
                var a = o[1] == 1 ? t[3] : o[1] == 0 ? t[3] / 2 : 0;
                var s = o[1] == -1 ? t[3] : o[1] == 0 ? t[3] / 2 : 0;
                var l = o[0] == 1 ? t[2] : o[0] == 0 ? t[2] / 2 : 0;
                var u = o[0] == -1 ? t[2] : o[0] == 0 ? t[2] / 2 : 0;
                var c = i.createLinearGradient(l, a, u, s);
                for (var f = 0; f < n.gradient.stops.length; f++) {
                    c.addColorStop(n.gradient.stops[f][0], n.gradient.stops[f][1])
                }
                i.fillStyle = c
            }
            i.beginPath();
            i.rect(0, 0, t[2], t[3]);
            i.closePath();
            if (n.fillStyle || n.gradient) {
                i.fill()
            }
            if (n.strokeStyle) {
                i.stroke()
            }
        }
    };
    jsPlumb.Endpoints.canvas.Triangle = function (t) {
        var e = this;
        jsPlumb.Endpoints.Triangle.apply(this, arguments);
        c.apply(this, arguments);
        this._paint = function (t, n, r) {
            var i = t[2], o = t[3], a = t[0], s = t[1], l = e.canvas.getContext("2d"), u = 0, c = 0, f = 0, h = r.getOrientation(e);
            if (h[0] == 1) {
                u = i;
                c = o;
                f = 180
            }
            if (h[1] == -1) {
                u = i;
                f = 90
            }
            if (h[1] == 1) {
                c = o;
                f = -90
            }
            l.fillStyle = n.fillStyle;
            l.translate(u, c);
            l.rotate(f * Math.PI / 180);
            l.beginPath();
            l.moveTo(0, 0);
            l.lineTo(i / 2, o / 2);
            l.lineTo(0, o);
            l.closePath();
            if (n.fillStyle || n.gradient) {
                l.fill()
            }
            if (n.strokeStyle) {
                l.stroke()
            }
        }
    };
    jsPlumb.Endpoints.canvas.Image = jsPlumb.Endpoints.Image;
    jsPlumb.Endpoints.canvas.Blank = jsPlumb.Endpoints.Blank;
    jsPlumb.Connectors.canvas.Bezier = function () {
        var t = this;
        jsPlumb.Connectors.Bezier.apply(this, arguments);
        u.apply(this, arguments);
        this._paint = function (e, n) {
            t.ctx.beginPath();
            t.ctx.moveTo(e[4], e[5]);
            t.ctx.bezierCurveTo(e[8], e[9], e[10], e[11], e[6], e[7]);
            t.ctx.stroke()
        };
        this.createGradient = function (e, n, r) {
            return t.ctx.createLinearGradient(e[6], e[7], e[4], e[5])
        }
    };
    jsPlumb.Connectors.canvas.Straight = function () {
        var t = this, e = [null, [1, -1], [1, 1], [-1, 1], [-1, -1]];
        jsPlumb.Connectors.Straight.apply(this, arguments);
        u.apply(this, arguments);
        this._paint = function (n, r) {
            t.ctx.beginPath();
            if (r.dashstyle && r.dashstyle.split(" ").length == 2) {
                var i = r.dashstyle.split(" ");
                if (i.length != 2) {
                    i = [2, 2]
                }
                var o = [i[0] * r.lineWidth, i[1] * r.lineWidth], a = (n[6] - n[4]) / (n[7] - n[5]), s = jsPlumbUtil.segment([n[4], n[5]], [n[6], n[7]]), l = e[s], u = Math.atan(a), c = Math.sqrt(Math.pow(n[6] - n[4], 2) + Math.pow(n[7] - n[5], 2)), f = Math.floor(c / (o[0] + o[1])), h = [n[4], n[5]];
                for (var p = 0; p < f; p++) {
                    t.ctx.moveTo(h[0], h[1]);
                    var d = h[0] + Math.abs(Math.sin(u) * o[0]) * l[0], v = h[1] + Math.abs(Math.cos(u) * o[0]) * l[1], m = h[0] + Math.abs(Math.sin(u) * (o[0] + o[1])) * l[0], g = h[1] + Math.abs(Math.cos(u) * (o[0] + o[1])) * l[1];
                    t.ctx.lineTo(d, v);
                    h = [m, g]
                }
                t.ctx.moveTo(h[0], h[1]);
                t.ctx.lineTo(n[6], n[7])
            } else {
                t.ctx.moveTo(n[4], n[5]);
                t.ctx.lineTo(n[6], n[7])
            }
            t.ctx.stroke()
        };
        this.createGradient = function (t, e) {
            return e.createLinearGradient(t[4], t[5], t[6], t[7])
        }
    };
    jsPlumb.Connectors.canvas.Flowchart = function () {
        var t = this;
        jsPlumb.Connectors.Flowchart.apply(this, arguments);
        u.apply(this, arguments);
        this._paint = function (e, n) {
            t.ctx.beginPath();
            t.ctx.moveTo(e[4], e[5]);
            for (var r = 0; r < e[8]; r++) {
                t.ctx.lineTo(e[9 + r * 2], e[10 + r * 2])
            }
            t.ctx.lineTo(e[6], e[7]);
            t.ctx.stroke()
        };
        this.createGradient = function (t, e) {
            return e.createLinearGradient(t[4], t[5], t[6], t[7])
        }
    };
    jsPlumb.Overlays.canvas.Label = jsPlumb.Overlays.Label;
    jsPlumb.Overlays.canvas.Custom = jsPlumb.Overlays.Custom;
    var f = function () {
        jsPlumb.jsPlumbUIComponent.apply(this, arguments)
    };
    var h = function (t, e) {
        t.apply(this, e);
        f.apply(this, e);
        this.paint = function (t, e, n, r, i) {
            var o = t.ctx;
            o.lineWidth = n;
            o.beginPath();
            o.moveTo(e.hxy.x, e.hxy.y);
            o.lineTo(e.tail[0].x, e.tail[0].y);
            o.lineTo(e.cxy.x, e.cxy.y);
            o.lineTo(e.tail[1].x, e.tail[1].y);
            o.lineTo(e.hxy.x, e.hxy.y);
            o.closePath();
            if (r) {
                o.strokeStyle = r;
                o.stroke()
            }
            if (i) {
                o.fillStyle = i;
                o.fill()
            }
        }
    };
    jsPlumb.Overlays.canvas.Arrow = function () {
        h.apply(this, [jsPlumb.Overlays.Arrow, arguments])
    };
    jsPlumb.Overlays.canvas.PlainArrow = function () {
        h.apply(this, [jsPlumb.Overlays.PlainArrow, arguments])
    };
    jsPlumb.Overlays.canvas.Diamond = function () {
        h.apply(this, [jsPlumb.Overlays.Diamond, arguments])
    }
})();
(function (t) {
    jsPlumb.CurrentLibrary = {
        addClass: function (t, e) {
            t = jsPlumb.CurrentLibrary.getElementObject(t);
            try {
                if (t[0].className.constructor == SVGAnimatedString) {
                    jsPlumb.util.svg.addClass(t[0], e)
                }
            } catch (n) {
            }
            t.addClass(e)
        },
        animate: function (t, e, n) {
            t.animate(e, n)
        },
        appendElement: function (t, e) {
            jsPlumb.CurrentLibrary.getElementObject(e).append(t)
        },
        ajax: function (e) {
            e = e || {};
            e.type = e.type || "get";
            t.ajax(e)
        },
        bind: function (t, e, n) {
            t = jsPlumb.CurrentLibrary.getElementObject(t);
            t.bind(e, n)
        },
        dragEvents: {
            start: "start",
            stop: "stop",
            drag: "drag",
            step: "step",
            over: "over",
            out: "out",
            drop: "drop",
            complete: "complete"
        },
        extend: function (e, n) {
            return t.extend(e, n)
        },
        getAttribute: function (t, e) {
            return t.attr(e)
        },
        getClientXY: function (t) {
            return [t.clientX, t.clientY]
        },
        getDragObject: function (t) {
            return t[1].draggable
        },
        getDragScope: function (t) {
            return t.draggable("option", "scope")
        },
        getDropEvent: function (t) {
            return t[0]
        },
        getDropScope: function (t) {
            return t.droppable("option", "scope")
        },
        getDOMElement: function (t) {
            if (typeof t == "string") {
                return document.getElementById(t)
            } else {
                if (t.context || t.length != null) {
                    return t[0]
                } else {
                    return t
                }
            }
        },
        getElementObject: function (e) {
            return typeof e == "string" ? t("#" + e) : t(e)
        },
        getOffset: function (t) {
            return t.offset()
        },
        getOriginalEvent: function (t) {
            return t.originalEvent
        },
        getPageXY: function (t) {
            return [t.pageX, t.pageY]
        },
        getParent: function (t) {
            return jsPlumb.CurrentLibrary.getElementObject(t).parent()
        },
        getScrollLeft: function (t) {
            return t.scrollLeft()
        },
        getScrollTop: function (t) {
            return t.scrollTop()
        },
        getSelector: function (e) {
            return t(e)
        },
        getSize: function (t) {
            return [t.outerWidth(), t.outerHeight()]
        },
        getTagName: function (t) {
            var e = jsPlumb.CurrentLibrary.getElementObject(t);
            return e.length > 0 ? e[0].tagName : null
        },
        getUIPosition: function (t, e) {
            e = e || 1;
            if (t.length == 1) {
                ret = {left: t[0].pageX, top: t[0].pageY}
            } else {
                var n = t[1], r = n.offset;
                ret = r || n.absolutePosition;
                n.position.left /= e;
                n.position.top /= e
            }
            return {left: ret.left / e, top: ret.top / e}
        },
        hasClass: function (t, e) {
            return t.hasClass(e)
        },
        initDraggable: function (t, e, n) {
            e = e || {};
            e.helper = null;
            if (n) {
                e.scope = e.scope || jsPlumb.Defaults.Scope
            }
            t.draggable(e)
        },
        initDroppable: function (t, e) {
            e.scope = e.scope || jsPlumb.Defaults.Scope;
            t.droppable(e)
        },
        isAlreadyDraggable: function (t) {
            t = jsPlumb.CurrentLibrary.getElementObject(t);
            return t.hasClass("ui-draggable")
        },
        isDragSupported: function (t, e) {
            return t.draggable
        },
        isDropSupported: function (t, e) {
            return t.droppable
        },
        removeClass: function (t, e) {
            t = jsPlumb.CurrentLibrary.getElementObject(t);
            try {
                if (t[0].className.constructor == SVGAnimatedString) {
                    jsPlumb.util.svg.removeClass(t[0], e)
                }
            } catch (n) {
            }
            t.removeClass(e)
        },
        removeElement: function (t, e) {
            jsPlumb.CurrentLibrary.getElementObject(t).remove()
        },
        setAttribute: function (t, e, n) {
            t.attr(e, n)
        },
        setDraggable: function (t, e) {
            t.draggable("option", "disabled", !e)
        },
        setDragScope: function (t, e) {
            t.draggable("option", "scope", e)
        },
        setOffset: function (t, e) {
            jsPlumb.CurrentLibrary.getElementObject(t).offset(e)
        },
        trigger: function (t, e, n) {
            var r = jQuery._data(jsPlumb.CurrentLibrary.getElementObject(t)[0], "handle");
            r(n)
        },
        unbind: function (t, e, n) {
            t = jsPlumb.CurrentLibrary.getElementObject(t);
            t.unbind(e, n)
        }
    };
    t(document).ready(jsPlumb.init)
})(jQuery);
(function () {
    "undefined" == typeof Math.sgn && (Math.sgn = function (t) {
        return 0 == t ? 0 : 0 < t ? 1 : -1
    });
    var t = {
        subtract: function (t, e) {
            return {x: t.x - e.x, y: t.y - e.y}
        }, dotProduct: function (t, e) {
            return t.x * e.x + t.y * e.y
        }, square: function (t) {
            return Math.sqrt(t.x * t.x + t.y * t.y)
        }, scale: function (t, e) {
            return {x: t.x * e, y: t.y * e}
        }
    }, e = Math.pow(2, -65), n = function (e, n) {
        for (var o = [], a = n.length - 1, s = 2 * a - 1, l = [], u = [], c = [], f = [], h = [[1, .6, .3, .1], [.4, .6, .6, .4], [.1, .3, .6, 1]], p = 0; p <= a; p++) {
            l[p] = t.subtract(n[p], e)
        }
        for (p = 0; p <= a - 1; p++) {
            u[p] = t.subtract(n[p + 1], n[p]);
            u[p] = t.scale(u[p], 3)
        }
        for (p = 0; p <= a - 1; p++) {
            for (var d = 0; d <= a; d++) {
                c[p] || (c[p] = []);
                c[p][d] = t.dotProduct(u[p], l[d])
            }
        }
        for (p = 0; p <= s; p++) {
            f[p] || (f[p] = []);
            f[p].y = 0;
            f[p].x = parseFloat(p) / s
        }
        s = a - 1;
        for (l = 0; l <= a + s; l++) {
            p = Math.max(0, l - s);
            for (u = Math.min(l, a); p <= u; p++) {
                j = l - p;
                f[p + j].y = f[p + j].y + c[j][p] * h[j][p]
            }
        }
        a = n.length - 1;
        f = r(f, 2 * a - 1, o, 0);
        s = t.subtract(e, n[0]);
        c = t.square(s);
        for (p = h = 0; p < f; p++) {
            s = t.subtract(e, i(n, a, o[p], null, null));
            s = t.square(s);
            if (s < c) {
                c = s;
                h = o[p]
            }
        }
        s = t.subtract(e, n[a]);
        s = t.square(s);
        if (s < c) {
            c = s;
            h = 1
        }
        return {location: h, distance: c}
    }, r = function (t, n, o, a) {
        var s = [], l = [], u = [], c = [], f = 0, h, p;
        p = Math.sgn(t[0].y);
        for (var d = 1; d <= n; d++) {
            h = Math.sgn(t[d].y);
            h != p && f++;
            p = h
        }
        switch (f) {
            case 0:
                return 0;
            case 1:
                if (a >= 64) {
                    o[0] = (t[0].x + t[n].x) / 2;
                    return 1
                }
                var v, f = t[0].y - t[n].y;
                p = t[n].x - t[0].x;
                d = t[0].x * t[n].y - t[n].x * t[0].y;
                h = max_distance_below = 0;
                for (v = 1; v < n; v++) {
                    var m = f * t[v].x + p * t[v].y + d;
                    m > h ? h = m : m < max_distance_below && (max_distance_below = m)
                }
                v = p;
                h = (1 * (d - h) - v * 0) * (1 / (0 * v - f * 1));
                v = p;
                p = d - max_distance_below;
                f = (1 * p - v * 0) * (1 / (0 * v - f * 1));
                p = Math.min(h, f);
                if (Math.max(h, f) - p < e) {
                    u = t[n].x - t[0].x;
                    c = t[n].y - t[0].y;
                    o[0] = 0 + 1 * (u * (t[0].y - 0) - c * (t[0].x - 0)) * (1 / (u * 0 - c * 1));
                    return 1
                }
        }
        i(t, n, .5, s, l);
        t = r(s, n, u, a + 1);
        n = r(l, n, c, a + 1);
        for (a = 0; a < t; a++) {
            o[a] = u[a]
        }
        for (a = 0; a < n; a++) {
            o[a + t] = c[a]
        }
        return t + n
    }, i = function (t, e, n, r, i) {
        for (var o = [[]], a = 0; a <= e; a++) {
            o[0][a] = t[a]
        }
        for (t = 1; t <= e; t++) {
            for (a = 0; a <= e - t; a++) {
                o[t] || (o[t] = []);
                o[t][a] || (o[t][a] = {});
                o[t][a].x = (1 - n) * o[t - 1][a].x + n * o[t - 1][a + 1].x;
                o[t][a].y = (1 - n) * o[t - 1][a].y + n * o[t - 1][a + 1].y
            }
        }
        if (r != null) {
            for (a = 0; a <= e; a++) {
                r[a] = o[a][0]
            }
        }
        if (i != null) {
            for (a = 0; a <= e; a++) {
                i[a] = o[e - a][a]
            }
        }
        return o[e][0]
    }, o = {}, a = function (t) {
        var e = o[t];
        if (!e) {
            var e = [], n = function (t) {
                return function () {
                    return t
                }
            }, r = function () {
                return function (t) {
                    return t
                }
            }, i = function () {
                return function (t) {
                    return 1 - t
                }
            }, a = function (t) {
                return function (e) {
                    for (var n = 1, r = 0; r < t.length; r++) {
                        n = n * t[r](e)
                    }
                    return n
                }
            };
            e.push(new function () {
                return function (e) {
                    return Math.pow(e, t)
                }
            });
            for (var s = 1; s < t; s++) {
                for (var l = [new n(t)], u = 0; u < t - s; u++) {
                    l.push(new r)
                }
                for (u = 0; u < s; u++) {
                    l.push(new i)
                }
                e.push(new a(l))
            }
            e.push(new function () {
                return function (e) {
                    return Math.pow(1 - e, t)
                }
            });
            o[t] = e
        }
        return e
    }, s = function (t, e) {
        for (var n = a(t.length - 1), r = 0, i = 0, o = 0; o < t.length; o++) {
            r = r + t[o].x * n[o](e);
            i = i + t[o].y * n[o](e)
        }
        return {x: r, y: i}
    }, l = function (t, e, n) {
        for (var r = s(t, e), i = 0, o = n > 0 ? 1 : -1, a = null; i < Math.abs(n);) {
            e = e + .005 * o;
            a = s(t, e);
            i = i + Math.sqrt(Math.pow(a.x - r.x, 2) + Math.pow(a.y - r.y, 2));
            r = a
        }
        return {point: a, location: e}
    }, u = function (t, e) {
        var n = s(t, e), r = s(t.slice(0, t.length - 1), e), i = r.y - n.y, n = r.x - n.x;
        return i == 0 ? Infinity : Math.atan(i / n)
    };
    window.jsBezier = {
        distanceFromCurve: n, gradientAtPoint: u, gradientAtPointAlongCurveFrom: function (t, e, n) {
            e = l(t, e, n);
            if (e.location > 1) {
                e.location = 1
            }
            if (e.location < 0) {
                e.location = 0
            }
            return u(t, e.location)
        }, nearestPointOnCurve: function (t, e) {
            var r = n(t, e);
            return {point: i(e, e.length - 1, r.location, null, null), location: r.location}
        }, pointOnCurve: s, pointAlongCurveFrom: function (t, e, n) {
            return l(t, e, n).point
        }, perpendicularToCurveAt: function (t, e, n, r) {
            e = l(t, e, r == null ? 0 : r);
            t = u(t, e.location);
            r = Math.atan(-1 / t);
            t = n / 2 * Math.sin(r);
            n = n / 2 * Math.cos(r);
            return [{x: e.point.x + n, y: e.point.y + t}, {x: e.point.x - n, y: e.point.y - t}]
        }, locationAlongCurveFrom: function (t, e, n) {
            return l(t, e, n).location
        }
    }
})();