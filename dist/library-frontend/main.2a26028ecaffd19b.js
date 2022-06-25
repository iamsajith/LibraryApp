"use strict";
(self.webpackChunkLibrary_Frontend =
  self.webpackChunkLibrary_Frontend || []).push([
  [179],
  {
    174: () => {
      function ie(e) {
        return "function" == typeof e;
      }
      function lo(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const Ii = lo(
        (e) =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function uo(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class pt {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const i of n) i.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (ie(r))
              try {
                r();
              } catch (i) {
                t = i instanceof Ii ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  Jd(i);
                } catch (s) {
                  (t = null != t ? t : []),
                    s instanceof Ii ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new Ii(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) Jd(t);
            else {
              if (t instanceof pt) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                t
              );
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && uo(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && uo(n, t), t instanceof pt && t._removeParent(this);
        }
      }
      pt.EMPTY = (() => {
        const e = new pt();
        return (e.closed = !0), e;
      })();
      const Zd = pt.EMPTY;
      function Kd(e) {
        return (
          e instanceof pt ||
          (e && "closed" in e && ie(e.remove) && ie(e.add) && ie(e.unsubscribe))
        );
      }
      function Jd(e) {
        ie(e) ? e() : e.unsubscribe();
      }
      const Ln = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        xi = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = xi;
            return (null == r ? void 0 : r.setTimeout)
              ? r.setTimeout(e, t, ...n)
              : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = xi;
            return ((null == t ? void 0 : t.clearTimeout) || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function Yd(e) {
        xi.setTimeout(() => {
          const { onUnhandledError: t } = Ln;
          if (!t) throw e;
          t(e);
        });
      }
      function Xd() {}
      const lD = Oa("C", void 0, void 0);
      function Oa(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let Bn = null;
      function Ti(e) {
        if (Ln.useDeprecatedSynchronousErrorHandling) {
          const t = !Bn;
          if ((t && (Bn = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = Bn;
            if (((Bn = null), n)) throw r;
          }
        } else e();
      }
      class Pa extends pt {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), Kd(t) && t.add(this))
              : (this.destination = gD);
        }
        static create(t, n, r) {
          return new Oi(t, n, r);
        }
        next(t) {
          this.isStopped
            ? Ra(
                (function cD(e) {
                  return Oa("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? Ra(
                (function uD(e) {
                  return Oa("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? Ra(lD, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const fD = Function.prototype.bind;
      function Fa(e, t) {
        return fD.call(e, t);
      }
      class hD {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              Pi(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              Pi(r);
            }
          else Pi(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              Pi(n);
            }
        }
      }
      class Oi extends Pa {
        constructor(t, n, r) {
          let o;
          if ((super(), ie(t) || !t))
            o = {
              next: null != t ? t : void 0,
              error: null != n ? n : void 0,
              complete: null != r ? r : void 0,
            };
          else {
            let i;
            this && Ln.useDeprecatedNextContext
              ? ((i = Object.create(t)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: t.next && Fa(t.next, i),
                  error: t.error && Fa(t.error, i),
                  complete: t.complete && Fa(t.complete, i),
                }))
              : (o = t);
          }
          this.destination = new hD(o);
        }
      }
      function Pi(e) {
        Ln.useDeprecatedSynchronousErrorHandling
          ? (function dD(e) {
              Ln.useDeprecatedSynchronousErrorHandling &&
                Bn &&
                ((Bn.errorThrown = !0), (Bn.error = e));
            })(e)
          : Yd(e);
      }
      function Ra(e, t) {
        const { onStoppedNotification: n } = Ln;
        n && xi.setTimeout(() => n(e, t));
      }
      const gD = {
          closed: !0,
          next: Xd,
          error: function pD(e) {
            throw e;
          },
          complete: Xd,
        },
        Na =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function jn(e) {
        return e;
      }
      let ye = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function yD(e) {
              return (
                (e && e instanceof Pa) ||
                ((function mD(e) {
                  return e && ie(e.next) && ie(e.error) && ie(e.complete);
                })(e) &&
                  Kd(e))
              );
            })(n)
              ? n
              : new Oi(n, r, o);
            return (
              Ti(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i)
                );
              }),
              i
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = tf(r))((o, i) => {
              const s = new Oi({
                next: (a) => {
                  try {
                    n(a);
                  } catch (l) {
                    i(l), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [Na]() {
            return this;
          }
          pipe(...n) {
            return (function ef(e) {
              return 0 === e.length
                ? jn
                : 1 === e.length
                ? e[0]
                : function (n) {
                    return e.reduce((r, o) => o(r), n);
                  };
            })(n)(this);
          }
          toPromise(n) {
            return new (n = tf(n))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function tf(e) {
        var t;
        return null !== (t = null != e ? e : Ln.Promise) && void 0 !== t
          ? t
          : Promise;
      }
      const vD = lo(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let nn = (() => {
        class e extends ye {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new nf(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new vD();
          }
          next(n) {
            Ti(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            Ti(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            Ti(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? Zd
              : ((this.currentObservers = null),
                i.push(n),
                new pt(() => {
                  (this.currentObservers = null), uo(i, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new ye();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new nf(t, n)), e;
      })();
      class nf extends nn {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null ===
            (n =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(t)) && void 0 !== r
            ? r
            : Zd;
        }
      }
      function rf(e) {
        return ie(null == e ? void 0 : e.lift);
      }
      function Ne(e) {
        return (t) => {
          if (rf(t))
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function Oe(e, t, n, r, o) {
        return new _D(e, t, n, r, o);
      }
      class _D extends Pa {
        constructor(t, n, r, o, i, s) {
          super(t),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (l) {
                    t.error(l);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (l) {
                    t.error(l);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (t = this.onFinalize) ||
                  void 0 === t ||
                  t.call(this));
          }
        }
      }
      function Y(e, t) {
        return Ne((n, r) => {
          let o = 0;
          n.subscribe(
            Oe(r, (i) => {
              r.next(e.call(t, i, o++));
            })
          );
        });
      }
      function Hn(e) {
        return this instanceof Hn ? ((this.v = e), this) : new Hn(e);
      }
      function wD(e, t, n) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var o,
          r = n.apply(e, t || []),
          i = [];
        return (
          (o = {}),
          s("next"),
          s("throw"),
          s("return"),
          (o[Symbol.asyncIterator] = function () {
            return this;
          }),
          o
        );
        function s(f) {
          r[f] &&
            (o[f] = function (h) {
              return new Promise(function (p, m) {
                i.push([f, h, p, m]) > 1 || a(f, h);
              });
            });
        }
        function a(f, h) {
          try {
            !(function l(f) {
              f.value instanceof Hn
                ? Promise.resolve(f.value.v).then(u, c)
                : d(i[0][2], f);
            })(r[f](h));
          } catch (p) {
            d(i[0][3], p);
          }
        }
        function u(f) {
          a("next", f);
        }
        function c(f) {
          a("throw", f);
        }
        function d(f, h) {
          f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
        }
      }
      function bD(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function af(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(i) {
          n[i] =
            e[i] &&
            function (s) {
              return new Promise(function (a, l) {
                !(function o(i, s, a, l) {
                  Promise.resolve(l).then(function (u) {
                    i({ value: u, done: a });
                  }, s);
                })(a, l, (s = e[i](s)).done, s.value);
              });
            };
        }
      }
      const lf = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function uf(e) {
        return ie(null == e ? void 0 : e.then);
      }
      function cf(e) {
        return ie(e[Na]);
      }
      function df(e) {
        return (
          Symbol.asyncIterator &&
          ie(null == e ? void 0 : e[Symbol.asyncIterator])
        );
      }
      function ff(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const hf = (function MD() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function pf(e) {
        return ie(null == e ? void 0 : e[hf]);
      }
      function gf(e) {
        return wD(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield Hn(n.read());
              if (o) return yield Hn(void 0);
              yield yield Hn(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function mf(e) {
        return ie(null == e ? void 0 : e.getReader);
      }
      function jt(e) {
        if (e instanceof ye) return e;
        if (null != e) {
          if (cf(e))
            return (function AD(e) {
              return new ye((t) => {
                const n = e[Na]();
                if (ie(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (lf(e))
            return (function SD(e) {
              return new ye((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (uf(e))
            return (function ID(e) {
              return new ye((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n)
                ).then(null, Yd);
              });
            })(e);
          if (df(e)) return yf(e);
          if (pf(e))
            return (function xD(e) {
              return new ye((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (mf(e))
            return (function TD(e) {
              return yf(gf(e));
            })(e);
        }
        throw ff(e);
      }
      function yf(e) {
        return new ye((t) => {
          (function OD(e, t) {
            var n, r, o, i;
            return (function CD(e, t, n, r) {
              return new (n || (n = Promise))(function (i, s) {
                function a(c) {
                  try {
                    u(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  try {
                    u(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  c.done
                    ? i(c.value)
                    : (function o(i) {
                        return i instanceof n
                          ? i
                          : new n(function (s) {
                              s(i);
                            });
                      })(c.value).then(a, l);
                }
                u((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = bD(e); !(r = yield n.next()).done; )
                  if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = n.return) && (yield i.call(n));
                } finally {
                  if (o) throw o.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function rn(e, t, n, r = 0, o = !1) {
        const i = t.schedule(function () {
          n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function Pe(e, t, n = 1 / 0) {
        return ie(t)
          ? Pe((r, o) => Y((i, s) => t(r, i, o, s))(jt(e(r, o))), n)
          : ("number" == typeof t && (n = t),
            Ne((r, o) =>
              (function PD(e, t, n, r, o, i, s, a) {
                const l = [];
                let u = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !l.length && !u && t.complete();
                  },
                  h = (m) => (u < r ? p(m) : l.push(m)),
                  p = (m) => {
                    i && t.next(m), u++;
                    let C = !1;
                    jt(n(m, c++)).subscribe(
                      Oe(
                        t,
                        (_) => {
                          null == o || o(_), i ? h(_) : t.next(_);
                        },
                        () => {
                          C = !0;
                        },
                        void 0,
                        () => {
                          if (C)
                            try {
                              for (u--; l.length && u < r; ) {
                                const _ = l.shift();
                                s ? rn(t, s, () => p(_)) : p(_);
                              }
                              f();
                            } catch (_) {
                              t.error(_);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    Oe(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    null == a || a();
                  }
                );
              })(r, o, e, n)
            ));
      }
      function co(e = 1 / 0) {
        return Pe(jn, e);
      }
      const on = new ye((e) => e.complete());
      function Va(e) {
        return e[e.length - 1];
      }
      function vf(e) {
        return ie(Va(e)) ? e.pop() : void 0;
      }
      function fo(e) {
        return (function RD(e) {
          return e && ie(e.schedule);
        })(Va(e))
          ? e.pop()
          : void 0;
      }
      function _f(e, t = 0) {
        return Ne((n, r) => {
          n.subscribe(
            Oe(
              r,
              (o) => rn(r, e, () => r.next(o), t),
              () => rn(r, e, () => r.complete(), t),
              (o) => rn(r, e, () => r.error(o), t)
            )
          );
        });
      }
      function Cf(e, t = 0) {
        return Ne((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function Df(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new ye((n) => {
          rn(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            rn(
              n,
              t,
              () => {
                r.next().then((o) => {
                  o.done ? n.complete() : n.next(o.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function Fe(e, t) {
        return t
          ? (function HD(e, t) {
              if (null != e) {
                if (cf(e))
                  return (function kD(e, t) {
                    return jt(e).pipe(Cf(t), _f(t));
                  })(e, t);
                if (lf(e))
                  return (function LD(e, t) {
                    return new ye((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (uf(e))
                  return (function VD(e, t) {
                    return jt(e).pipe(Cf(t), _f(t));
                  })(e, t);
                if (df(e)) return Df(e, t);
                if (pf(e))
                  return (function BD(e, t) {
                    return new ye((n) => {
                      let r;
                      return (
                        rn(n, t, () => {
                          (r = e[hf]()),
                            rn(
                              n,
                              t,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                i ? n.complete() : n.next(o);
                              },
                              0,
                              !0
                            );
                        }),
                        () => ie(null == r ? void 0 : r.return) && r.return()
                      );
                    });
                  })(e, t);
                if (mf(e))
                  return (function jD(e, t) {
                    return Df(gf(e), t);
                  })(e, t);
              }
              throw ff(e);
            })(e, t)
          : jt(e);
      }
      function Fi(e) {
        return e <= 0
          ? () => on
          : Ne((t, n) => {
              let r = 0;
              t.subscribe(
                Oe(n, (o) => {
                  ++r <= e && (n.next(o), e <= r && n.complete());
                })
              );
            });
      }
      function La(e, t, ...n) {
        return !0 === t
          ? (e(), null)
          : !1 === t
          ? null
          : t(...n)
              .pipe(Fi(1))
              .subscribe(() => e());
      }
      function ne(e) {
        for (let t in e) if (e[t] === ne) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function Ba(e, t) {
        for (const n in t)
          t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
      }
      function X(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(X).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function ja(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const GD = ne({ __forward_ref__: ne });
      function se(e) {
        return (
          (e.__forward_ref__ = se),
          (e.toString = function () {
            return X(this());
          }),
          e
        );
      }
      function B(e) {
        return wf(e) ? e() : e;
      }
      function wf(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(GD) &&
          e.__forward_ref__ === se
        );
      }
      class Q extends Error {
        constructor(t, n) {
          super(
            (function Ha(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t : ""}`;
            })(t, n)
          ),
            (this.code = t);
        }
      }
      function F(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function ke(e) {
        return "function" == typeof e
          ? e.name || e.toString()
          : "object" == typeof e && null != e && "function" == typeof e.type
          ? e.type.name || e.type.toString()
          : F(e);
      }
      function Ri(e, t) {
        const n = t ? ` in ${t}` : "";
        throw new Q(-201, `No provider for ${ke(e)} found${n}`);
      }
      function rt(e, t) {
        null == e &&
          (function re(e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
            );
          })(t, e, null, "!=");
      }
      function R(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function ot(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function Ua(e) {
        return bf(e, Ni) || bf(e, Mf);
      }
      function bf(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function Ef(e) {
        return e && (e.hasOwnProperty($a) || e.hasOwnProperty(JD))
          ? e[$a]
          : null;
      }
      const Ni = ne({ ɵprov: ne }),
        $a = ne({ ɵinj: ne }),
        Mf = ne({ ngInjectableDef: ne }),
        JD = ne({ ngInjectorDef: ne });
      var P = (() => (
        ((P = P || {})[(P.Default = 0)] = "Default"),
        (P[(P.Host = 1)] = "Host"),
        (P[(P.Self = 2)] = "Self"),
        (P[(P.SkipSelf = 4)] = "SkipSelf"),
        (P[(P.Optional = 8)] = "Optional"),
        P
      ))();
      let Ga;
      function Cn(e) {
        const t = Ga;
        return (Ga = e), t;
      }
      function Af(e, t, n) {
        const r = Ua(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & P.Optional
          ? null
          : void 0 !== t
          ? t
          : void Ri(X(e), "Injector");
      }
      function Dn(e) {
        return { toString: e }.toString();
      }
      var St = (() => (
          ((St = St || {})[(St.OnPush = 0)] = "OnPush"),
          (St[(St.Default = 1)] = "Default"),
          St
        ))(),
        Ht = (() => {
          return (
            ((e = Ht || (Ht = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            Ht
          );
          var e;
        })();
      const XD = "undefined" != typeof globalThis && globalThis,
        ew = "undefined" != typeof window && window,
        tw =
          "undefined" != typeof self &&
          "undefined" != typeof WorkerGlobalScope &&
          self instanceof WorkerGlobalScope &&
          self,
        te = XD || ("undefined" != typeof global && global) || ew || tw,
        dr = {},
        oe = [],
        ki = ne({ ɵcmp: ne }),
        za = ne({ ɵdir: ne }),
        qa = ne({ ɵpipe: ne }),
        Sf = ne({ ɵmod: ne }),
        an = ne({ ɵfac: ne }),
        ho = ne({ __NG_ELEMENT_ID__: ne });
      let nw = 0;
      function gt(e) {
        return Dn(() => {
          const n = {},
            r = {
              type: e.type,
              providersResolver: null,
              decls: e.decls,
              vars: e.vars,
              factory: null,
              template: e.template || null,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              hostBindings: e.hostBindings || null,
              hostVars: e.hostVars || 0,
              hostAttrs: e.hostAttrs || null,
              contentQueries: e.contentQueries || null,
              declaredInputs: n,
              inputs: null,
              outputs: null,
              exportAs: e.exportAs || null,
              onPush: e.changeDetection === St.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              selectors: e.selectors || oe,
              viewQuery: e.viewQuery || null,
              features: e.features || null,
              data: e.data || {},
              encapsulation: e.encapsulation || Ht.Emulated,
              id: "c",
              styles: e.styles || oe,
              _: null,
              setInput: null,
              schemas: e.schemas || null,
              tView: null,
            },
            o = e.directives,
            i = e.features,
            s = e.pipes;
          return (
            (r.id += nw++),
            (r.inputs = Of(e.inputs, n)),
            (r.outputs = Of(e.outputs)),
            i && i.forEach((a) => a(r)),
            (r.directiveDefs = o
              ? () => ("function" == typeof o ? o() : o).map(If)
              : null),
            (r.pipeDefs = s
              ? () => ("function" == typeof s ? s() : s).map(xf)
              : null),
            r
          );
        });
      }
      function If(e) {
        return (
          Be(e) ||
          (function wn(e) {
            return e[za] || null;
          })(e)
        );
      }
      function xf(e) {
        return (function Un(e) {
          return e[qa] || null;
        })(e);
      }
      const Tf = {};
      function mt(e) {
        return Dn(() => {
          const t = {
            type: e.type,
            bootstrap: e.bootstrap || oe,
            declarations: e.declarations || oe,
            imports: e.imports || oe,
            exports: e.exports || oe,
            transitiveCompileScopes: null,
            schemas: e.schemas || null,
            id: e.id || null,
          };
          return null != e.id && (Tf[e.id] = e.type), t;
        });
      }
      function Of(e, t) {
        if (null == e) return dr;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let o = e[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (n[o] = r),
              t && (t[o] = i);
          }
        return n;
      }
      const O = gt;
      function Be(e) {
        return e[ki] || null;
      }
      function yt(e, t) {
        const n = e[Sf] || null;
        if (!n && !0 === t)
          throw new Error(`Type ${X(e)} does not have '\u0275mod' property.`);
        return n;
      }
      const j = 11;
      function Ut(e) {
        return Array.isArray(e) && "object" == typeof e[1];
      }
      function xt(e) {
        return Array.isArray(e) && !0 === e[1];
      }
      function Za(e) {
        return 0 != (8 & e.flags);
      }
      function ji(e) {
        return 2 == (2 & e.flags);
      }
      function Hi(e) {
        return 1 == (1 & e.flags);
      }
      function Tt(e) {
        return null !== e.template;
      }
      function lw(e) {
        return 0 != (512 & e[2]);
      }
      function qn(e, t) {
        return e.hasOwnProperty(an) ? e[an] : null;
      }
      class dw {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function _t() {
        return Ff;
      }
      function Ff(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = hw), fw;
      }
      function fw() {
        const e = Nf(this),
          t = null == e ? void 0 : e.current;
        if (t) {
          const n = e.previous;
          if (n === dr) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function hw(e, t, n, r) {
        const o =
            Nf(e) ||
            (function pw(e, t) {
              return (e[Rf] = t);
            })(e, { previous: dr, current: null }),
          i = o.current || (o.current = {}),
          s = o.previous,
          a = this.declaredInputs[n],
          l = s[a];
        (i[a] = new dw(l && l.currentValue, t, s === dr)), (e[r] = t);
      }
      _t.ngInherit = !0;
      const Rf = "__ngSimpleChanges__";
      function Nf(e) {
        return e[Rf] || null;
      }
      let el;
      function fe(e) {
        return !!e.listen;
      }
      const kf = {
        createRenderer: (e, t) =>
          (function tl() {
            return void 0 !== el
              ? el
              : "undefined" != typeof document
              ? document
              : void 0;
          })(),
      };
      function Ce(e) {
        for (; Array.isArray(e); ) e = e[0];
        return e;
      }
      function Ui(e, t) {
        return Ce(t[e]);
      }
      function Dt(e, t) {
        return Ce(t[e.index]);
      }
      function nl(e, t) {
        return e.data[t];
      }
      function st(e, t) {
        const n = t[e];
        return Ut(n) ? n : n[0];
      }
      function rl(e) {
        return 128 == (128 & e[2]);
      }
      function bn(e, t) {
        return null == t ? null : e[t];
      }
      function Lf(e) {
        e[18] = 0;
      }
      function ol(e, t) {
        e[5] += t;
        let n = e,
          r = e[3];
        for (
          ;
          null !== r && ((1 === t && 1 === n[5]) || (-1 === t && 0 === n[5]));

        )
          (r[5] += t), (n = r), (r = r[3]);
      }
      const N = { lFrame: Wf(null), bindingsEnabled: !0 };
      function jf() {
        return N.bindingsEnabled;
      }
      function v() {
        return N.lFrame.lView;
      }
      function Z() {
        return N.lFrame.tView;
      }
      function il(e) {
        return (N.lFrame.contextLView = e), e[8];
      }
      function Ae() {
        let e = Hf();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function Hf() {
        return N.lFrame.currentTNode;
      }
      function $t(e, t) {
        const n = N.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function sl() {
        return N.lFrame.isParent;
      }
      function yr() {
        return N.lFrame.bindingIndex++;
      }
      function Ow(e, t) {
        const n = N.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), ll(t);
      }
      function ll(e) {
        N.lFrame.currentDirectiveIndex = e;
      }
      function cl(e) {
        N.lFrame.currentQueryIndex = e;
      }
      function Fw(e) {
        const t = e[1];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[6] : null;
      }
      function zf(e, t, n) {
        if (n & P.SkipSelf) {
          let o = t,
            i = e;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              n & P.Host ||
              ((o = Fw(i)), null === o || ((i = i[15]), 10 & o.type)));

          );
          if (null === o) return !1;
          (t = o), (e = i);
        }
        const r = (N.lFrame = qf());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function Gi(e) {
        const t = qf(),
          n = e[1];
        (N.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function qf() {
        const e = N.lFrame,
          t = null === e ? null : e.child;
        return null === t ? Wf(e) : t;
      }
      function Wf(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function Qf() {
        const e = N.lFrame;
        return (
          (N.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const Zf = Qf;
      function zi() {
        const e = Qf();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function qe() {
        return N.lFrame.selectedIndex;
      }
      function En(e) {
        N.lFrame.selectedIndex = e;
      }
      function he() {
        const e = N.lFrame;
        return nl(e.tView, e.selectedIndex);
      }
      function qi(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const i = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: u,
              ngOnDestroy: c,
            } = i;
          s && (e.contentHooks || (e.contentHooks = [])).push(-n, s),
            a &&
              ((e.contentHooks || (e.contentHooks = [])).push(n, a),
              (e.contentCheckHooks || (e.contentCheckHooks = [])).push(n, a)),
            l && (e.viewHooks || (e.viewHooks = [])).push(-n, l),
            u &&
              ((e.viewHooks || (e.viewHooks = [])).push(n, u),
              (e.viewCheckHooks || (e.viewCheckHooks = [])).push(n, u)),
            null != c && (e.destroyHooks || (e.destroyHooks = [])).push(n, c);
        }
      }
      function Wi(e, t, n) {
        Kf(e, t, 3, n);
      }
      function Qi(e, t, n, r) {
        (3 & e[2]) === n && Kf(e, t, n, r);
      }
      function dl(e, t) {
        let n = e[2];
        (3 & n) === t && ((n &= 2047), (n += 1), (e[2] = n));
      }
      function Kf(e, t, n, r) {
        const i = null != r ? r : -1,
          s = t.length - 1;
        let a = 0;
        for (let l = void 0 !== r ? 65535 & e[18] : 0; l < s; l++)
          if ("number" == typeof t[l + 1]) {
            if (((a = t[l]), null != r && a >= r)) break;
          } else
            t[l] < 0 && (e[18] += 65536),
              (a < i || -1 == i) &&
                (Uw(e, n, t, l), (e[18] = (4294901760 & e[18]) + l + 2)),
              l++;
      }
      function Uw(e, t, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = e[o ? -n[r] : n[r]];
        if (o) {
          if (e[2] >> 11 < e[18] >> 16 && (3 & e[2]) === t) {
            e[2] += 2048;
            try {
              i.call(a);
            } finally {
            }
          }
        } else
          try {
            i.call(a);
          } finally {
          }
      }
      class vo {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function Zi(e, t, n) {
        const r = fe(e);
        let o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if ("number" == typeof i) {
            if (0 !== i) break;
            o++;
            const s = n[o++],
              a = n[o++],
              l = n[o++];
            r ? e.setAttribute(t, a, l, s) : t.setAttributeNS(s, a, l);
          } else {
            const s = i,
              a = n[++o];
            hl(s)
              ? r && e.setProperty(t, s, a)
              : r
              ? e.setAttribute(t, s, a)
              : t.setAttribute(s, a),
              o++;
          }
        }
        return o;
      }
      function Jf(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function hl(e) {
        return 64 === e.charCodeAt(0);
      }
      function Ki(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const o = t[r];
              "number" == typeof o
                ? (n = o)
                : 0 === n ||
                  Yf(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function Yf(e, t, n, r, o) {
        let i = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; i < e.length; ) {
            const a = e[i++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const a = e[i];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== o && (e[i + 1] = o));
            if (r === e[i + 1]) return void (e[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (e.splice(s, 0, t), (i = s + 1)),
          e.splice(i++, 0, n),
          null !== r && e.splice(i++, 0, r),
          null !== o && e.splice(i++, 0, o);
      }
      function Xf(e) {
        return -1 !== e;
      }
      function vr(e) {
        return 32767 & e;
      }
      function _r(e, t) {
        let n = (function Ww(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[15]), n--;
        return r;
      }
      let pl = !0;
      function Ji(e) {
        const t = pl;
        return (pl = e), t;
      }
      let Qw = 0;
      function Co(e, t) {
        const n = ml(e, t);
        if (-1 !== n) return n;
        const r = t[1];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          gl(r.data, e),
          gl(t, null),
          gl(r.blueprint, null));
        const o = Yi(e, t),
          i = e.injectorIndex;
        if (Xf(o)) {
          const s = vr(o),
            a = _r(o, t),
            l = a[1].data;
          for (let u = 0; u < 8; u++) t[i + u] = a[s + u] | l[s + u];
        }
        return (t[i + 8] = o), i;
      }
      function gl(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function ml(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function Yi(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          o = t;
        for (; null !== o; ) {
          const i = o[1],
            s = i.type;
          if (((r = 2 === s ? i.declTNode : 1 === s ? o[6] : null), null === r))
            return -1;
          if ((n++, (o = o[15]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return -1;
      }
      function Xi(e, t, n) {
        !(function Zw(e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(ho) && (r = n[ho]),
            null == r && (r = n[ho] = Qw++);
          const o = 255 & r;
          t.data[e + (o >> 5)] |= 1 << o;
        })(e, t, n);
      }
      function nh(e, t, n) {
        if (n & P.Optional) return e;
        Ri(t, "NodeInjector");
      }
      function rh(e, t, n, r) {
        if (
          (n & P.Optional && void 0 === r && (r = null),
          0 == (n & (P.Self | P.Host)))
        ) {
          const o = e[9],
            i = Cn(void 0);
          try {
            return o ? o.get(t, r, n & P.Optional) : Af(t, r, n & P.Optional);
          } finally {
            Cn(i);
          }
        }
        return nh(r, t, n);
      }
      function oh(e, t, n, r = P.Default, o) {
        if (null !== e) {
          const i = (function Xw(e) {
            if ("string" == typeof e) return e.charCodeAt(0) || 0;
            const t = e.hasOwnProperty(ho) ? e[ho] : void 0;
            return "number" == typeof t ? (t >= 0 ? 255 & t : Jw) : t;
          })(n);
          if ("function" == typeof i) {
            if (!zf(t, e, r)) return r & P.Host ? nh(o, n, r) : rh(t, n, r, o);
            try {
              const s = i(r);
              if (null != s || r & P.Optional) return s;
              Ri(n);
            } finally {
              Zf();
            }
          } else if ("number" == typeof i) {
            let s = null,
              a = ml(e, t),
              l = -1,
              u = r & P.Host ? t[16][6] : null;
            for (
              (-1 === a || r & P.SkipSelf) &&
              ((l = -1 === a ? Yi(e, t) : t[a + 8]),
              -1 !== l && ah(r, !1)
                ? ((s = t[1]), (a = vr(l)), (t = _r(l, t)))
                : (a = -1));
              -1 !== a;

            ) {
              const c = t[1];
              if (sh(i, a, c.data)) {
                const d = Yw(a, t, n, s, r, u);
                if (d !== ih) return d;
              }
              (l = t[a + 8]),
                -1 !== l && ah(r, t[1].data[a + 8] === u) && sh(i, a, t)
                  ? ((s = c), (a = vr(l)), (t = _r(l, t)))
                  : (a = -1);
            }
          }
        }
        return rh(t, n, r, o);
      }
      const ih = {};
      function Jw() {
        return new Cr(Ae(), v());
      }
      function Yw(e, t, n, r, o, i) {
        const s = t[1],
          a = s.data[e + 8],
          c = (function es(e, t, n, r, o) {
            const i = e.providerIndexes,
              s = t.data,
              a = 1048575 & i,
              l = e.directiveStart,
              c = i >> 20,
              f = o ? a + c : e.directiveEnd;
            for (let h = r ? a : a + c; h < f; h++) {
              const p = s[h];
              if ((h < l && n === p) || (h >= l && p.type === n)) return h;
            }
            if (o) {
              const h = s[l];
              if (h && Tt(h) && h.type === n) return l;
            }
            return null;
          })(
            a,
            s,
            n,
            null == r ? ji(a) && pl : r != s && 0 != (3 & a.type),
            o & P.Host && i === a
          );
        return null !== c ? Do(t, s, c, a) : ih;
      }
      function Do(e, t, n, r) {
        let o = e[n];
        const i = t.data;
        if (
          (function $w(e) {
            return e instanceof vo;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function zD(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new Q(
                -200,
                `Circular dependency in DI detected for ${e}${n}`
              );
            })(ke(i[n]));
          const a = Ji(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? Cn(s.injectImpl) : null;
          zf(e, r, P.Default);
          try {
            (o = e[n] = s.factory(void 0, i, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function Hw(e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = t.type.prototype;
                  if (r) {
                    const s = Ff(t);
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(e, s),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, s);
                  }
                  o &&
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(0 - e, o),
                    i &&
                      ((n.preOrderHooks || (n.preOrderHooks = [])).push(e, i),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, i));
                })(n, i[n], t);
          } finally {
            null !== l && Cn(l), Ji(a), (s.resolving = !1), Zf();
          }
        }
        return o;
      }
      function sh(e, t, n) {
        return !!(n[t + (e >> 5)] & (1 << e));
      }
      function ah(e, t) {
        return !(e & P.Self || (e & P.Host && t));
      }
      class Cr {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return oh(this._tNode, this._lView, t, r, n);
        }
      }
      function He(e) {
        return Dn(() => {
          const t = e.prototype.constructor,
            n = t[an] || yl(t),
            r = Object.prototype;
          let o = Object.getPrototypeOf(e.prototype).constructor;
          for (; o && o !== r; ) {
            const i = o[an] || yl(o);
            if (i && i !== n) return i;
            o = Object.getPrototypeOf(o);
          }
          return (i) => new i();
        });
      }
      function yl(e) {
        return wf(e)
          ? () => {
              const t = yl(B(e));
              return t && t();
            }
          : qn(e);
      }
      function wo(e) {
        return (function Kw(e, t) {
          if ("class" === t) return e.classes;
          if ("style" === t) return e.styles;
          const n = e.attrs;
          if (n) {
            const r = n.length;
            let o = 0;
            for (; o < r; ) {
              const i = n[o];
              if (Jf(i)) break;
              if (0 === i) o += 2;
              else if ("number" == typeof i)
                for (o++; o < r && "string" == typeof n[o]; ) o++;
              else {
                if (i === t) return n[o + 1];
                o += 2;
              }
            }
          }
          return null;
        })(Ae(), e);
      }
      const wr = "__parameters__";
      function Er(e, t, n) {
        return Dn(() => {
          const r = (function vl(e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const o in r) this[o] = r[o];
              }
            };
          })(t);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(l, u, c) {
              const d = l.hasOwnProperty(wr)
                ? l[wr]
                : Object.defineProperty(l, wr, { value: [] })[wr];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), l;
            }
          }
          return (
            n && (o.prototype = Object.create(n.prototype)),
            (o.prototype.ngMetadataName = e),
            (o.annotationCls = o),
            o
          );
        });
      }
      class H {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = R({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const tb = new H("AnalyzeForEntryComponents");
      function Gt(e, t) {
        e.forEach((n) => (Array.isArray(n) ? Gt(n, t) : t(n)));
      }
      function uh(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function ts(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      function at(e, t, n) {
        let r = Mr(e, t);
        return (
          r >= 0
            ? (e[1 | r] = n)
            : ((r = ~r),
              (function ob(e, t, n, r) {
                let o = e.length;
                if (o == t) e.push(n, r);
                else if (1 === o) e.push(r, e[0]), (e[0] = n);
                else {
                  for (o--, e.push(e[o - 1], e[o]); o > t; )
                    (e[o] = e[o - 2]), o--;
                  (e[t] = n), (e[t + 1] = r);
                }
              })(e, r, t, n)),
          r
        );
      }
      function Cl(e, t) {
        const n = Mr(e, t);
        if (n >= 0) return e[1 | n];
      }
      function Mr(e, t) {
        return (function fh(e, t, n) {
          let r = 0,
            o = e.length >> n;
          for (; o !== r; ) {
            const i = r + ((o - r) >> 1),
              s = e[i << n];
            if (t === s) return i << n;
            s > t ? (o = i) : (r = i + 1);
          }
          return ~(o << n);
        })(e, t, 1);
      }
      const Ao = {},
        wl = "__NG_DI_FLAG__",
        rs = "ngTempTokenPath",
        db = /\n/gm,
        ph = "__source",
        hb = ne({ provide: String, useValue: ne });
      let So;
      function gh(e) {
        const t = So;
        return (So = e), t;
      }
      function pb(e, t = P.Default) {
        if (void 0 === So) throw new Q(203, "");
        return null === So
          ? Af(e, void 0, t)
          : So.get(e, t & P.Optional ? null : void 0, t);
      }
      function S(e, t = P.Default) {
        return (
          (function YD() {
            return Ga;
          })() || pb
        )(B(e), t);
      }
      const gb = S;
      function bl(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = B(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new Q(900, "");
            let o,
              i = P.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                l = mb(a);
              "number" == typeof l
                ? -1 === l
                  ? (o = a.token)
                  : (i |= l)
                : (o = a);
            }
            t.push(S(o, i));
          } else t.push(S(r));
        }
        return t;
      }
      function Io(e, t) {
        return (e[wl] = t), (e.prototype[wl] = t), e;
      }
      function mb(e) {
        return e[wl];
      }
      const os = Io(
          Er("Inject", (e) => ({ token: e })),
          -1
        ),
        An = Io(Er("Optional"), 8),
        xo = Io(Er("SkipSelf"), 4);
      class Eh {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      function Sn(e) {
        return e instanceof Eh ? e.changingThisBreaksApplicationSecurity : e;
      }
      const Lb =
          /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi,
        Bb =
          /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;
      var De = (() => (
        ((De = De || {})[(De.NONE = 0)] = "NONE"),
        (De[(De.HTML = 1)] = "HTML"),
        (De[(De.STYLE = 2)] = "STYLE"),
        (De[(De.SCRIPT = 3)] = "SCRIPT"),
        (De[(De.URL = 4)] = "URL"),
        (De[(De.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        De
      ))();
      function cs(e) {
        const t = (function Fo() {
          const e = v();
          return e && e[12];
        })();
        return t
          ? t.sanitize(De.URL, e) || ""
          : (function Oo(e, t) {
              const n = (function Rb(e) {
                return (e instanceof Eh && e.getTypeName()) || null;
              })(e);
              if (null != n && n !== t) {
                if ("ResourceURL" === n && "URL" === t) return !0;
                throw new Error(
                  `Required a safe ${t}, got a ${n} (see https://g.co/ng/security#xss)`
                );
              }
              return n === t;
            })(e, "URL")
          ? Sn(e)
          : (function ls(e) {
              return (e = String(e)).match(Lb) || e.match(Bb)
                ? e
                : "unsafe:" + e;
            })(F(e));
      }
      const Rh = "__ngContext__";
      function Ue(e, t) {
        e[Rh] = t;
      }
      function Pl(e) {
        const t = (function Ro(e) {
          return e[Rh] || null;
        })(e);
        return t ? (Array.isArray(t) ? t : t.lView) : null;
      }
      function Rl(e) {
        return e.ngOriginalError;
      }
      function lE(e, ...t) {
        e.error(...t);
      }
      class No {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t),
            r = (function aE(e) {
              return (e && e.ngErrorLogger) || lE;
            })(t);
          r(this._console, "ERROR", t),
            n && r(this._console, "ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && Rl(t);
          for (; n && Rl(n); ) n = Rl(n);
          return n || null;
        }
      }
      const vE = (() =>
        (
          ("undefined" != typeof requestAnimationFrame &&
            requestAnimationFrame) ||
          setTimeout
        ).bind(te))();
      function qt(e) {
        return e instanceof Function ? e() : e;
      }
      var lt = (() => (
        ((lt = lt || {})[(lt.Important = 1)] = "Important"),
        (lt[(lt.DashCase = 2)] = "DashCase"),
        lt
      ))();
      function kl(e, t) {
        return undefined(e, t);
      }
      function ko(e) {
        const t = e[3];
        return xt(t) ? t[3] : t;
      }
      function Vl(e) {
        return $h(e[13]);
      }
      function Ll(e) {
        return $h(e[4]);
      }
      function $h(e) {
        for (; null !== e && !xt(e); ) e = e[4];
        return e;
      }
      function xr(e, t, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          xt(r) ? (i = r) : Ut(r) && ((s = !0), (r = r[0]));
          const a = Ce(r);
          0 === e && null !== n
            ? null == o
              ? Zh(t, n, a)
              : Wn(t, n, a, o || null, !0)
            : 1 === e && null !== n
            ? Wn(t, n, a, o || null, !0)
            : 2 === e
            ? (function np(e, t, n) {
                const r = ds(e, t);
                r &&
                  (function PE(e, t, n, r) {
                    fe(e) ? e.removeChild(t, n, r) : t.removeChild(n);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != i &&
              (function NE(e, t, n, r, o) {
                const i = n[7];
                i !== Ce(n) && xr(t, e, r, i, o);
                for (let a = 10; a < n.length; a++) {
                  const l = n[a];
                  Vo(l[1], l, e, t, r, i);
                }
              })(t, e, i, n, o);
        }
      }
      function jl(e, t, n) {
        if (fe(e)) return e.createElement(t, n);
        {
          const r =
            null !== n
              ? (function vw(e) {
                  const t = e.toLowerCase();
                  return "svg" === t
                    ? "http://www.w3.org/2000/svg"
                    : "math" === t
                    ? "http://www.w3.org/1998/MathML/"
                    : null;
                })(n)
              : null;
          return null === r ? e.createElement(t) : e.createElementNS(r, t);
        }
      }
      function zh(e, t) {
        const n = e[9],
          r = n.indexOf(t),
          o = t[3];
        1024 & t[2] && ((t[2] &= -1025), ol(o, -1)), n.splice(r, 1);
      }
      function Hl(e, t) {
        if (e.length <= 10) return;
        const n = 10 + t,
          r = e[n];
        if (r) {
          const o = r[17];
          null !== o && o !== e && zh(o, r), t > 0 && (e[n - 1][4] = r[4]);
          const i = ts(e, 10 + t);
          !(function EE(e, t) {
            Vo(e, t, t[j], 2, null, null), (t[0] = null), (t[6] = null);
          })(r[1], r);
          const s = i[19];
          null !== s && s.detachView(i[1]),
            (r[3] = null),
            (r[4] = null),
            (r[2] &= -129);
        }
        return r;
      }
      function qh(e, t) {
        if (!(256 & t[2])) {
          const n = t[j];
          fe(n) && n.destroyNode && Vo(e, t, n, 3, null, null),
            (function SE(e) {
              let t = e[13];
              if (!t) return Ul(e[1], e);
              for (; t; ) {
                let n = null;
                if (Ut(t)) n = t[13];
                else {
                  const r = t[10];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[4] && t !== e; )
                    Ut(t) && Ul(t[1], t), (t = t[3]);
                  null === t && (t = e), Ut(t) && Ul(t[1], t), (n = t && t[4]);
                }
                t = n;
              }
            })(t);
        }
      }
      function Ul(e, t) {
        if (!(256 & t[2])) {
          (t[2] &= -129),
            (t[2] |= 256),
            (function OE(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r]];
                  if (!(o instanceof vo)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          l = i[s + 1];
                        try {
                          l.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        i.call(o);
                      } finally {
                      }
                  }
                }
            })(e, t),
            (function TE(e, t) {
              const n = e.cleanup,
                r = t[7];
              let o = -1;
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 1],
                      a = "function" == typeof s ? s(t) : Ce(t[s]),
                      l = r[(o = n[i + 2])],
                      u = n[i + 3];
                    "boolean" == typeof u
                      ? a.removeEventListener(n[i], l, u)
                      : u >= 0
                      ? r[(o = u)]()
                      : r[(o = -u)].unsubscribe(),
                      (i += 2);
                  } else {
                    const s = r[(o = n[i + 1])];
                    n[i].call(s);
                  }
              if (null !== r) {
                for (let i = o + 1; i < r.length; i++) r[i]();
                t[7] = null;
              }
            })(e, t),
            1 === t[1].type && fe(t[j]) && t[j].destroy();
          const n = t[17];
          if (null !== n && xt(t[3])) {
            n !== t[3] && zh(n, t);
            const r = t[19];
            null !== r && r.detachView(e);
          }
        }
      }
      function Wh(e, t, n) {
        return (function Qh(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[0];
          if (2 & r.flags) {
            const o = e.data[r.directiveStart].encapsulation;
            if (o === Ht.None || o === Ht.Emulated) return null;
          }
          return Dt(r, n);
        })(e, t.parent, n);
      }
      function Wn(e, t, n, r, o) {
        fe(e) ? e.insertBefore(t, n, r, o) : t.insertBefore(n, r, o);
      }
      function Zh(e, t, n) {
        fe(e) ? e.appendChild(t, n) : t.appendChild(n);
      }
      function Kh(e, t, n, r, o) {
        null !== r ? Wn(e, t, n, r, o) : Zh(e, t, n);
      }
      function ds(e, t) {
        return fe(e) ? e.parentNode(t) : t.parentNode;
      }
      let Xh = function Yh(e, t, n) {
        return 40 & e.type ? Dt(e, n) : null;
      };
      function fs(e, t, n, r) {
        const o = Wh(e, r, t),
          i = t[j],
          a = (function Jh(e, t, n) {
            return Xh(e, t, n);
          })(r.parent || t[6], r, t);
        if (null != o)
          if (Array.isArray(n))
            for (let l = 0; l < n.length; l++) Kh(i, o, n[l], a, !1);
          else Kh(i, o, n, a, !1);
      }
      function hs(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return Dt(t, e);
          if (4 & n) return Gl(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return hs(e, r);
            {
              const o = e[t.index];
              return xt(o) ? Gl(-1, o) : Ce(o);
            }
          }
          if (32 & n) return kl(t, e)() || Ce(e[t.index]);
          {
            const r = tp(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : hs(ko(e[16]), r)
              : hs(e, t.next);
          }
        }
        return null;
      }
      function tp(e, t) {
        return null !== t ? e[16][6].projection[t.projection] : null;
      }
      function Gl(e, t) {
        const n = 10 + e + 1;
        if (n < t.length) {
          const r = t[n],
            o = r[1].firstChild;
          if (null !== o) return hs(r, o);
        }
        return t[7];
      }
      function zl(e, t, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            l = n.type;
          if (
            (s && 0 === t && (a && Ue(Ce(a), r), (n.flags |= 4)),
            64 != (64 & n.flags))
          )
            if (8 & l) zl(e, t, n.child, r, o, i, !1), xr(t, e, o, a, i);
            else if (32 & l) {
              const u = kl(n, r);
              let c;
              for (; (c = u()); ) xr(t, e, o, c, i);
              xr(t, e, o, a, i);
            } else 16 & l ? rp(e, t, r, n, o, i) : xr(t, e, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function Vo(e, t, n, r, o, i) {
        zl(n, r, e.firstChild, t, o, i, !1);
      }
      function rp(e, t, n, r, o, i) {
        const s = n[16],
          l = s[6].projection[r.projection];
        if (Array.isArray(l))
          for (let u = 0; u < l.length; u++) xr(t, e, o, l[u], i);
        else zl(e, t, l, s[3], o, i, !0);
      }
      function op(e, t, n) {
        fe(e) ? e.setAttribute(t, "style", n) : (t.style.cssText = n);
      }
      function ql(e, t, n) {
        fe(e)
          ? "" === n
            ? e.removeAttribute(t, "class")
            : e.setAttribute(t, "class", n)
          : (t.className = n);
      }
      function ip(e, t, n) {
        let r = e.length;
        for (;;) {
          const o = e.indexOf(t, n);
          if (-1 === o) return o;
          if (0 === o || e.charCodeAt(o - 1) <= 32) {
            const i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
          }
          n = o + 1;
        }
      }
      const sp = "ng-template";
      function VE(e, t, n) {
        let r = 0;
        for (; r < e.length; ) {
          let o = e[r++];
          if (n && "class" === o) {
            if (((o = e[r]), -1 !== ip(o.toLowerCase(), t, 0))) return !0;
          } else if (1 === o) {
            for (; r < e.length && "string" == typeof (o = e[r++]); )
              if (o.toLowerCase() === t) return !0;
            return !1;
          }
        }
        return !1;
      }
      function ap(e) {
        return 4 === e.type && e.value !== sp;
      }
      function LE(e, t, n) {
        return t === (4 !== e.type || n ? e.value : sp);
      }
      function BE(e, t, n) {
        let r = 4;
        const o = e.attrs || [],
          i = (function UE(e) {
            for (let t = 0; t < e.length; t++) if (Jf(e[t])) return t;
            return e.length;
          })(o);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const l = t[a];
          if ("number" != typeof l) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== l && !LE(e, l, n)) || ("" === l && 1 === t.length))
                ) {
                  if (Ot(r)) return !1;
                  s = !0;
                }
              } else {
                const u = 8 & r ? l : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!VE(e.attrs, u, n)) {
                    if (Ot(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = jE(8 & r ? "class" : l, o, ap(e), n);
                if (-1 === d) {
                  if (Ot(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== u) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== ip(h, u, 0)) || (2 & r && u !== f)) {
                    if (Ot(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !Ot(r) && !Ot(l)) return !1;
            if (s && Ot(l)) continue;
            (s = !1), (r = l | (1 & r));
          }
        }
        return Ot(r) || s;
      }
      function Ot(e) {
        return 0 == (1 & e);
      }
      function jE(e, t, n, r) {
        if (null === t) return -1;
        let o = 0;
        if (r || !n) {
          let i = !1;
          for (; o < t.length; ) {
            const s = t[o];
            if (s === e) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++o];
                for (; "string" == typeof a; ) a = t[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function $E(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function lp(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (BE(e, t[r], n)) return !0;
        return !1;
      }
      function up(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function zE(e) {
        let t = e[0],
          n = 1,
          r = 2,
          o = "",
          i = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !Ot(s) && ((t += up(i, o)), (o = "")),
              (r = s),
              (i = i || !Ot(r));
          n++;
        }
        return "" !== o && (t += up(i, o)), t;
      }
      const k = {};
      function I(e) {
        cp(Z(), v(), qe() + e, !1);
      }
      function cp(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[2])) {
            const i = e.preOrderCheckHooks;
            null !== i && Wi(t, i, n);
          } else {
            const i = e.preOrderHooks;
            null !== i && Qi(t, i, 0, n);
          }
        En(n);
      }
      function ps(e, t) {
        return (e << 17) | (t << 2);
      }
      function Pt(e) {
        return (e >> 17) & 32767;
      }
      function Wl(e) {
        return 2 | e;
      }
      function cn(e) {
        return (131068 & e) >> 2;
      }
      function Ql(e, t) {
        return (-131069 & e) | (t << 2);
      }
      function Zl(e) {
        return 1 | e;
      }
      function Dp(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const o = n[r],
              i = n[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              cl(o), s.contentQueries(2, t[i], i);
            }
          }
      }
      function Lo(e, t, n, r, o, i, s, a, l, u) {
        const c = t.blueprint.slice();
        return (
          (c[0] = o),
          (c[2] = 140 | r),
          Lf(c),
          (c[3] = c[15] = e),
          (c[8] = n),
          (c[10] = s || (e && e[10])),
          (c[j] = a || (e && e[j])),
          (c[12] = l || (e && e[12]) || null),
          (c[9] = u || (e && e[9]) || null),
          (c[6] = i),
          (c[16] = 2 == t.type ? e[16] : c),
          c
        );
      }
      function Tr(e, t, n, r, o) {
        let i = e.data[t];
        if (null === i)
          (i = (function ou(e, t, n, r, o) {
            const i = Hf(),
              s = sl(),
              l = (e.data[t] = (function c0(e, t, n, r, o, i) {
                return {
                  type: n,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: t ? t.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: o,
                  attrs: i,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  projectionNext: null,
                  child: null,
                  parent: t,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? i : i && i.parent, n, t, r, o));
            return (
              null === e.firstChild && (e.firstChild = l),
              null !== i &&
                (s
                  ? null == i.child && null !== l.parent && (i.child = l)
                  : null === i.next && (i.next = l)),
              l
            );
          })(e, t, n, r, o)),
            (function Tw() {
              return N.lFrame.inI18n;
            })() && (i.flags |= 64);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function yo() {
            const e = N.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return $t(i, !0), i;
      }
      function Or(e, t, n, r) {
        if (0 === n) return -1;
        const o = t.length;
        for (let i = 0; i < n; i++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function Bo(e, t, n) {
        Gi(t);
        try {
          const r = e.viewQuery;
          null !== r && hu(1, r, n);
          const o = e.template;
          null !== o && wp(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && Dp(e, t),
            e.staticViewQueries && hu(2, e.viewQuery, n);
          const i = e.components;
          null !== i &&
            (function a0(e, t) {
              for (let n = 0; n < t.length; n++) I0(e, t[n]);
            })(t, i);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[2] &= -5), zi();
        }
      }
      function Pr(e, t, n, r) {
        const o = t[2];
        if (256 != (256 & o)) {
          Gi(t);
          try {
            Lf(t),
              (function Uf(e) {
                return (N.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && wp(e, t, n, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const u = e.preOrderCheckHooks;
              null !== u && Wi(t, u, null);
            } else {
              const u = e.preOrderHooks;
              null !== u && Qi(t, u, 0, null), dl(t, 0);
            }
            if (
              ((function A0(e) {
                for (let t = Vl(e); null !== t; t = Ll(t)) {
                  if (!t[2]) continue;
                  const n = t[9];
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r],
                      i = o[3];
                    0 == (1024 & o[2]) && ol(i, 1), (o[2] |= 1024);
                  }
                }
              })(t),
              (function M0(e) {
                for (let t = Vl(e); null !== t; t = Ll(t))
                  for (let n = 10; n < t.length; n++) {
                    const r = t[n],
                      o = r[1];
                    rl(r) && Pr(o, r, o.template, r[8]);
                  }
              })(t),
              null !== e.contentQueries && Dp(e, t),
              s)
            ) {
              const u = e.contentCheckHooks;
              null !== u && Wi(t, u);
            } else {
              const u = e.contentHooks;
              null !== u && Qi(t, u, 1), dl(t, 1);
            }
            !(function o0(e, t) {
              const n = e.hostBindingOpCodes;
              if (null !== n)
                try {
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r];
                    if (o < 0) En(~o);
                    else {
                      const i = o,
                        s = n[++r],
                        a = n[++r];
                      Ow(s, i), a(2, t[i]);
                    }
                  }
                } finally {
                  En(-1);
                }
            })(e, t);
            const a = e.components;
            null !== a &&
              (function s0(e, t) {
                for (let n = 0; n < t.length; n++) S0(e, t[n]);
              })(t, a);
            const l = e.viewQuery;
            if ((null !== l && hu(2, l, r), s)) {
              const u = e.viewCheckHooks;
              null !== u && Wi(t, u);
            } else {
              const u = e.viewHooks;
              null !== u && Qi(t, u, 2), dl(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (t[2] &= -73),
              1024 & t[2] && ((t[2] &= -1025), ol(t[3], -1));
          } finally {
            zi();
          }
        }
      }
      function l0(e, t, n, r) {
        const o = t[10],
          s = (function Vf(e) {
            return 4 == (4 & e[2]);
          })(t);
        try {
          !s && o.begin && o.begin(), s && Bo(e, t, r), Pr(e, t, n, r);
        } finally {
          !s && o.end && o.end();
        }
      }
      function wp(e, t, n, r, o) {
        const i = qe(),
          s = 2 & r;
        try {
          En(-1), s && t.length > 20 && cp(e, t, 20, !1), n(r, o);
        } finally {
          En(i);
        }
      }
      function iu(e, t, n) {
        !jf() ||
          ((function y0(e, t, n, r) {
            const o = n.directiveStart,
              i = n.directiveEnd;
            e.firstCreatePass || Co(n, t), Ue(r, t);
            const s = n.initialInputs;
            for (let a = o; a < i; a++) {
              const l = e.data[a],
                u = Tt(l);
              u && w0(t, n, l);
              const c = Do(t, e, a, n);
              Ue(c, t),
                null !== s && b0(0, a - o, c, l, 0, s),
                u && (st(n.index, t)[8] = c);
            }
          })(e, t, n, Dt(n, t)),
          128 == (128 & n.flags) &&
            (function v0(e, t, n) {
              const r = n.directiveStart,
                o = n.directiveEnd,
                s = n.index,
                a = (function Pw() {
                  return N.lFrame.currentDirectiveIndex;
                })();
              try {
                En(s);
                for (let l = r; l < o; l++) {
                  const u = e.data[l],
                    c = t[l];
                  ll(l),
                    (null !== u.hostBindings ||
                      0 !== u.hostVars ||
                      null !== u.hostAttrs) &&
                      Op(u, c);
                }
              } finally {
                En(-1), ll(a);
              }
            })(e, t, n));
      }
      function su(e, t, n = Dt) {
        const r = t.localNames;
        if (null !== r) {
          let o = t.index + 1;
          for (let i = 0; i < r.length; i += 2) {
            const s = r[i + 1],
              a = -1 === s ? n(t, e) : e[s];
            e[o++] = a;
          }
        }
      }
      function Ep(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = ys(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts
            ))
          : t;
      }
      function ys(e, t, n, r, o, i, s, a, l, u) {
        const c = 20 + r,
          d = c + o,
          f = (function u0(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : k);
            return n;
          })(c, d),
          h = "function" == typeof u ? u() : u;
        return (f[1] = {
          type: e,
          blueprint: f,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: f.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: l,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function Ip(e, t, n) {
        for (let r in e)
          if (e.hasOwnProperty(r)) {
            const o = e[r];
            (n = null === n ? {} : n).hasOwnProperty(r)
              ? n[r].push(t, o)
              : (n[r] = [t, o]);
          }
        return n;
      }
      function au(e, t, n, r) {
        let o = !1;
        if (jf()) {
          const i = (function _0(e, t, n) {
              const r = e.directiveRegistry;
              let o = null;
              if (r)
                for (let i = 0; i < r.length; i++) {
                  const s = r[i];
                  lp(n, s.selectors, !1) &&
                    (o || (o = []),
                    Xi(Co(n, t), e, s.type),
                    Tt(s) ? (Pp(e, n), o.unshift(s)) : o.push(s));
                }
              return o;
            })(e, t, n),
            s = null === r ? null : { "": -1 };
          if (null !== i) {
            (o = !0), Fp(n, e.data.length, i.length);
            for (let c = 0; c < i.length; c++) {
              const d = i[c];
              d.providersResolver && d.providersResolver(d);
            }
            let a = !1,
              l = !1,
              u = Or(e, t, i.length, null);
            for (let c = 0; c < i.length; c++) {
              const d = i[c];
              (n.mergedAttrs = Ki(n.mergedAttrs, d.hostAttrs)),
                Rp(e, n, t, u, d),
                D0(u, d, s),
                null !== d.contentQueries && (n.flags |= 8),
                (null !== d.hostBindings ||
                  null !== d.hostAttrs ||
                  0 !== d.hostVars) &&
                  (n.flags |= 128);
              const f = d.type.prototype;
              !a &&
                (f.ngOnChanges || f.ngOnInit || f.ngDoCheck) &&
                ((e.preOrderHooks || (e.preOrderHooks = [])).push(n.index),
                (a = !0)),
                !l &&
                  (f.ngOnChanges || f.ngDoCheck) &&
                  ((e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(
                    n.index
                  ),
                  (l = !0)),
                u++;
            }
            !(function d0(e, t) {
              const r = t.directiveEnd,
                o = e.data,
                i = t.attrs,
                s = [];
              let a = null,
                l = null;
              for (let u = t.directiveStart; u < r; u++) {
                const c = o[u],
                  d = c.inputs,
                  f = null === i || ap(t) ? null : E0(d, i);
                s.push(f), (a = Ip(d, u, a)), (l = Ip(c.outputs, u, l));
              }
              null !== a &&
                (a.hasOwnProperty("class") && (t.flags |= 16),
                a.hasOwnProperty("style") && (t.flags |= 32)),
                (t.initialInputs = s),
                (t.inputs = a),
                (t.outputs = l);
            })(e, n);
          }
          s &&
            (function C0(e, t, n) {
              if (t) {
                const r = (e.localNames = []);
                for (let o = 0; o < t.length; o += 2) {
                  const i = n[t[o + 1]];
                  if (null == i) throw new Q(-301, !1);
                  r.push(t[o], i);
                }
              }
            })(n, r, s);
        }
        return (n.mergedAttrs = Ki(n.mergedAttrs, n.attrs)), o;
      }
      function Tp(e, t, n, r, o, i) {
        const s = i.hostBindings;
        if (s) {
          let a = e.hostBindingOpCodes;
          null === a && (a = e.hostBindingOpCodes = []);
          const l = ~t.index;
          (function m0(e) {
            let t = e.length;
            for (; t > 0; ) {
              const n = e[--t];
              if ("number" == typeof n && n < 0) return n;
            }
            return 0;
          })(a) != l && a.push(l),
            a.push(r, o, s);
        }
      }
      function Op(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function Pp(e, t) {
        (t.flags |= 2), (e.components || (e.components = [])).push(t.index);
      }
      function D0(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          Tt(t) && (n[""] = e);
        }
      }
      function Fp(e, t, n) {
        (e.flags |= 1),
          (e.directiveStart = t),
          (e.directiveEnd = t + n),
          (e.providerIndexes = t);
      }
      function Rp(e, t, n, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = qn(o.type)),
          s = new vo(i, Tt(o), null);
        (e.blueprint[r] = s),
          (n[r] = s),
          Tp(e, t, 0, r, Or(e, n, o.hostVars, k), o);
      }
      function w0(e, t, n) {
        const r = Dt(t, e),
          o = Ep(n),
          i = e[10],
          s = vs(
            e,
            Lo(
              e,
              o,
              null,
              n.onPush ? 64 : 16,
              r,
              t,
              i,
              i.createRenderer(r, n),
              null,
              null
            )
          );
        e[t.index] = s;
      }
      function Wt(e, t, n, r, o, i) {
        const s = Dt(e, t);
        !(function lu(e, t, n, r, o, i, s) {
          if (null == i)
            fe(e) ? e.removeAttribute(t, o, n) : t.removeAttribute(o);
          else {
            const a = null == s ? F(i) : s(i, r || "", o);
            fe(e)
              ? e.setAttribute(t, o, a, n)
              : n
              ? t.setAttributeNS(n, o, a)
              : t.setAttribute(o, a);
          }
        })(t[j], s, i, e.value, n, r, o);
      }
      function b0(e, t, n, r, o, i) {
        const s = i[t];
        if (null !== s) {
          const a = r.setInput;
          for (let l = 0; l < s.length; ) {
            const u = s[l++],
              c = s[l++],
              d = s[l++];
            null !== a ? r.setInput(n, d, u, c) : (n[c] = d);
          }
        }
      }
      function E0(e, t) {
        let n = null,
          r = 0;
        for (; r < t.length; ) {
          const o = t[r];
          if (0 !== o)
            if (5 !== o) {
              if ("number" == typeof o) break;
              e.hasOwnProperty(o) &&
                (null === n && (n = []), n.push(o, e[o], t[r + 1])),
                (r += 2);
            } else r += 2;
          else r += 4;
        }
        return n;
      }
      function Np(e, t, n, r) {
        return new Array(e, !0, !1, t, null, 0, r, n, null, null);
      }
      function S0(e, t) {
        const n = st(t, e);
        if (rl(n)) {
          const r = n[1];
          80 & n[2] ? Pr(r, n, r.template, n[8]) : n[5] > 0 && uu(n);
        }
      }
      function uu(e) {
        for (let r = Vl(e); null !== r; r = Ll(r))
          for (let o = 10; o < r.length; o++) {
            const i = r[o];
            if (1024 & i[2]) {
              const s = i[1];
              Pr(s, i, s.template, i[8]);
            } else i[5] > 0 && uu(i);
          }
        const n = e[1].components;
        if (null !== n)
          for (let r = 0; r < n.length; r++) {
            const o = st(n[r], e);
            rl(o) && o[5] > 0 && uu(o);
          }
      }
      function I0(e, t) {
        const n = st(t, e),
          r = n[1];
        (function x0(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n),
          Bo(r, n, n[8]);
      }
      function vs(e, t) {
        return e[13] ? (e[14][4] = t) : (e[13] = t), (e[14] = t), t;
      }
      function cu(e) {
        for (; e; ) {
          e[2] |= 64;
          const t = ko(e);
          if (lw(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function kp(e) {
        !(function du(e) {
          for (let t = 0; t < e.components.length; t++) {
            const n = e.components[t],
              r = Pl(n),
              o = r[1];
            l0(o, r, o.template, n);
          }
        })(e[8]);
      }
      function hu(e, t, n) {
        cl(0), t(e, n);
      }
      const O0 = (() => Promise.resolve(null))();
      function Vp(e) {
        return e[7] || (e[7] = []);
      }
      function Lp(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function jp(e, t) {
        const n = e[9],
          r = n ? n.get(No, null) : null;
        r && r.handleError(t);
      }
      function Hp(e, t, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++],
            l = t[s],
            u = e.data[s];
          null !== u.setInput ? u.setInput(l, o, r, a) : (l[a] = o);
        }
      }
      function dn(e, t, n) {
        const r = Ui(t, e);
        !(function Gh(e, t, n) {
          fe(e) ? e.setValue(t, n) : (t.textContent = n);
        })(e[j], r, n);
      }
      function _s(e, t, n) {
        let r = n ? e.styles : null,
          o = n ? e.classes : null,
          i = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = ja(o, a))
              : 2 == i && (r = ja(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      const pu = new H("INJECTOR", -1);
      class Up {
        get(t, n = Ao) {
          if (n === Ao) {
            const r = new Error(`NullInjectorError: No provider for ${X(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      const gu = new H("Set Injector scope."),
        jo = {},
        R0 = {};
      let mu;
      function $p() {
        return void 0 === mu && (mu = new Up()), mu;
      }
      function Gp(e, t = null, n = null, r) {
        const o = zp(e, t, n, r);
        return o._resolveInjectorDefTypes(), o;
      }
      function zp(e, t = null, n = null, r) {
        return new N0(e, n, t || $p(), r);
      }
      class N0 {
        constructor(t, n, r, o = null) {
          (this.parent = r),
            (this.records = new Map()),
            (this.injectorDefTypes = new Set()),
            (this.onDestroy = new Set()),
            (this._destroyed = !1);
          const i = [];
          n && Gt(n, (a) => this.processProvider(a, t, n)),
            Gt([t], (a) => this.processInjectorType(a, [], i)),
            this.records.set(pu, Fr(void 0, this));
          const s = this.records.get(gu);
          (this.scope = null != s ? s.value : null),
            (this.source = o || ("object" == typeof t ? null : X(t)));
        }
        get destroyed() {
          return this._destroyed;
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            this.onDestroy.forEach((t) => t.ngOnDestroy());
          } finally {
            this.records.clear(),
              this.onDestroy.clear(),
              this.injectorDefTypes.clear();
          }
        }
        get(t, n = Ao, r = P.Default) {
          this.assertNotDestroyed();
          const o = gh(this),
            i = Cn(void 0);
          try {
            if (!(r & P.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const l =
                  (function $0(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof H)
                    );
                  })(t) && Ua(t);
                (a = l && this.injectableDefInScope(l) ? Fr(yu(t), jo) : null),
                  this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & P.Self ? $p() : this.parent).get(
              t,
              (n = r & P.Optional && n === Ao ? null : n)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[rs] = s[rs] || []).unshift(X(t)), o)) throw s;
              return (function yb(e, t, n, r) {
                const o = e[rs];
                throw (
                  (t[ph] && o.unshift(t[ph]),
                  (e.message = (function vb(e, t, n, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.substr(2)
                        : e;
                    let o = X(t);
                    if (Array.isArray(t)) o = t.map(X).join(" -> ");
                    else if ("object" == typeof t) {
                      let i = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : X(a))
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
                      db,
                      "\n  "
                    )}`;
                  })("\n" + e.message, o, n, r)),
                  (e.ngTokenPath = o),
                  (e[rs] = null),
                  e)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            Cn(i), gh(o);
          }
        }
        _resolveInjectorDefTypes() {
          this.injectorDefTypes.forEach((t) => this.get(t));
        }
        toString() {
          const t = [];
          return (
            this.records.forEach((r, o) => t.push(X(o))),
            `R3Injector[${t.join(", ")}]`
          );
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new Q(205, !1);
        }
        processInjectorType(t, n, r) {
          if (!(t = B(t))) return !1;
          let o = Ef(t);
          const i = (null == o && t.ngModule) || void 0,
            s = void 0 === i ? t : i,
            a = -1 !== r.indexOf(s);
          if ((void 0 !== i && (o = Ef(i)), null == o)) return !1;
          if (null != o.imports && !a) {
            let c;
            r.push(s);
            try {
              Gt(o.imports, (d) => {
                this.processInjectorType(d, n, r) &&
                  (void 0 === c && (c = []), c.push(d));
              });
            } finally {
            }
            if (void 0 !== c)
              for (let d = 0; d < c.length; d++) {
                const { ngModule: f, providers: h } = c[d];
                Gt(h, (p) => this.processProvider(p, f, h || oe));
              }
          }
          this.injectorDefTypes.add(s);
          const l = qn(s) || (() => new s());
          this.records.set(s, Fr(l, jo));
          const u = o.providers;
          if (null != u && !a) {
            const c = t;
            Gt(u, (d) => this.processProvider(d, c, u));
          }
          return void 0 !== i && void 0 !== t.providers;
        }
        processProvider(t, n, r) {
          let o = Rr((t = B(t))) ? t : B(t && t.provide);
          const i = (function V0(e, t, n) {
            return Wp(e) ? Fr(void 0, e.useValue) : Fr(qp(e), jo);
          })(t);
          if (Rr(t) || !0 !== t.multi) this.records.get(o);
          else {
            let s = this.records.get(o);
            s ||
              ((s = Fr(void 0, jo, !0)),
              (s.factory = () => bl(s.multi)),
              this.records.set(o, s)),
              (o = t),
              s.multi.push(t);
          }
          this.records.set(o, i);
        }
        hydrate(t, n) {
          return (
            n.value === jo && ((n.value = R0), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function U0(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(n.value) &&
              this.onDestroy.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = B(t.providedIn);
          return "string" == typeof n
            ? "any" === n || n === this.scope
            : this.injectorDefTypes.has(n);
        }
      }
      function yu(e) {
        const t = Ua(e),
          n = null !== t ? t.factory : qn(e);
        if (null !== n) return n;
        if (e instanceof H) throw new Q(204, !1);
        if (e instanceof Function)
          return (function k0(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function Mo(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new Q(204, !1))
              );
            const n = (function ZD(e) {
              const t = e && (e[Ni] || e[Mf]);
              if (t) {
                const n = (function KD(e) {
                  if (e.hasOwnProperty("name")) return e.name;
                  const t = ("" + e).match(/^function\s*([^\s(]+)/);
                  return null === t ? "" : t[1];
                })(e);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${n}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${n}" class.`
                  ),
                  t
                );
              }
              return null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new Q(204, !1);
      }
      function qp(e, t, n) {
        let r;
        if (Rr(e)) {
          const o = B(e);
          return qn(o) || yu(o);
        }
        if (Wp(e)) r = () => B(e.useValue);
        else if (
          (function B0(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          r = () => e.useFactory(...bl(e.deps || []));
        else if (
          (function L0(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          r = () => S(B(e.useExisting));
        else {
          const o = B(e && (e.useClass || e.provide));
          if (
            !(function H0(e) {
              return !!e.deps;
            })(e)
          )
            return qn(o) || yu(o);
          r = () => new o(...bl(e.deps));
        }
        return r;
      }
      function Fr(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function Wp(e) {
        return null !== e && "object" == typeof e && hb in e;
      }
      function Rr(e) {
        return "function" == typeof e;
      }
      let Qe = (() => {
        class e {
          static create(n, r) {
            var o;
            if (Array.isArray(n)) return Gp({ name: "" }, r, n, "");
            {
              const i = null !== (o = n.name) && void 0 !== o ? o : "";
              return Gp({ name: i }, n.parent, n.providers, i);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = Ao),
          (e.NULL = new Up()),
          (e.ɵprov = R({ token: e, providedIn: "any", factory: () => S(pu) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function J0(e, t) {
        qi(Pl(e)[1], Ae());
      }
      function ee(e) {
        let t = (function ig(e) {
            return Object.getPrototypeOf(e.prototype).constructor;
          })(e.type),
          n = !0;
        const r = [e];
        for (; t; ) {
          let o;
          if (Tt(e)) o = t.ɵcmp || t.ɵdir;
          else {
            if (t.ɵcmp) throw new Q(903, "");
            o = t.ɵdir;
          }
          if (o) {
            if (n) {
              r.push(o);
              const s = e;
              (s.inputs = Cu(e.inputs)),
                (s.declaredInputs = Cu(e.declaredInputs)),
                (s.outputs = Cu(e.outputs));
              const a = o.hostBindings;
              a && tM(e, a);
              const l = o.viewQuery,
                u = o.contentQueries;
              if (
                (l && X0(e, l),
                u && eM(e, u),
                Ba(e.inputs, o.inputs),
                Ba(e.declaredInputs, o.declaredInputs),
                Ba(e.outputs, o.outputs),
                Tt(o) && o.data.animation)
              ) {
                const c = e.data;
                c.animation = (c.animation || []).concat(o.data.animation);
              }
            }
            const i = o.features;
            if (i)
              for (let s = 0; s < i.length; s++) {
                const a = i[s];
                a && a.ngInherit && a(e), a === ee && (n = !1);
              }
          }
          t = Object.getPrototypeOf(t);
        }
        !(function Y0(e) {
          let t = 0,
            n = null;
          for (let r = e.length - 1; r >= 0; r--) {
            const o = e[r];
            (o.hostVars = t += o.hostVars),
              (o.hostAttrs = Ki(o.hostAttrs, (n = Ki(n, o.hostAttrs))));
          }
        })(r);
      }
      function Cu(e) {
        return e === dr ? {} : e === oe ? [] : e;
      }
      function X0(e, t) {
        const n = e.viewQuery;
        e.viewQuery = n
          ? (r, o) => {
              t(r, o), n(r, o);
            }
          : t;
      }
      function eM(e, t) {
        const n = e.contentQueries;
        e.contentQueries = n
          ? (r, o, i) => {
              t(r, o, i), n(r, o, i);
            }
          : t;
      }
      function tM(e, t) {
        const n = e.hostBindings;
        e.hostBindings = n
          ? (r, o) => {
              t(r, o), n(r, o);
            }
          : t;
      }
      let Cs = null;
      function Nr() {
        if (!Cs) {
          const e = te.Symbol;
          if (e && e.iterator) Cs = e.iterator;
          else {
            const t = Object.getOwnPropertyNames(Map.prototype);
            for (let n = 0; n < t.length; ++n) {
              const r = t[n];
              "entries" !== r &&
                "size" !== r &&
                Map.prototype[r] === Map.prototype.entries &&
                (Cs = r);
            }
          }
        }
        return Cs;
      }
      function Ho(e) {
        return (
          !!(function Du(e) {
            return (
              null !== e && ("function" == typeof e || "object" == typeof e)
            );
          })(e) &&
          (Array.isArray(e) || (!(e instanceof Map) && Nr() in e))
        );
      }
      function $e(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function Zt(e, t, n, r) {
        const o = v();
        return $e(o, yr(), t) && (Z(), Wt(he(), o, e, t, n, r)), Zt;
      }
      function Ie(e) {
        return (function mr(e, t) {
          return e[t];
        })(
          (function xw() {
            return N.lFrame.contextLView;
          })(),
          20 + e
        );
      }
      function y(e, t = P.Default) {
        const n = v();
        return null === n ? S(e, t) : oh(Ae(), n, B(e), t);
      }
      function Au() {
        throw new Error("invalid");
      }
      function pe(e, t, n) {
        const r = v();
        return (
          $e(r, yr(), t) &&
            (function ut(e, t, n, r, o, i, s, a) {
              const l = Dt(t, n);
              let c,
                u = t.inputs;
              !a && null != u && (c = u[r])
                ? (Hp(e, n, c, r, o),
                  ji(t) &&
                    (function h0(e, t) {
                      const n = st(t, e);
                      16 & n[2] || (n[2] |= 64);
                    })(n, t.index))
                : 3 & t.type &&
                  ((r = (function f0(e) {
                    return "class" === e
                      ? "className"
                      : "for" === e
                      ? "htmlFor"
                      : "formaction" === e
                      ? "formAction"
                      : "innerHtml" === e
                      ? "innerHTML"
                      : "readonly" === e
                      ? "readOnly"
                      : "tabindex" === e
                      ? "tabIndex"
                      : e;
                  })(r)),
                  (o = null != s ? s(o, t.value || "", r) : o),
                  fe(i)
                    ? i.setProperty(l, r, o)
                    : hl(r) ||
                      (l.setProperty ? l.setProperty(r, o) : (l[r] = o)));
            })(Z(), he(), r, e, t, r[j], n, !1),
          pe
        );
      }
      function Su(e, t, n, r, o) {
        const s = o ? "class" : "style";
        Hp(e, n, t.inputs[s], s, r);
      }
      function D(e, t, n, r) {
        const o = v(),
          i = Z(),
          s = 20 + e,
          a = o[j],
          l = (o[s] = jl(
            a,
            t,
            (function jw() {
              return N.lFrame.currentNamespace;
            })()
          )),
          u = i.firstCreatePass
            ? (function xM(e, t, n, r, o, i, s) {
                const a = t.consts,
                  u = Tr(t, e, 2, o, bn(a, i));
                return (
                  au(t, n, u, bn(a, s)),
                  null !== u.attrs && _s(u, u.attrs, !1),
                  null !== u.mergedAttrs && _s(u, u.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, u),
                  u
                );
              })(s, i, o, 0, t, n, r)
            : i.data[s];
        $t(u, !0);
        const c = u.mergedAttrs;
        null !== c && Zi(a, l, c);
        const d = u.classes;
        null !== d && ql(a, l, d);
        const f = u.styles;
        return (
          null !== f && op(a, l, f),
          64 != (64 & u.flags) && fs(i, o, l, u),
          0 ===
            (function Ew() {
              return N.lFrame.elementDepthCount;
            })() && Ue(l, o),
          (function Mw() {
            N.lFrame.elementDepthCount++;
          })(),
          Hi(u) &&
            (iu(i, o, u),
            (function bp(e, t, n) {
              if (Za(t)) {
                const o = t.directiveEnd;
                for (let i = t.directiveStart; i < o; i++) {
                  const s = e.data[i];
                  s.contentQueries && s.contentQueries(1, n[i], i);
                }
              }
            })(i, u, o)),
          null !== r && su(o, u),
          D
        );
      }
      function w() {
        let e = Ae();
        sl()
          ? (function al() {
              N.lFrame.isParent = !1;
            })()
          : ((e = e.parent), $t(e, !1));
        const t = e;
        !(function Aw() {
          N.lFrame.elementDepthCount--;
        })();
        const n = Z();
        return (
          n.firstCreatePass && (qi(n, e), Za(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function zw(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            Su(n, t, v(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function qw(e) {
              return 0 != (32 & e.flags);
            })(t) &&
            Su(n, t, v(), t.stylesWithoutHost, !1),
          w
        );
      }
      function Ze(e, t, n, r) {
        return D(e, t, n, r), w(), Ze;
      }
      function $o(e) {
        return !!e && "function" == typeof e.then;
      }
      const Tu = function Ig(e) {
        return !!e && "function" == typeof e.subscribe;
      };
      function K(e, t, n, r) {
        const o = v(),
          i = Z(),
          s = Ae();
        return (
          (function Tg(e, t, n, r, o, i, s, a) {
            const l = Hi(r),
              c = e.firstCreatePass && Lp(e),
              d = t[8],
              f = Vp(t);
            let h = !0;
            if (3 & r.type || a) {
              const C = Dt(r, t),
                _ = a ? a(C) : C,
                g = f.length,
                A = a ? (V) => a(Ce(V[r.index])) : r.index;
              if (fe(n)) {
                let V = null;
                if (
                  (!a &&
                    l &&
                    (V = (function OM(e, t, n, r) {
                      const o = e.cleanup;
                      if (null != o)
                        for (let i = 0; i < o.length - 1; i += 2) {
                          const s = o[i];
                          if (s === n && o[i + 1] === r) {
                            const a = t[7],
                              l = o[i + 2];
                            return a.length > l ? a[l] : null;
                          }
                          "string" == typeof s && (i += 2);
                        }
                      return null;
                    })(e, t, o, r.index)),
                  null !== V)
                )
                  ((V.__ngLastListenerFn__ || V).__ngNextListenerFn__ = i),
                    (V.__ngLastListenerFn__ = i),
                    (h = !1);
                else {
                  i = Ou(r, t, d, i, !1);
                  const J = n.listen(_, o, i);
                  f.push(i, J), c && c.push(o, A, g, g + 1);
                }
              } else
                (i = Ou(r, t, d, i, !0)),
                  _.addEventListener(o, i, s),
                  f.push(i),
                  c && c.push(o, A, g, s);
            } else i = Ou(r, t, d, i, !1);
            const p = r.outputs;
            let m;
            if (h && null !== p && (m = p[o])) {
              const C = m.length;
              if (C)
                for (let _ = 0; _ < C; _ += 2) {
                  const ht = t[m[_]][m[_ + 1]].subscribe(i),
                    cr = f.length;
                  f.push(i, ht), c && c.push(o, r.index, cr, -(cr + 1));
                }
            }
          })(i, o, o[j], s, e, t, !!n, r),
          K
        );
      }
      function Og(e, t, n, r) {
        try {
          return !1 !== n(r);
        } catch (o) {
          return jp(e, o), !1;
        }
      }
      function Ou(e, t, n, r, o) {
        return function i(s) {
          if (s === Function) return r;
          const a = 2 & e.flags ? st(e.index, t) : t;
          0 == (32 & t[2]) && cu(a);
          let l = Og(t, 0, r, s),
            u = i.__ngNextListenerFn__;
          for (; u; ) (l = Og(t, 0, u, s) && l), (u = u.__ngNextListenerFn__);
          return o && !1 === l && (s.preventDefault(), (s.returnValue = !1)), l;
        };
      }
      function Pu(e = 1) {
        return (function Rw(e) {
          return (N.lFrame.contextLView = (function Nw(e, t) {
            for (; e > 0; ) (t = t[15]), e--;
            return t;
          })(e, N.lFrame.contextLView))[8];
        })(e);
      }
      function Hg(e, t, n, r, o) {
        const i = e[n + 1],
          s = null === t;
        let a = r ? Pt(i) : cn(i),
          l = !1;
        for (; 0 !== a && (!1 === l || s); ) {
          const c = e[a + 1];
          VM(e[a], t) && ((l = !0), (e[a + 1] = r ? Zl(c) : Wl(c))),
            (a = r ? Pt(c) : cn(c));
        }
        l && (e[n + 1] = r ? Wl(i) : Zl(i));
      }
      function VM(e, t) {
        return (
          null === e ||
          null == t ||
          (Array.isArray(e) ? e[1] : e) === t ||
          (!(!Array.isArray(e) || "string" != typeof t) && Mr(e, t) >= 0)
        );
      }
      function z(e, t) {
        return (
          (function Rt(e, t, n, r) {
            const o = v(),
              i = Z(),
              s = (function un(e) {
                const t = N.lFrame,
                  n = t.bindingIndex;
                return (t.bindingIndex = t.bindingIndex + e), n;
              })(2);
            i.firstUpdatePass &&
              (function Kg(e, t, n, r) {
                const o = e.data;
                if (null === o[n + 1]) {
                  const i = o[qe()],
                    s = (function Zg(e, t) {
                      return t >= e.expandoStartIndex;
                    })(e, n);
                  (function em(e, t) {
                    return 0 != (e.flags & (t ? 16 : 32));
                  })(i, r) &&
                    null === t &&
                    !s &&
                    (t = !1),
                    (t = (function qM(e, t, n, r) {
                      const o = (function ul(e) {
                        const t = N.lFrame.currentDirectiveIndex;
                        return -1 === t ? null : e[t];
                      })(e);
                      let i = r ? t.residualClasses : t.residualStyles;
                      if (null === o)
                        0 === (r ? t.classBindings : t.styleBindings) &&
                          ((n = Go((n = Ru(null, e, t, n, r)), t.attrs, r)),
                          (i = null));
                      else {
                        const s = t.directiveStylingLast;
                        if (-1 === s || e[s] !== o)
                          if (((n = Ru(o, e, t, n, r)), null === i)) {
                            let l = (function WM(e, t, n) {
                              const r = n ? t.classBindings : t.styleBindings;
                              if (0 !== cn(r)) return e[Pt(r)];
                            })(e, t, r);
                            void 0 !== l &&
                              Array.isArray(l) &&
                              ((l = Ru(null, e, t, l[1], r)),
                              (l = Go(l, t.attrs, r)),
                              (function QM(e, t, n, r) {
                                e[Pt(n ? t.classBindings : t.styleBindings)] =
                                  r;
                              })(e, t, r, l));
                          } else
                            i = (function ZM(e, t, n) {
                              let r;
                              const o = t.directiveEnd;
                              for (
                                let i = 1 + t.directiveStylingLast;
                                i < o;
                                i++
                              )
                                r = Go(r, e[i].hostAttrs, n);
                              return Go(r, t.attrs, n);
                            })(e, t, r);
                      }
                      return (
                        void 0 !== i &&
                          (r
                            ? (t.residualClasses = i)
                            : (t.residualStyles = i)),
                        n
                      );
                    })(o, i, t, r)),
                    (function NM(e, t, n, r, o, i) {
                      let s = i ? t.classBindings : t.styleBindings,
                        a = Pt(s),
                        l = cn(s);
                      e[r] = n;
                      let c,
                        u = !1;
                      if (Array.isArray(n)) {
                        const d = n;
                        (c = d[1]), (null === c || Mr(d, c) > 0) && (u = !0);
                      } else c = n;
                      if (o)
                        if (0 !== l) {
                          const f = Pt(e[a + 1]);
                          (e[r + 1] = ps(f, a)),
                            0 !== f && (e[f + 1] = Ql(e[f + 1], r)),
                            (e[a + 1] = (function QE(e, t) {
                              return (131071 & e) | (t << 17);
                            })(e[a + 1], r));
                        } else
                          (e[r + 1] = ps(a, 0)),
                            0 !== a && (e[a + 1] = Ql(e[a + 1], r)),
                            (a = r);
                      else
                        (e[r + 1] = ps(l, 0)),
                          0 === a ? (a = r) : (e[l + 1] = Ql(e[l + 1], r)),
                          (l = r);
                      u && (e[r + 1] = Wl(e[r + 1])),
                        Hg(e, c, r, !0),
                        Hg(e, c, r, !1),
                        (function kM(e, t, n, r, o) {
                          const i = o ? e.residualClasses : e.residualStyles;
                          null != i &&
                            "string" == typeof t &&
                            Mr(i, t) >= 0 &&
                            (n[r + 1] = Zl(n[r + 1]));
                        })(t, c, e, r, i),
                        (s = ps(a, l)),
                        i ? (t.classBindings = s) : (t.styleBindings = s);
                    })(o, i, t, n, s, r);
                }
              })(i, e, s, r),
              t !== k &&
                $e(o, s, t) &&
                (function Yg(e, t, n, r, o, i, s, a) {
                  if (!(3 & t.type)) return;
                  const l = e.data,
                    u = l[a + 1];
                  bs(
                    (function hp(e) {
                      return 1 == (1 & e);
                    })(u)
                      ? Xg(l, t, n, o, cn(u), s)
                      : void 0
                  ) ||
                    (bs(i) ||
                      ((function fp(e) {
                        return 2 == (2 & e);
                      })(u) &&
                        (i = Xg(l, null, n, o, a, s))),
                    (function kE(e, t, n, r, o) {
                      const i = fe(e);
                      if (t)
                        o
                          ? i
                            ? e.addClass(n, r)
                            : n.classList.add(r)
                          : i
                          ? e.removeClass(n, r)
                          : n.classList.remove(r);
                      else {
                        let s = -1 === r.indexOf("-") ? void 0 : lt.DashCase;
                        if (null == o)
                          i
                            ? e.removeStyle(n, r, s)
                            : n.style.removeProperty(r);
                        else {
                          const a =
                            "string" == typeof o && o.endsWith("!important");
                          a && ((o = o.slice(0, -10)), (s |= lt.Important)),
                            i
                              ? e.setStyle(n, r, o, s)
                              : n.style.setProperty(r, o, a ? "important" : "");
                        }
                      }
                    })(r, s, Ui(qe(), n), o, i));
                })(
                  i,
                  i.data[qe()],
                  o,
                  o[j],
                  e,
                  (o[s + 1] = (function YM(e, t) {
                    return (
                      null == e ||
                        ("string" == typeof t
                          ? (e += t)
                          : "object" == typeof e && (e = X(Sn(e)))),
                      e
                    );
                  })(t, n)),
                  r,
                  s
                );
          })(e, t, null, !0),
          z
        );
      }
      function Ru(e, t, n, r, o) {
        let i = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < s && ((i = t[a]), (r = Go(r, i.hostAttrs, o)), i !== e);

        )
          a++;
        return null !== e && (n.directiveStylingLast = a), r;
      }
      function Go(e, t, n) {
        const r = n ? 1 : 2;
        let o = -1;
        if (null !== t)
          for (let i = 0; i < t.length; i++) {
            const s = t[i];
            "number" == typeof s
              ? (o = s)
              : o === r &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                at(e, s, !!n || t[++i]));
          }
        return void 0 === e ? null : e;
      }
      function Xg(e, t, n, r, o, i) {
        const s = null === t;
        let a;
        for (; o > 0; ) {
          const l = e[o],
            u = Array.isArray(l),
            c = u ? l[1] : l,
            d = null === c;
          let f = n[o + 1];
          f === k && (f = d ? oe : void 0);
          let h = d ? Cl(f, r) : c === r ? f : void 0;
          if ((u && !bs(h) && (h = Cl(l, r)), bs(h) && ((a = h), s))) return a;
          const p = e[o + 1];
          o = s ? Pt(p) : cn(p);
        }
        if (null !== t) {
          let l = i ? t.residualClasses : t.residualStyles;
          null != l && (a = Cl(l, r));
        }
        return a;
      }
      function bs(e) {
        return void 0 !== e;
      }
      function M(e, t = "") {
        const n = v(),
          r = Z(),
          o = e + 20,
          i = r.firstCreatePass ? Tr(r, o, 1, t, null) : r.data[o],
          s = (n[o] = (function Bl(e, t) {
            return fe(e) ? e.createText(t) : e.createTextNode(t);
          })(n[j], t));
        fs(r, n, s, i), $t(i, !1);
      }
      function zo(e) {
        return Es("", e, ""), zo;
      }
      function Es(e, t, n) {
        const r = v(),
          o = (function Vr(e, t, n, r) {
            return $e(e, yr(), n) ? t + F(n) + r : k;
          })(r, e, t, n);
        return o !== k && dn(r, qe(), o), Es;
      }
      const Ms = "en-US";
      let wm = Ms;
      function Vu(e, t, n, r, o) {
        if (((e = B(e)), Array.isArray(e)))
          for (let i = 0; i < e.length; i++) Vu(e[i], t, n, r, o);
        else {
          const i = Z(),
            s = v();
          let a = Rr(e) ? e : B(e.provide),
            l = qp(e);
          const u = Ae(),
            c = 1048575 & u.providerIndexes,
            d = u.directiveStart,
            f = u.providerIndexes >> 20;
          if (Rr(e) || !e.multi) {
            const h = new vo(l, o, y),
              p = Bu(a, t, o ? c : c + f, d);
            -1 === p
              ? (Xi(Co(u, s), i, a),
                Lu(i, e, t.length),
                t.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                o && (u.providerIndexes += 1048576),
                n.push(h),
                s.push(h))
              : ((n[p] = h), (s[p] = h));
          } else {
            const h = Bu(a, t, c + f, d),
              p = Bu(a, t, c, c + f),
              m = h >= 0 && n[h],
              C = p >= 0 && n[p];
            if ((o && !C) || (!o && !m)) {
              Xi(Co(u, s), i, a);
              const _ = (function yS(e, t, n, r, o) {
                const i = new vo(e, n, y);
                return (
                  (i.multi = []),
                  (i.index = t),
                  (i.componentProviders = 0),
                  qm(i, o, r && !n),
                  i
                );
              })(o ? mS : gS, n.length, o, r, l);
              !o && C && (n[p].providerFactory = _),
                Lu(i, e, t.length, 0),
                t.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                o && (u.providerIndexes += 1048576),
                n.push(_),
                s.push(_);
            } else Lu(i, e, h > -1 ? h : p, qm(n[o ? p : h], l, !o && r));
            !o && r && C && n[p].componentProviders++;
          }
        }
      }
      function Lu(e, t, n, r) {
        const o = Rr(t),
          i = (function j0(e) {
            return !!e.useClass;
          })(t);
        if (o || i) {
          const l = (i ? B(t.useClass) : t).prototype.ngOnDestroy;
          if (l) {
            const u = e.destroyHooks || (e.destroyHooks = []);
            if (!o && t.multi) {
              const c = u.indexOf(n);
              -1 === c ? u.push(n, [r, l]) : u[c + 1].push(r, l);
            } else u.push(n, l);
          }
        }
      }
      function qm(e, t, n) {
        return n && e.componentProviders++, e.multi.push(t) - 1;
      }
      function Bu(e, t, n, r) {
        for (let o = n; o < r; o++) if (t[o] === e) return o;
        return -1;
      }
      function gS(e, t, n, r) {
        return ju(this.multi, []);
      }
      function mS(e, t, n, r) {
        const o = this.multi;
        let i;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = Do(n, n[1], this.providerFactory.index, r);
          (i = a.slice(0, s)), ju(o, i);
          for (let l = s; l < a.length; l++) i.push(a[l]);
        } else (i = []), ju(o, i);
        return i;
      }
      function ju(e, t) {
        for (let n = 0; n < e.length; n++) t.push((0, e[n])());
        return t;
      }
      function ce(e, t = []) {
        return (n) => {
          n.providersResolver = (r, o) =>
            (function pS(e, t, n) {
              const r = Z();
              if (r.firstCreatePass) {
                const o = Tt(e);
                Vu(n, r.data, r.blueprint, o, !0),
                  Vu(t, r.data, r.blueprint, o, !1);
              }
            })(r, o ? o(e) : e, t);
        };
      }
      class Wm {}
      class CS {
        resolveComponentFactory(t) {
          throw (function _S(e) {
            const t = Error(
              `No component factory found for ${X(
                e
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let Ko = (() => {
        class e {}
        return (e.NULL = new CS()), e;
      })();
      function DS() {
        return Zr(Ae(), v());
      }
      function Zr(e, t) {
        return new ct(Dt(e, t));
      }
      let ct = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (e.__NG_ELEMENT_ID__ = DS), e;
      })();
      class Zm {}
      let fn = (() => {
          class e {}
          return (
            (e.__NG_ELEMENT_ID__ = () =>
              (function ES() {
                const e = v(),
                  n = st(Ae().index, e);
                return (function bS(e) {
                  return e[j];
                })(Ut(n) ? n : e);
              })()),
            e
          );
        })(),
        MS = (() => {
          class e {}
          return (
            (e.ɵprov = R({
              token: e,
              providedIn: "root",
              factory: () => null,
            })),
            e
          );
        })();
      class Jo {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const AS = new Jo("13.3.11"),
        Hu = {};
      function Ts(e, t, n, r, o = !1) {
        for (; null !== n; ) {
          const i = t[n.index];
          if ((null !== i && r.push(Ce(i)), xt(i)))
            for (let a = 10; a < i.length; a++) {
              const l = i[a],
                u = l[1].firstChild;
              null !== u && Ts(l[1], l, u, r);
            }
          const s = n.type;
          if (8 & s) Ts(e, t, n.child, r);
          else if (32 & s) {
            const a = kl(n, t);
            let l;
            for (; (l = a()); ) r.push(l);
          } else if (16 & s) {
            const a = tp(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const l = ko(t[16]);
              Ts(l[1], l, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      class Yo {
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get rootNodes() {
          const t = this._lView,
            n = t[1];
          return Ts(n, t, n.firstChild, []);
        }
        get context() {
          return this._lView[8];
        }
        set context(t) {
          this._lView[8] = t;
        }
        get destroyed() {
          return 256 == (256 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[3];
            if (xt(t)) {
              const n = t[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (Hl(t, r), ts(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          qh(this._lView[1], this._lView);
        }
        onDestroy(t) {
          !(function Sp(e, t, n, r) {
            const o = Vp(t);
            null === n
              ? o.push(r)
              : (o.push(n), e.firstCreatePass && Lp(e).push(r, o.length - 1));
          })(this._lView[1], this._lView, null, t);
        }
        markForCheck() {
          cu(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -129;
        }
        reattach() {
          this._lView[2] |= 128;
        }
        detectChanges() {
          !(function fu(e, t, n) {
            const r = t[10];
            r.begin && r.begin();
            try {
              Pr(e, t, e.template, n);
            } catch (o) {
              throw (jp(t, o), o);
            } finally {
              r.end && r.end();
            }
          })(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new Q(902, "");
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function AE(e, t) {
              Vo(e, t, t[j], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new Q(902, "");
          this._appRef = t;
        }
      }
      class SS extends Yo {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          kp(this._view);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class Km extends Ko {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = Be(t);
          return new Uu(n, this.ngModule);
        }
      }
      function Jm(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class Uu extends Wm {
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function qE(e) {
              return e.map(zE).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        get inputs() {
          return Jm(this.componentDef.inputs);
        }
        get outputs() {
          return Jm(this.componentDef.outputs);
        }
        create(t, n, r, o) {
          const i = (o = o || this.ngModule)
              ? (function xS(e, t) {
                  return {
                    get: (n, r, o) => {
                      const i = e.get(n, Hu, o);
                      return i !== Hu || r === Hu ? i : t.get(n, r, o);
                    },
                  };
                })(t, o.injector)
              : t,
            s = i.get(Zm, kf),
            a = i.get(MS, null),
            l = s.createRenderer(null, this.componentDef),
            u = this.componentDef.selectors[0][0] || "div",
            c = r
              ? (function Ap(e, t, n) {
                  if (fe(e)) return e.selectRootElement(t, n === Ht.ShadowDom);
                  let r = "string" == typeof t ? e.querySelector(t) : t;
                  return (r.textContent = ""), r;
                })(l, r, this.componentDef.encapsulation)
              : jl(
                  s.createRenderer(null, this.componentDef),
                  u,
                  (function IS(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(u)
                ),
            d = this.componentDef.onPush ? 576 : 528,
            f = (function og(e, t) {
              return {
                components: [],
                scheduler: e || vE,
                clean: O0,
                playerHandler: t || null,
                flags: 0,
              };
            })(),
            h = ys(0, null, null, 1, 0, null, null, null, null, null),
            p = Lo(null, h, f, d, null, null, s, l, a, i);
          let m, C;
          Gi(p);
          try {
            const _ = (function ng(e, t, n, r, o, i) {
              const s = n[1];
              n[20] = e;
              const l = Tr(s, 20, 2, "#host", null),
                u = (l.mergedAttrs = t.hostAttrs);
              null !== u &&
                (_s(l, u, !0),
                null !== e &&
                  (Zi(o, e, u),
                  null !== l.classes && ql(o, e, l.classes),
                  null !== l.styles && op(o, e, l.styles)));
              const c = r.createRenderer(e, t),
                d = Lo(
                  n,
                  Ep(t),
                  null,
                  t.onPush ? 64 : 16,
                  n[20],
                  l,
                  r,
                  c,
                  i || null,
                  null
                );
              return (
                s.firstCreatePass &&
                  (Xi(Co(l, n), s, t.type), Pp(s, l), Fp(l, n.length, 1)),
                vs(n, d),
                (n[20] = d)
              );
            })(c, this.componentDef, p, s, l);
            if (c)
              if (r) Zi(l, c, ["ng-version", AS.full]);
              else {
                const { attrs: g, classes: A } = (function WE(e) {
                  const t = [],
                    n = [];
                  let r = 1,
                    o = 2;
                  for (; r < e.length; ) {
                    let i = e[r];
                    if ("string" == typeof i)
                      2 === o
                        ? "" !== i && t.push(i, e[++r])
                        : 8 === o && n.push(i);
                    else {
                      if (!Ot(o)) break;
                      o = i;
                    }
                    r++;
                  }
                  return { attrs: t, classes: n };
                })(this.componentDef.selectors[0]);
                g && Zi(l, c, g), A && A.length > 0 && ql(l, c, A.join(" "));
              }
            if (((C = nl(h, 20)), void 0 !== n)) {
              const g = (C.projection = []);
              for (let A = 0; A < this.ngContentSelectors.length; A++) {
                const V = n[A];
                g.push(null != V ? Array.from(V) : null);
              }
            }
            (m = (function rg(e, t, n, r, o) {
              const i = n[1],
                s = (function g0(e, t, n) {
                  const r = Ae();
                  e.firstCreatePass &&
                    (n.providersResolver && n.providersResolver(n),
                    Rp(e, r, t, Or(e, t, 1, null), n));
                  const o = Do(t, e, r.directiveStart, r);
                  Ue(o, t);
                  const i = Dt(r, t);
                  return i && Ue(i, t), o;
                })(i, n, t);
              if (
                (r.components.push(s),
                (e[8] = s),
                o && o.forEach((l) => l(s, t)),
                t.contentQueries)
              ) {
                const l = Ae();
                t.contentQueries(1, s, l.directiveStart);
              }
              const a = Ae();
              return (
                !i.firstCreatePass ||
                  (null === t.hostBindings && null === t.hostAttrs) ||
                  (En(a.index),
                  Tp(n[1], a, 0, a.directiveStart, a.directiveEnd, t),
                  Op(t, s)),
                s
              );
            })(_, this.componentDef, p, f, [J0])),
              Bo(h, p, null);
          } finally {
            zi();
          }
          return new OS(this.componentType, m, Zr(C, p), p, C);
        }
      }
      class OS extends class vS {} {
        constructor(t, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new SS(o)),
            (this.componentType = t);
        }
        get injector() {
          return new Cr(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      class hn {}
      class Ym {}
      const Kr = new Map();
      class ty extends hn {
        constructor(t, n) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.injector = this),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new Km(this));
          const r = yt(t);
          (this._bootstrapComponents = qt(r.bootstrap)),
            (this._r3Injector = zp(
              t,
              n,
              [
                { provide: hn, useValue: this },
                { provide: Ko, useValue: this.componentFactoryResolver },
              ],
              X(t)
            )),
            this._r3Injector._resolveInjectorDefTypes(),
            (this.instance = this.get(t));
        }
        get(t, n = Qe.THROW_IF_NOT_FOUND, r = P.Default) {
          return t === Qe || t === hn || t === pu
            ? this
            : this._r3Injector.get(t, n, r);
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class $u extends Ym {
        constructor(t) {
          super(),
            (this.moduleType = t),
            null !== yt(t) &&
              (function FS(e) {
                const t = new Set();
                !(function n(r) {
                  const o = yt(r, !0),
                    i = o.id;
                  null !== i &&
                    ((function Xm(e, t, n) {
                      if (t && t !== n)
                        throw new Error(
                          `Duplicate module registered for ${e} - ${X(
                            t
                          )} vs ${X(t.name)}`
                        );
                    })(i, Kr.get(i), r),
                    Kr.set(i, r));
                  const s = qt(o.imports);
                  for (const a of s) t.has(a) || (t.add(a), n(a));
                })(e);
              })(t);
        }
        create(t) {
          return new ty(this.moduleType, t);
        }
      }
      function Gu(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const me = class JS extends nn {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          var o, i, s;
          let a = t,
            l = n || (() => null),
            u = r;
          if (t && "object" == typeof t) {
            const d = t;
            (a = null === (o = d.next) || void 0 === o ? void 0 : o.bind(d)),
              (l = null === (i = d.error) || void 0 === i ? void 0 : i.bind(d)),
              (u =
                null === (s = d.complete) || void 0 === s ? void 0 : s.bind(d));
          }
          this.__isAsync && ((l = Gu(l)), a && (a = Gu(a)), u && (u = Gu(u)));
          const c = super.subscribe({ next: a, error: l, complete: u });
          return t instanceof pt && t.add(c), c;
        }
      };
      Symbol;
      let pn = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = tI), e;
      })();
      const XS = pn,
        eI = class extends XS {
          constructor(t, n, r) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          createEmbeddedView(t) {
            const n = this._declarationTContainer.tViews,
              r = Lo(
                this._declarationLView,
                n,
                t,
                16,
                null,
                n.declTNode,
                null,
                null,
                null,
                null
              );
            r[17] = this._declarationLView[this._declarationTContainer.index];
            const i = this._declarationLView[19];
            return (
              null !== i && (r[19] = i.createEmbeddedView(n)),
              Bo(n, r, t),
              new Yo(r)
            );
          }
        };
      function tI() {
        return (function Os(e, t) {
          return 4 & e.type ? new eI(t, e, Zr(e, t)) : null;
        })(Ae(), v());
      }
      let kt = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = nI), e;
      })();
      function nI() {
        return (function uy(e, t) {
          let n;
          const r = t[e.index];
          if (xt(r)) n = r;
          else {
            let o;
            if (8 & e.type) o = Ce(r);
            else {
              const i = t[j];
              o = i.createComment("");
              const s = Dt(e, t);
              Wn(
                i,
                ds(i, s),
                o,
                (function FE(e, t) {
                  return fe(e) ? e.nextSibling(t) : t.nextSibling;
                })(i, s),
                !1
              );
            }
            (t[e.index] = n = Np(r, t, o, e)), vs(t, n);
          }
          return new ay(n, e, t);
        })(Ae(), v());
      }
      const rI = kt,
        ay = class extends rI {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return Zr(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new Cr(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = Yi(this._hostTNode, this._hostLView);
            if (Xf(t)) {
              const n = _r(t, this._hostLView),
                r = vr(t);
              return new Cr(n[1].data[r + 8], n);
            }
            return new Cr(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = ly(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(t, n, r) {
            const o = t.createEmbeddedView(n || {});
            return this.insert(o, r), o;
          }
          createComponent(t, n, r, o, i) {
            const s =
              t &&
              !(function Eo(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const d = n || {};
              (a = d.index),
                (r = d.injector),
                (o = d.projectableNodes),
                (i = d.ngModuleRef);
            }
            const l = s ? t : new Uu(Be(t)),
              u = r || this.parentInjector;
            if (!i && null == l.ngModule) {
              const f = (s ? u : this.parentInjector).get(hn, null);
              f && (i = f);
            }
            const c = l.create(u, o, void 0, i);
            return this.insert(c.hostView, a), c;
          }
          insert(t, n) {
            const r = t._lView,
              o = r[1];
            if (
              (function bw(e) {
                return xt(e[3]);
              })(r)
            ) {
              const c = this.indexOf(t);
              if (-1 !== c) this.detach(c);
              else {
                const d = r[3],
                  f = new ay(d, d[6], d[3]);
                f.detach(f.indexOf(t));
              }
            }
            const i = this._adjustIndex(n),
              s = this._lContainer;
            !(function IE(e, t, n, r) {
              const o = 10 + r,
                i = n.length;
              r > 0 && (n[o - 1][4] = t),
                r < i - 10
                  ? ((t[4] = n[o]), uh(n, 10 + r, t))
                  : (n.push(t), (t[4] = null)),
                (t[3] = n);
              const s = t[17];
              null !== s &&
                n !== s &&
                (function xE(e, t) {
                  const n = e[9];
                  t[16] !== t[3][3][16] && (e[2] = !0),
                    null === n ? (e[9] = [t]) : n.push(t);
                })(s, t);
              const a = t[19];
              null !== a && a.insertView(e), (t[2] |= 128);
            })(o, r, s, i);
            const a = Gl(i, s),
              l = r[j],
              u = ds(l, s[7]);
            return (
              null !== u &&
                (function ME(e, t, n, r, o, i) {
                  (r[0] = o), (r[6] = t), Vo(e, r, n, 1, o, i);
                })(o, s[6], l, r, u, a),
              t.attachToViewContainerRef(),
              uh(qu(s), i, t),
              t
            );
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = ly(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = Hl(this._lContainer, n);
            r && (ts(qu(this._lContainer), n), qh(r[1], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = Hl(this._lContainer, n);
            return r && null != ts(qu(this._lContainer), n) ? new Yo(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return null == t ? this.length + n : t;
          }
        };
      function ly(e) {
        return e[8];
      }
      function qu(e) {
        return e[8] || (e[8] = []);
      }
      function Rs(...e) {}
      const sc = new H("Application Initializer");
      let ac = (() => {
        class e {
          constructor(n) {
            (this.appInits = n),
              (this.resolve = Rs),
              (this.reject = Rs),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, o) => {
                (this.resolve = r), (this.reject = o);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const n = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let o = 0; o < this.appInits.length; o++) {
                const i = this.appInits[o]();
                if ($o(i)) n.push(i);
                else if (Tu(i)) {
                  const s = new Promise((a, l) => {
                    i.subscribe({ complete: a, error: l });
                  });
                  n.push(s);
                }
              }
            Promise.all(n)
              .then(() => {
                r();
              })
              .catch((o) => {
                this.reject(o);
              }),
              0 === n.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(sc, 8));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const ni = new H("AppId", {
        providedIn: "root",
        factory: function Oy() {
          return `${lc()}${lc()}${lc()}`;
        },
      });
      function lc() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const Py = new H("Platform Initializer"),
        uc = new H("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        Fy = new H("appBootstrapListener");
      let TI = (() => {
        class e {
          log(n) {
            console.log(n);
          }
          warn(n) {
            console.warn(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      const Tn = new H("LocaleId", {
        providedIn: "root",
        factory: () =>
          gb(Tn, P.Optional | P.SkipSelf) ||
          (function OI() {
            return ("undefined" != typeof $localize && $localize.locale) || Ms;
          })(),
      });
      class FI {
        constructor(t, n) {
          (this.ngModuleFactory = t), (this.componentFactories = n);
        }
      }
      let Ry = (() => {
        class e {
          compileModuleSync(n) {
            return new $u(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const r = this.compileModuleSync(n),
              i = qt(yt(n).declarations).reduce((s, a) => {
                const l = Be(a);
                return l && s.push(new Uu(l)), s;
              }, []);
            return new FI(r, i);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const NI = (() => Promise.resolve(0))();
      function cc(e) {
        "undefined" == typeof Zone
          ? NI.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      class Ve {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new me(!1)),
            (this.onMicrotaskEmpty = new me(!1)),
            (this.onStable = new me(!1)),
            (this.onError = new me(!1)),
            "undefined" == typeof Zone)
          )
            throw new Error("In this configuration Angular requires Zone.js");
          Zone.assertZonePatched();
          const o = this;
          (o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && n),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function kI() {
              let e = te.requestAnimationFrame,
                t = te.cancelAnimationFrame;
              if ("undefined" != typeof Zone && e && t) {
                const n = e[Zone.__symbol__("OriginalDelegate")];
                n && (e = n);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return {
                nativeRequestAnimationFrame: e,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function BI(e) {
              const t = () => {
                !(function LI(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(te, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                fc(e),
                                (e.isCheckStableRunning = !0),
                                dc(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    fc(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  try {
                    return Ny(e), n.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      ky(e);
                  }
                },
                onInvoke: (n, r, o, i, s, a, l) => {
                  try {
                    return Ny(e), n.invoke(o, i, s, a, l);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), ky(e);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          fc(e),
                          dc(e))
                        : "macroTask" == i.change &&
                          (e.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (n, r, o, i) => (
                  n.handleError(o, i),
                  e.runOutsideAngular(() => e.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return (
            "undefined" != typeof Zone &&
            !0 === Zone.current.get("isAngularZone")
          );
        }
        static assertInAngularZone() {
          if (!Ve.isInAngularZone())
            throw new Error("Expected to be in Angular Zone, but it is not!");
        }
        static assertNotInAngularZone() {
          if (Ve.isInAngularZone())
            throw new Error("Expected to not be in Angular Zone, but it is!");
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, t, VI, Rs, Rs);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const VI = {};
      function dc(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function fc(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function Ny(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function ky(e) {
        e._nesting--, dc(e);
      }
      class jI {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new me()),
            (this.onMicrotaskEmpty = new me()),
            (this.onStable = new me()),
            (this.onError = new me());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, o) {
          return t.apply(n, r);
        }
      }
      let hc = (() => {
          class e {
            constructor(n) {
              (this._ngZone = n),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    "undefined" == typeof Zone
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      Ve.assertNotInAngularZone(),
                        cc(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                cc(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
            }
            whenStable(n, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            findProviders(n, r, o) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(Ve));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        HI = (() => {
          class e {
            constructor() {
              (this._applications = new Map()), pc.addToWindow(this);
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return pc.findTestabilityInTree(this, n, r);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            e
          );
        })();
      class UI {
        addToWindow(t) {}
        findTestabilityInTree(t, n, r) {
          return null;
        }
      }
      let pc = new UI(),
        Kn = null;
      const Vy = new H("AllowMultipleToken"),
        Ly = new H("PlatformOnDestroy");
      class By {
        constructor(t, n) {
          (this.name = t), (this.token = n);
        }
      }
      function jy(e, t, n = []) {
        const r = `Platform: ${t}`,
          o = new H(r);
        return (i = []) => {
          let s = gc();
          if (!s || s.injector.get(Vy, !1)) {
            const a = [...n, ...i, { provide: o, useValue: !0 }];
            e
              ? e(a)
              : (function qI(e) {
                  if (Kn && !Kn.get(Vy, !1)) throw new Q(400, "");
                  Kn = e;
                  const t = e.get(Hy),
                    n = e.get(Py, null);
                  n && n.forEach((r) => r());
                })(
                  (function QI(e = [], t) {
                    return Qe.create({
                      name: t,
                      providers: [
                        { provide: gu, useValue: "platform" },
                        { provide: Ly, useValue: () => (Kn = null) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function WI(e) {
            const t = gc();
            if (!t) throw new Q(401, "");
            return t;
          })();
        };
      }
      function gc() {
        var e;
        return null !== (e = null == Kn ? void 0 : Kn.get(Hy)) && void 0 !== e
          ? e
          : null;
      }
      let Hy = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const a = (function ZI(e, t) {
                let n;
                return (
                  (n =
                    "noop" === e
                      ? new jI()
                      : ("zone.js" === e ? void 0 : e) ||
                        new Ve({
                          enableLongStackTrace: !1,
                          shouldCoalesceEventChangeDetection: !!(null == t
                            ? void 0
                            : t.ngZoneEventCoalescing),
                          shouldCoalesceRunChangeDetection: !!(null == t
                            ? void 0
                            : t.ngZoneRunCoalescing),
                        })),
                  n
                );
              })(r ? r.ngZone : void 0, {
                ngZoneEventCoalescing: (r && r.ngZoneEventCoalescing) || !1,
                ngZoneRunCoalescing: (r && r.ngZoneRunCoalescing) || !1,
              }),
              l = [{ provide: Ve, useValue: a }];
            return a.run(() => {
              const u = Qe.create({
                  providers: l,
                  parent: this.injector,
                  name: n.moduleType.name,
                }),
                c = n.create(u),
                d = c.injector.get(No, null);
              if (!d) throw new Q(402, "");
              return (
                a.runOutsideAngular(() => {
                  const f = a.onError.subscribe({
                    next: (h) => {
                      d.handleError(h);
                    },
                  });
                  c.onDestroy(() => {
                    yc(this._modules, c), f.unsubscribe();
                  });
                }),
                (function KI(e, t, n) {
                  try {
                    const r = n();
                    return $o(r)
                      ? r.catch((o) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(d, a, () => {
                  const f = c.injector.get(ac);
                  return (
                    f.runInitializers(),
                    f.donePromise.then(
                      () => (
                        (function bA(e) {
                          rt(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (wm = e.toLowerCase().replace(/_/g, "-"));
                        })(c.injector.get(Tn, Ms) || Ms),
                        this._moduleDoBootstrap(c),
                        c
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const o = Uy({}, r);
            return (function GI(e, t, n) {
              const r = new $u(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(mc);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!n.instance.ngDoBootstrap) throw new Q(403, "");
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new Q(404, "");
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(Ly, null);
            null == n || n(), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(Qe));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      function Uy(e, t) {
        return Array.isArray(t)
          ? t.reduce(Uy, e)
          : Object.assign(Object.assign({}, e), t);
      }
      let mc = (() => {
        class e {
          constructor(n, r, o, i) {
            (this._zone = n),
              (this._injector = r),
              (this._exceptionHandler = o),
              (this._initStatus = i),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const s = new ye((l) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    l.next(this._stable), l.complete();
                  });
              }),
              a = new ye((l) => {
                let u;
                this._zone.runOutsideAngular(() => {
                  u = this._zone.onStable.subscribe(() => {
                    Ve.assertNotInAngularZone(),
                      cc(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), l.next(!0));
                      });
                  });
                });
                const c = this._zone.onUnstable.subscribe(() => {
                  Ve.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        l.next(!1);
                      }));
                });
                return () => {
                  u.unsubscribe(), c.unsubscribe();
                };
              });
            this.isStable = (function UD(...e) {
              const t = fo(e),
                n = (function ND(e, t) {
                  return "number" == typeof Va(e) ? e.pop() : t;
                })(e, 1 / 0),
                r = e;
              return r.length
                ? 1 === r.length
                  ? jt(r[0])
                  : co(n)(Fe(r, t))
                : on;
            })(
              s,
              a.pipe(
                (function $D(e = {}) {
                  const {
                    connector: t = () => new nn(),
                    resetOnError: n = !0,
                    resetOnComplete: r = !0,
                    resetOnRefCountZero: o = !0,
                  } = e;
                  return (i) => {
                    let s = null,
                      a = null,
                      l = null,
                      u = 0,
                      c = !1,
                      d = !1;
                    const f = () => {
                        null == a || a.unsubscribe(), (a = null);
                      },
                      h = () => {
                        f(), (s = l = null), (c = d = !1);
                      },
                      p = () => {
                        const m = s;
                        h(), null == m || m.unsubscribe();
                      };
                    return Ne((m, C) => {
                      u++, !d && !c && f();
                      const _ = (l = null != l ? l : t());
                      C.add(() => {
                        u--, 0 === u && !d && !c && (a = La(p, o));
                      }),
                        _.subscribe(C),
                        s ||
                          ((s = new Oi({
                            next: (g) => _.next(g),
                            error: (g) => {
                              (d = !0), f(), (a = La(h, n, g)), _.error(g);
                            },
                            complete: () => {
                              (c = !0), f(), (a = La(h, r)), _.complete();
                            },
                          })),
                          Fe(m).subscribe(s));
                    })(i);
                  };
                })()
              )
            );
          }
          bootstrap(n, r) {
            if (!this._initStatus.done) throw new Q(405, "");
            let o;
            (o =
              n instanceof Wm
                ? n
                : this._injector.get(Ko).resolveComponentFactory(n)),
              this.componentTypes.push(o.componentType);
            const i = (function zI(e) {
                return e.isBoundToModule;
              })(o)
                ? void 0
                : this._injector.get(hn),
              a = o.create(Qe.NULL, [], r || o.selector, i),
              l = a.location.nativeElement,
              u = a.injector.get(hc, null),
              c = u && a.injector.get(HI);
            return (
              u && c && c.registerApplication(l, u),
              a.onDestroy(() => {
                this.detachView(a.hostView),
                  yc(this.components, a),
                  c && c.unregisterApplication(l);
              }),
              this._loadComponent(a),
              a
            );
          }
          tick() {
            if (this._runningTick) throw new Q(101, "");
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(n)
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            yc(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView),
              this.tick(),
              this.components.push(n),
              this._injector
                .get(Fy, [])
                .concat(this._bootstrapListeners)
                .forEach((o) => o(n));
          }
          ngOnDestroy() {
            this._views.slice().forEach((n) => n.destroy()),
              this._onMicrotaskEmptySubscription.unsubscribe();
          }
          get viewCount() {
            return this._views.length;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(Ve), S(Qe), S(No), S(ac));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function yc(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      let Gy = !0,
        Ns = (() => {
          class e {}
          return (e.__NG_ELEMENT_ID__ = XI), e;
        })();
      function XI(e) {
        return (function ex(e, t, n) {
          if (ji(e) && !n) {
            const r = st(e.index, t);
            return new Yo(r, r);
          }
          return 47 & e.type ? new Yo(t[16], t) : null;
        })(Ae(), v(), 16 == (16 & e));
      }
      class Zy {
        constructor() {}
        supports(t) {
          return Ho(t);
        }
        create(t) {
          return new sx(t);
        }
      }
      const ix = (e, t) => t;
      class sx {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || ix);
        }
        forEachItem(t) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) t(n);
        }
        forEachOperation(t) {
          let n = this._itHead,
            r = this._removalsHead,
            o = 0,
            i = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < Jy(r, o, i)) ? n : r,
              a = Jy(s, o, i),
              l = s.currentIndex;
            if (s === r) o--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) o++;
            else {
              i || (i = []);
              const u = a - o,
                c = l - o;
              if (u != c) {
                for (let f = 0; f < u; f++) {
                  const h = f < i.length ? i[f] : (i[f] = 0),
                    p = h + f;
                  c <= p && p < u && (i[f] = h + 1);
                }
                i[s.previousIndex] = c - u;
              }
            }
            a !== l && t(s, a, l);
          }
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachMovedItem(t) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        forEachIdentityChange(t) {
          let n;
          for (
            n = this._identityChangesHead;
            null !== n;
            n = n._nextIdentityChange
          )
            t(n);
        }
        diff(t) {
          if ((null == t && (t = []), !Ho(t))) throw new Q(900, "");
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let o,
            i,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (i = t[a]),
                (s = this._trackByFn(a, i)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, i, s, a)),
                    Object.is(n.item, i) || this._addIdentityChange(n, i))
                  : ((n = this._mismatch(n, i, s, a)), (r = !0)),
                (n = n._next);
          } else
            (o = 0),
              (function aM(e, t) {
                if (Array.isArray(e))
                  for (let n = 0; n < e.length; n++) t(e[n]);
                else {
                  const n = e[Nr()]();
                  let r;
                  for (; !(r = n.next()).done; ) t(r.value);
                }
              })(t, (a) => {
                (s = this._trackByFn(o, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, o)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, o)), (r = !0)),
                  (n = n._next),
                  o++;
              }),
              (this.length = o);
          return this._truncate(n), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              t = this._previousItHead = this._itHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded)
              t.previousIndex = t.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                t = this._movesHead;
              null !== t;
              t = t._nextMoved
            )
              t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, n, r, o) {
          let i;
          return (
            null === t ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
            null !==
            (t =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._reinsertAfter(t, i, o))
              : null !==
                (t =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, o))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._moveAfter(t, i, o))
              : (t = this._addAfter(new ax(n, r), i, o)),
            t
          );
        }
        _verifyReinsertion(t, n, r, o) {
          let i =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== i
              ? (t = this._reinsertAfter(i, t._prev, o))
              : t.currentIndex != o &&
                ((t.currentIndex = o), this._addToMoves(t, o)),
            t
          );
        }
        _truncate(t) {
          for (; null !== t; ) {
            const n = t._next;
            this._addToRemovals(this._unlink(t)), (t = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const o = t._prevRemoved,
            i = t._nextRemoved;
          return (
            null === o ? (this._removalsHead = i) : (o._nextRemoved = i),
            null === i ? (this._removalsTail = o) : (i._prevRemoved = o),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _moveAfter(t, n, r) {
          return (
            this._unlink(t),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _addAfter(t, n, r) {
          return (
            this._insertAfter(t, n, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = t)
                : (this._additionsTail._nextAdded = t)),
            t
          );
        }
        _insertAfter(t, n, r) {
          const o = null === n ? this._itHead : n._next;
          return (
            (t._next = o),
            (t._prev = n),
            null === o ? (this._itTail = t) : (o._prev = t),
            null === n ? (this._itHead = t) : (n._next = t),
            null === this._linkedRecords && (this._linkedRecords = new Ky()),
            this._linkedRecords.put(t),
            (t.currentIndex = r),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const n = t._prev,
            r = t._next;
          return (
            null === n ? (this._itHead = r) : (n._next = r),
            null === r ? (this._itTail = n) : (r._prev = n),
            t
          );
        }
        _addToMoves(t, n) {
          return (
            t.previousIndex === n ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = t)
                  : (this._movesTail._nextMoved = t)),
            t
          );
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new Ky()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t),
                (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, n) {
          return (
            (t.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          );
        }
      }
      class ax {
        constructor(t, n) {
          (this.item = t),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class lx {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t),
              (t._nextDup = null),
              (t._prevDup = null))
            : ((this._tail._nextDup = t),
              (t._prevDup = this._tail),
              (t._nextDup = null),
              (this._tail = t));
        }
        get(t, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === n || n <= r.currentIndex) &&
              Object.is(r.trackById, t)
            )
              return r;
          return null;
        }
        remove(t) {
          const n = t._prevDup,
            r = t._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class Ky {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const n = t.trackById;
          let r = this.map.get(n);
          r || ((r = new lx()), this.map.set(n, r)), r.add(t);
        }
        get(t, n) {
          const o = this.map.get(t);
          return o ? o.get(t, n) : null;
        }
        remove(t) {
          const n = t.trackById;
          return this.map.get(n).remove(t) && this.map.delete(n), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function Jy(e, t, n) {
        const r = e.previousIndex;
        if (null === r) return r;
        let o = 0;
        return n && r < n.length && (o = n[r]), r + t + o;
      }
      function Xy() {
        return new Ls([new Zy()]);
      }
      let Ls = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || Xy()),
              deps: [[e, new xo(), new An()]],
            };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (null != r) return r;
            throw new Q(901, "");
          }
        }
        return (e.ɵprov = R({ token: e, providedIn: "root", factory: Xy })), e;
      })();
      const hx = jy(null, "core", []);
      let px = (() => {
          class e {
            constructor(n) {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(mc));
            }),
            (e.ɵmod = mt({ type: e })),
            (e.ɵinj = ot({})),
            e
          );
        })(),
        Bs = null;
      function Yt() {
        return Bs;
      }
      const dt = new H("DocumentToken");
      let Yn = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({
            token: e,
            factory: function () {
              return (function vx() {
                return S(tv);
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      const _x = new H("Location Initialized");
      let tv = (() => {
        class e extends Yn {
          constructor(n) {
            super(), (this._doc = n), this._init();
          }
          _init() {
            (this.location = window.location), (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return Yt().getBaseHref(this._doc);
          }
          onPopState(n) {
            const r = Yt().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", n, !1),
              () => r.removeEventListener("popstate", n)
            );
          }
          onHashChange(n) {
            const r = Yt().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", n, !1),
              () => r.removeEventListener("hashchange", n)
            );
          }
          get href() {
            return this.location.href;
          }
          get protocol() {
            return this.location.protocol;
          }
          get hostname() {
            return this.location.hostname;
          }
          get port() {
            return this.location.port;
          }
          get pathname() {
            return this.location.pathname;
          }
          get search() {
            return this.location.search;
          }
          get hash() {
            return this.location.hash;
          }
          set pathname(n) {
            this.location.pathname = n;
          }
          pushState(n, r, o) {
            nv() ? this._history.pushState(n, r, o) : (this.location.hash = o);
          }
          replaceState(n, r, o) {
            nv()
              ? this._history.replaceState(n, r, o)
              : (this.location.hash = o);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(dt));
          }),
          (e.ɵprov = R({
            token: e,
            factory: function () {
              return (function Cx() {
                return new tv(S(dt));
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      function nv() {
        return !!window.history.pushState;
      }
      function wc(e, t) {
        if (0 == e.length) return t;
        if (0 == t.length) return e;
        let n = 0;
        return (
          e.endsWith("/") && n++,
          t.startsWith("/") && n++,
          2 == n ? e + t.substring(1) : 1 == n ? e + t : e + "/" + t
        );
      }
      function rv(e) {
        const t = e.match(/#|\?|$/),
          n = (t && t.index) || e.length;
        return e.slice(0, n - ("/" === e[n - 1] ? 1 : 0)) + e.slice(n);
      }
      function gn(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let Yr = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({
            token: e,
            factory: function () {
              return (function Dx(e) {
                const t = S(dt).location;
                return new ov(S(Yn), (t && t.origin) || "");
              })();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      const bc = new H("appBaseHref");
      let ov = (() => {
          class e extends Yr {
            constructor(n, r) {
              if (
                (super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                null == r && (r = this._platformLocation.getBaseHrefFromDOM()),
                null == r)
              )
                throw new Error(
                  "No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document."
                );
              this._baseHref = r;
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return wc(this._baseHref, n);
            }
            path(n = !1) {
              const r =
                  this._platformLocation.pathname +
                  gn(this._platformLocation.search),
                o = this._platformLocation.hash;
              return o && n ? `${r}${o}` : r;
            }
            pushState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + gn(i));
              this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + gn(i));
              this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            historyGo(n = 0) {
              var r, o;
              null === (o = (r = this._platformLocation).historyGo) ||
                void 0 === o ||
                o.call(r, n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(Yn), S(bc, 8));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        wx = (() => {
          class e extends Yr {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(n) {
              const r = wc(this._baseHref, n);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + gn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + gn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            historyGo(n = 0) {
              var r, o;
              null === (o = (r = this._platformLocation).historyGo) ||
                void 0 === o ||
                o.call(r, n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(Yn), S(bc, 8));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Ec = (() => {
          class e {
            constructor(n, r) {
              (this._subject = new me()),
                (this._urlChangeListeners = []),
                (this._platformStrategy = n);
              const o = this._platformStrategy.getBaseHref();
              (this._platformLocation = r),
                (this._baseHref = rv(iv(o))),
                this._platformStrategy.onPopState((i) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: i.state,
                    type: i.type,
                  });
                });
            }
            path(n = !1) {
              return this.normalize(this._platformStrategy.path(n));
            }
            getState() {
              return this._platformLocation.getState();
            }
            isCurrentPathEqualTo(n, r = "") {
              return this.path() == this.normalize(n + gn(r));
            }
            normalize(n) {
              return e.stripTrailingSlash(
                (function Ex(e, t) {
                  return e && t.startsWith(e) ? t.substring(e.length) : t;
                })(this._baseHref, iv(n))
              );
            }
            prepareExternalUrl(n) {
              return (
                n && "/" !== n[0] && (n = "/" + n),
                this._platformStrategy.prepareExternalUrl(n)
              );
            }
            go(n, r = "", o = null) {
              this._platformStrategy.pushState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + gn(r)),
                  o
                );
            }
            replaceState(n, r = "", o = null) {
              this._platformStrategy.replaceState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + gn(r)),
                  o
                );
            }
            forward() {
              this._platformStrategy.forward();
            }
            back() {
              this._platformStrategy.back();
            }
            historyGo(n = 0) {
              var r, o;
              null === (o = (r = this._platformStrategy).historyGo) ||
                void 0 === o ||
                o.call(r, n);
            }
            onUrlChange(n) {
              this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  }));
            }
            _notifyUrlChangeListeners(n = "", r) {
              this._urlChangeListeners.forEach((o) => o(n, r));
            }
            subscribe(n, r, o) {
              return this._subject.subscribe({
                next: n,
                error: r,
                complete: o,
              });
            }
          }
          return (
            (e.normalizeQueryParams = gn),
            (e.joinWithSlash = wc),
            (e.stripTrailingSlash = rv),
            (e.ɵfac = function (n) {
              return new (n || e)(S(Yr), S(Yn));
            }),
            (e.ɵprov = R({
              token: e,
              factory: function () {
                return (function bx() {
                  return new Ec(S(Yr), S(Yn));
                })();
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function iv(e) {
        return e.replace(/\/index.html$/, "");
      }
      function pv(e, t) {
        t = encodeURIComponent(t);
        for (const n of e.split(";")) {
          const r = n.indexOf("="),
            [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
          if (o.trim() === t) return decodeURIComponent(i);
        }
        return null;
      }
      class uT {
        constructor(t, n, r, o) {
          (this.$implicit = t),
            (this.ngForOf = n),
            (this.index = r),
            (this.count = o);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let gv = (() => {
        class e {
          constructor(n, r, o) {
            (this._viewContainer = n),
              (this._template = r),
              (this._differs = o),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ &&
                n &&
                (this._differ = this._differs
                  .find(n)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((o, i, s) => {
              if (null == o.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new uT(o.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === i ? void 0 : i);
              else if (null !== i) {
                const a = r.get(i);
                r.move(a, s), mv(a, o);
              }
            });
            for (let o = 0, i = r.length; o < i; o++) {
              const a = r.get(o).context;
              (a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((o) => {
              mv(r.get(o.currentIndex), o);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(y(kt), y(pn), y(Ls));
          }),
          (e.ɵdir = O({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
          })),
          e
        );
      })();
      function mv(e, t) {
        e.context.$implicit = t.item;
      }
      let Cv = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = mt({ type: e })),
          (e.ɵinj = ot({})),
          e
        );
      })();
      let HT = (() => {
        class e {}
        return (
          (e.ɵprov = R({
            token: e,
            providedIn: "root",
            factory: () => new UT(S(dt), window),
          })),
          e
        );
      })();
      class UT {
        constructor(t, n) {
          (this.document = t), (this.window = n), (this.offset = () => [0, 0]);
        }
        setOffset(t) {
          this.offset = Array.isArray(t) ? () => t : t;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(t) {
          this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
          if (!this.supportsScrolling()) return;
          const n = (function $T(e, t) {
            const n = e.getElementById(t) || e.getElementsByName(t)[0];
            if (n) return n;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              (e.body.createShadowRoot || e.body.attachShadow)
            ) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let o = r.currentNode;
              for (; o; ) {
                const i = o.shadowRoot;
                if (i) {
                  const s =
                    i.getElementById(t) || i.querySelector(`[name="${t}"]`);
                  if (s) return s;
                }
                o = r.nextNode();
              }
            }
            return null;
          })(this.document, t);
          n && (this.scrollToElement(n), n.focus());
        }
        setHistoryScrollRestoration(t) {
          if (this.supportScrollRestoration()) {
            const n = this.window.history;
            n && n.scrollRestoration && (n.scrollRestoration = t);
          }
        }
        scrollToElement(t) {
          const n = t.getBoundingClientRect(),
            r = n.left + this.window.pageXOffset,
            o = n.top + this.window.pageYOffset,
            i = this.offset();
          this.window.scrollTo(r - i[0], o - i[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const t =
              wv(this.window.history) ||
              wv(Object.getPrototypeOf(this.window.history));
            return !(!t || (!t.writable && !t.set));
          } catch (t) {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch (t) {
            return !1;
          }
        }
      }
      function wv(e) {
        return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
      }
      class bv {}
      class Lc extends class GT extends class yx {} {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      } {
        static makeCurrent() {
          !(function mx(e) {
            Bs || (Bs = e);
          })(new Lc());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r, !1),
            () => {
              t.removeEventListener(n, r, !1);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n
            ? window
            : "document" === n
            ? t
            : "body" === n
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const n = (function zT() {
            return (
              (si = si || document.querySelector("base")),
              si ? si.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function qT(e) {
                (Zs = Zs || document.createElement("a")),
                  Zs.setAttribute("href", e);
                const t = Zs.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          si = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return pv(document.cookie, t);
        }
      }
      let Zs,
        si = null;
      const Ev = new H("TRANSITION_ID"),
        QT = [
          {
            provide: sc,
            useFactory: function WT(e, t, n) {
              return () => {
                n.get(ac).donePromise.then(() => {
                  const r = Yt(),
                    o = t.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let i = 0; i < o.length; i++) r.remove(o[i]);
                });
              };
            },
            deps: [Ev, dt, Qe],
            multi: !0,
          },
        ];
      class Bc {
        static init() {
          !(function $I(e) {
            pc = e;
          })(new Bc());
        }
        addToWindow(t) {
          (te.getAngularTestability = (r, o = !0) => {
            const i = t.findTestabilityInTree(r, o);
            if (null == i)
              throw new Error("Could not find testability for element.");
            return i;
          }),
            (te.getAllAngularTestabilities = () => t.getAllTestabilities()),
            (te.getAllAngularRootElements = () => t.getAllRootElements()),
            te.frameworkStabilizers || (te.frameworkStabilizers = []),
            te.frameworkStabilizers.push((r) => {
              const o = te.getAllAngularTestabilities();
              let i = o.length,
                s = !1;
              const a = function (l) {
                (s = s || l), i--, 0 == i && r(s);
              };
              o.forEach(function (l) {
                l.whenStable(a);
              });
            });
        }
        findTestabilityInTree(t, n, r) {
          if (null == n) return null;
          const o = t.getTestability(n);
          return null != o
            ? o
            : r
            ? Yt().isShadowRoot(n)
              ? this.findTestabilityInTree(t, n.host, !0)
              : this.findTestabilityInTree(t, n.parentElement, !0)
            : null;
        }
      }
      let ZT = (() => {
        class e {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Ks = new H("EventManagerPlugins");
      let Js = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((o) => (o.manager = this)),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          addGlobalEventListener(n, r, o) {
            return this._findPluginFor(r).addGlobalEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            const r = this._eventNameToPlugin.get(n);
            if (r) return r;
            const o = this._plugins;
            for (let i = 0; i < o.length; i++) {
              const s = o[i];
              if (s.supports(n)) return this._eventNameToPlugin.set(n, s), s;
            }
            throw new Error(`No event manager plugin found for event ${n}`);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(Ks), S(Ve));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Mv {
        constructor(t) {
          this._doc = t;
        }
        addGlobalEventListener(t, n, r) {
          const o = Yt().getGlobalEventTarget(this._doc, t);
          if (!o)
            throw new Error(`Unsupported event target ${o} for event ${n}`);
          return this.addEventListener(o, n, r);
        }
      }
      let Av = (() => {
          class e {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(n) {
              const r = new Set();
              n.forEach((o) => {
                this._stylesSet.has(o) || (this._stylesSet.add(o), r.add(o));
              }),
                this.onStylesAdded(r);
            }
            onStylesAdded(n) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        ai = (() => {
          class e extends Av {
            constructor(n) {
              super(),
                (this._doc = n),
                (this._hostNodes = new Map()),
                this._hostNodes.set(n.head, []);
            }
            _addStylesToHost(n, r, o) {
              n.forEach((i) => {
                const s = this._doc.createElement("style");
                (s.textContent = i), o.push(r.appendChild(s));
              });
            }
            addHost(n) {
              const r = [];
              this._addStylesToHost(this._stylesSet, n, r),
                this._hostNodes.set(n, r);
            }
            removeHost(n) {
              const r = this._hostNodes.get(n);
              r && r.forEach(Sv), this._hostNodes.delete(n);
            }
            onStylesAdded(n) {
              this._hostNodes.forEach((r, o) => {
                this._addStylesToHost(n, o, r);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((n) => n.forEach(Sv));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(dt));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      function Sv(e) {
        Yt().remove(e);
      }
      const jc = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Hc = /%COMP%/g;
      function Ys(e, t, n) {
        for (let r = 0; r < t.length; r++) {
          let o = t[r];
          Array.isArray(o) ? Ys(e, o, n) : ((o = o.replace(Hc, e)), n.push(o));
        }
        return n;
      }
      function Tv(e) {
        return (t) => {
          if ("__ngUnwrap__" === t) return e;
          !1 === e(t) && (t.preventDefault(), (t.returnValue = !1));
        };
      }
      let Uc = (() => {
        class e {
          constructor(n, r, o) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new $c(n));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case Ht.Emulated: {
                let o = this.rendererByCompId.get(r.id);
                return (
                  o ||
                    ((o = new t1(
                      this.eventManager,
                      this.sharedStylesHost,
                      r,
                      this.appId
                    )),
                    this.rendererByCompId.set(r.id, o)),
                  o.applyToHost(n),
                  o
                );
              }
              case 1:
              case Ht.ShadowDom:
                return new n1(this.eventManager, this.sharedStylesHost, n, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const o = Ys(r.id, r.styles, []);
                  this.sharedStylesHost.addStyles(o),
                    this.rendererByCompId.set(r.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(Js), S(ai), S(ni));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class $c {
        constructor(t) {
          (this.eventManager = t),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? document.createElementNS(jc[n] || n, t)
            : document.createElement(t);
        }
        createComment(t) {
          return document.createComment(t);
        }
        createText(t) {
          return document.createTextNode(t);
        }
        appendChild(t, n) {
          t.appendChild(n);
        }
        insertBefore(t, n, r) {
          t && t.insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? document.querySelector(t) : t;
          if (!r)
            throw new Error(`The selector "${t}" did not match any elements`);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, o) {
          if (o) {
            n = o + ":" + n;
            const i = jc[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const o = jc[r];
            o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, o) {
          o & (lt.DashCase | lt.Important)
            ? t.style.setProperty(n, r, o & lt.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & lt.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          return "string" == typeof t
            ? this.eventManager.addGlobalEventListener(t, n, Tv(r))
            : this.eventManager.addEventListener(t, n, Tv(r));
        }
      }
      class t1 extends $c {
        constructor(t, n, r, o) {
          super(t), (this.component = r);
          const i = Ys(o + "-" + r.id, r.styles, []);
          n.addStyles(i),
            (this.contentAttr = (function YT(e) {
              return "_ngcontent-%COMP%".replace(Hc, e);
            })(o + "-" + r.id)),
            (this.hostAttr = (function XT(e) {
              return "_nghost-%COMP%".replace(Hc, e);
            })(o + "-" + r.id));
        }
        applyToHost(t) {
          super.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      class n1 extends $c {
        constructor(t, n, r, o) {
          super(t),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const i = Ys(o.id, o.styles, []);
          for (let s = 0; s < i.length; s++) {
            const a = document.createElement("style");
            (a.textContent = i[s]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          );
        }
      }
      let r1 = (() => {
        class e extends Mv {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return (
              n.addEventListener(r, o, !1),
              () => this.removeEventListener(n, r, o)
            );
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(dt));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Pv = ["alt", "control", "meta", "shift"],
        i1 = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        Fv = {
          A: "1",
          B: "2",
          C: "3",
          D: "4",
          E: "5",
          F: "6",
          G: "7",
          H: "8",
          I: "9",
          J: "*",
          K: "+",
          M: "-",
          N: ".",
          O: "/",
          "`": "0",
          "\x90": "NumLock",
        },
        s1 = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let a1 = (() => {
        class e extends Mv {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, o) {
            const i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Yt().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = e._normalizeKey(r.pop());
            let s = "";
            if (
              (Pv.forEach((l) => {
                const u = r.indexOf(l);
                u > -1 && (r.splice(u, 1), (s += l + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const a = {};
            return (a.domEventName = o), (a.fullKey = s), a;
          }
          static getEventFullKey(n) {
            let r = "",
              o = (function l1(e) {
                let t = e.key;
                if (null == t) {
                  if (((t = e.keyIdentifier), null == t)) return "Unidentified";
                  t.startsWith("U+") &&
                    ((t = String.fromCharCode(parseInt(t.substring(2), 16))),
                    3 === e.location && Fv.hasOwnProperty(t) && (t = Fv[t]));
                }
                return i1[t] || t;
              })(n);
            return (
              (o = o.toLowerCase()),
              " " === o ? (o = "space") : "." === o && (o = "dot"),
              Pv.forEach((i) => {
                i != o && s1[i](n) && (r += i + ".");
              }),
              (r += o),
              r
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              e.getEventFullKey(i) === n && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(dt));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const f1 = jy(hx, "browser", [
          { provide: uc, useValue: "browser" },
          {
            provide: Py,
            useValue: function u1() {
              Lc.makeCurrent(), Bc.init();
            },
            multi: !0,
          },
          {
            provide: dt,
            useFactory: function d1() {
              return (
                (function _w(e) {
                  el = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        h1 = [
          { provide: gu, useValue: "root" },
          {
            provide: No,
            useFactory: function c1() {
              return new No();
            },
            deps: [],
          },
          { provide: Ks, useClass: r1, multi: !0, deps: [dt, Ve, uc] },
          { provide: Ks, useClass: a1, multi: !0, deps: [dt] },
          { provide: Uc, useClass: Uc, deps: [Js, ai, ni] },
          { provide: Zm, useExisting: Uc },
          { provide: Av, useExisting: ai },
          { provide: ai, useClass: ai, deps: [dt] },
          { provide: hc, useClass: hc, deps: [Ve] },
          { provide: Js, useClass: Js, deps: [Ks, Ve] },
          { provide: bv, useClass: ZT, deps: [] },
        ];
      let p1 = (() => {
        class e {
          constructor(n) {
            if (n)
              throw new Error(
                "BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead."
              );
          }
          static withServerTransition(n) {
            return {
              ngModule: e,
              providers: [
                { provide: ni, useValue: n.appId },
                { provide: Ev, useExisting: ni },
                QT,
              ],
            };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(e, 12));
          }),
          (e.ɵmod = mt({ type: e })),
          (e.ɵinj = ot({ providers: h1, imports: [Cv, px] })),
          e
        );
      })();
      "undefined" != typeof window && window;
      const { isArray: M1 } = Array,
        { getPrototypeOf: A1, prototype: S1, keys: I1 } = Object;
      function kv(e) {
        if (1 === e.length) {
          const t = e[0];
          if (M1(t)) return { args: t, keys: null };
          if (
            (function x1(e) {
              return e && "object" == typeof e && A1(e) === S1;
            })(t)
          ) {
            const n = I1(t);
            return { args: n.map((r) => t[r]), keys: n };
          }
        }
        return { args: e, keys: null };
      }
      const { isArray: T1 } = Array;
      function Vv(e) {
        return Y((t) =>
          (function O1(e, t) {
            return T1(t) ? e(...t) : e(t);
          })(e, t)
        );
      }
      function Lv(e, t) {
        return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
      }
      let Bv = (() => {
          class e {
            constructor(n, r) {
              (this._renderer = n),
                (this._elementRef = r),
                (this.onChange = (o) => {}),
                (this.onTouched = () => {});
            }
            setProperty(n, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, n, r);
            }
            registerOnTouched(n) {
              this.onTouched = n;
            }
            registerOnChange(n) {
              this.onChange = n;
            }
            setDisabledState(n) {
              this.setProperty("disabled", n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(y(fn), y(ct));
            }),
            (e.ɵdir = O({ type: e })),
            e
          );
        })(),
        Xn = (() => {
          class e extends Bv {}
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = He(e)))(r || e);
              };
            })()),
            (e.ɵdir = O({ type: e, features: [ee] })),
            e
          );
        })();
      const Xt = new H("NgValueAccessor"),
        R1 = { provide: Xt, useExisting: se(() => er), multi: !0 },
        k1 = new H("CompositionEventMode");
      let er = (() => {
        class e extends Bv {
          constructor(n, r, o) {
            super(n, r),
              (this._compositionMode = o),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function N1() {
                  const e = Yt() ? Yt().getUserAgent() : "";
                  return /android (\d+)/.test(e.toLowerCase());
                })());
          }
          writeValue(n) {
            this.setProperty("value", null == n ? "" : n);
          }
          _handleInput(n) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(n);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(n) {
            (this._composing = !1), this._compositionMode && this.onChange(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(y(fn), y(ct), y(k1, 8));
          }),
          (e.ɵdir = O({
            type: e,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (n, r) {
              1 & n &&
                K("input", function (i) {
                  return r._handleInput(i.target.value);
                })("blur", function () {
                  return r.onTouched();
                })("compositionstart", function () {
                  return r._compositionStart();
                })("compositionend", function (i) {
                  return r._compositionEnd(i.target.value);
                });
            },
            features: [ce([R1]), ee],
          })),
          e
        );
      })();
      function Pn(e) {
        return null == e || 0 === e.length;
      }
      function Hv(e) {
        return null != e && "number" == typeof e.length;
      }
      const Ge = new H("NgValidators"),
        Fn = new H("NgAsyncValidators");
      function Gv(e) {
        return Pn(e.value) ? { required: !0 } : null;
      }
      function Xs(e) {
        return null;
      }
      function Kv(e) {
        return null != e;
      }
      function Jv(e) {
        const t = $o(e) ? Fe(e) : e;
        return Tu(t), t;
      }
      function Yv(e) {
        let t = {};
        return (
          e.forEach((n) => {
            t = null != n ? Object.assign(Object.assign({}, t), n) : t;
          }),
          0 === Object.keys(t).length ? null : t
        );
      }
      function Xv(e, t) {
        return t.map((n) => n(e));
      }
      function e_(e) {
        return e.map((t) =>
          (function L1(e) {
            return !e.validate;
          })(t)
            ? t
            : (n) => t.validate(n)
        );
      }
      function zc(e) {
        return null != e
          ? (function t_(e) {
              if (!e) return null;
              const t = e.filter(Kv);
              return 0 == t.length
                ? null
                : function (n) {
                    return Yv(Xv(n, t));
                  };
            })(e_(e))
          : null;
      }
      function qc(e) {
        return null != e
          ? (function n_(e) {
              if (!e) return null;
              const t = e.filter(Kv);
              return 0 == t.length
                ? null
                : function (n) {
                    return (function P1(...e) {
                      const t = vf(e),
                        { args: n, keys: r } = kv(e),
                        o = new ye((i) => {
                          const { length: s } = n;
                          if (!s) return void i.complete();
                          const a = new Array(s);
                          let l = s,
                            u = s;
                          for (let c = 0; c < s; c++) {
                            let d = !1;
                            jt(n[c]).subscribe(
                              Oe(
                                i,
                                (f) => {
                                  d || ((d = !0), u--), (a[c] = f);
                                },
                                () => l--,
                                void 0,
                                () => {
                                  (!l || !d) &&
                                    (u || i.next(r ? Lv(r, a) : a),
                                    i.complete());
                                }
                              )
                            );
                          }
                        });
                      return t ? o.pipe(Vv(t)) : o;
                    })(Xv(n, t).map(Jv)).pipe(Y(Yv));
                  };
            })(e_(e))
          : null;
      }
      function r_(e, t) {
        return null === e ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
      }
      function Wc(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function ea(e, t) {
        return Array.isArray(e) ? e.includes(t) : e === t;
      }
      function s_(e, t) {
        const n = Wc(t);
        return (
          Wc(e).forEach((o) => {
            ea(n, o) || n.push(o);
          }),
          n
        );
      }
      function a_(e, t) {
        return Wc(t).filter((n) => !ea(e, n));
      }
      class l_ {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(t) {
          (this._rawValidators = t || []),
            (this._composedValidatorFn = zc(this._rawValidators));
        }
        _setAsyncValidators(t) {
          (this._rawAsyncValidators = t || []),
            (this._composedAsyncValidatorFn = qc(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(t) {
          this._onDestroyCallbacks.push(t);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((t) => t()),
            (this._onDestroyCallbacks = []);
        }
        reset(t) {
          this.control && this.control.reset(t);
        }
        hasError(t, n) {
          return !!this.control && this.control.hasError(t, n);
        }
        getError(t, n) {
          return this.control ? this.control.getError(t, n) : null;
        }
      }
      class Rn extends l_ {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class Ye extends l_ {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class u_ {
        constructor(t) {
          this._cd = t;
        }
        is(t) {
          var n, r, o;
          return "submitted" === t
            ? !!(null === (n = this._cd) || void 0 === n ? void 0 : n.submitted)
            : !!(null ===
                (o =
                  null === (r = this._cd) || void 0 === r
                    ? void 0
                    : r.control) || void 0 === o
                ? void 0
                : o[t]);
        }
      }
      let li = (() => {
          class e extends u_ {
            constructor(n) {
              super(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(y(Rn, 2));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (n, r) {
                2 & n &&
                  z("ng-untouched", r.is("untouched"))(
                    "ng-touched",
                    r.is("touched")
                  )("ng-pristine", r.is("pristine"))("ng-dirty", r.is("dirty"))(
                    "ng-valid",
                    r.is("valid")
                  )("ng-invalid", r.is("invalid"))(
                    "ng-pending",
                    r.is("pending")
                  );
              },
              features: [ee],
            })),
            e
          );
        })(),
        ui = (() => {
          class e extends u_ {
            constructor(n) {
              super(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(y(Ye, 10));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [
                ["", "formGroupName", ""],
                ["", "formArrayName", ""],
                ["", "ngModelGroup", ""],
                ["", "formGroup", ""],
                ["form", 3, "ngNoForm", ""],
                ["", "ngForm", ""],
              ],
              hostVars: 16,
              hostBindings: function (n, r) {
                2 & n &&
                  z("ng-untouched", r.is("untouched"))(
                    "ng-touched",
                    r.is("touched")
                  )("ng-pristine", r.is("pristine"))("ng-dirty", r.is("dirty"))(
                    "ng-valid",
                    r.is("valid")
                  )("ng-invalid", r.is("invalid"))(
                    "ng-pending",
                    r.is("pending")
                  )("ng-submitted", r.is("submitted"));
              },
              features: [ee],
            })),
            e
          );
        })();
      function ci(e, t) {
        Kc(e, t),
          t.valueAccessor.writeValue(e.value),
          (function q1(e, t) {
            t.valueAccessor.registerOnChange((n) => {
              (e._pendingValue = n),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                "change" === e.updateOn && d_(e, t);
            });
          })(e, t),
          (function Q1(e, t) {
            const n = (r, o) => {
              t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
            };
            e.registerOnChange(n),
              t._registerOnDestroy(() => {
                e._unregisterOnChange(n);
              });
          })(e, t),
          (function W1(e, t) {
            t.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                "blur" === e.updateOn && e._pendingChange && d_(e, t),
                "submit" !== e.updateOn && e.markAsTouched();
            });
          })(e, t),
          (function z1(e, t) {
            if (t.valueAccessor.setDisabledState) {
              const n = (r) => {
                t.valueAccessor.setDisabledState(r);
              };
              e.registerOnDisabledChange(n),
                t._registerOnDestroy(() => {
                  e._unregisterOnDisabledChange(n);
                });
            }
          })(e, t);
      }
      function oa(e, t) {
        e.forEach((n) => {
          n.registerOnValidatorChange && n.registerOnValidatorChange(t);
        });
      }
      function Kc(e, t) {
        const n = (function o_(e) {
          return e._rawValidators;
        })(e);
        null !== t.validator
          ? e.setValidators(r_(n, t.validator))
          : "function" == typeof n && e.setValidators([n]);
        const r = (function i_(e) {
          return e._rawAsyncValidators;
        })(e);
        null !== t.asyncValidator
          ? e.setAsyncValidators(r_(r, t.asyncValidator))
          : "function" == typeof r && e.setAsyncValidators([r]);
        const o = () => e.updateValueAndValidity();
        oa(t._rawValidators, o), oa(t._rawAsyncValidators, o);
      }
      function d_(e, t) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          t.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      function Xc(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      const di = "VALID",
        sa = "INVALID",
        Xr = "PENDING",
        fi = "DISABLED";
      function td(e) {
        return (aa(e) ? e.validators : e) || null;
      }
      function g_(e) {
        return Array.isArray(e) ? zc(e) : e || null;
      }
      function nd(e, t) {
        return (aa(t) ? t.asyncValidators : e) || null;
      }
      function m_(e) {
        return Array.isArray(e) ? qc(e) : e || null;
      }
      function aa(e) {
        return null != e && !Array.isArray(e) && "object" == typeof e;
      }
      const rd = (e) => e instanceof id;
      function v_(e) {
        return ((e) => e instanceof D_)(e) ? e.value : e.getRawValue();
      }
      function __(e, t) {
        const n = rd(e),
          r = e.controls;
        if (!(n ? Object.keys(r) : r).length) throw new Q(1e3, "");
        if (!r[t]) throw new Q(1001, "");
      }
      function C_(e, t) {
        rd(e),
          e._forEachChild((r, o) => {
            if (void 0 === t[o]) throw new Q(1002, "");
          });
      }
      class od {
        constructor(t, n) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            (this._rawValidators = t),
            (this._rawAsyncValidators = n),
            (this._composedValidatorFn = g_(this._rawValidators)),
            (this._composedAsyncValidatorFn = m_(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(t) {
          this._rawValidators = this._composedValidatorFn = t;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(t) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === di;
        }
        get invalid() {
          return this.status === sa;
        }
        get pending() {
          return this.status == Xr;
        }
        get disabled() {
          return this.status === fi;
        }
        get enabled() {
          return this.status !== fi;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(t) {
          (this._rawValidators = t), (this._composedValidatorFn = g_(t));
        }
        setAsyncValidators(t) {
          (this._rawAsyncValidators = t),
            (this._composedAsyncValidatorFn = m_(t));
        }
        addValidators(t) {
          this.setValidators(s_(t, this._rawValidators));
        }
        addAsyncValidators(t) {
          this.setAsyncValidators(s_(t, this._rawAsyncValidators));
        }
        removeValidators(t) {
          this.setValidators(a_(t, this._rawValidators));
        }
        removeAsyncValidators(t) {
          this.setAsyncValidators(a_(t, this._rawAsyncValidators));
        }
        hasValidator(t) {
          return ea(this._rawValidators, t);
        }
        hasAsyncValidator(t) {
          return ea(this._rawAsyncValidators, t);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(t = {}) {
          (this.touched = !0),
            this._parent && !t.onlySelf && this._parent.markAsTouched(t);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((t) => t.markAllAsTouched());
        }
        markAsUntouched(t = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((n) => {
              n.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        markAsDirty(t = {}) {
          (this.pristine = !1),
            this._parent && !t.onlySelf && this._parent.markAsDirty(t);
        }
        markAsPristine(t = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((n) => {
              n.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        markAsPending(t = {}) {
          (this.status = Xr),
            !1 !== t.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !t.onlySelf && this._parent.markAsPending(t);
        }
        disable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = fi),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable(Object.assign(Object.assign({}, t), { onlySelf: !0 }));
            }),
            this._updateValue(),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors(
              Object.assign(Object.assign({}, t), { skipPristineCheck: n })
            ),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = di),
            this._forEachChild((r) => {
              r.enable(Object.assign(Object.assign({}, t), { onlySelf: !0 }));
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            }),
            this._updateAncestors(
              Object.assign(Object.assign({}, t), { skipPristineCheck: n })
            ),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(t) {
          this._parent &&
            !t.onlySelf &&
            (this._parent.updateValueAndValidity(t),
            t.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(t) {
          this._parent = t;
        }
        updateValueAndValidity(t = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === di || this.status === Xr) &&
                this._runAsyncValidator(t.emitEvent)),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !t.onlySelf &&
              this._parent.updateValueAndValidity(t);
        }
        _updateTreeValidity(t = { emitEvent: !0 }) {
          this._forEachChild((n) => n._updateTreeValidity(t)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? fi : di;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(t) {
          if (this.asyncValidator) {
            (this.status = Xr), (this._hasOwnPendingAsyncValidator = !0);
            const n = Jv(this.asyncValidator(this));
            this._asyncValidationSubscription = n.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: t });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(t, n = {}) {
          (this.errors = t), this._updateControlsErrors(!1 !== n.emitEvent);
        }
        get(t) {
          return (function Y1(e, t, n) {
            if (
              null == t ||
              (Array.isArray(t) || (t = t.split(n)),
              Array.isArray(t) && 0 === t.length)
            )
              return null;
            let r = e;
            return (
              t.forEach((o) => {
                r = rd(r)
                  ? r.controls.hasOwnProperty(o)
                    ? r.controls[o]
                    : null
                  : (((e) => e instanceof eO)(r) && r.at(o)) || null;
              }),
              r
            );
          })(this, t, ".");
        }
        getError(t, n) {
          const r = n ? this.get(n) : this;
          return r && r.errors ? r.errors[t] : null;
        }
        hasError(t, n) {
          return !!this.getError(t, n);
        }
        get root() {
          let t = this;
          for (; t._parent; ) t = t._parent;
          return t;
        }
        _updateControlsErrors(t) {
          (this.status = this._calculateStatus()),
            t && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(t);
        }
        _initObservables() {
          (this.valueChanges = new me()), (this.statusChanges = new me());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? fi
            : this.errors
            ? sa
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(Xr)
            ? Xr
            : this._anyControlsHaveStatus(sa)
            ? sa
            : di;
        }
        _anyControlsHaveStatus(t) {
          return this._anyControls((n) => n.status === t);
        }
        _anyControlsDirty() {
          return this._anyControls((t) => t.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((t) => t.touched);
        }
        _updatePristine(t = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        _updateTouched(t = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        _isBoxedValue(t) {
          return (
            "object" == typeof t &&
            null !== t &&
            2 === Object.keys(t).length &&
            "value" in t &&
            "disabled" in t
          );
        }
        _registerOnCollectionChange(t) {
          this._onCollectionChange = t;
        }
        _setUpdateStrategy(t) {
          aa(t) && null != t.updateOn && (this._updateOn = t.updateOn);
        }
        _parentMarkedDirty(t) {
          return (
            !t &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
      }
      class D_ extends od {
        constructor(t = null, n, r) {
          super(td(n), nd(r, n)),
            (this.defaultValue = null),
            (this._onChange = []),
            (this._pendingChange = !1),
            this._applyFormState(t),
            this._setUpdateStrategy(n),
            this._initObservables(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            }),
            aa(n) &&
              n.initialValueIsDefault &&
              (this.defaultValue = this._isBoxedValue(t) ? t.value : t);
        }
        setValue(t, n = {}) {
          (this.value = this._pendingValue = t),
            this._onChange.length &&
              !1 !== n.emitModelToViewChange &&
              this._onChange.forEach((r) =>
                r(this.value, !1 !== n.emitViewToModelChange)
              ),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          this.setValue(t, n);
        }
        reset(t = this.defaultValue, n = {}) {
          this._applyFormState(t),
            this.markAsPristine(n),
            this.markAsUntouched(n),
            this.setValue(this.value, n),
            (this._pendingChange = !1);
        }
        _updateValue() {}
        _anyControls(t) {
          return !1;
        }
        _allControlsDisabled() {
          return this.disabled;
        }
        registerOnChange(t) {
          this._onChange.push(t);
        }
        _unregisterOnChange(t) {
          Xc(this._onChange, t);
        }
        registerOnDisabledChange(t) {
          this._onDisabledChange.push(t);
        }
        _unregisterOnDisabledChange(t) {
          Xc(this._onDisabledChange, t);
        }
        _forEachChild(t) {}
        _syncPendingControls() {
          return !(
            "submit" !== this.updateOn ||
            (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            !this._pendingChange) ||
            (this.setValue(this._pendingValue, {
              onlySelf: !0,
              emitModelToViewChange: !1,
            }),
            0)
          );
        }
        _applyFormState(t) {
          this._isBoxedValue(t)
            ? ((this.value = this._pendingValue = t.value),
              t.disabled
                ? this.disable({ onlySelf: !0, emitEvent: !1 })
                : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = t);
        }
      }
      class id extends od {
        constructor(t, n, r) {
          super(td(n), nd(r, n)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(t, n) {
          return this.controls[t]
            ? this.controls[t]
            : ((this.controls[t] = n),
              n.setParent(this),
              n._registerOnCollectionChange(this._onCollectionChange),
              n);
        }
        addControl(t, n, r = {}) {
          this.registerControl(t, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(t, n = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        setControl(t, n, r = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            n && this.registerControl(t, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(t) {
          return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
        }
        setValue(t, n = {}) {
          C_(this, t),
            Object.keys(t).forEach((r) => {
              __(this, r),
                this.controls[r].setValue(t[r], {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          null != t &&
            (Object.keys(t).forEach((r) => {
              this.controls[r] &&
                this.controls[r].patchValue(t[r], {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n));
        }
        reset(t = {}, n = {}) {
          this._forEachChild((r, o) => {
            r.reset(t[o], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this._reduceChildren({}, (t, n, r) => ((t[r] = v_(n)), t));
        }
        _syncPendingControls() {
          let t = this._reduceChildren(
            !1,
            (n, r) => !!r._syncPendingControls() || n
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          Object.keys(this.controls).forEach((n) => {
            const r = this.controls[n];
            r && t(r, n);
          });
        }
        _setUpControls() {
          this._forEachChild((t) => {
            t.setParent(this),
              t._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(t) {
          for (const n of Object.keys(this.controls)) {
            const r = this.controls[n];
            if (this.contains(n) && t(r)) return !0;
          }
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (t, n, r) => ((n.enabled || this.disabled) && (t[r] = n.value), t)
          );
        }
        _reduceChildren(t, n) {
          let r = t;
          return (
            this._forEachChild((o, i) => {
              r = n(r, o, i);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const t of Object.keys(this.controls))
            if (this.controls[t].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
      }
      class eO extends od {
        constructor(t, n, r) {
          super(td(n), nd(r, n)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        at(t) {
          return this.controls[t];
        }
        push(t, n = {}) {
          this.controls.push(t),
            this._registerControl(t),
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        insert(t, n, r = {}) {
          this.controls.splice(t, 0, n),
            this._registerControl(n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent });
        }
        removeAt(t, n = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            this.controls.splice(t, 1),
            this.updateValueAndValidity({ emitEvent: n.emitEvent });
        }
        setControl(t, n, r = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            this.controls.splice(t, 1),
            n && (this.controls.splice(t, 0, n), this._registerControl(n)),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        get length() {
          return this.controls.length;
        }
        setValue(t, n = {}) {
          C_(this, t),
            t.forEach((r, o) => {
              __(this, o),
                this.at(o).setValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          null != t &&
            (t.forEach((r, o) => {
              this.at(o) &&
                this.at(o).patchValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n));
        }
        reset(t = [], n = {}) {
          this._forEachChild((r, o) => {
            r.reset(t[o], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this.controls.map((t) => v_(t));
        }
        clear(t = {}) {
          this.controls.length < 1 ||
            (this._forEachChild((n) => n._registerOnCollectionChange(() => {})),
            this.controls.splice(0),
            this.updateValueAndValidity({ emitEvent: t.emitEvent }));
        }
        _syncPendingControls() {
          let t = this.controls.reduce(
            (n, r) => !!r._syncPendingControls() || n,
            !1
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          this.controls.forEach((n, r) => {
            t(n, r);
          });
        }
        _updateValue() {
          this.value = this.controls
            .filter((t) => t.enabled || this.disabled)
            .map((t) => t.value);
        }
        _anyControls(t) {
          return this.controls.some((n) => n.enabled && t(n));
        }
        _setUpControls() {
          this._forEachChild((t) => this._registerControl(t));
        }
        _allControlsDisabled() {
          for (const t of this.controls) if (t.enabled) return !1;
          return this.controls.length > 0 || this.disabled;
        }
        _registerControl(t) {
          t.setParent(this),
            t._registerOnCollectionChange(this._onCollectionChange);
        }
      }
      const tO = { provide: Ye, useExisting: se(() => tr) },
        hi = (() => Promise.resolve(null))();
      let tr = (() => {
        class e extends Ye {
          constructor(n, r) {
            super(),
              (this.submitted = !1),
              (this._directives = new Set()),
              (this.ngSubmit = new me()),
              (this.form = new id({}, zc(n), qc(r)));
          }
          ngAfterViewInit() {
            this._setUpdateStrategy();
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          get controls() {
            return this.form.controls;
          }
          addControl(n) {
            hi.then(() => {
              const r = this._findContainer(n.path);
              (n.control = r.registerControl(n.name, n.control)),
                ci(n.control, n),
                n.control.updateValueAndValidity({ emitEvent: !1 }),
                this._directives.add(n);
            });
          }
          getControl(n) {
            return this.form.get(n.path);
          }
          removeControl(n) {
            hi.then(() => {
              const r = this._findContainer(n.path);
              r && r.removeControl(n.name), this._directives.delete(n);
            });
          }
          addFormGroup(n) {
            hi.then(() => {
              const r = this._findContainer(n.path),
                o = new id({});
              (function f_(e, t) {
                Kc(e, t);
              })(o, n),
                r.registerControl(n.name, o),
                o.updateValueAndValidity({ emitEvent: !1 });
            });
          }
          removeFormGroup(n) {
            hi.then(() => {
              const r = this._findContainer(n.path);
              r && r.removeControl(n.name);
            });
          }
          getFormGroup(n) {
            return this.form.get(n.path);
          }
          updateModel(n, r) {
            hi.then(() => {
              this.form.get(n.path).setValue(r);
            });
          }
          setValue(n) {
            this.control.setValue(n);
          }
          onSubmit(n) {
            return (
              (this.submitted = !0),
              (function p_(e, t) {
                e._syncPendingControls(),
                  t.forEach((n) => {
                    const r = n.control;
                    "submit" === r.updateOn &&
                      r._pendingChange &&
                      (n.viewToModelUpdate(r._pendingValue),
                      (r._pendingChange = !1));
                  });
              })(this.form, this._directives),
              this.ngSubmit.emit(n),
              !1
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(n) {
            this.form.reset(n), (this.submitted = !1);
          }
          _setUpdateStrategy() {
            this.options &&
              null != this.options.updateOn &&
              (this.form._updateOn = this.options.updateOn);
          }
          _findContainer(n) {
            return n.pop(), n.length ? this.form.get(n) : this.form;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(y(Ge, 10), y(Fn, 10));
          }),
          (e.ɵdir = O({
            type: e,
            selectors: [
              ["form", 3, "ngNoForm", "", 3, "formGroup", ""],
              ["ng-form"],
              ["", "ngForm", ""],
            ],
            hostBindings: function (n, r) {
              1 & n &&
                K("submit", function (i) {
                  return r.onSubmit(i);
                })("reset", function () {
                  return r.onReset();
                });
            },
            inputs: { options: ["ngFormOptions", "options"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [ce([tO]), ee],
          })),
          e
        );
      })();
      const rO = { provide: Rn, useExisting: se(() => eo) },
        E_ = (() => Promise.resolve(null))();
      let eo = (() => {
          class e extends Rn {
            constructor(n, r, o, i, s) {
              super(),
                (this._changeDetectorRef = s),
                (this.control = new D_()),
                (this._registered = !1),
                (this.update = new me()),
                (this._parent = n),
                this._setValidators(r),
                this._setAsyncValidators(o),
                (this.valueAccessor = (function Yc(e, t) {
                  if (!t) return null;
                  let n, r, o;
                  return (
                    Array.isArray(t),
                    t.forEach((i) => {
                      i.constructor === er
                        ? (n = i)
                        : (function J1(e) {
                            return Object.getPrototypeOf(e.constructor) === Xn;
                          })(i)
                        ? (r = i)
                        : (o = i);
                    }),
                    o || r || n || null
                  );
                })(0, i));
            }
            ngOnChanges(n) {
              if ((this._checkForErrors(), !this._registered || "name" in n)) {
                if (
                  this._registered &&
                  (this._checkName(), this.formDirective)
                ) {
                  const r = n.name.previousValue;
                  this.formDirective.removeControl({
                    name: r,
                    path: this._getPath(r),
                  });
                }
                this._setUpControl();
              }
              "isDisabled" in n && this._updateDisabled(n),
                (function Jc(e, t) {
                  if (!e.hasOwnProperty("model")) return !1;
                  const n = e.model;
                  return !!n.isFirstChange() || !Object.is(t, n.currentValue);
                })(n, this.viewModel) &&
                  (this._updateValue(this.model),
                  (this.viewModel = this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            get path() {
              return this._getPath(this.name);
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            viewToModelUpdate(n) {
              (this.viewModel = n), this.update.emit(n);
            }
            _setUpControl() {
              this._setUpdateStrategy(),
                this._isStandalone()
                  ? this._setUpStandalone()
                  : this.formDirective.addControl(this),
                (this._registered = !0);
            }
            _setUpdateStrategy() {
              this.options &&
                null != this.options.updateOn &&
                (this.control._updateOn = this.options.updateOn);
            }
            _isStandalone() {
              return (
                !this._parent || !(!this.options || !this.options.standalone)
              );
            }
            _setUpStandalone() {
              ci(this.control, this),
                this.control.updateValueAndValidity({ emitEvent: !1 });
            }
            _checkForErrors() {
              this._isStandalone() || this._checkParentType(),
                this._checkName();
            }
            _checkParentType() {}
            _checkName() {
              this.options &&
                this.options.name &&
                (this.name = this.options.name),
                this._isStandalone();
            }
            _updateValue(n) {
              E_.then(() => {
                var r;
                this.control.setValue(n, { emitViewToModelChange: !1 }),
                  null === (r = this._changeDetectorRef) ||
                    void 0 === r ||
                    r.markForCheck();
              });
            }
            _updateDisabled(n) {
              const r = n.isDisabled.currentValue,
                o = "" === r || (r && "false" !== r);
              E_.then(() => {
                var i;
                o && !this.control.disabled
                  ? this.control.disable()
                  : !o && this.control.disabled && this.control.enable(),
                  null === (i = this._changeDetectorRef) ||
                    void 0 === i ||
                    i.markForCheck();
              });
            }
            _getPath(n) {
              return this._parent
                ? (function na(e, t) {
                    return [...t.path, e];
                  })(n, this._parent)
                : [n];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(
                y(Ye, 9),
                y(Ge, 10),
                y(Fn, 10),
                y(Xt, 10),
                y(Ns, 8)
              );
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [
                [
                  "",
                  "ngModel",
                  "",
                  3,
                  "formControlName",
                  "",
                  3,
                  "formControl",
                  "",
                ],
              ],
              inputs: {
                name: "name",
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
                options: ["ngModelOptions", "options"],
              },
              outputs: { update: "ngModelChange" },
              exportAs: ["ngModel"],
              features: [ce([rO]), ee, _t],
            })),
            e
          );
        })(),
        pi = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""],
              ],
              hostAttrs: ["novalidate", ""],
            })),
            e
          );
        })();
      const oO = { provide: Xt, useExisting: se(() => sd), multi: !0 };
      let sd = (() => {
          class e extends Xn {
            writeValue(n) {
              this.setProperty("value", null == n ? "" : n);
            }
            registerOnChange(n) {
              this.onChange = (r) => {
                n("" == r ? null : parseFloat(r));
              };
            }
          }
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = He(e)))(r || e);
              };
            })()),
            (e.ɵdir = O({
              type: e,
              selectors: [
                ["input", "type", "number", "formControlName", ""],
                ["input", "type", "number", "formControl", ""],
                ["input", "type", "number", "ngModel", ""],
              ],
              hostBindings: function (n, r) {
                1 & n &&
                  K("input", function (i) {
                    return r.onChange(i.target.value);
                  })("blur", function () {
                    return r.onTouched();
                  });
              },
              features: [ce([oO]), ee],
            })),
            e
          );
        })(),
        M_ = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = mt({ type: e })),
            (e.ɵinj = ot({})),
            e
          );
        })();
      function R_(e) {
        return "number" == typeof e ? e : parseInt(e, 10);
      }
      let nr = (() => {
        class e {
          constructor() {
            this._validator = Xs;
          }
          ngOnChanges(n) {
            if (this.inputName in n) {
              const r = this.normalizeInput(n[this.inputName].currentValue);
              (this._enabled = this.enabled(r)),
                (this._validator = this._enabled
                  ? this.createValidator(r)
                  : Xs),
                this._onChange && this._onChange();
            }
          }
          validate(n) {
            return this._validator(n);
          }
          registerOnValidatorChange(n) {
            this._onChange = n;
          }
          enabled(n) {
            return null != n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵdir = O({ type: e, features: [_t] })),
          e
        );
      })();
      const wO = { provide: Ge, useExisting: se(() => rr), multi: !0 };
      let rr = (() => {
        class e extends nr {
          constructor() {
            super(...arguments),
              (this.inputName = "required"),
              (this.normalizeInput = (n) =>
                (function _O(e) {
                  return null != e && !1 !== e && "false" != `${e}`;
                })(n)),
              (this.createValidator = (n) => Gv);
          }
          enabled(n) {
            return n;
          }
        }
        return (
          (e.ɵfac = (function () {
            let t;
            return function (r) {
              return (t || (t = He(e)))(r || e);
            };
          })()),
          (e.ɵdir = O({
            type: e,
            selectors: [
              [
                "",
                "required",
                "",
                "formControlName",
                "",
                3,
                "type",
                "checkbox",
              ],
              ["", "required", "", "formControl", "", 3, "type", "checkbox"],
              ["", "required", "", "ngModel", "", 3, "type", "checkbox"],
            ],
            hostVars: 1,
            hostBindings: function (n, r) {
              2 & n && Zt("required", r._enabled ? "" : null);
            },
            inputs: { required: "required" },
            features: [ce([wO]), ee],
          })),
          e
        );
      })();
      const MO = { provide: Ge, useExisting: se(() => to), multi: !0 };
      let to = (() => {
        class e extends nr {
          constructor() {
            super(...arguments),
              (this.inputName = "minlength"),
              (this.normalizeInput = (n) => R_(n)),
              (this.createValidator = (n) =>
                (function Wv(e) {
                  return (t) =>
                    Pn(t.value) || !Hv(t.value)
                      ? null
                      : t.value.length < e
                      ? {
                          minlength: {
                            requiredLength: e,
                            actualLength: t.value.length,
                          },
                        }
                      : null;
                })(n));
          }
        }
        return (
          (e.ɵfac = (function () {
            let t;
            return function (r) {
              return (t || (t = He(e)))(r || e);
            };
          })()),
          (e.ɵdir = O({
            type: e,
            selectors: [
              ["", "minlength", "", "formControlName", ""],
              ["", "minlength", "", "formControl", ""],
              ["", "minlength", "", "ngModel", ""],
            ],
            hostVars: 1,
            hostBindings: function (n, r) {
              2 & n && Zt("minlength", r._enabled ? r.minlength : null);
            },
            inputs: { minlength: "minlength" },
            features: [ce([MO]), ee],
          })),
          e
        );
      })();
      const AO = { provide: Ge, useExisting: se(() => la), multi: !0 };
      let la = (() => {
        class e extends nr {
          constructor() {
            super(...arguments),
              (this.inputName = "maxlength"),
              (this.normalizeInput = (n) => R_(n)),
              (this.createValidator = (n) =>
                (function Qv(e) {
                  return (t) =>
                    Hv(t.value) && t.value.length > e
                      ? {
                          maxlength: {
                            requiredLength: e,
                            actualLength: t.value.length,
                          },
                        }
                      : null;
                })(n));
          }
        }
        return (
          (e.ɵfac = (function () {
            let t;
            return function (r) {
              return (t || (t = He(e)))(r || e);
            };
          })()),
          (e.ɵdir = O({
            type: e,
            selectors: [
              ["", "maxlength", "", "formControlName", ""],
              ["", "maxlength", "", "formControl", ""],
              ["", "maxlength", "", "ngModel", ""],
            ],
            hostVars: 1,
            hostBindings: function (n, r) {
              2 & n && Zt("maxlength", r._enabled ? r.maxlength : null);
            },
            inputs: { maxlength: "maxlength" },
            features: [ce([AO]), ee],
          })),
          e
        );
      })();
      const SO = { provide: Ge, useExisting: se(() => ua), multi: !0 };
      let ua = (() => {
          class e extends nr {
            constructor() {
              super(...arguments),
                (this.inputName = "pattern"),
                (this.normalizeInput = (n) => n),
                (this.createValidator = (n) =>
                  (function Zv(e) {
                    if (!e) return Xs;
                    let t, n;
                    return (
                      "string" == typeof e
                        ? ((n = ""),
                          "^" !== e.charAt(0) && (n += "^"),
                          (n += e),
                          "$" !== e.charAt(e.length - 1) && (n += "$"),
                          (t = new RegExp(n)))
                        : ((n = e.toString()), (t = e)),
                      (r) => {
                        if (Pn(r.value)) return null;
                        const o = r.value;
                        return t.test(o)
                          ? null
                          : { pattern: { requiredPattern: n, actualValue: o } };
                      }
                    );
                  })(n));
            }
          }
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = He(e)))(r || e);
              };
            })()),
            (e.ɵdir = O({
              type: e,
              selectors: [
                ["", "pattern", "", "formControlName", ""],
                ["", "pattern", "", "formControl", ""],
                ["", "pattern", "", "ngModel", ""],
              ],
              hostVars: 1,
              hostBindings: function (n, r) {
                2 & n && Zt("pattern", r._enabled ? r.pattern : null);
              },
              inputs: { pattern: "pattern" },
              features: [ce([SO]), ee],
            })),
            e
          );
        })(),
        IO = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = mt({ type: e })),
            (e.ɵinj = ot({ imports: [[M_]] })),
            e
          );
        })(),
        xO = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = mt({ type: e })),
            (e.ɵinj = ot({ imports: [IO] })),
            e
          );
        })();
      function L(...e) {
        return Fe(e, fo(e));
      }
      class Bt extends nn {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const n = super._subscribe(t);
          return !n.closed && t.next(this._value), n;
        }
        getValue() {
          const { hasError: t, thrownError: n, _value: r } = this;
          if (t) throw n;
          return this._throwIfClosed(), r;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      function j_(e, t, n) {
        e ? rn(n, e, t) : t();
      }
      function ca(e, t) {
        const n = ie(e) ? e : () => e,
          r = (o) => o.error(n());
        return new ye(t ? (o) => t.schedule(r, 0, o) : r);
      }
      const da = lo(
        (e) =>
          function () {
            e(this),
              (this.name = "EmptyError"),
              (this.message = "no elements in sequence");
          }
      );
      function fd(...e) {
        return (function PO() {
          return co(1);
        })()(Fe(e, fo(e)));
      }
      function H_(e) {
        return new ye((t) => {
          jt(e()).subscribe(t);
        });
      }
      function U_() {
        return Ne((e, t) => {
          let n = null;
          e._refCount++;
          const r = Oe(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (n = null);
            const o = e._connection,
              i = n;
            (n = null),
              o && (!i || o === i) && o.unsubscribe(),
              t.unsubscribe();
          });
          e.subscribe(r), r.closed || (n = e.connect());
        });
      }
      class FO extends ye {
        constructor(t, n) {
          super(),
            (this.source = t),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            rf(t) && (this.lift = t.lift);
        }
        _subscribe(t) {
          return this.getSubject().subscribe(t);
        }
        getSubject() {
          const t = this._subject;
          return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: t } = this;
          (this._subject = this._connection = null),
            null == t || t.unsubscribe();
        }
        connect() {
          let t = this._connection;
          if (!t) {
            t = this._connection = new pt();
            const n = this.getSubject();
            t.add(
              this.source.subscribe(
                Oe(
                  n,
                  void 0,
                  () => {
                    this._teardown(), n.complete();
                  },
                  (r) => {
                    this._teardown(), n.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              t.closed && ((this._connection = null), (t = pt.EMPTY));
          }
          return t;
        }
        refCount() {
          return U_()(this);
        }
      }
      function or(e, t) {
        return Ne((n, r) => {
          let o = null,
            i = 0,
            s = !1;
          const a = () => s && !o && r.complete();
          n.subscribe(
            Oe(
              r,
              (l) => {
                null == o || o.unsubscribe();
                let u = 0;
                const c = i++;
                jt(e(l, c)).subscribe(
                  (o = Oe(
                    r,
                    (d) => r.next(t ? t(l, d, c, u++) : d),
                    () => {
                      (o = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function NO(e, t, n, r, o) {
        return (i, s) => {
          let a = n,
            l = t,
            u = 0;
          i.subscribe(
            Oe(
              s,
              (c) => {
                const d = u++;
                (l = a ? e(l, c, d) : ((a = !0), c)), r && s.next(l);
              },
              o &&
                (() => {
                  a && s.next(l), s.complete();
                })
            )
          );
        };
      }
      function $_(e, t) {
        return Ne(NO(e, t, arguments.length >= 2, !0));
      }
      function ir(e, t) {
        return Ne((n, r) => {
          let o = 0;
          n.subscribe(Oe(r, (i) => e.call(t, i, o++) && r.next(i)));
        });
      }
      function Nn(e) {
        return Ne((t, n) => {
          let i,
            r = null,
            o = !1;
          (r = t.subscribe(
            Oe(n, void 0, void 0, (s) => {
              (i = jt(e(s, Nn(e)(t)))),
                r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
            })
          )),
            o && (r.unsubscribe(), (r = null), i.subscribe(n));
        });
      }
      function no(e, t) {
        return ie(t) ? Pe(e, t, 1) : Pe(e, 1);
      }
      function hd(e) {
        return e <= 0
          ? () => on
          : Ne((t, n) => {
              let r = [];
              t.subscribe(
                Oe(
                  n,
                  (o) => {
                    r.push(o), e < r.length && r.shift();
                  },
                  () => {
                    for (const o of r) n.next(o);
                    n.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function G_(e = kO) {
        return Ne((t, n) => {
          let r = !1;
          t.subscribe(
            Oe(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => (r ? n.complete() : n.error(e()))
            )
          );
        });
      }
      function kO() {
        return new da();
      }
      function z_(e) {
        return Ne((t, n) => {
          let r = !1;
          t.subscribe(
            Oe(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => {
                r || n.next(e), n.complete();
              }
            )
          );
        });
      }
      function ro(e, t) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? ir((o, i) => e(o, i, r)) : jn,
            Fi(1),
            n ? z_(t) : G_(() => new da())
          );
      }
      function ft(e, t, n) {
        const r = ie(e) || t || n ? { next: e, error: t, complete: n } : e;
        return r
          ? Ne((o, i) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              o.subscribe(
                Oe(
                  i,
                  (l) => {
                    var u;
                    null === (u = r.next) || void 0 === u || u.call(r, l),
                      i.next(l);
                  },
                  () => {
                    var l;
                    (a = !1),
                      null === (l = r.complete) || void 0 === l || l.call(r),
                      i.complete();
                  },
                  (l) => {
                    var u;
                    (a = !1),
                      null === (u = r.error) || void 0 === u || u.call(r, l),
                      i.error(l);
                  },
                  () => {
                    var l, u;
                    a &&
                      (null === (l = r.unsubscribe) ||
                        void 0 === l ||
                        l.call(r)),
                      null === (u = r.finalize) || void 0 === u || u.call(r);
                  }
                )
              );
            })
          : jn;
      }
      class yn {
        constructor(t, n) {
          (this.id = t), (this.url = n);
        }
      }
      class pd extends yn {
        constructor(t, n, r = "imperative", o = null) {
          super(t, n), (this.navigationTrigger = r), (this.restoredState = o);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class gi extends yn {
        constructor(t, n, r) {
          super(t, n), (this.urlAfterRedirects = r);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class q_ extends yn {
        constructor(t, n, r) {
          super(t, n), (this.reason = r);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class BO extends yn {
        constructor(t, n, r) {
          super(t, n), (this.error = r);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class jO extends yn {
        constructor(t, n, r, o) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = o);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class HO extends yn {
        constructor(t, n, r, o) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = o);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class UO extends yn {
        constructor(t, n, r, o, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.shouldActivate = i);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class $O extends yn {
        constructor(t, n, r, o) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = o);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class GO extends yn {
        constructor(t, n, r, o) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = o);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class W_ {
        constructor(t) {
          this.route = t;
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class Q_ {
        constructor(t) {
          this.route = t;
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class zO {
        constructor(t) {
          this.snapshot = t;
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class qO {
        constructor(t) {
          this.snapshot = t;
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class WO {
        constructor(t) {
          this.snapshot = t;
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class QO {
        constructor(t) {
          this.snapshot = t;
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class Z_ {
        constructor(t, n, r) {
          (this.routerEvent = t), (this.position = n), (this.anchor = r);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      const G = "primary";
      class ZO {
        constructor(t) {
          this.params = t || {};
        }
        has(t) {
          return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n[0] : n;
          }
          return null;
        }
        getAll(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n : [n];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function oo(e) {
        return new ZO(e);
      }
      const K_ = "ngNavigationCancelingError";
      function gd(e) {
        const t = Error("NavigationCancelingError: " + e);
        return (t[K_] = !0), t;
      }
      function JO(e, t, n) {
        const r = n.path.split("/");
        if (
          r.length > e.length ||
          ("full" === n.pathMatch && (t.hasChildren() || r.length < e.length))
        )
          return null;
        const o = {};
        for (let i = 0; i < r.length; i++) {
          const s = r[i],
            a = e[i];
          if (s.startsWith(":")) o[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: o };
      }
      function en(e, t) {
        const n = e ? Object.keys(e) : void 0,
          r = t ? Object.keys(t) : void 0;
        if (!n || !r || n.length != r.length) return !1;
        let o;
        for (let i = 0; i < n.length; i++)
          if (((o = n[i]), !J_(e[o], t[o]))) return !1;
        return !0;
      }
      function J_(e, t) {
        if (Array.isArray(e) && Array.isArray(t)) {
          if (e.length !== t.length) return !1;
          const n = [...e].sort(),
            r = [...t].sort();
          return n.every((o, i) => r[i] === o);
        }
        return e === t;
      }
      function Y_(e) {
        return Array.prototype.concat.apply([], e);
      }
      function X_(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function Le(e, t) {
        for (const n in e) e.hasOwnProperty(n) && t(e[n], n);
      }
      function tn(e) {
        return Tu(e) ? e : $o(e) ? Fe(Promise.resolve(e)) : L(e);
      }
      const eP = {
          exact: function nC(e, t, n) {
            if (
              !ar(e.segments, t.segments) ||
              !fa(e.segments, t.segments, n) ||
              e.numberOfChildren !== t.numberOfChildren
            )
              return !1;
            for (const r in t.children)
              if (!e.children[r] || !nC(e.children[r], t.children[r], n))
                return !1;
            return !0;
          },
          subset: rC,
        },
        eC = {
          exact: function tP(e, t) {
            return en(e, t);
          },
          subset: function nP(e, t) {
            return (
              Object.keys(t).length <= Object.keys(e).length &&
              Object.keys(t).every((n) => J_(e[n], t[n]))
            );
          },
          ignored: () => !0,
        };
      function tC(e, t, n) {
        return (
          eP[n.paths](e.root, t.root, n.matrixParams) &&
          eC[n.queryParams](e.queryParams, t.queryParams) &&
          !("exact" === n.fragment && e.fragment !== t.fragment)
        );
      }
      function rC(e, t, n) {
        return oC(e, t, t.segments, n);
      }
      function oC(e, t, n, r) {
        if (e.segments.length > n.length) {
          const o = e.segments.slice(0, n.length);
          return !(!ar(o, n) || t.hasChildren() || !fa(o, n, r));
        }
        if (e.segments.length === n.length) {
          if (!ar(e.segments, n) || !fa(e.segments, n, r)) return !1;
          for (const o in t.children)
            if (!e.children[o] || !rC(e.children[o], t.children[o], r))
              return !1;
          return !0;
        }
        {
          const o = n.slice(0, e.segments.length),
            i = n.slice(e.segments.length);
          return (
            !!(ar(e.segments, o) && fa(e.segments, o, r) && e.children[G]) &&
            oC(e.children[G], t, i, r)
          );
        }
      }
      function fa(e, t, n) {
        return t.every((r, o) => eC[n](e[o].parameters, r.parameters));
      }
      class sr {
        constructor(t, n, r) {
          (this.root = t), (this.queryParams = n), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = oo(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return iP.serialize(this);
        }
      }
      class W {
        constructor(t, n) {
          (this.segments = t),
            (this.children = n),
            (this.parent = null),
            Le(n, (r, o) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return ha(this);
        }
      }
      class mi {
        constructor(t, n) {
          (this.path = t), (this.parameters = n);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = oo(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return uC(this);
        }
      }
      function ar(e, t) {
        return e.length === t.length && e.every((n, r) => n.path === t[r].path);
      }
      class iC {}
      class sC {
        parse(t) {
          const n = new pP(t);
          return new sr(
            n.parseRootSegment(),
            n.parseQueryParams(),
            n.parseFragment()
          );
        }
        serialize(t) {
          const n = `/${yi(t.root, !0)}`,
            r = (function lP(e) {
              const t = Object.keys(e)
                .map((n) => {
                  const r = e[n];
                  return Array.isArray(r)
                    ? r.map((o) => `${pa(n)}=${pa(o)}`).join("&")
                    : `${pa(n)}=${pa(r)}`;
                })
                .filter((n) => !!n);
              return t.length ? `?${t.join("&")}` : "";
            })(t.queryParams);
          return `${n}${r}${
            "string" == typeof t.fragment
              ? `#${(function sP(e) {
                  return encodeURI(e);
                })(t.fragment)}`
              : ""
          }`;
        }
      }
      const iP = new sC();
      function ha(e) {
        return e.segments.map((t) => uC(t)).join("/");
      }
      function yi(e, t) {
        if (!e.hasChildren()) return ha(e);
        if (t) {
          const n = e.children[G] ? yi(e.children[G], !1) : "",
            r = [];
          return (
            Le(e.children, (o, i) => {
              i !== G && r.push(`${i}:${yi(o, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
          );
        }
        {
          const n = (function oP(e, t) {
            let n = [];
            return (
              Le(e.children, (r, o) => {
                o === G && (n = n.concat(t(r, o)));
              }),
              Le(e.children, (r, o) => {
                o !== G && (n = n.concat(t(r, o)));
              }),
              n
            );
          })(e, (r, o) =>
            o === G ? [yi(e.children[G], !1)] : [`${o}:${yi(r, !1)}`]
          );
          return 1 === Object.keys(e.children).length && null != e.children[G]
            ? `${ha(e)}/${n[0]}`
            : `${ha(e)}/(${n.join("//")})`;
        }
      }
      function aC(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function pa(e) {
        return aC(e).replace(/%3B/gi, ";");
      }
      function md(e) {
        return aC(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function ga(e) {
        return decodeURIComponent(e);
      }
      function lC(e) {
        return ga(e.replace(/\+/g, "%20"));
      }
      function uC(e) {
        return `${md(e.path)}${(function aP(e) {
          return Object.keys(e)
            .map((t) => `;${md(t)}=${md(e[t])}`)
            .join("");
        })(e.parameters)}`;
      }
      const uP = /^[^\/()?;=#]+/;
      function ma(e) {
        const t = e.match(uP);
        return t ? t[0] : "";
      }
      const cP = /^[^=?&#]+/,
        fP = /^[^&#]+/;
      class pP {
        constructor(t) {
          (this.url = t), (this.remaining = t);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new W([], {})
              : new W([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const t = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(t);
            } while (this.consumeOptional("&"));
          return t;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const t = [];
          for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), t.push(this.parseSegment());
          let n = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (n = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (t.length > 0 || Object.keys(n).length > 0) && (r[G] = new W(t, n)),
            r
          );
        }
        parseSegment() {
          const t = ma(this.remaining);
          if ("" === t && this.peekStartsWith(";"))
            throw new Error(
              `Empty path url segment cannot have parameters: '${this.remaining}'.`
            );
          return this.capture(t), new mi(ga(t), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const t = {};
          for (; this.consumeOptional(";"); ) this.parseParam(t);
          return t;
        }
        parseParam(t) {
          const n = ma(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const o = ma(this.remaining);
            o && ((r = o), this.capture(r));
          }
          t[ga(n)] = ga(r);
        }
        parseQueryParam(t) {
          const n = (function dP(e) {
            const t = e.match(cP);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function hP(e) {
              const t = e.match(fP);
              return t ? t[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const o = lC(n),
            i = lC(r);
          if (t.hasOwnProperty(o)) {
            let s = t[o];
            Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i);
          } else t[o] = i;
        }
        parseParens(t) {
          const n = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = ma(this.remaining),
              o = this.remaining[r.length];
            if ("/" !== o && ")" !== o && ";" !== o)
              throw new Error(`Cannot parse url '${this.url}'`);
            let i;
            r.indexOf(":") > -1
              ? ((i = r.substr(0, r.indexOf(":"))),
                this.capture(i),
                this.capture(":"))
              : t && (i = G);
            const s = this.parseChildren();
            (n[i] = 1 === Object.keys(s).length ? s[G] : new W([], s)),
              this.consumeOptional("//");
          }
          return n;
        }
        peekStartsWith(t) {
          return this.remaining.startsWith(t);
        }
        consumeOptional(t) {
          return (
            !!this.peekStartsWith(t) &&
            ((this.remaining = this.remaining.substring(t.length)), !0)
          );
        }
        capture(t) {
          if (!this.consumeOptional(t)) throw new Error(`Expected "${t}".`);
        }
      }
      class cC {
        constructor(t) {
          this._root = t;
        }
        get root() {
          return this._root.value;
        }
        parent(t) {
          const n = this.pathFromRoot(t);
          return n.length > 1 ? n[n.length - 2] : null;
        }
        children(t) {
          const n = yd(t, this._root);
          return n ? n.children.map((r) => r.value) : [];
        }
        firstChild(t) {
          const n = yd(t, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(t) {
          const n = vd(t, this._root);
          return n.length < 2
            ? []
            : n[n.length - 2].children
                .map((o) => o.value)
                .filter((o) => o !== t);
        }
        pathFromRoot(t) {
          return vd(t, this._root).map((n) => n.value);
        }
      }
      function yd(e, t) {
        if (e === t.value) return t;
        for (const n of t.children) {
          const r = yd(e, n);
          if (r) return r;
        }
        return null;
      }
      function vd(e, t) {
        if (e === t.value) return [t];
        for (const n of t.children) {
          const r = vd(e, n);
          if (r.length) return r.unshift(t), r;
        }
        return [];
      }
      class vn {
        constructor(t, n) {
          (this.value = t), (this.children = n);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function io(e) {
        const t = {};
        return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
      }
      class dC extends cC {
        constructor(t, n) {
          super(t), (this.snapshot = n), _d(this, t);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function fC(e, t) {
        const n = (function gP(e, t) {
            const s = new ya([], {}, {}, "", {}, G, t, null, e.root, -1, {});
            return new pC("", new vn(s, []));
          })(e, t),
          r = new Bt([new mi("", {})]),
          o = new Bt({}),
          i = new Bt({}),
          s = new Bt({}),
          a = new Bt(""),
          l = new so(r, o, s, a, i, G, t, n.root);
        return (l.snapshot = n.root), new dC(new vn(l, []), n);
      }
      class so {
        constructor(t, n, r, o, i, s, a, l) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = l);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(Y((t) => oo(t)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(Y((t) => oo(t)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function hC(e, t = "emptyOnly") {
        const n = e.pathFromRoot;
        let r = 0;
        if ("always" !== t)
          for (r = n.length - 1; r >= 1; ) {
            const o = n[r],
              i = n[r - 1];
            if (o.routeConfig && "" === o.routeConfig.path) r--;
            else {
              if (i.component) break;
              r--;
            }
          }
        return (function mP(e) {
          return e.reduce(
            (t, n) => ({
              params: Object.assign(Object.assign({}, t.params), n.params),
              data: Object.assign(Object.assign({}, t.data), n.data),
              resolve: Object.assign(
                Object.assign({}, t.resolve),
                n._resolvedData
              ),
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(n.slice(r));
      }
      class ya {
        constructor(t, n, r, o, i, s, a, l, u, c, d) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = l),
            (this._urlSegment = u),
            (this._lastPathIndex = c),
            (this._resolve = d);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = oo(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = oo(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class pC extends cC {
        constructor(t, n) {
          super(n), (this.url = t), _d(this, n);
        }
        toString() {
          return gC(this._root);
        }
      }
      function _d(e, t) {
        (t.value._routerState = e), t.children.forEach((n) => _d(e, n));
      }
      function gC(e) {
        const t =
          e.children.length > 0 ? ` { ${e.children.map(gC).join(", ")} } ` : "";
        return `${e.value}${t}`;
      }
      function Cd(e) {
        if (e.snapshot) {
          const t = e.snapshot,
            n = e._futureSnapshot;
          (e.snapshot = n),
            en(t.queryParams, n.queryParams) ||
              e.queryParams.next(n.queryParams),
            t.fragment !== n.fragment && e.fragment.next(n.fragment),
            en(t.params, n.params) || e.params.next(n.params),
            (function YO(e, t) {
              if (e.length !== t.length) return !1;
              for (let n = 0; n < e.length; ++n) if (!en(e[n], t[n])) return !1;
              return !0;
            })(t.url, n.url) || e.url.next(n.url),
            en(t.data, n.data) || e.data.next(n.data);
        } else
          (e.snapshot = e._futureSnapshot), e.data.next(e._futureSnapshot.data);
      }
      function Dd(e, t) {
        const n =
          en(e.params, t.params) &&
          (function rP(e, t) {
            return (
              ar(e, t) && e.every((n, r) => en(n.parameters, t[r].parameters))
            );
          })(e.url, t.url);
        return (
          n &&
          !(!e.parent != !t.parent) &&
          (!e.parent || Dd(e.parent, t.parent))
        );
      }
      function vi(e, t, n) {
        if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
          const r = n.value;
          r._futureSnapshot = t.value;
          const o = (function vP(e, t, n) {
            return t.children.map((r) => {
              for (const o of n.children)
                if (e.shouldReuseRoute(r.value, o.value.snapshot))
                  return vi(e, r, o);
              return vi(e, r);
            });
          })(e, t, n);
          return new vn(r, o);
        }
        {
          if (e.shouldAttach(t.value)) {
            const i = e.retrieve(t.value);
            if (null !== i) {
              const s = i.route;
              return (
                (s.value._futureSnapshot = t.value),
                (s.children = t.children.map((a) => vi(e, a))),
                s
              );
            }
          }
          const r = (function _P(e) {
              return new so(
                new Bt(e.url),
                new Bt(e.params),
                new Bt(e.queryParams),
                new Bt(e.fragment),
                new Bt(e.data),
                e.outlet,
                e.component,
                e
              );
            })(t.value),
            o = t.children.map((i) => vi(e, i));
          return new vn(r, o);
        }
      }
      function va(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function _i(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function wd(e, t, n, r, o) {
        let i = {};
        if (
          (r &&
            Le(r, (a, l) => {
              i[l] = Array.isArray(a) ? a.map((u) => `${u}`) : `${a}`;
            }),
          e === t)
        )
          return new sr(n, i, o);
        const s = mC(e, t, n);
        return new sr(s, i, o);
      }
      function mC(e, t, n) {
        const r = {};
        return (
          Le(e.children, (o, i) => {
            r[i] = o === t ? n : mC(o, t, n);
          }),
          new W(e.segments, r)
        );
      }
      class yC {
        constructor(t, n, r) {
          if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = n),
            (this.commands = r),
            t && r.length > 0 && va(r[0]))
          )
            throw new Error("Root segment cannot have matrix parameters");
          const o = r.find(_i);
          if (o && o !== X_(r))
            throw new Error("{outlets:{}} has to be the last command");
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class bd {
        constructor(t, n, r) {
          (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
        }
      }
      function vC(e, t, n) {
        if (
          (e || (e = new W([], {})), 0 === e.segments.length && e.hasChildren())
        )
          return _a(e, t, n);
        const r = (function MP(e, t, n) {
            let r = 0,
              o = t;
            const i = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; o < e.segments.length; ) {
              if (r >= n.length) return i;
              const s = e.segments[o],
                a = n[r];
              if (_i(a)) break;
              const l = `${a}`,
                u = r < n.length - 1 ? n[r + 1] : null;
              if (o > 0 && void 0 === l) break;
              if (l && u && "object" == typeof u && void 0 === u.outlets) {
                if (!CC(l, u, s)) return i;
                r += 2;
              } else {
                if (!CC(l, {}, s)) return i;
                r++;
              }
              o++;
            }
            return { match: !0, pathIndex: o, commandIndex: r };
          })(e, t, n),
          o = n.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const i = new W(e.segments.slice(0, r.pathIndex), {});
          return (
            (i.children[G] = new W(e.segments.slice(r.pathIndex), e.children)),
            _a(i, 0, o)
          );
        }
        return r.match && 0 === o.length
          ? new W(e.segments, {})
          : r.match && !e.hasChildren()
          ? Ed(e, t, n)
          : r.match
          ? _a(e, 0, o)
          : Ed(e, t, n);
      }
      function _a(e, t, n) {
        if (0 === n.length) return new W(e.segments, {});
        {
          const r = (function EP(e) {
              return _i(e[0]) ? e[0].outlets : { [G]: e };
            })(n),
            o = {};
          return (
            Le(r, (i, s) => {
              "string" == typeof i && (i = [i]),
                null !== i && (o[s] = vC(e.children[s], t, i));
            }),
            Le(e.children, (i, s) => {
              void 0 === r[s] && (o[s] = i);
            }),
            new W(e.segments, o)
          );
        }
      }
      function Ed(e, t, n) {
        const r = e.segments.slice(0, t);
        let o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (_i(i)) {
            const l = AP(i.outlets);
            return new W(r, l);
          }
          if (0 === o && va(n[0])) {
            r.push(new mi(e.segments[t].path, _C(n[0]))), o++;
            continue;
          }
          const s = _i(i) ? i.outlets[G] : `${i}`,
            a = o < n.length - 1 ? n[o + 1] : null;
          s && a && va(a)
            ? (r.push(new mi(s, _C(a))), (o += 2))
            : (r.push(new mi(s, {})), o++);
        }
        return new W(r, {});
      }
      function AP(e) {
        const t = {};
        return (
          Le(e, (n, r) => {
            "string" == typeof n && (n = [n]),
              null !== n && (t[r] = Ed(new W([], {}), 0, n));
          }),
          t
        );
      }
      function _C(e) {
        const t = {};
        return Le(e, (n, r) => (t[r] = `${n}`)), t;
      }
      function CC(e, t, n) {
        return e == n.path && en(t, n.parameters);
      }
      class IP {
        constructor(t, n, r, o) {
          (this.routeReuseStrategy = t),
            (this.futureState = n),
            (this.currState = r),
            (this.forwardEvent = o);
        }
        activate(t) {
          const n = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(n, r, t),
            Cd(this.futureState.root),
            this.activateChildRoutes(n, r, t);
        }
        deactivateChildRoutes(t, n, r) {
          const o = io(n);
          t.children.forEach((i) => {
            const s = i.value.outlet;
            this.deactivateRoutes(i, o[s], r), delete o[s];
          }),
            Le(o, (i, s) => {
              this.deactivateRouteAndItsChildren(i, r);
            });
        }
        deactivateRoutes(t, n, r) {
          const o = t.value,
            i = n ? n.value : null;
          if (o === i)
            if (o.component) {
              const s = r.getContext(o.outlet);
              s && this.deactivateChildRoutes(t, n, s.children);
            } else this.deactivateChildRoutes(t, n, r);
          else i && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(t, n) {
          t.value.component &&
          this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, n)
            : this.deactivateRouteAndOutlet(t, n);
        }
        detachAndStoreRouteSubtree(t, n) {
          const r = n.getContext(t.value.outlet),
            o = r && t.value.component ? r.children : n,
            i = io(t);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
              componentRef: s,
              route: t,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(t, n) {
          const r = n.getContext(t.value.outlet),
            o = r && t.value.component ? r.children : n,
            i = io(t);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          r &&
            r.outlet &&
            (r.outlet.deactivate(),
            r.children.onOutletDeactivated(),
            (r.attachRef = null),
            (r.resolver = null),
            (r.route = null));
        }
        activateChildRoutes(t, n, r) {
          const o = io(n);
          t.children.forEach((i) => {
            this.activateRoutes(i, o[i.value.outlet], r),
              this.forwardEvent(new QO(i.value.snapshot));
          }),
            t.children.length && this.forwardEvent(new qO(t.value.snapshot));
        }
        activateRoutes(t, n, r) {
          const o = t.value,
            i = n ? n.value : null;
          if ((Cd(o), o === i))
            if (o.component) {
              const s = r.getOrCreateContext(o.outlet);
              this.activateChildRoutes(t, n, s.children);
            } else this.activateChildRoutes(t, n, r);
          else if (o.component) {
            const s = r.getOrCreateContext(o.outlet);
            if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(o.snapshot);
              this.routeReuseStrategy.store(o.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Cd(a.route.value),
                this.activateChildRoutes(t, null, s.children);
            } else {
              const a = (function xP(e) {
                  for (let t = e.parent; t; t = t.parent) {
                    const n = t.routeConfig;
                    if (n && n._loadedConfig) return n._loadedConfig;
                    if (n && n.component) return null;
                  }
                  return null;
                })(o.snapshot),
                l = a ? a.module.componentFactoryResolver : null;
              (s.attachRef = null),
                (s.route = o),
                (s.resolver = l),
                s.outlet && s.outlet.activateWith(o, l),
                this.activateChildRoutes(t, null, s.children);
            }
          } else this.activateChildRoutes(t, null, r);
        }
      }
      class Md {
        constructor(t, n) {
          (this.routes = t), (this.module = n);
        }
      }
      function kn(e) {
        return "function" == typeof e;
      }
      function lr(e) {
        return e instanceof sr;
      }
      const Ci = Symbol("INITIAL_VALUE");
      function Di() {
        return or((e) =>
          (function TO(...e) {
            const t = fo(e),
              n = vf(e),
              { args: r, keys: o } = kv(e);
            if (0 === r.length) return Fe([], t);
            const i = new ye(
              (function OO(e, t, n = jn) {
                return (r) => {
                  j_(
                    t,
                    () => {
                      const { length: o } = e,
                        i = new Array(o);
                      let s = o,
                        a = o;
                      for (let l = 0; l < o; l++)
                        j_(
                          t,
                          () => {
                            const u = Fe(e[l], t);
                            let c = !1;
                            u.subscribe(
                              Oe(
                                r,
                                (d) => {
                                  (i[l] = d),
                                    c || ((c = !0), a--),
                                    a || r.next(n(i.slice()));
                                },
                                () => {
                                  --s || r.complete();
                                }
                              )
                            );
                          },
                          r
                        );
                    },
                    r
                  );
                };
              })(r, t, o ? (s) => Lv(o, s) : jn)
            );
            return n ? i.pipe(Vv(n)) : i;
          })(
            e.map((t) =>
              t.pipe(
                Fi(1),
                (function RO(...e) {
                  const t = fo(e);
                  return Ne((n, r) => {
                    (t ? fd(e, n, t) : fd(e, n)).subscribe(r);
                  });
                })(Ci)
              )
            )
          ).pipe(
            $_((t, n) => {
              let r = !1;
              return n.reduce(
                (o, i, s) =>
                  o !== Ci
                    ? o
                    : (i === Ci && (r = !0),
                      r || (!1 !== i && s !== n.length - 1 && !lr(i)) ? o : i),
                t
              );
            }, Ci),
            ir((t) => t !== Ci),
            Y((t) => (lr(t) ? t : !0 === t)),
            Fi(1)
          )
        );
      }
      class NP {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.children = new wi()),
            (this.attachRef = null);
        }
      }
      class wi {
        constructor() {
          this.contexts = new Map();
        }
        onChildOutletCreated(t, n) {
          const r = this.getOrCreateContext(t);
          (r.outlet = n), this.contexts.set(t, r);
        }
        onChildOutletDestroyed(t) {
          const n = this.getContext(t);
          n && ((n.outlet = null), (n.attachRef = null));
        }
        onOutletDeactivated() {
          const t = this.contexts;
          return (this.contexts = new Map()), t;
        }
        onOutletReAttached(t) {
          this.contexts = t;
        }
        getOrCreateContext(t) {
          let n = this.getContext(t);
          return n || ((n = new NP()), this.contexts.set(t, n)), n;
        }
        getContext(t) {
          return this.contexts.get(t) || null;
        }
      }
      let Ca = (() => {
        class e {
          constructor(n, r, o, i, s) {
            (this.parentContexts = n),
              (this.location = r),
              (this.resolver = o),
              (this.changeDetector = s),
              (this.activated = null),
              (this._activatedRoute = null),
              (this.activateEvents = new me()),
              (this.deactivateEvents = new me()),
              (this.attachEvents = new me()),
              (this.detachEvents = new me()),
              (this.name = i || G),
              n.onChildOutletCreated(this.name, this);
          }
          ngOnDestroy() {
            this.parentContexts.onChildOutletDestroyed(this.name);
          }
          ngOnInit() {
            if (!this.activated) {
              const n = this.parentContexts.getContext(this.name);
              n &&
                n.route &&
                (n.attachRef
                  ? this.attach(n.attachRef, n.route)
                  : this.activateWith(n.route, n.resolver || null));
            }
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new Error("Outlet is not activated");
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new Error("Outlet is not activated");
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new Error("Outlet is not activated");
            this.location.detach();
            const n = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(n.instance),
              n
            );
          }
          attach(n, r) {
            (this.activated = n),
              (this._activatedRoute = r),
              this.location.insert(n.hostView),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, r) {
            if (this.isActivated)
              throw new Error("Cannot activate an already activated outlet");
            this._activatedRoute = n;
            const s = (r = r || this.resolver).resolveComponentFactory(
                n._futureSnapshot.routeConfig.component
              ),
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new kP(n, a, this.location.injector);
            (this.activated = this.location.createComponent(
              s,
              this.location.length,
              l
            )),
              this.changeDetector.markForCheck(),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(y(wi), y(kt), y(Ko), wo("name"), y(Ns));
          }),
          (e.ɵdir = O({
            type: e,
            selectors: [["router-outlet"]],
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
          })),
          e
        );
      })();
      class kP {
        constructor(t, n, r) {
          (this.route = t), (this.childContexts = n), (this.parent = r);
        }
        get(t, n) {
          return t === so
            ? this.route
            : t === wi
            ? this.childContexts
            : this.parent.get(t, n);
        }
      }
      let DC = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵcmp = gt({
            type: e,
            selectors: [["ng-component"]],
            decls: 1,
            vars: 0,
            template: function (n, r) {
              1 & n && Ze(0, "router-outlet");
            },
            directives: [Ca],
            encapsulation: 2,
          })),
          e
        );
      })();
      function wC(e, t = "") {
        for (let n = 0; n < e.length; n++) {
          const r = e[n];
          VP(r, LP(t, r));
        }
      }
      function VP(e, t) {
        e.children && wC(e.children, t);
      }
      function LP(e, t) {
        return t
          ? e || t.path
            ? e && !t.path
              ? `${e}/`
              : !e && t.path
              ? t.path
              : `${e}/${t.path}`
            : ""
          : e;
      }
      function Ad(e) {
        const t = e.children && e.children.map(Ad),
          n = t
            ? Object.assign(Object.assign({}, e), { children: t })
            : Object.assign({}, e);
        return (
          !n.component &&
            (t || n.loadChildren) &&
            n.outlet &&
            n.outlet !== G &&
            (n.component = DC),
          n
        );
      }
      function At(e) {
        return e.outlet || G;
      }
      function bC(e, t) {
        const n = e.filter((r) => At(r) === t);
        return n.push(...e.filter((r) => At(r) !== t)), n;
      }
      const EC = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function Da(e, t, n) {
        var r;
        if ("" === t.path)
          return "full" === t.pathMatch && (e.hasChildren() || n.length > 0)
            ? Object.assign({}, EC)
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: n,
                parameters: {},
                positionalParamSegments: {},
              };
        const i = (t.matcher || JO)(n, e, t);
        if (!i) return Object.assign({}, EC);
        const s = {};
        Le(i.posParams, (l, u) => {
          s[u] = l.path;
        });
        const a =
          i.consumed.length > 0
            ? Object.assign(
                Object.assign({}, s),
                i.consumed[i.consumed.length - 1].parameters
              )
            : s;
        return {
          matched: !0,
          consumedSegments: i.consumed,
          remainingSegments: n.slice(i.consumed.length),
          parameters: a,
          positionalParamSegments:
            null !== (r = i.posParams) && void 0 !== r ? r : {},
        };
      }
      function wa(e, t, n, r, o = "corrected") {
        if (
          n.length > 0 &&
          (function HP(e, t, n) {
            return n.some((r) => ba(e, t, r) && At(r) !== G);
          })(e, n, r)
        ) {
          const s = new W(
            t,
            (function jP(e, t, n, r) {
              const o = {};
              (o[G] = r),
                (r._sourceSegment = e),
                (r._segmentIndexShift = t.length);
              for (const i of n)
                if ("" === i.path && At(i) !== G) {
                  const s = new W([], {});
                  (s._sourceSegment = e),
                    (s._segmentIndexShift = t.length),
                    (o[At(i)] = s);
                }
              return o;
            })(e, t, r, new W(n, e.children))
          );
          return (
            (s._sourceSegment = e),
            (s._segmentIndexShift = t.length),
            { segmentGroup: s, slicedSegments: [] }
          );
        }
        if (
          0 === n.length &&
          (function UP(e, t, n) {
            return n.some((r) => ba(e, t, r));
          })(e, n, r)
        ) {
          const s = new W(
            e.segments,
            (function BP(e, t, n, r, o, i) {
              const s = {};
              for (const a of r)
                if (ba(e, n, a) && !o[At(a)]) {
                  const l = new W([], {});
                  (l._sourceSegment = e),
                    (l._segmentIndexShift =
                      "legacy" === i ? e.segments.length : t.length),
                    (s[At(a)] = l);
                }
              return Object.assign(Object.assign({}, o), s);
            })(e, t, n, r, e.children, o)
          );
          return (
            (s._sourceSegment = e),
            (s._segmentIndexShift = t.length),
            { segmentGroup: s, slicedSegments: n }
          );
        }
        const i = new W(e.segments, e.children);
        return (
          (i._sourceSegment = e),
          (i._segmentIndexShift = t.length),
          { segmentGroup: i, slicedSegments: n }
        );
      }
      function ba(e, t, n) {
        return (
          (!(e.hasChildren() || t.length > 0) || "full" !== n.pathMatch) &&
          "" === n.path
        );
      }
      function MC(e, t, n, r) {
        return (
          !!(At(e) === r || (r !== G && ba(t, n, e))) &&
          ("**" === e.path || Da(t, e, n).matched)
        );
      }
      function AC(e, t, n) {
        return 0 === t.length && !e.children[n];
      }
      class Ea {
        constructor(t) {
          this.segmentGroup = t || null;
        }
      }
      class SC {
        constructor(t) {
          this.urlTree = t;
        }
      }
      function bi(e) {
        return ca(new Ea(e));
      }
      function IC(e) {
        return ca(new SC(e));
      }
      class qP {
        constructor(t, n, r, o, i) {
          (this.configLoader = n),
            (this.urlSerializer = r),
            (this.urlTree = o),
            (this.config = i),
            (this.allowRedirects = !0),
            (this.ngModule = t.get(hn));
        }
        apply() {
          const t = wa(this.urlTree.root, [], [], this.config).segmentGroup,
            n = new W(t.segments, t.children);
          return this.expandSegmentGroup(this.ngModule, this.config, n, G)
            .pipe(
              Y((i) =>
                this.createUrlTree(
                  Sd(i),
                  this.urlTree.queryParams,
                  this.urlTree.fragment
                )
              )
            )
            .pipe(
              Nn((i) => {
                if (i instanceof SC)
                  return (this.allowRedirects = !1), this.match(i.urlTree);
                throw i instanceof Ea ? this.noMatchError(i) : i;
              })
            );
        }
        match(t) {
          return this.expandSegmentGroup(this.ngModule, this.config, t.root, G)
            .pipe(
              Y((o) => this.createUrlTree(Sd(o), t.queryParams, t.fragment))
            )
            .pipe(
              Nn((o) => {
                throw o instanceof Ea ? this.noMatchError(o) : o;
              })
            );
        }
        noMatchError(t) {
          return new Error(
            `Cannot match any routes. URL Segment: '${t.segmentGroup}'`
          );
        }
        createUrlTree(t, n, r) {
          const o = t.segments.length > 0 ? new W([], { [G]: t }) : t;
          return new sr(o, n, r);
        }
        expandSegmentGroup(t, n, r, o) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.expandChildren(t, n, r).pipe(Y((i) => new W([], i)))
            : this.expandSegment(t, r, n, r.segments, o, !0);
        }
        expandChildren(t, n, r) {
          const o = [];
          for (const i of Object.keys(r.children))
            "primary" === i ? o.unshift(i) : o.push(i);
          return Fe(o).pipe(
            no((i) => {
              const s = r.children[i],
                a = bC(n, i);
              return this.expandSegmentGroup(t, a, s, i).pipe(
                Y((l) => ({ segment: l, outlet: i }))
              );
            }),
            $_((i, s) => ((i[s.outlet] = s.segment), i), {}),
            (function VO(e, t) {
              const n = arguments.length >= 2;
              return (r) =>
                r.pipe(
                  e ? ir((o, i) => e(o, i, r)) : jn,
                  hd(1),
                  n ? z_(t) : G_(() => new da())
                );
            })()
          );
        }
        expandSegment(t, n, r, o, i, s) {
          return Fe(r).pipe(
            no((a) =>
              this.expandSegmentAgainstRoute(t, n, r, a, o, i, s).pipe(
                Nn((u) => {
                  if (u instanceof Ea) return L(null);
                  throw u;
                })
              )
            ),
            ro((a) => !!a),
            Nn((a, l) => {
              if (a instanceof da || "EmptyError" === a.name)
                return AC(n, o, i) ? L(new W([], {})) : bi(n);
              throw a;
            })
          );
        }
        expandSegmentAgainstRoute(t, n, r, o, i, s, a) {
          return MC(o, n, i, s)
            ? void 0 === o.redirectTo
              ? this.matchSegmentAgainstRoute(t, n, o, i, s)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s)
              : bi(n)
            : bi(n);
        }
        expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
          return "**" === o.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, o, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                t,
                n,
                r,
                o,
                i,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, r, o) {
          const i = this.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith("/")
            ? IC(i)
            : this.lineralizeSegments(r, i).pipe(
                Pe((s) => {
                  const a = new W(s, {});
                  return this.expandSegment(t, a, n, s, o, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
          const {
            matched: a,
            consumedSegments: l,
            remainingSegments: u,
            positionalParamSegments: c,
          } = Da(n, o, i);
          if (!a) return bi(n);
          const d = this.applyRedirectCommands(l, o.redirectTo, c);
          return o.redirectTo.startsWith("/")
            ? IC(d)
            : this.lineralizeSegments(o, d).pipe(
                Pe((f) => this.expandSegment(t, n, r, f.concat(u), s, !1))
              );
        }
        matchSegmentAgainstRoute(t, n, r, o, i) {
          if ("**" === r.path)
            return r.loadChildren
              ? (r._loadedConfig
                  ? L(r._loadedConfig)
                  : this.configLoader.load(t.injector, r)
                ).pipe(Y((d) => ((r._loadedConfig = d), new W(o, {}))))
              : L(new W(o, {}));
          const {
            matched: s,
            consumedSegments: a,
            remainingSegments: l,
          } = Da(n, r, o);
          return s
            ? this.getChildConfig(t, r, o).pipe(
                Pe((c) => {
                  const d = c.module,
                    f = c.routes,
                    { segmentGroup: h, slicedSegments: p } = wa(n, a, l, f),
                    m = new W(h.segments, h.children);
                  if (0 === p.length && m.hasChildren())
                    return this.expandChildren(d, f, m).pipe(
                      Y((A) => new W(a, A))
                    );
                  if (0 === f.length && 0 === p.length) return L(new W(a, {}));
                  const C = At(r) === i;
                  return this.expandSegment(d, m, f, p, C ? G : i, !0).pipe(
                    Y((g) => new W(a.concat(g.segments), g.children))
                  );
                })
              )
            : bi(n);
        }
        getChildConfig(t, n, r) {
          return n.children
            ? L(new Md(n.children, t))
            : n.loadChildren
            ? void 0 !== n._loadedConfig
              ? L(n._loadedConfig)
              : this.runCanLoadGuards(t.injector, n, r).pipe(
                  Pe((o) =>
                    o
                      ? this.configLoader
                          .load(t.injector, n)
                          .pipe(Y((i) => ((n._loadedConfig = i), i)))
                      : (function GP(e) {
                          return ca(
                            gd(
                              `Cannot load children because the guard of the route "path: '${e.path}'" returned false`
                            )
                          );
                        })(n)
                  )
                )
            : L(new Md([], t));
        }
        runCanLoadGuards(t, n, r) {
          const o = n.canLoad;
          return o && 0 !== o.length
            ? L(
                o.map((s) => {
                  const a = t.get(s);
                  let l;
                  if (
                    (function OP(e) {
                      return e && kn(e.canLoad);
                    })(a)
                  )
                    l = a.canLoad(n, r);
                  else {
                    if (!kn(a)) throw new Error("Invalid CanLoad guard");
                    l = a(n, r);
                  }
                  return tn(l);
                })
              ).pipe(
                Di(),
                ft((s) => {
                  if (!lr(s)) return;
                  const a = gd(
                    `Redirecting to "${this.urlSerializer.serialize(s)}"`
                  );
                  throw ((a.url = s), a);
                }),
                Y((s) => !0 === s)
              )
            : L(!0);
        }
        lineralizeSegments(t, n) {
          let r = [],
            o = n.root;
          for (;;) {
            if (((r = r.concat(o.segments)), 0 === o.numberOfChildren))
              return L(r);
            if (o.numberOfChildren > 1 || !o.children[G])
              return ca(
                new Error(
                  `Only absolute redirects can have named outlets. redirectTo: '${t.redirectTo}'`
                )
              );
            o = o.children[G];
          }
        }
        applyRedirectCommands(t, n, r) {
          return this.applyRedirectCreatreUrlTree(
            n,
            this.urlSerializer.parse(n),
            t,
            r
          );
        }
        applyRedirectCreatreUrlTree(t, n, r, o) {
          const i = this.createSegmentGroup(t, n.root, r, o);
          return new sr(
            i,
            this.createQueryParams(n.queryParams, this.urlTree.queryParams),
            n.fragment
          );
        }
        createQueryParams(t, n) {
          const r = {};
          return (
            Le(t, (o, i) => {
              if ("string" == typeof o && o.startsWith(":")) {
                const a = o.substring(1);
                r[i] = n[a];
              } else r[i] = o;
            }),
            r
          );
        }
        createSegmentGroup(t, n, r, o) {
          const i = this.createSegments(t, n.segments, r, o);
          let s = {};
          return (
            Le(n.children, (a, l) => {
              s[l] = this.createSegmentGroup(t, a, r, o);
            }),
            new W(i, s)
          );
        }
        createSegments(t, n, r, o) {
          return n.map((i) =>
            i.path.startsWith(":")
              ? this.findPosParam(t, i, o)
              : this.findOrReturn(i, r)
          );
        }
        findPosParam(t, n, r) {
          const o = r[n.path.substring(1)];
          if (!o)
            throw new Error(
              `Cannot redirect to '${t}'. Cannot find '${n.path}'.`
            );
          return o;
        }
        findOrReturn(t, n) {
          let r = 0;
          for (const o of n) {
            if (o.path === t.path) return n.splice(r), o;
            r++;
          }
          return t;
        }
      }
      function Sd(e) {
        const t = {};
        for (const r of Object.keys(e.children)) {
          const i = Sd(e.children[r]);
          (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
        }
        return (function WP(e) {
          if (1 === e.numberOfChildren && e.children[G]) {
            const t = e.children[G];
            return new W(e.segments.concat(t.segments), t.children);
          }
          return e;
        })(new W(e.segments, t));
      }
      class xC {
        constructor(t) {
          (this.path = t), (this.route = this.path[this.path.length - 1]);
        }
      }
      class Ma {
        constructor(t, n) {
          (this.component = t), (this.route = n);
        }
      }
      function ZP(e, t, n) {
        const r = e._root;
        return Ei(r, t ? t._root : null, n, [r.value]);
      }
      function Aa(e, t, n) {
        const r = (function JP(e) {
          if (!e) return null;
          for (let t = e.parent; t; t = t.parent) {
            const n = t.routeConfig;
            if (n && n._loadedConfig) return n._loadedConfig;
          }
          return null;
        })(t);
        return (r ? r.module.injector : n).get(e);
      }
      function Ei(
        e,
        t,
        n,
        r,
        o = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const i = io(t);
        return (
          e.children.forEach((s) => {
            (function YP(
              e,
              t,
              n,
              r,
              o = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const i = e.value,
                s = t ? t.value : null,
                a = n ? n.getContext(e.value.outlet) : null;
              if (s && i.routeConfig === s.routeConfig) {
                const l = (function XP(e, t, n) {
                  if ("function" == typeof n) return n(e, t);
                  switch (n) {
                    case "pathParamsChange":
                      return !ar(e.url, t.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !ar(e.url, t.url) || !en(e.queryParams, t.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !Dd(e, t) || !en(e.queryParams, t.queryParams);
                    default:
                      return !Dd(e, t);
                  }
                })(s, i, i.routeConfig.runGuardsAndResolvers);
                l
                  ? o.canActivateChecks.push(new xC(r))
                  : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
                  Ei(e, t, i.component ? (a ? a.children : null) : n, r, o),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    o.canDeactivateChecks.push(new Ma(a.outlet.component, s));
              } else
                s && Mi(t, a, o),
                  o.canActivateChecks.push(new xC(r)),
                  Ei(e, null, i.component ? (a ? a.children : null) : n, r, o);
            })(s, i[s.value.outlet], n, r.concat([s.value]), o),
              delete i[s.value.outlet];
          }),
          Le(i, (s, a) => Mi(s, n.getContext(a), o)),
          o
        );
      }
      function Mi(e, t, n) {
        const r = io(e),
          o = e.value;
        Le(r, (i, s) => {
          Mi(i, o.component ? (t ? t.children.getContext(s) : null) : t, n);
        }),
          n.canDeactivateChecks.push(
            new Ma(
              o.component && t && t.outlet && t.outlet.isActivated
                ? t.outlet.component
                : null,
              o
            )
          );
      }
      class lF {}
      function TC(e) {
        return new ye((t) => t.error(e));
      }
      class cF {
        constructor(t, n, r, o, i, s) {
          (this.rootComponentType = t),
            (this.config = n),
            (this.urlTree = r),
            (this.url = o),
            (this.paramsInheritanceStrategy = i),
            (this.relativeLinkResolution = s);
        }
        recognize() {
          const t = wa(
              this.urlTree.root,
              [],
              [],
              this.config.filter((s) => void 0 === s.redirectTo),
              this.relativeLinkResolution
            ).segmentGroup,
            n = this.processSegmentGroup(this.config, t, G);
          if (null === n) return null;
          const r = new ya(
              [],
              Object.freeze({}),
              Object.freeze(Object.assign({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              G,
              this.rootComponentType,
              null,
              this.urlTree.root,
              -1,
              {}
            ),
            o = new vn(r, n),
            i = new pC(this.url, o);
          return this.inheritParamsAndData(i._root), i;
        }
        inheritParamsAndData(t) {
          const n = t.value,
            r = hC(n, this.paramsInheritanceStrategy);
          (n.params = Object.freeze(r.params)),
            (n.data = Object.freeze(r.data)),
            t.children.forEach((o) => this.inheritParamsAndData(o));
        }
        processSegmentGroup(t, n, r) {
          return 0 === n.segments.length && n.hasChildren()
            ? this.processChildren(t, n)
            : this.processSegment(t, n, n.segments, r);
        }
        processChildren(t, n) {
          const r = [];
          for (const i of Object.keys(n.children)) {
            const s = n.children[i],
              a = bC(t, i),
              l = this.processSegmentGroup(a, s, i);
            if (null === l) return null;
            r.push(...l);
          }
          const o = OC(r);
          return (
            (function dF(e) {
              e.sort((t, n) =>
                t.value.outlet === G
                  ? -1
                  : n.value.outlet === G
                  ? 1
                  : t.value.outlet.localeCompare(n.value.outlet)
              );
            })(o),
            o
          );
        }
        processSegment(t, n, r, o) {
          for (const i of t) {
            const s = this.processSegmentAgainstRoute(i, n, r, o);
            if (null !== s) return s;
          }
          return AC(n, r, o) ? [] : null;
        }
        processSegmentAgainstRoute(t, n, r, o) {
          if (t.redirectTo || !MC(t, n, r, o)) return null;
          let i,
            s = [],
            a = [];
          if ("**" === t.path) {
            const h = r.length > 0 ? X_(r).parameters : {};
            i = new ya(
              r,
              h,
              Object.freeze(Object.assign({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              RC(t),
              At(t),
              t.component,
              t,
              PC(n),
              FC(n) + r.length,
              NC(t)
            );
          } else {
            const h = Da(n, t, r);
            if (!h.matched) return null;
            (s = h.consumedSegments),
              (a = h.remainingSegments),
              (i = new ya(
                s,
                h.parameters,
                Object.freeze(Object.assign({}, this.urlTree.queryParams)),
                this.urlTree.fragment,
                RC(t),
                At(t),
                t.component,
                t,
                PC(n),
                FC(n) + s.length,
                NC(t)
              ));
          }
          const l = (function fF(e) {
              return e.children
                ? e.children
                : e.loadChildren
                ? e._loadedConfig.routes
                : [];
            })(t),
            { segmentGroup: u, slicedSegments: c } = wa(
              n,
              s,
              a,
              l.filter((h) => void 0 === h.redirectTo),
              this.relativeLinkResolution
            );
          if (0 === c.length && u.hasChildren()) {
            const h = this.processChildren(l, u);
            return null === h ? null : [new vn(i, h)];
          }
          if (0 === l.length && 0 === c.length) return [new vn(i, [])];
          const d = At(t) === o,
            f = this.processSegment(l, u, c, d ? G : o);
          return null === f ? null : [new vn(i, f)];
        }
      }
      function hF(e) {
        const t = e.value.routeConfig;
        return t && "" === t.path && void 0 === t.redirectTo;
      }
      function OC(e) {
        const t = [],
          n = new Set();
        for (const r of e) {
          if (!hF(r)) {
            t.push(r);
            continue;
          }
          const o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
          void 0 !== o ? (o.children.push(...r.children), n.add(o)) : t.push(r);
        }
        for (const r of n) {
          const o = OC(r.children);
          t.push(new vn(r.value, o));
        }
        return t.filter((r) => !n.has(r));
      }
      function PC(e) {
        let t = e;
        for (; t._sourceSegment; ) t = t._sourceSegment;
        return t;
      }
      function FC(e) {
        let t = e,
          n = t._segmentIndexShift ? t._segmentIndexShift : 0;
        for (; t._sourceSegment; )
          (t = t._sourceSegment),
            (n += t._segmentIndexShift ? t._segmentIndexShift : 0);
        return n - 1;
      }
      function RC(e) {
        return e.data || {};
      }
      function NC(e) {
        return e.resolve || {};
      }
      function kC(e) {
        return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
      }
      function Id(e) {
        return or((t) => {
          const n = e(t);
          return n ? Fe(n).pipe(Y(() => t)) : L(t);
        });
      }
      class DF extends class CF {
        shouldDetach(t) {
          return !1;
        }
        store(t, n) {}
        shouldAttach(t) {
          return !1;
        }
        retrieve(t) {
          return null;
        }
        shouldReuseRoute(t, n) {
          return t.routeConfig === n.routeConfig;
        }
      } {}
      const xd = new H("ROUTES");
      class VC {
        constructor(t, n, r, o) {
          (this.injector = t),
            (this.compiler = n),
            (this.onLoadStartListener = r),
            (this.onLoadEndListener = o);
        }
        load(t, n) {
          if (n._loader$) return n._loader$;
          this.onLoadStartListener && this.onLoadStartListener(n);
          const o = this.loadModuleFactory(n.loadChildren).pipe(
            Y((i) => {
              this.onLoadEndListener && this.onLoadEndListener(n);
              const s = i.create(t);
              return new Md(
                Y_(s.injector.get(xd, void 0, P.Self | P.Optional)).map(Ad),
                s
              );
            }),
            Nn((i) => {
              throw ((n._loader$ = void 0), i);
            })
          );
          return (
            (n._loader$ = new FO(o, () => new nn()).pipe(U_())), n._loader$
          );
        }
        loadModuleFactory(t) {
          return tn(t()).pipe(
            Pe((n) =>
              n instanceof Ym ? L(n) : Fe(this.compiler.compileModuleAsync(n))
            )
          );
        }
      }
      class bF {
        shouldProcessUrl(t) {
          return !0;
        }
        extract(t) {
          return t;
        }
        merge(t, n) {
          return t;
        }
      }
      function EF(e) {
        throw e;
      }
      function MF(e, t, n) {
        return t.parse("/");
      }
      function LC(e, t) {
        return L(null);
      }
      const AF = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        SF = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let Ee = (() => {
        class e {
          constructor(n, r, o, i, s, a, l) {
            (this.rootComponentType = n),
              (this.urlSerializer = r),
              (this.rootContexts = o),
              (this.location = i),
              (this.config = l),
              (this.lastSuccessfulNavigation = null),
              (this.currentNavigation = null),
              (this.disposed = !1),
              (this.navigationId = 0),
              (this.currentPageId = 0),
              (this.isNgZoneEnabled = !1),
              (this.events = new nn()),
              (this.errorHandler = EF),
              (this.malformedUriErrorHandler = MF),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.hooks = {
                beforePreactivation: LC,
                afterPreactivation: LC,
              }),
              (this.urlHandlingStrategy = new bF()),
              (this.routeReuseStrategy = new DF()),
              (this.onSameUrlNavigation = "ignore"),
              (this.paramsInheritanceStrategy = "emptyOnly"),
              (this.urlUpdateStrategy = "deferred"),
              (this.relativeLinkResolution = "corrected"),
              (this.canceledNavigationResolution = "replace"),
              (this.ngModule = s.get(hn)),
              (this.console = s.get(TI));
            const d = s.get(Ve);
            (this.isNgZoneEnabled = d instanceof Ve && Ve.isInAngularZone()),
              this.resetConfig(l),
              (this.currentUrlTree = (function XO() {
                return new sr(new W([], {}), {}, null);
              })()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.configLoader = new VC(
                s,
                a,
                (f) => this.triggerEvent(new W_(f)),
                (f) => this.triggerEvent(new Q_(f))
              )),
              (this.routerState = fC(
                this.currentUrlTree,
                this.rootComponentType
              )),
              (this.transitions = new Bt({
                id: 0,
                targetPageId: 0,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                extractedUrl: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                urlAfterRedirects: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                rawUrl: this.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: "imperative",
                restoredState: null,
                currentSnapshot: this.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: this.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              (this.navigations = this.setupNavigations(this.transitions)),
              this.processNavigations();
          }
          get browserPageId() {
            var n;
            return null === (n = this.location.getState()) || void 0 === n
              ? void 0
              : n.ɵrouterPageId;
          }
          setupNavigations(n) {
            const r = this.events;
            return n.pipe(
              ir((o) => 0 !== o.id),
              Y((o) =>
                Object.assign(Object.assign({}, o), {
                  extractedUrl: this.urlHandlingStrategy.extract(o.rawUrl),
                })
              ),
              or((o) => {
                let i = !1,
                  s = !1;
                return L(o).pipe(
                  ft((a) => {
                    this.currentNavigation = {
                      id: a.id,
                      initialUrl: a.currentRawUrl,
                      extractedUrl: a.extractedUrl,
                      trigger: a.source,
                      extras: a.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? Object.assign(
                            Object.assign({}, this.lastSuccessfulNavigation),
                            { previousNavigation: null }
                          )
                        : null,
                    };
                  }),
                  or((a) => {
                    const l = this.browserUrlTree.toString(),
                      u =
                        !this.navigated ||
                        a.extractedUrl.toString() !== l ||
                        l !== this.currentUrlTree.toString();
                    if (
                      ("reload" === this.onSameUrlNavigation || u) &&
                      this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl)
                    )
                      return (
                        BC(a.source) && (this.browserUrlTree = a.extractedUrl),
                        L(a).pipe(
                          or((d) => {
                            const f = this.transitions.getValue();
                            return (
                              r.next(
                                new pd(
                                  d.id,
                                  this.serializeUrl(d.extractedUrl),
                                  d.source,
                                  d.restoredState
                                )
                              ),
                              f !== this.transitions.getValue()
                                ? on
                                : Promise.resolve(d)
                            );
                          }),
                          (function QP(e, t, n, r) {
                            return or((o) =>
                              (function zP(e, t, n, r, o) {
                                return new qP(e, t, n, r, o).apply();
                              })(e, t, n, o.extractedUrl, r).pipe(
                                Y((i) =>
                                  Object.assign(Object.assign({}, o), {
                                    urlAfterRedirects: i,
                                  })
                                )
                              )
                            );
                          })(
                            this.ngModule.injector,
                            this.configLoader,
                            this.urlSerializer,
                            this.config
                          ),
                          ft((d) => {
                            this.currentNavigation = Object.assign(
                              Object.assign({}, this.currentNavigation),
                              { finalUrl: d.urlAfterRedirects }
                            );
                          }),
                          (function pF(e, t, n, r, o) {
                            return Pe((i) =>
                              (function uF(
                                e,
                                t,
                                n,
                                r,
                                o = "emptyOnly",
                                i = "legacy"
                              ) {
                                try {
                                  const s = new cF(
                                    e,
                                    t,
                                    n,
                                    r,
                                    o,
                                    i
                                  ).recognize();
                                  return null === s ? TC(new lF()) : L(s);
                                } catch (s) {
                                  return TC(s);
                                }
                              })(
                                e,
                                t,
                                i.urlAfterRedirects,
                                n(i.urlAfterRedirects),
                                r,
                                o
                              ).pipe(
                                Y((s) =>
                                  Object.assign(Object.assign({}, i), {
                                    targetSnapshot: s,
                                  })
                                )
                              )
                            );
                          })(
                            this.rootComponentType,
                            this.config,
                            (d) => this.serializeUrl(d),
                            this.paramsInheritanceStrategy,
                            this.relativeLinkResolution
                          ),
                          ft((d) => {
                            if ("eager" === this.urlUpdateStrategy) {
                              if (!d.extras.skipLocationChange) {
                                const h = this.urlHandlingStrategy.merge(
                                  d.urlAfterRedirects,
                                  d.rawUrl
                                );
                                this.setBrowserUrl(h, d);
                              }
                              this.browserUrlTree = d.urlAfterRedirects;
                            }
                            const f = new jO(
                              d.id,
                              this.serializeUrl(d.extractedUrl),
                              this.serializeUrl(d.urlAfterRedirects),
                              d.targetSnapshot
                            );
                            r.next(f);
                          })
                        )
                      );
                    if (
                      u &&
                      this.rawUrlTree &&
                      this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)
                    ) {
                      const {
                          id: f,
                          extractedUrl: h,
                          source: p,
                          restoredState: m,
                          extras: C,
                        } = a,
                        _ = new pd(f, this.serializeUrl(h), p, m);
                      r.next(_);
                      const g = fC(h, this.rootComponentType).snapshot;
                      return L(
                        Object.assign(Object.assign({}, a), {
                          targetSnapshot: g,
                          urlAfterRedirects: h,
                          extras: Object.assign(Object.assign({}, C), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })
                      );
                    }
                    return (this.rawUrlTree = a.rawUrl), a.resolve(null), on;
                  }),
                  Id((a) => {
                    const {
                      targetSnapshot: l,
                      id: u,
                      extractedUrl: c,
                      rawUrl: d,
                      extras: { skipLocationChange: f, replaceUrl: h },
                    } = a;
                    return this.hooks.beforePreactivation(l, {
                      navigationId: u,
                      appliedUrlTree: c,
                      rawUrlTree: d,
                      skipLocationChange: !!f,
                      replaceUrl: !!h,
                    });
                  }),
                  ft((a) => {
                    const l = new HO(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot
                    );
                    this.triggerEvent(l);
                  }),
                  Y((a) =>
                    Object.assign(Object.assign({}, a), {
                      guards: ZP(
                        a.targetSnapshot,
                        a.currentSnapshot,
                        this.rootContexts
                      ),
                    })
                  ),
                  (function eF(e, t) {
                    return Pe((n) => {
                      const {
                        targetSnapshot: r,
                        currentSnapshot: o,
                        guards: {
                          canActivateChecks: i,
                          canDeactivateChecks: s,
                        },
                      } = n;
                      return 0 === s.length && 0 === i.length
                        ? L(
                            Object.assign(Object.assign({}, n), {
                              guardsResult: !0,
                            })
                          )
                        : (function tF(e, t, n, r) {
                            return Fe(e).pipe(
                              Pe((o) =>
                                (function aF(e, t, n, r, o) {
                                  const i =
                                    t && t.routeConfig
                                      ? t.routeConfig.canDeactivate
                                      : null;
                                  return i && 0 !== i.length
                                    ? L(
                                        i.map((a) => {
                                          const l = Aa(a, t, o);
                                          let u;
                                          if (
                                            (function RP(e) {
                                              return e && kn(e.canDeactivate);
                                            })(l)
                                          )
                                            u = tn(l.canDeactivate(e, t, n, r));
                                          else {
                                            if (!kn(l))
                                              throw new Error(
                                                "Invalid CanDeactivate guard"
                                              );
                                            u = tn(l(e, t, n, r));
                                          }
                                          return u.pipe(ro());
                                        })
                                      ).pipe(Di())
                                    : L(!0);
                                })(o.component, o.route, n, t, r)
                              ),
                              ro((o) => !0 !== o, !0)
                            );
                          })(s, r, o, e).pipe(
                            Pe((a) =>
                              a &&
                              (function TP(e) {
                                return "boolean" == typeof e;
                              })(a)
                                ? (function nF(e, t, n, r) {
                                    return Fe(t).pipe(
                                      no((o) =>
                                        fd(
                                          (function oF(e, t) {
                                            return (
                                              null !== e && t && t(new zO(e)),
                                              L(!0)
                                            );
                                          })(o.route.parent, r),
                                          (function rF(e, t) {
                                            return (
                                              null !== e && t && t(new WO(e)),
                                              L(!0)
                                            );
                                          })(o.route, r),
                                          (function sF(e, t, n) {
                                            const r = t[t.length - 1],
                                              i = t
                                                .slice(0, t.length - 1)
                                                .reverse()
                                                .map((s) =>
                                                  (function KP(e) {
                                                    const t = e.routeConfig
                                                      ? e.routeConfig
                                                          .canActivateChild
                                                      : null;
                                                    return t && 0 !== t.length
                                                      ? { node: e, guards: t }
                                                      : null;
                                                  })(s)
                                                )
                                                .filter((s) => null !== s)
                                                .map((s) =>
                                                  H_(() =>
                                                    L(
                                                      s.guards.map((l) => {
                                                        const u = Aa(
                                                          l,
                                                          s.node,
                                                          n
                                                        );
                                                        let c;
                                                        if (
                                                          (function FP(e) {
                                                            return (
                                                              e &&
                                                              kn(
                                                                e.canActivateChild
                                                              )
                                                            );
                                                          })(u)
                                                        )
                                                          c = tn(
                                                            u.canActivateChild(
                                                              r,
                                                              e
                                                            )
                                                          );
                                                        else {
                                                          if (!kn(u))
                                                            throw new Error(
                                                              "Invalid CanActivateChild guard"
                                                            );
                                                          c = tn(u(r, e));
                                                        }
                                                        return c.pipe(ro());
                                                      })
                                                    ).pipe(Di())
                                                  )
                                                );
                                            return L(i).pipe(Di());
                                          })(e, o.path, n),
                                          (function iF(e, t, n) {
                                            const r = t.routeConfig
                                              ? t.routeConfig.canActivate
                                              : null;
                                            if (!r || 0 === r.length)
                                              return L(!0);
                                            const o = r.map((i) =>
                                              H_(() => {
                                                const s = Aa(i, t, n);
                                                let a;
                                                if (
                                                  (function PP(e) {
                                                    return (
                                                      e && kn(e.canActivate)
                                                    );
                                                  })(s)
                                                )
                                                  a = tn(s.canActivate(t, e));
                                                else {
                                                  if (!kn(s))
                                                    throw new Error(
                                                      "Invalid CanActivate guard"
                                                    );
                                                  a = tn(s(t, e));
                                                }
                                                return a.pipe(ro());
                                              })
                                            );
                                            return L(o).pipe(Di());
                                          })(e, o.route, n)
                                        )
                                      ),
                                      ro((o) => !0 !== o, !0)
                                    );
                                  })(r, i, e, t)
                                : L(a)
                            ),
                            Y((a) =>
                              Object.assign(Object.assign({}, n), {
                                guardsResult: a,
                              })
                            )
                          );
                    });
                  })(this.ngModule.injector, (a) => this.triggerEvent(a)),
                  ft((a) => {
                    if (lr(a.guardsResult)) {
                      const u = gd(
                        `Redirecting to "${this.serializeUrl(a.guardsResult)}"`
                      );
                      throw ((u.url = a.guardsResult), u);
                    }
                    const l = new UO(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot,
                      !!a.guardsResult
                    );
                    this.triggerEvent(l);
                  }),
                  ir(
                    (a) =>
                      !!a.guardsResult ||
                      (this.restoreHistory(a),
                      this.cancelNavigationTransition(a, ""),
                      !1)
                  ),
                  Id((a) => {
                    if (a.guards.canActivateChecks.length)
                      return L(a).pipe(
                        ft((l) => {
                          const u = new $O(
                            l.id,
                            this.serializeUrl(l.extractedUrl),
                            this.serializeUrl(l.urlAfterRedirects),
                            l.targetSnapshot
                          );
                          this.triggerEvent(u);
                        }),
                        or((l) => {
                          let u = !1;
                          return L(l).pipe(
                            (function gF(e, t) {
                              return Pe((n) => {
                                const {
                                  targetSnapshot: r,
                                  guards: { canActivateChecks: o },
                                } = n;
                                if (!o.length) return L(n);
                                let i = 0;
                                return Fe(o).pipe(
                                  no((s) =>
                                    (function mF(e, t, n, r) {
                                      return (function yF(e, t, n, r) {
                                        const o = kC(e);
                                        if (0 === o.length) return L({});
                                        const i = {};
                                        return Fe(o).pipe(
                                          Pe((s) =>
                                            (function vF(e, t, n, r) {
                                              const o = Aa(e, t, r);
                                              return tn(
                                                o.resolve
                                                  ? o.resolve(t, n)
                                                  : o(t, n)
                                              );
                                            })(e[s], t, n, r).pipe(
                                              ft((a) => {
                                                i[s] = a;
                                              })
                                            )
                                          ),
                                          hd(1),
                                          Pe(() =>
                                            kC(i).length === o.length
                                              ? L(i)
                                              : on
                                          )
                                        );
                                      })(e._resolve, e, t, r).pipe(
                                        Y(
                                          (i) => (
                                            (e._resolvedData = i),
                                            (e.data = Object.assign(
                                              Object.assign({}, e.data),
                                              hC(e, n).resolve
                                            )),
                                            null
                                          )
                                        )
                                      );
                                    })(s.route, r, e, t)
                                  ),
                                  ft(() => i++),
                                  hd(1),
                                  Pe((s) => (i === o.length ? L(n) : on))
                                );
                              });
                            })(
                              this.paramsInheritanceStrategy,
                              this.ngModule.injector
                            ),
                            ft({
                              next: () => (u = !0),
                              complete: () => {
                                u ||
                                  (this.restoreHistory(l),
                                  this.cancelNavigationTransition(
                                    l,
                                    "At least one route resolver didn't emit any value."
                                  ));
                              },
                            })
                          );
                        }),
                        ft((l) => {
                          const u = new GO(
                            l.id,
                            this.serializeUrl(l.extractedUrl),
                            this.serializeUrl(l.urlAfterRedirects),
                            l.targetSnapshot
                          );
                          this.triggerEvent(u);
                        })
                      );
                  }),
                  Id((a) => {
                    const {
                      targetSnapshot: l,
                      id: u,
                      extractedUrl: c,
                      rawUrl: d,
                      extras: { skipLocationChange: f, replaceUrl: h },
                    } = a;
                    return this.hooks.afterPreactivation(l, {
                      navigationId: u,
                      appliedUrlTree: c,
                      rawUrlTree: d,
                      skipLocationChange: !!f,
                      replaceUrl: !!h,
                    });
                  }),
                  Y((a) => {
                    const l = (function yP(e, t, n) {
                      const r = vi(e, t._root, n ? n._root : void 0);
                      return new dC(r, t);
                    })(
                      this.routeReuseStrategy,
                      a.targetSnapshot,
                      a.currentRouterState
                    );
                    return Object.assign(Object.assign({}, a), {
                      targetRouterState: l,
                    });
                  }),
                  ft((a) => {
                    (this.currentUrlTree = a.urlAfterRedirects),
                      (this.rawUrlTree = this.urlHandlingStrategy.merge(
                        a.urlAfterRedirects,
                        a.rawUrl
                      )),
                      (this.routerState = a.targetRouterState),
                      "deferred" === this.urlUpdateStrategy &&
                        (a.extras.skipLocationChange ||
                          this.setBrowserUrl(this.rawUrlTree, a),
                        (this.browserUrlTree = a.urlAfterRedirects));
                  }),
                  ((e, t, n) =>
                    Y(
                      (r) => (
                        new IP(
                          t,
                          r.targetRouterState,
                          r.currentRouterState,
                          n
                        ).activate(e),
                        r
                      )
                    ))(this.rootContexts, this.routeReuseStrategy, (a) =>
                    this.triggerEvent(a)
                  ),
                  ft({
                    next() {
                      i = !0;
                    },
                    complete() {
                      i = !0;
                    },
                  }),
                  (function LO(e) {
                    return Ne((t, n) => {
                      try {
                        t.subscribe(n);
                      } finally {
                        n.add(e);
                      }
                    });
                  })(() => {
                    var a;
                    i ||
                      s ||
                      this.cancelNavigationTransition(
                        o,
                        `Navigation ID ${o.id} is not equal to the current navigation id ${this.navigationId}`
                      ),
                      (null === (a = this.currentNavigation) || void 0 === a
                        ? void 0
                        : a.id) === o.id && (this.currentNavigation = null);
                  }),
                  Nn((a) => {
                    if (
                      ((s = !0),
                      (function KO(e) {
                        return e && e[K_];
                      })(a))
                    ) {
                      const l = lr(a.url);
                      l || ((this.navigated = !0), this.restoreHistory(o, !0));
                      const u = new q_(
                        o.id,
                        this.serializeUrl(o.extractedUrl),
                        a.message
                      );
                      r.next(u),
                        l
                          ? setTimeout(() => {
                              const c = this.urlHandlingStrategy.merge(
                                  a.url,
                                  this.rawUrlTree
                                ),
                                d = {
                                  skipLocationChange:
                                    o.extras.skipLocationChange,
                                  replaceUrl:
                                    "eager" === this.urlUpdateStrategy ||
                                    BC(o.source),
                                };
                              this.scheduleNavigation(
                                c,
                                "imperative",
                                null,
                                d,
                                {
                                  resolve: o.resolve,
                                  reject: o.reject,
                                  promise: o.promise,
                                }
                              );
                            }, 0)
                          : o.resolve(!1);
                    } else {
                      this.restoreHistory(o, !0);
                      const l = new BO(
                        o.id,
                        this.serializeUrl(o.extractedUrl),
                        a
                      );
                      r.next(l);
                      try {
                        o.resolve(this.errorHandler(a));
                      } catch (u) {
                        o.reject(u);
                      }
                    }
                    return on;
                  })
                );
              })
            );
          }
          resetRootComponentType(n) {
            (this.rootComponentType = n),
              (this.routerState.root.component = this.rootComponentType);
          }
          setTransition(n) {
            this.transitions.next(
              Object.assign(Object.assign({}, this.transitions.value), n)
            );
          }
          initialNavigation() {
            this.setUpLocationChangeListener(),
              0 === this.navigationId &&
                this.navigateByUrl(this.location.path(!0), { replaceUrl: !0 });
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((n) => {
                const r = "popstate" === n.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    var o;
                    const i = { replaceUrl: !0 },
                      s = (
                        null === (o = n.state) || void 0 === o
                          ? void 0
                          : o.navigationId
                      )
                        ? n.state
                        : null;
                    if (s) {
                      const l = Object.assign({}, s);
                      delete l.navigationId,
                        delete l.ɵrouterPageId,
                        0 !== Object.keys(l).length && (i.state = l);
                    }
                    const a = this.parseUrl(n.url);
                    this.scheduleNavigation(a, r, s, i);
                  }, 0);
              }));
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.currentNavigation;
          }
          triggerEvent(n) {
            this.events.next(n);
          }
          resetConfig(n) {
            wC(n),
              (this.config = n.map(Ad)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.transitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0);
          }
          createUrlTree(n, r = {}) {
            const {
                relativeTo: o,
                queryParams: i,
                fragment: s,
                queryParamsHandling: a,
                preserveFragment: l,
              } = r,
              u = o || this.routerState.root,
              c = l ? this.currentUrlTree.fragment : s;
            let d = null;
            switch (a) {
              case "merge":
                d = Object.assign(
                  Object.assign({}, this.currentUrlTree.queryParams),
                  i
                );
                break;
              case "preserve":
                d = this.currentUrlTree.queryParams;
                break;
              default:
                d = i || null;
            }
            return (
              null !== d && (d = this.removeEmptyProps(d)),
              (function CP(e, t, n, r, o) {
                if (0 === n.length) return wd(t.root, t.root, t.root, r, o);
                const i = (function DP(e) {
                  if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
                    return new yC(!0, 0, e);
                  let t = 0,
                    n = !1;
                  const r = e.reduce((o, i, s) => {
                    if ("object" == typeof i && null != i) {
                      if (i.outlets) {
                        const a = {};
                        return (
                          Le(i.outlets, (l, u) => {
                            a[u] = "string" == typeof l ? l.split("/") : l;
                          }),
                          [...o, { outlets: a }]
                        );
                      }
                      if (i.segmentPath) return [...o, i.segmentPath];
                    }
                    return "string" != typeof i
                      ? [...o, i]
                      : 0 === s
                      ? (i.split("/").forEach((a, l) => {
                          (0 == l && "." === a) ||
                            (0 == l && "" === a
                              ? (n = !0)
                              : ".." === a
                              ? t++
                              : "" != a && o.push(a));
                        }),
                        o)
                      : [...o, i];
                  }, []);
                  return new yC(n, t, r);
                })(n);
                if (i.toRoot()) return wd(t.root, t.root, new W([], {}), r, o);
                const s = (function wP(e, t, n) {
                    if (e.isAbsolute) return new bd(t.root, !0, 0);
                    if (-1 === n.snapshot._lastPathIndex) {
                      const i = n.snapshot._urlSegment;
                      return new bd(i, i === t.root, 0);
                    }
                    const r = va(e.commands[0]) ? 0 : 1;
                    return (function bP(e, t, n) {
                      let r = e,
                        o = t,
                        i = n;
                      for (; i > o; ) {
                        if (((i -= o), (r = r.parent), !r))
                          throw new Error("Invalid number of '../'");
                        o = r.segments.length;
                      }
                      return new bd(r, !1, o - i);
                    })(
                      n.snapshot._urlSegment,
                      n.snapshot._lastPathIndex + r,
                      e.numberOfDoubleDots
                    );
                  })(i, t, e),
                  a = s.processChildren
                    ? _a(s.segmentGroup, s.index, i.commands)
                    : vC(s.segmentGroup, s.index, i.commands);
                return wd(t.root, s.segmentGroup, a, r, o);
              })(u, this.currentUrlTree, n, d, null != c ? c : null)
            );
          }
          navigateByUrl(n, r = { skipLocationChange: !1 }) {
            const o = lr(n) ? n : this.parseUrl(n),
              i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
            return this.scheduleNavigation(i, "imperative", null, r);
          }
          navigate(n, r = { skipLocationChange: !1 }) {
            return (
              (function IF(e) {
                for (let t = 0; t < e.length; t++) {
                  const n = e[t];
                  if (null == n)
                    throw new Error(
                      `The requested path contains ${n} segment at index ${t}`
                    );
                }
              })(n),
              this.navigateByUrl(this.createUrlTree(n, r), r)
            );
          }
          serializeUrl(n) {
            return this.urlSerializer.serialize(n);
          }
          parseUrl(n) {
            let r;
            try {
              r = this.urlSerializer.parse(n);
            } catch (o) {
              r = this.malformedUriErrorHandler(o, this.urlSerializer, n);
            }
            return r;
          }
          isActive(n, r) {
            let o;
            if (
              ((o =
                !0 === r
                  ? Object.assign({}, AF)
                  : !1 === r
                  ? Object.assign({}, SF)
                  : r),
              lr(n))
            )
              return tC(this.currentUrlTree, n, o);
            const i = this.parseUrl(n);
            return tC(this.currentUrlTree, i, o);
          }
          removeEmptyProps(n) {
            return Object.keys(n).reduce((r, o) => {
              const i = n[o];
              return null != i && (r[o] = i), r;
            }, {});
          }
          processNavigations() {
            this.navigations.subscribe(
              (n) => {
                (this.navigated = !0),
                  (this.lastSuccessfulId = n.id),
                  (this.currentPageId = n.targetPageId),
                  this.events.next(
                    new gi(
                      n.id,
                      this.serializeUrl(n.extractedUrl),
                      this.serializeUrl(this.currentUrlTree)
                    )
                  ),
                  (this.lastSuccessfulNavigation = this.currentNavigation),
                  n.resolve(!0);
              },
              (n) => {
                this.console.warn(`Unhandled Navigation Error: ${n}`);
              }
            );
          }
          scheduleNavigation(n, r, o, i, s) {
            var a, l;
            if (this.disposed) return Promise.resolve(!1);
            let u, c, d;
            s
              ? ((u = s.resolve), (c = s.reject), (d = s.promise))
              : (d = new Promise((p, m) => {
                  (u = p), (c = m);
                }));
            const f = ++this.navigationId;
            let h;
            return (
              "computed" === this.canceledNavigationResolution
                ? (0 === this.currentPageId && (o = this.location.getState()),
                  (h =
                    o && o.ɵrouterPageId
                      ? o.ɵrouterPageId
                      : i.replaceUrl || i.skipLocationChange
                      ? null !== (a = this.browserPageId) && void 0 !== a
                        ? a
                        : 0
                      : (null !== (l = this.browserPageId) && void 0 !== l
                          ? l
                          : 0) + 1))
                : (h = 0),
              this.setTransition({
                id: f,
                targetPageId: h,
                source: r,
                restoredState: o,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.rawUrlTree,
                rawUrl: n,
                extras: i,
                resolve: u,
                reject: c,
                promise: d,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              d.catch((p) => Promise.reject(p))
            );
          }
          setBrowserUrl(n, r) {
            const o = this.urlSerializer.serialize(n),
              i = Object.assign(
                Object.assign({}, r.extras.state),
                this.generateNgRouterState(r.id, r.targetPageId)
              );
            this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl
              ? this.location.replaceState(o, "", i)
              : this.location.go(o, "", i);
          }
          restoreHistory(n, r = !1) {
            var o, i;
            if ("computed" === this.canceledNavigationResolution) {
              const s = this.currentPageId - n.targetPageId;
              ("popstate" !== n.source &&
                "eager" !== this.urlUpdateStrategy &&
                this.currentUrlTree !==
                  (null === (o = this.currentNavigation) || void 0 === o
                    ? void 0
                    : o.finalUrl)) ||
              0 === s
                ? this.currentUrlTree ===
                    (null === (i = this.currentNavigation) || void 0 === i
                      ? void 0
                      : i.finalUrl) &&
                  0 === s &&
                  (this.resetState(n),
                  (this.browserUrlTree = n.currentUrlTree),
                  this.resetUrlToCurrentUrlTree())
                : this.location.historyGo(s);
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
          }
          resetState(n) {
            (this.routerState = n.currentRouterState),
              (this.currentUrlTree = n.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                n.rawUrl
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId
              )
            );
          }
          cancelNavigationTransition(n, r) {
            const o = new q_(n.id, this.serializeUrl(n.extractedUrl), r);
            this.triggerEvent(o), n.resolve(!1);
          }
          generateNgRouterState(n, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: n, ɵrouterPageId: r }
              : { navigationId: n };
          }
        }
        return (
          (e.ɵfac = function (n) {
            Au();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function BC(e) {
        return "imperative" !== e;
      }
      let Sa = (() => {
          class e {
            constructor(n, r, o, i, s) {
              (this.router = n),
                (this.route = r),
                (this.tabIndexAttribute = o),
                (this.renderer = i),
                (this.el = s),
                (this.commands = null),
                (this.onChanges = new nn()),
                this.setTabIndexIfNotOnNativeEl("0");
            }
            setTabIndexIfNotOnNativeEl(n) {
              if (null != this.tabIndexAttribute) return;
              const r = this.renderer,
                o = this.el.nativeElement;
              null !== n
                ? r.setAttribute(o, "tabindex", n)
                : r.removeAttribute(o, "tabindex");
            }
            ngOnChanges(n) {
              this.onChanges.next(this);
            }
            set routerLink(n) {
              null != n
                ? ((this.commands = Array.isArray(n) ? n : [n]),
                  this.setTabIndexIfNotOnNativeEl("0"))
                : ((this.commands = null),
                  this.setTabIndexIfNotOnNativeEl(null));
            }
            onClick() {
              if (null === this.urlTree) return !0;
              const n = {
                skipLocationChange: ao(this.skipLocationChange),
                replaceUrl: ao(this.replaceUrl),
                state: this.state,
              };
              return this.router.navigateByUrl(this.urlTree, n), !0;
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: ao(this.preserveFragment),
                  });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(y(Ee), y(so), wo("tabindex"), y(fn), y(ct));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [["", "routerLink", "", 5, "a", 5, "area"]],
              hostBindings: function (n, r) {
                1 & n &&
                  K("click", function () {
                    return r.onClick();
                  });
              },
              inputs: {
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                preserveFragment: "preserveFragment",
                skipLocationChange: "skipLocationChange",
                replaceUrl: "replaceUrl",
                state: "state",
                relativeTo: "relativeTo",
                routerLink: "routerLink",
              },
              features: [_t],
            })),
            e
          );
        })(),
        Ai = (() => {
          class e {
            constructor(n, r, o) {
              (this.router = n),
                (this.route = r),
                (this.locationStrategy = o),
                (this.commands = null),
                (this.href = null),
                (this.onChanges = new nn()),
                (this.subscription = n.events.subscribe((i) => {
                  i instanceof gi && this.updateTargetUrlAndHref();
                }));
            }
            set routerLink(n) {
              this.commands = null != n ? (Array.isArray(n) ? n : [n]) : null;
            }
            ngOnChanges(n) {
              this.updateTargetUrlAndHref(), this.onChanges.next(this);
            }
            ngOnDestroy() {
              this.subscription.unsubscribe();
            }
            onClick(n, r, o, i, s) {
              if (
                0 !== n ||
                r ||
                o ||
                i ||
                s ||
                ("string" == typeof this.target && "_self" != this.target) ||
                null === this.urlTree
              )
                return !0;
              const a = {
                skipLocationChange: ao(this.skipLocationChange),
                replaceUrl: ao(this.replaceUrl),
                state: this.state,
              };
              return this.router.navigateByUrl(this.urlTree, a), !1;
            }
            updateTargetUrlAndHref() {
              this.href =
                null !== this.urlTree
                  ? this.locationStrategy.prepareExternalUrl(
                      this.router.serializeUrl(this.urlTree)
                    )
                  : null;
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: ao(this.preserveFragment),
                  });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(y(Ee), y(so), y(Yr));
            }),
            (e.ɵdir = O({
              type: e,
              selectors: [
                ["a", "routerLink", ""],
                ["area", "routerLink", ""],
              ],
              hostVars: 2,
              hostBindings: function (n, r) {
                1 & n &&
                  K("click", function (i) {
                    return r.onClick(
                      i.button,
                      i.ctrlKey,
                      i.shiftKey,
                      i.altKey,
                      i.metaKey
                    );
                  }),
                  2 & n && Zt("target", r.target)("href", r.href, cs);
              },
              inputs: {
                target: "target",
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                preserveFragment: "preserveFragment",
                skipLocationChange: "skipLocationChange",
                replaceUrl: "replaceUrl",
                state: "state",
                relativeTo: "relativeTo",
                routerLink: "routerLink",
              },
              features: [_t],
            })),
            e
          );
        })();
      function ao(e) {
        return "" === e || !!e;
      }
      class jC {}
      class HC {
        preload(t, n) {
          return L(null);
        }
      }
      let UC = (() => {
          class e {
            constructor(n, r, o, i) {
              (this.router = n),
                (this.injector = o),
                (this.preloadingStrategy = i),
                (this.loader = new VC(
                  o,
                  r,
                  (l) => n.triggerEvent(new W_(l)),
                  (l) => n.triggerEvent(new Q_(l))
                ));
            }
            setUpPreloading() {
              this.subscription = this.router.events
                .pipe(
                  ir((n) => n instanceof gi),
                  no(() => this.preload())
                )
                .subscribe(() => {});
            }
            preload() {
              const n = this.injector.get(hn);
              return this.processRoutes(n, this.router.config);
            }
            ngOnDestroy() {
              this.subscription && this.subscription.unsubscribe();
            }
            processRoutes(n, r) {
              const o = [];
              for (const i of r)
                if (i.loadChildren && !i.canLoad && i._loadedConfig) {
                  const s = i._loadedConfig;
                  o.push(this.processRoutes(s.module, s.routes));
                } else
                  i.loadChildren && !i.canLoad
                    ? o.push(this.preloadConfig(n, i))
                    : i.children && o.push(this.processRoutes(n, i.children));
              return Fe(o).pipe(
                co(),
                Y((i) => {})
              );
            }
            preloadConfig(n, r) {
              return this.preloadingStrategy.preload(r, () =>
                (r._loadedConfig
                  ? L(r._loadedConfig)
                  : this.loader.load(n.injector, r)
                ).pipe(
                  Pe(
                    (i) => (
                      (r._loadedConfig = i),
                      this.processRoutes(i.module, i.routes)
                    )
                  )
                )
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(Ee), S(Ry), S(Qe), S(jC));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Td = (() => {
          class e {
            constructor(n, r, o = {}) {
              (this.router = n),
                (this.viewportScroller = r),
                (this.options = o),
                (this.lastId = 0),
                (this.lastSource = "imperative"),
                (this.restoredId = 0),
                (this.store = {}),
                (o.scrollPositionRestoration =
                  o.scrollPositionRestoration || "disabled"),
                (o.anchorScrolling = o.anchorScrolling || "disabled");
            }
            init() {
              "disabled" !== this.options.scrollPositionRestoration &&
                this.viewportScroller.setHistoryScrollRestoration("manual"),
                (this.routerEventsSubscription = this.createScrollEvents()),
                (this.scrollEventsSubscription = this.consumeScrollEvents());
            }
            createScrollEvents() {
              return this.router.events.subscribe((n) => {
                n instanceof pd
                  ? ((this.store[this.lastId] =
                      this.viewportScroller.getScrollPosition()),
                    (this.lastSource = n.navigationTrigger),
                    (this.restoredId = n.restoredState
                      ? n.restoredState.navigationId
                      : 0))
                  : n instanceof gi &&
                    ((this.lastId = n.id),
                    this.scheduleScrollEvent(
                      n,
                      this.router.parseUrl(n.urlAfterRedirects).fragment
                    ));
              });
            }
            consumeScrollEvents() {
              return this.router.events.subscribe((n) => {
                n instanceof Z_ &&
                  (n.position
                    ? "top" === this.options.scrollPositionRestoration
                      ? this.viewportScroller.scrollToPosition([0, 0])
                      : "enabled" === this.options.scrollPositionRestoration &&
                        this.viewportScroller.scrollToPosition(n.position)
                    : n.anchor && "enabled" === this.options.anchorScrolling
                    ? this.viewportScroller.scrollToAnchor(n.anchor)
                    : "disabled" !== this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition([0, 0]));
              });
            }
            scheduleScrollEvent(n, r) {
              this.router.triggerEvent(
                new Z_(
                  n,
                  "popstate" === this.lastSource
                    ? this.store[this.restoredId]
                    : null,
                  r
                )
              );
            }
            ngOnDestroy() {
              this.routerEventsSubscription &&
                this.routerEventsSubscription.unsubscribe(),
                this.scrollEventsSubscription &&
                  this.scrollEventsSubscription.unsubscribe();
            }
          }
          return (
            (e.ɵfac = function (n) {
              Au();
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const ur = new H("ROUTER_CONFIGURATION"),
        $C = new H("ROUTER_FORROOT_GUARD"),
        PF = [
          Ec,
          { provide: iC, useClass: sC },
          {
            provide: Ee,
            useFactory: function VF(e, t, n, r, o, i, s = {}, a, l) {
              const u = new Ee(null, e, t, n, r, o, Y_(i));
              return (
                a && (u.urlHandlingStrategy = a),
                l && (u.routeReuseStrategy = l),
                (function LF(e, t) {
                  e.errorHandler && (t.errorHandler = e.errorHandler),
                    e.malformedUriErrorHandler &&
                      (t.malformedUriErrorHandler = e.malformedUriErrorHandler),
                    e.onSameUrlNavigation &&
                      (t.onSameUrlNavigation = e.onSameUrlNavigation),
                    e.paramsInheritanceStrategy &&
                      (t.paramsInheritanceStrategy =
                        e.paramsInheritanceStrategy),
                    e.relativeLinkResolution &&
                      (t.relativeLinkResolution = e.relativeLinkResolution),
                    e.urlUpdateStrategy &&
                      (t.urlUpdateStrategy = e.urlUpdateStrategy),
                    e.canceledNavigationResolution &&
                      (t.canceledNavigationResolution =
                        e.canceledNavigationResolution);
                })(s, u),
                s.enableTracing &&
                  u.events.subscribe((c) => {
                    var d, f;
                    null === (d = console.group) ||
                      void 0 === d ||
                      d.call(console, `Router Event: ${c.constructor.name}`),
                      console.log(c.toString()),
                      console.log(c),
                      null === (f = console.groupEnd) ||
                        void 0 === f ||
                        f.call(console);
                  }),
                u
              );
            },
            deps: [
              iC,
              wi,
              Ec,
              Qe,
              Ry,
              xd,
              ur,
              [class wF {}, new An()],
              [class _F {}, new An()],
            ],
          },
          wi,
          {
            provide: so,
            useFactory: function BF(e) {
              return e.routerState.root;
            },
            deps: [Ee],
          },
          UC,
          HC,
          class OF {
            preload(t, n) {
              return n().pipe(Nn(() => L(null)));
            }
          },
          { provide: ur, useValue: { enableTracing: !1 } },
        ];
      function FF() {
        return new By("Router", Ee);
      }
      let GC = (() => {
        class e {
          constructor(n, r) {}
          static forRoot(n, r) {
            return {
              ngModule: e,
              providers: [
                PF,
                zC(n),
                {
                  provide: $C,
                  useFactory: kF,
                  deps: [[Ee, new An(), new xo()]],
                },
                { provide: ur, useValue: r || {} },
                {
                  provide: Yr,
                  useFactory: NF,
                  deps: [Yn, [new os(bc), new An()], ur],
                },
                { provide: Td, useFactory: RF, deps: [Ee, HT, ur] },
                {
                  provide: jC,
                  useExisting:
                    r && r.preloadingStrategy ? r.preloadingStrategy : HC,
                },
                { provide: By, multi: !0, useFactory: FF },
                [
                  Od,
                  { provide: sc, multi: !0, useFactory: jF, deps: [Od] },
                  { provide: qC, useFactory: HF, deps: [Od] },
                  { provide: Fy, multi: !0, useExisting: qC },
                ],
              ],
            };
          }
          static forChild(n) {
            return { ngModule: e, providers: [zC(n)] };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S($C, 8), S(Ee, 8));
          }),
          (e.ɵmod = mt({ type: e })),
          (e.ɵinj = ot({})),
          e
        );
      })();
      function RF(e, t, n) {
        return n.scrollOffset && t.setOffset(n.scrollOffset), new Td(e, t, n);
      }
      function NF(e, t, n = {}) {
        return n.useHash ? new wx(e, t) : new ov(e, t);
      }
      function kF(e) {
        return "guarded";
      }
      function zC(e) {
        return [
          { provide: tb, multi: !0, useValue: e },
          { provide: xd, multi: !0, useValue: e },
        ];
      }
      let Od = (() => {
        class e {
          constructor(n) {
            (this.injector = n),
              (this.initNavigation = !1),
              (this.destroyed = !1),
              (this.resultOfPreactivationDone = new nn());
          }
          appInitializer() {
            return this.injector.get(_x, Promise.resolve(null)).then(() => {
              if (this.destroyed) return Promise.resolve(!0);
              let r = null;
              const o = new Promise((a) => (r = a)),
                i = this.injector.get(Ee),
                s = this.injector.get(ur);
              return (
                "disabled" === s.initialNavigation
                  ? (i.setUpLocationChangeListener(), r(!0))
                  : "enabled" === s.initialNavigation ||
                    "enabledBlocking" === s.initialNavigation
                  ? ((i.hooks.afterPreactivation = () =>
                      this.initNavigation
                        ? L(null)
                        : ((this.initNavigation = !0),
                          r(!0),
                          this.resultOfPreactivationDone)),
                    i.initialNavigation())
                  : r(!0),
                o
              );
            });
          }
          bootstrapListener(n) {
            const r = this.injector.get(ur),
              o = this.injector.get(UC),
              i = this.injector.get(Td),
              s = this.injector.get(Ee),
              a = this.injector.get(mc);
            n === a.components[0] &&
              (("enabledNonBlocking" === r.initialNavigation ||
                void 0 === r.initialNavigation) &&
                s.initialNavigation(),
              o.setUpPreloading(),
              i.init(),
              s.resetRootComponentType(a.componentTypes[0]),
              this.resultOfPreactivationDone.next(null),
              this.resultOfPreactivationDone.complete());
          }
          ngOnDestroy() {
            this.destroyed = !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(Qe));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function jF(e) {
        return e.appInitializer.bind(e);
      }
      function HF(e) {
        return e.bootstrapListener.bind(e);
      }
      const qC = new H("Router Initializer");
      class WC {
        constructor(t, n, r, o) {
          (this.author = t),
            (this.bookname = n),
            (this.imgUrl = r),
            (this.synopsis = o);
        }
      }
      class QC {}
      class ZC {}
      class _n {
        constructor(t) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            t
              ? (this.lazyInit =
                  "string" == typeof t
                    ? () => {
                        (this.headers = new Map()),
                          t.split("\n").forEach((n) => {
                            const r = n.indexOf(":");
                            if (r > 0) {
                              const o = n.slice(0, r),
                                i = o.toLowerCase(),
                                s = n.slice(r + 1).trim();
                              this.maybeSetNormalizedName(o, i),
                                this.headers.has(i)
                                  ? this.headers.get(i).push(s)
                                  : this.headers.set(i, [s]);
                            }
                          });
                      }
                    : () => {
                        (this.headers = new Map()),
                          Object.keys(t).forEach((n) => {
                            let r = t[n];
                            const o = n.toLowerCase();
                            "string" == typeof r && (r = [r]),
                              r.length > 0 &&
                                (this.headers.set(o, r),
                                this.maybeSetNormalizedName(n, o));
                          });
                      })
              : (this.headers = new Map());
        }
        has(t) {
          return this.init(), this.headers.has(t.toLowerCase());
        }
        get(t) {
          this.init();
          const n = this.headers.get(t.toLowerCase());
          return n && n.length > 0 ? n[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(t) {
          return this.init(), this.headers.get(t.toLowerCase()) || null;
        }
        append(t, n) {
          return this.clone({ name: t, value: n, op: "a" });
        }
        set(t, n) {
          return this.clone({ name: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ name: t, value: n, op: "d" });
        }
        maybeSetNormalizedName(t, n) {
          this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof _n
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
              (this.lazyUpdate = null)));
        }
        copyFrom(t) {
          t.init(),
            Array.from(t.headers.keys()).forEach((n) => {
              this.headers.set(n, t.headers.get(n)),
                this.normalizedNames.set(n, t.normalizedNames.get(n));
            });
        }
        clone(t) {
          const n = new _n();
          return (
            (n.lazyInit =
              this.lazyInit && this.lazyInit instanceof _n
                ? this.lazyInit
                : this),
            (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
            n
          );
        }
        applyUpdate(t) {
          const n = t.name.toLowerCase();
          switch (t.op) {
            case "a":
            case "s":
              let r = t.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(t.name, n);
              const o = ("a" === t.op ? this.headers.get(n) : void 0) || [];
              o.push(...r), this.headers.set(n, o);
              break;
            case "d":
              const i = t.value;
              if (i) {
                let s = this.headers.get(n);
                if (!s) return;
                (s = s.filter((a) => -1 === i.indexOf(a))),
                  0 === s.length
                    ? (this.headers.delete(n), this.normalizedNames.delete(n))
                    : this.headers.set(n, s);
              } else this.headers.delete(n), this.normalizedNames.delete(n);
          }
        }
        forEach(t) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((n) =>
              t(this.normalizedNames.get(n), this.headers.get(n))
            );
        }
      }
      class $F {
        encodeKey(t) {
          return KC(t);
        }
        encodeValue(t) {
          return KC(t);
        }
        decodeKey(t) {
          return decodeURIComponent(t);
        }
        decodeValue(t) {
          return decodeURIComponent(t);
        }
      }
      const zF = /%(\d[a-f0-9])/gi,
        qF = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "2B": "+",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function KC(e) {
        return encodeURIComponent(e).replace(zF, (t, n) => {
          var r;
          return null !== (r = qF[n]) && void 0 !== r ? r : t;
        });
      }
      function JC(e) {
        return `${e}`;
      }
      class Vn {
        constructor(t = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = t.encoder || new $F()),
            t.fromString)
          ) {
            if (t.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function GF(e, t) {
              const n = new Map();
              return (
                e.length > 0 &&
                  e
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((o) => {
                      const i = o.indexOf("="),
                        [s, a] =
                          -1 == i
                            ? [t.decodeKey(o), ""]
                            : [
                                t.decodeKey(o.slice(0, i)),
                                t.decodeValue(o.slice(i + 1)),
                              ],
                        l = n.get(s) || [];
                      l.push(a), n.set(s, l);
                    }),
                n
              );
            })(t.fromString, this.encoder);
          } else
            t.fromObject
              ? ((this.map = new Map()),
                Object.keys(t.fromObject).forEach((n) => {
                  const r = t.fromObject[n];
                  this.map.set(n, Array.isArray(r) ? r : [r]);
                }))
              : (this.map = null);
        }
        has(t) {
          return this.init(), this.map.has(t);
        }
        get(t) {
          this.init();
          const n = this.map.get(t);
          return n ? n[0] : null;
        }
        getAll(t) {
          return this.init(), this.map.get(t) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(t, n) {
          return this.clone({ param: t, value: n, op: "a" });
        }
        appendAll(t) {
          const n = [];
          return (
            Object.keys(t).forEach((r) => {
              const o = t[r];
              Array.isArray(o)
                ? o.forEach((i) => {
                    n.push({ param: r, value: i, op: "a" });
                  })
                : n.push({ param: r, value: o, op: "a" });
            }),
            this.clone(n)
          );
        }
        set(t, n) {
          return this.clone({ param: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ param: t, value: n, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((t) => {
                const n = this.encoder.encodeKey(t);
                return this.map
                  .get(t)
                  .map((r) => n + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter((t) => "" !== t)
              .join("&")
          );
        }
        clone(t) {
          const n = new Vn({ encoder: this.encoder });
          return (
            (n.cloneFrom = this.cloneFrom || this),
            (n.updates = (this.updates || []).concat(t)),
            n
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
              this.updates.forEach((t) => {
                switch (t.op) {
                  case "a":
                  case "s":
                    const n =
                      ("a" === t.op ? this.map.get(t.param) : void 0) || [];
                    n.push(JC(t.value)), this.map.set(t.param, n);
                    break;
                  case "d":
                    if (void 0 === t.value) {
                      this.map.delete(t.param);
                      break;
                    }
                    {
                      let r = this.map.get(t.param) || [];
                      const o = r.indexOf(JC(t.value));
                      -1 !== o && r.splice(o, 1),
                        r.length > 0
                          ? this.map.set(t.param, r)
                          : this.map.delete(t.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class WF {
        constructor() {
          this.map = new Map();
        }
        set(t, n) {
          return this.map.set(t, n), this;
        }
        get(t) {
          return (
            this.map.has(t) || this.map.set(t, t.defaultValue()),
            this.map.get(t)
          );
        }
        delete(t) {
          return this.map.delete(t), this;
        }
        has(t) {
          return this.map.has(t);
        }
        keys() {
          return this.map.keys();
        }
      }
      function YC(e) {
        return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer;
      }
      function XC(e) {
        return "undefined" != typeof Blob && e instanceof Blob;
      }
      function eD(e) {
        return "undefined" != typeof FormData && e instanceof FormData;
      }
      class Si {
        constructor(t, n, r, o) {
          let i;
          if (
            ((this.url = n),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = t.toUpperCase()),
            (function QF(e) {
              switch (e) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || o
              ? ((this.body = void 0 !== r ? r : null), (i = o))
              : (i = r),
            i &&
              ((this.reportProgress = !!i.reportProgress),
              (this.withCredentials = !!i.withCredentials),
              i.responseType && (this.responseType = i.responseType),
              i.headers && (this.headers = i.headers),
              i.context && (this.context = i.context),
              i.params && (this.params = i.params)),
            this.headers || (this.headers = new _n()),
            this.context || (this.context = new WF()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = n;
            else {
              const a = n.indexOf("?");
              this.urlWithParams =
                n + (-1 === a ? "?" : a < n.length - 1 ? "&" : "") + s;
            }
          } else (this.params = new Vn()), (this.urlWithParams = n);
        }
        serializeBody() {
          return null === this.body
            ? null
            : YC(this.body) ||
              XC(this.body) ||
              eD(this.body) ||
              (function ZF(e) {
                return (
                  "undefined" != typeof URLSearchParams &&
                  e instanceof URLSearchParams
                );
              })(this.body) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof Vn
            ? this.body.toString()
            : "object" == typeof this.body ||
              "boolean" == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || eD(this.body)
            ? null
            : XC(this.body)
            ? this.body.type || null
            : YC(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof Vn
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body ||
              "number" == typeof this.body ||
              "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(t = {}) {
          var n;
          const r = t.method || this.method,
            o = t.url || this.url,
            i = t.responseType || this.responseType,
            s = void 0 !== t.body ? t.body : this.body,
            a =
              void 0 !== t.withCredentials
                ? t.withCredentials
                : this.withCredentials,
            l =
              void 0 !== t.reportProgress
                ? t.reportProgress
                : this.reportProgress;
          let u = t.headers || this.headers,
            c = t.params || this.params;
          const d = null !== (n = t.context) && void 0 !== n ? n : this.context;
          return (
            void 0 !== t.setHeaders &&
              (u = Object.keys(t.setHeaders).reduce(
                (f, h) => f.set(h, t.setHeaders[h]),
                u
              )),
            t.setParams &&
              (c = Object.keys(t.setParams).reduce(
                (f, h) => f.set(h, t.setParams[h]),
                c
              )),
            new Si(r, o, s, {
              params: c,
              headers: u,
              context: d,
              reportProgress: l,
              responseType: i,
              withCredentials: a,
            })
          );
        }
      }
      var Me = (() => (
        ((Me = Me || {})[(Me.Sent = 0)] = "Sent"),
        (Me[(Me.UploadProgress = 1)] = "UploadProgress"),
        (Me[(Me.ResponseHeader = 2)] = "ResponseHeader"),
        (Me[(Me.DownloadProgress = 3)] = "DownloadProgress"),
        (Me[(Me.Response = 4)] = "Response"),
        (Me[(Me.User = 5)] = "User"),
        Me
      ))();
      class Pd {
        constructor(t, n = 200, r = "OK") {
          (this.headers = t.headers || new _n()),
            (this.status = void 0 !== t.status ? t.status : n),
            (this.statusText = t.statusText || r),
            (this.url = t.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class Fd extends Pd {
        constructor(t = {}) {
          super(t), (this.type = Me.ResponseHeader);
        }
        clone(t = {}) {
          return new Fd({
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class Ia extends Pd {
        constructor(t = {}) {
          super(t),
            (this.type = Me.Response),
            (this.body = void 0 !== t.body ? t.body : null);
        }
        clone(t = {}) {
          return new Ia({
            body: void 0 !== t.body ? t.body : this.body,
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class tD extends Pd {
        constructor(t) {
          super(t, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${t.url || "(unknown url)"}`
                : `Http failure response for ${t.url || "(unknown url)"}: ${
                    t.status
                  } ${t.statusText}`),
            (this.error = t.error || null);
        }
      }
      function Rd(e, t) {
        return {
          body: t,
          headers: e.headers,
          context: e.context,
          observe: e.observe,
          params: e.params,
          reportProgress: e.reportProgress,
          responseType: e.responseType,
          withCredentials: e.withCredentials,
        };
      }
      let Nd = (() => {
        class e {
          constructor(n) {
            this.handler = n;
          }
          request(n, r, o = {}) {
            let i;
            if (n instanceof Si) i = n;
            else {
              let l, u;
              (l = o.headers instanceof _n ? o.headers : new _n(o.headers)),
                o.params &&
                  (u =
                    o.params instanceof Vn
                      ? o.params
                      : new Vn({ fromObject: o.params })),
                (i = new Si(n, r, void 0 !== o.body ? o.body : null, {
                  headers: l,
                  context: o.context,
                  params: u,
                  reportProgress: o.reportProgress,
                  responseType: o.responseType || "json",
                  withCredentials: o.withCredentials,
                }));
            }
            const s = L(i).pipe(no((l) => this.handler.handle(l)));
            if (n instanceof Si || "events" === o.observe) return s;
            const a = s.pipe(ir((l) => l instanceof Ia));
            switch (o.observe || "body") {
              case "body":
                switch (i.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      Y((l) => {
                        if (null !== l.body && !(l.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return l.body;
                      })
                    );
                  case "blob":
                    return a.pipe(
                      Y((l) => {
                        if (null !== l.body && !(l.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return l.body;
                      })
                    );
                  case "text":
                    return a.pipe(
                      Y((l) => {
                        if (null !== l.body && "string" != typeof l.body)
                          throw new Error("Response is not a string.");
                        return l.body;
                      })
                    );
                  default:
                    return a.pipe(Y((l) => l.body));
                }
              case "response":
                return a;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${o.observe}}`
                );
            }
          }
          delete(n, r = {}) {
            return this.request("DELETE", n, r);
          }
          get(n, r = {}) {
            return this.request("GET", n, r);
          }
          head(n, r = {}) {
            return this.request("HEAD", n, r);
          }
          jsonp(n, r) {
            return this.request("JSONP", n, {
              params: new Vn().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(n, r = {}) {
            return this.request("OPTIONS", n, r);
          }
          patch(n, r, o = {}) {
            return this.request("PATCH", n, Rd(o, r));
          }
          post(n, r, o = {}) {
            return this.request("POST", n, Rd(o, r));
          }
          put(n, r, o = {}) {
            return this.request("PUT", n, Rd(o, r));
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(QC));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class nD {
        constructor(t, n) {
          (this.next = t), (this.interceptor = n);
        }
        handle(t) {
          return this.interceptor.intercept(t, this.next);
        }
      }
      const rD = new H("HTTP_INTERCEPTORS");
      let KF = (() => {
        class e {
          intercept(n, r) {
            return r.handle(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const JF = /^\)\]\}',?\n/;
      let oD = (() => {
        class e {
          constructor(n) {
            this.xhrFactory = n;
          }
          handle(n) {
            if ("JSONP" === n.method)
              throw new Error(
                "Attempted to construct Jsonp request without HttpClientJsonpModule installed."
              );
            return new ye((r) => {
              const o = this.xhrFactory.build();
              if (
                (o.open(n.method, n.urlWithParams),
                n.withCredentials && (o.withCredentials = !0),
                n.headers.forEach((h, p) => o.setRequestHeader(h, p.join(","))),
                n.headers.has("Accept") ||
                  o.setRequestHeader(
                    "Accept",
                    "application/json, text/plain, */*"
                  ),
                !n.headers.has("Content-Type"))
              ) {
                const h = n.detectContentTypeHeader();
                null !== h && o.setRequestHeader("Content-Type", h);
              }
              if (n.responseType) {
                const h = n.responseType.toLowerCase();
                o.responseType = "json" !== h ? h : "text";
              }
              const i = n.serializeBody();
              let s = null;
              const a = () => {
                  if (null !== s) return s;
                  const h = o.statusText || "OK",
                    p = new _n(o.getAllResponseHeaders()),
                    m =
                      (function YF(e) {
                        return "responseURL" in e && e.responseURL
                          ? e.responseURL
                          : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
                          ? e.getResponseHeader("X-Request-URL")
                          : null;
                      })(o) || n.url;
                  return (
                    (s = new Fd({
                      headers: p,
                      status: o.status,
                      statusText: h,
                      url: m,
                    })),
                    s
                  );
                },
                l = () => {
                  let { headers: h, status: p, statusText: m, url: C } = a(),
                    _ = null;
                  204 !== p &&
                    (_ = void 0 === o.response ? o.responseText : o.response),
                    0 === p && (p = _ ? 200 : 0);
                  let g = p >= 200 && p < 300;
                  if ("json" === n.responseType && "string" == typeof _) {
                    const A = _;
                    _ = _.replace(JF, "");
                    try {
                      _ = "" !== _ ? JSON.parse(_) : null;
                    } catch (V) {
                      (_ = A), g && ((g = !1), (_ = { error: V, text: _ }));
                    }
                  }
                  g
                    ? (r.next(
                        new Ia({
                          body: _,
                          headers: h,
                          status: p,
                          statusText: m,
                          url: C || void 0,
                        })
                      ),
                      r.complete())
                    : r.error(
                        new tD({
                          error: _,
                          headers: h,
                          status: p,
                          statusText: m,
                          url: C || void 0,
                        })
                      );
                },
                u = (h) => {
                  const { url: p } = a(),
                    m = new tD({
                      error: h,
                      status: o.status || 0,
                      statusText: o.statusText || "Unknown Error",
                      url: p || void 0,
                    });
                  r.error(m);
                };
              let c = !1;
              const d = (h) => {
                  c || (r.next(a()), (c = !0));
                  let p = { type: Me.DownloadProgress, loaded: h.loaded };
                  h.lengthComputable && (p.total = h.total),
                    "text" === n.responseType &&
                      !!o.responseText &&
                      (p.partialText = o.responseText),
                    r.next(p);
                },
                f = (h) => {
                  let p = { type: Me.UploadProgress, loaded: h.loaded };
                  h.lengthComputable && (p.total = h.total), r.next(p);
                };
              return (
                o.addEventListener("load", l),
                o.addEventListener("error", u),
                o.addEventListener("timeout", u),
                o.addEventListener("abort", u),
                n.reportProgress &&
                  (o.addEventListener("progress", d),
                  null !== i &&
                    o.upload &&
                    o.upload.addEventListener("progress", f)),
                o.send(i),
                r.next({ type: Me.Sent }),
                () => {
                  o.removeEventListener("error", u),
                    o.removeEventListener("abort", u),
                    o.removeEventListener("load", l),
                    o.removeEventListener("timeout", u),
                    n.reportProgress &&
                      (o.removeEventListener("progress", d),
                      null !== i &&
                        o.upload &&
                        o.upload.removeEventListener("progress", f)),
                    o.readyState !== o.DONE && o.abort();
                }
              );
            });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(S(bv));
          }),
          (e.ɵprov = R({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const kd = new H("XSRF_COOKIE_NAME"),
        Vd = new H("XSRF_HEADER_NAME");
      class iD {}
      let XF = (() => {
          class e {
            constructor(n, r, o) {
              (this.doc = n),
                (this.platform = r),
                (this.cookieName = o),
                (this.lastCookieString = ""),
                (this.lastToken = null),
                (this.parseCount = 0);
            }
            getToken() {
              if ("server" === this.platform) return null;
              const n = this.doc.cookie || "";
              return (
                n !== this.lastCookieString &&
                  (this.parseCount++,
                  (this.lastToken = pv(n, this.cookieName)),
                  (this.lastCookieString = n)),
                this.lastToken
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(dt), S(uc), S(kd));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Ld = (() => {
          class e {
            constructor(n, r) {
              (this.tokenService = n), (this.headerName = r);
            }
            intercept(n, r) {
              const o = n.url.toLowerCase();
              if (
                "GET" === n.method ||
                "HEAD" === n.method ||
                o.startsWith("http://") ||
                o.startsWith("https://")
              )
                return r.handle(n);
              const i = this.tokenService.getToken();
              return (
                null !== i &&
                  !n.headers.has(this.headerName) &&
                  (n = n.clone({ headers: n.headers.set(this.headerName, i) })),
                r.handle(n)
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(iD), S(Vd));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        eR = (() => {
          class e {
            constructor(n, r) {
              (this.backend = n), (this.injector = r), (this.chain = null);
            }
            handle(n) {
              if (null === this.chain) {
                const r = this.injector.get(rD, []);
                this.chain = r.reduceRight(
                  (o, i) => new nD(o, i),
                  this.backend
                );
              }
              return this.chain.handle(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(ZC), S(Qe));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        tR = (() => {
          class e {
            static disable() {
              return {
                ngModule: e,
                providers: [{ provide: Ld, useClass: KF }],
              };
            }
            static withOptions(n = {}) {
              return {
                ngModule: e,
                providers: [
                  n.cookieName ? { provide: kd, useValue: n.cookieName } : [],
                  n.headerName ? { provide: Vd, useValue: n.headerName } : [],
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = mt({ type: e })),
            (e.ɵinj = ot({
              providers: [
                Ld,
                { provide: rD, useExisting: Ld, multi: !0 },
                { provide: iD, useClass: XF },
                { provide: kd, useValue: "XSRF-TOKEN" },
                { provide: Vd, useValue: "X-XSRF-TOKEN" },
              ],
            })),
            e
          );
        })(),
        nR = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = mt({ type: e })),
            (e.ɵinj = ot({
              providers: [
                Nd,
                { provide: QC, useClass: eR },
                oD,
                { provide: ZC, useExisting: oD },
              ],
              imports: [
                [
                  tR.withOptions({
                    cookieName: "XSRF-TOKEN",
                    headerName: "X-XSRF-TOKEN",
                  }),
                ],
              ],
            })),
            e
          );
        })(),
        xa = (() => {
          class e {
            constructor(n) {
              (this._http = n), (this.server_address = "api");
            }
            getBook() {
              return this._http.get(`${this.server_address}/book`);
            }
            postBook(n) {
              return this._http
                .post(`${this.server_address}/add`, n)
                .subscribe();
            }
            deleteBook(n) {
              return (
                console.log(n),
                this._http.delete(`${this.server_address}/book/remove/` + n)
              );
            }
            editBookget(n) {
              return this._http.get(`${this.server_address}/edit/` + n);
            }
            updateBook(n) {
              return (
                console.log("book", n),
                this._http.put(`${this.server_address}/update`, n).subscribe()
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(Nd));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        Bd = (() => {
          class e {
            constructor(n) {
              (this._route = n), (this.title = "DIGITAL LIBRARY");
            }
            ngOnInit() {}
            logout() {
              localStorage.removeItem("token"),
                this._route.navigate(["/login"]);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(y(Ee));
            }),
            (e.ɵcmp = gt({
              type: e,
              selectors: [["app-header"]],
              decls: 17,
              vars: 1,
              consts: [
                [1, "navbar", "navbar-expand-lg", "navbar-light"],
                [1, "container"],
                [
                  "type",
                  "button",
                  "data-bs-toggle",
                  "collapse",
                  "data-bs-target",
                  "#navbarSupportedContent",
                  "aria-controls",
                  "navbarSupportedContent",
                  "aria-expanded",
                  "false",
                  "aria-label",
                  "Toggle navigation",
                  1,
                  "navbar-toggler",
                ],
                [1, "navbar-toggler-icon"],
                [
                  "id",
                  "navbarSupportedContent",
                  1,
                  "collapse",
                  "navbar-collapse",
                ],
                [1, "navbar-nav", "ms-auto"],
                [1, "nav-item"],
                [
                  "routerLink",
                  "/",
                  "aria-current",
                  "page",
                  1,
                  "btn",
                  "btn-outline-danger",
                  "mx-2",
                ],
                [
                  "aria-current",
                  "page",
                  1,
                  "btn",
                  "btn-outline-danger",
                  "mx-2",
                  3,
                  "click",
                ],
                [
                  "routerLink",
                  "/add",
                  "aria-current",
                  "page",
                  1,
                  "btn",
                  "btn-outline-danger",
                  "mx-2",
                ],
              ],
              template: function (n, r) {
                1 & n &&
                  (D(0, "nav", 0)(1, "div", 1)(2, "h3"),
                  M(3),
                  w(),
                  D(4, "button", 2),
                  Ze(5, "span", 3),
                  w(),
                  D(6, "div", 4)(7, "ul", 5)(8, "li", 6)(9, "button", 7),
                  M(10, "Books"),
                  w()(),
                  D(11, "li", 6)(12, "button", 8),
                  K("click", function () {
                    return r.logout();
                  }),
                  M(13, "Logout"),
                  w()(),
                  D(14, "li", 6)(15, "button", 9),
                  M(16, "Add Book"),
                  w()()()()()()),
                  2 & n && (I(3), zo(r.title));
              },
              directives: [Sa],
              styles: [".container[_ngcontent-%COMP%]{font-family:poppins}"],
            })),
            e
          );
        })(),
        rR = (() => {
          class e {
            constructor(n, r) {
              (this.book = n),
                (this._route = r),
                (this.Book = new WC("", "", "", ""));
            }
            ngOnInit() {}
            submitBook() {
              this.book.postBook(this.Book), this._route.navigate(["/"]);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(y(xa), y(Ee));
            }),
            (e.ɵcmp = gt({
              type: e,
              selectors: [["app-add"]],
              decls: 43,
              vars: 23,
              consts: [
                [1, "wrapper"],
                [1, "p-1", "mt-2", 3, "ngSubmit"],
                ["userlogin", "ngForm"],
                [1, "form-field", "d-flex", "align-items-center"],
                [
                  "type",
                  "text",
                  "name",
                  "Author",
                  "id",
                  "author",
                  "placeholder",
                  "Author",
                  "minlength",
                  "3",
                  "required",
                  "",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                ["author", "ngModel"],
                [1, "px-3", "text-danger"],
                [1, "px-3", "text-success"],
                [
                  "type",
                  "text",
                  "name",
                  "book",
                  "id",
                  "book",
                  "placeholder",
                  "Book",
                  "minlength",
                  "2",
                  "required",
                  "",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                ["book", "ngModel"],
                [1, "form-field", "d-flex", "align-items-center", "px-3"],
                [
                  "type",
                  "text",
                  "name",
                  "synopsis",
                  "id",
                  "synopsis",
                  "cols",
                  "30",
                  "rows",
                  "10",
                  "placeholder",
                  "Synopsis",
                  "minlength",
                  "120",
                  "maxlength",
                  "250",
                  "required",
                  "",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                ["synopsis", "ngModel"],
                [
                  "type",
                  "url",
                  "name",
                  "imgurl",
                  "id",
                  "imgurl",
                  "placeholder",
                  "Image URL",
                  "required",
                  "",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                ["url", "ngModel"],
                [1, "btn", "mt-3", "mb-1", 3, "disabled"],
              ],
              template: function (n, r) {
                if (
                  (1 & n &&
                    (Ze(0, "app-header"),
                    D(1, "div", 0)(2, "form", 1, 2),
                    K("ngSubmit", function () {
                      return r.submitBook();
                    }),
                    D(4, "div", 3)(5, "span"),
                    M(6, "\u{1f464}"),
                    w(),
                    D(7, "input", 4, 5),
                    K("ngModelChange", function (i) {
                      return (r.Book.author = i);
                    }),
                    w(),
                    D(9, "small", 6),
                    M(10, "\u03c7"),
                    w(),
                    D(11, "small", 7),
                    M(12, "\u2713"),
                    w()(),
                    D(13, "div", 3)(14, "span"),
                    M(15, "\u{1f4d6}"),
                    w(),
                    D(16, "input", 8, 9),
                    K("ngModelChange", function (i) {
                      return (r.Book.bookname = i);
                    }),
                    w(),
                    D(18, "small", 6),
                    M(19, "\u03c7"),
                    w(),
                    D(20, "small", 7),
                    M(21, "\u2713"),
                    w()(),
                    D(22, "div", 10)(23, "span"),
                    M(24, "\u{1f58a}\ufe0f"),
                    w(),
                    D(25, "textarea", 11, 12),
                    K("ngModelChange", function (i) {
                      return (r.Book.synopsis = i);
                    }),
                    M(27, "   "),
                    w(),
                    D(28, "small", 6),
                    M(29, "\u03c7"),
                    w(),
                    D(30, "small", 7),
                    M(31, "\u2713"),
                    w()(),
                    D(32, "div", 3)(33, "span"),
                    M(34, "\u{1f5bc}"),
                    w(),
                    D(35, "input", 13, 14),
                    K("ngModelChange", function (i) {
                      return (r.Book.imgUrl = i);
                    }),
                    w(),
                    D(37, "small", 6),
                    M(38, "\u03c7"),
                    w(),
                    D(39, "small", 7),
                    M(40, "\u2713"),
                    w()(),
                    D(41, "button", 15),
                    M(42, " ADD BOOK "),
                    w()()()),
                  2 & n)
                ) {
                  const o = Ie(3),
                    i = Ie(8),
                    s = Ie(17),
                    a = Ie(26),
                    l = Ie(36);
                  I(7),
                    z("is-invalid", i.invalid && i.touched),
                    pe("ngModel", r.Book.author),
                    I(2),
                    z("d-none", i.valid),
                    I(2),
                    z("d-none", i.invalid),
                    I(5),
                    pe("ngModel", r.Book.bookname),
                    I(2),
                    z("d-none", s.valid),
                    I(2),
                    z("d-none", s.invalid),
                    I(5),
                    pe("ngModel", r.Book.synopsis),
                    I(3),
                    z("d-none", a.valid),
                    I(2),
                    z("d-none", a.invalid),
                    I(5),
                    pe("ngModel", r.Book.imgUrl),
                    I(2),
                    z("d-none", l.valid),
                    I(2),
                    z("d-none", l.invalid),
                    I(2),
                    pe("disabled", o.form.invalid);
                }
              },
              directives: [Bd, pi, ui, tr, er, to, rr, li, eo, la],
              styles: [
                "*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box;font-family:Poppins,sans-serif}body[_ngcontent-%COMP%]{background-image:linear-gradient(to top,#cfd9df 0%,#e2ebf0 100%)}.wrapper[_ngcontent-%COMP%]{max-width:550px;min-height:500px;margin:80px auto;padding:40px 30px 30px;background-color:#ecf0f3;border-radius:15px;box-shadow:13px 13px 20px #cbced1,-13px -13px 20px #fff}textarea[_ngcontent-%COMP%]{width:100%;background-color:transparent;border:none;padding-top:20px;padding-bottom:20px;outline:none;resize:none;text-align:center}.logo[_ngcontent-%COMP%]{width:80px;margin:auto}.logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:80px;object-fit:cover}.wrapper[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%]{font-weight:600;font-size:1.4rem;letter-spacing:1.3px;padding-left:10px;color:#555}.wrapper[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:100%;display:block;border:none;outline:none;background:none;font-size:.85rem;color:#666;padding:10px 15px 10px 10px}.wrapper[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]{padding-left:10px;margin-bottom:20px;border-radius:20px;box-shadow:inset 8px 8px 8px #cbced1,inset -8px -8px 8px #fff}.wrapper[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]   .fas[_ngcontent-%COMP%]{color:#555}.wrapper[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]{box-shadow:none;width:100%;height:40px;background-color:#03a9f4;color:#fff;border-radius:25px;box-shadow:3px 3px 3px #b1b1b1,-3px -3px 3px #fff;letter-spacing:1.3px}.wrapper[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]:hover{background-color:#039be5}.wrapper[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none;font-size:.8rem;color:#03a9f4}.wrapper[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#039be5}@media (max-width: 380px){.wrapper[_ngcontent-%COMP%]{margin:30px 20px;padding:40px 15px 15px}}",
              ],
            })),
            e
          );
        })(),
        Ta = (() => {
          class e {
            constructor(n) {
              (this.http = n), (this.server_address = "api");
            }
            login(n) {
              return this.http.post(`${this.server_address}/login`, n);
            }
            loggedIn() {
              return !!localStorage.getItem("token");
            }
            getToken() {
              return localStorage.getItem("token");
            }
            saveCred(n) {
              return (
                console.log(n.email),
                this.http.post(`${this.server_address}/signup`, n).subscribe()
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(Nd));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        oR = (() => {
          class e {
            constructor(n, r) {
              (this._auth = n), (this.router = r);
            }
            canActivate() {
              return this._auth.loggedIn()
                ? (console.log("Failed"), !0)
                : (this.router.navigate(["/login"]), !1);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(S(Ta), S(Ee));
            }),
            (e.ɵprov = R({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })();
      function iR(e, t) {
        if (1 & e) {
          const n = (function Sg() {
            return v();
          })();
          D(0, "div", 4)(1, "div", 5)(2, "div", 6),
            Ze(3, "img", 7),
            w(),
            D(4, "div", 8)(5, "div", 9)(6, "h3", 10),
            M(7),
            w(),
            D(8, "p", 11),
            M(9),
            w(),
            D(10, "p", 12),
            M(11),
            w(),
            D(12, "div", 13)(13, "button", 14),
            K("click", function () {
              const i = il(n).$implicit;
              return Pu().delete(i._id);
            }),
            M(14, "\u{1f5d1} DELETE"),
            w(),
            D(15, "button", 14),
            K("click", function () {
              const i = il(n).$implicit;
              return Pu().update(i._id);
            }),
            M(16, "\u270e UPDATE"),
            w()()()()()();
        }
        if (2 & e) {
          const n = t.$implicit;
          I(3),
            pe("src", n.imgUrl, cs),
            I(4),
            zo(n.bookname),
            I(2),
            Es("Author : ", n.author, ""),
            I(2),
            zo(n.synopsis);
        }
      }
      let sR = (() => {
          class e {
            constructor(n, r) {
              (this._book = n), (this._route = r);
            }
            ngOnInit() {
              this._book.getBook().subscribe((n) => {
                (this.Booklist = JSON.parse(JSON.stringify(n))),
                  console.log(this.Booklist);
              });
            }
            update(n) {
              localStorage.setItem("updateProductID", n.toString()),
                this._route.navigate(["update"]);
            }
            delete(n) {
              this._book.deleteBook(n).subscribe(() => {
                localStorage.removeItem("updateProductID");
              }),
                window.location.reload();
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(y(xa), y(Ee));
            }),
            (e.ɵcmp = gt({
              type: e,
              selectors: [["app-books"]],
              decls: 6,
              vars: 1,
              consts: [
                ["id", "sample", 1, ""],
                [1, "text-center", "py-4"],
                [
                  1,
                  "container",
                  "d-flex",
                  "align-items-center",
                  "justify-content-center",
                  "flex-wrap",
                ],
                ["class", "box", 4, "ngFor", "ngForOf"],
                [1, "box"],
                [1, "body"],
                [1, "imgContainer"],
                ["alt", "", 3, "src"],
                [
                  1,
                  "content",
                  "d-flex",
                  "flex-column",
                  "align-items-center",
                  "justify-content-center",
                ],
                [1, "back"],
                [1, "text-dark", "text-center", "fs-5"],
                [1, "text-center"],
                [2, "text-align", "justify", "font-size", "smaller"],
                [1, "d-flex", "align-items-center", "justify-content-around"],
                [1, "btn", "btn-dark", "btn-sm", "mx-2", 3, "click"],
              ],
              template: function (n, r) {
                1 & n &&
                  (D(0, "section", 0),
                  Ze(1, "app-header"),
                  D(2, "h3", 1),
                  M(3, "BOOKS"),
                  w(),
                  D(4, "div", 2),
                  (function gg(e, t, n, r, o, i, s, a) {
                    const l = v(),
                      u = Z(),
                      c = e + 20,
                      d = u.firstCreatePass
                        ? (function lM(e, t, n, r, o, i, s, a, l) {
                            const u = t.consts,
                              c = Tr(t, e, 4, s || null, bn(u, a));
                            au(t, n, c, bn(u, l)), qi(t, c);
                            const d = (c.tViews = ys(
                              2,
                              c,
                              r,
                              o,
                              i,
                              t.directiveRegistry,
                              t.pipeRegistry,
                              null,
                              t.schemas,
                              u
                            ));
                            return (
                              null !== t.queries &&
                                (t.queries.template(t, c),
                                (d.queries = t.queries.embeddedTView(c))),
                              c
                            );
                          })(c, u, l, t, n, r, o, i, s)
                        : u.data[c];
                    $t(d, !1);
                    const f = l[j].createComment("");
                    fs(u, l, f, d),
                      Ue(f, l),
                      vs(l, (l[c] = Np(f, l, f, d))),
                      Hi(d) && iu(u, l, d),
                      null != s && su(l, d, a);
                  })(5, iR, 17, 4, "div", 3),
                  w()()),
                  2 & n && (I(5), pe("ngForOf", r.Booklist));
              },
              directives: [Bd, gv],
              styles: [
                "app-header[_ngcontent-%COMP%]{color:#000}.box[_ngcontent-%COMP%]{position:relative;width:300px;height:300px;margin:20px;transform-style:preserve-3d;perspective:1000px;cursor:pointer}.box[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%;transform-style:preserve-3d;transition:.9s ease}.box[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%]   .imgContainer[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%;transform-style:preserve-3d;border:1px black}.box[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%]   .imgContainer[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;border-radius:5%}.box[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%;background-image:linear-gradient(76.3deg,rgba(44,62,78,1) 12.6%,rgba(69,103,131,1) 82.8%);-webkit-backface-visibility:hidden;backface-visibility:hidden;transform-style:preserve-3d;transform:rotateY(180deg)}.box[_ngcontent-%COMP%]:hover   .body[_ngcontent-%COMP%]{transform:rotateY(180deg)}.box[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{transform-style:preserve-3d;padding:20px;background-image:linear-gradient(109.5deg,rgba(229,233,177,1) 11.2%,rgba(223,205,187,1) 100.2%);transform:translateZ(100px)}.box[_ngcontent-%COMP%]   .body[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{letter-spacing:1px}h3[_ngcontent-%COMP%]{font-family:Montserrat}.back[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:space-between;align-items:center}",
              ],
            })),
            e
          );
        })(),
        aR = (() => {
          class e {
            constructor(n, r) {
              (this.book = n),
                (this._route = r),
                (this.Book = new WC("", "", "", ""));
            }
            ngOnInit() {
              let n = localStorage.getItem("updateProductID");
              this.book.editBookget(n).subscribe((r) => {
                (this.Book = JSON.parse(JSON.stringify(r))),
                  console.log(this.Book);
              });
            }
            editBook() {
              this.book.updateBook(this.Book),
                localStorage.removeItem("updateProductID"),
                this._route.navigate(["/"]);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(y(xa), y(Ee));
            }),
            (e.ɵcmp = gt({
              type: e,
              selectors: [["app-edit"]],
              decls: 43,
              vars: 23,
              consts: [
                [1, "wrapper"],
                [1, "p-1", "mt-2", 3, "ngSubmit"],
                ["userlogin", "ngForm"],
                [1, "form-field", "d-flex", "align-items-center"],
                [
                  "type",
                  "text",
                  "name",
                  "Author",
                  "id",
                  "author",
                  "placeholder",
                  "Author",
                  "minlength",
                  "3",
                  "required",
                  "",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                ["author", "ngModel"],
                [1, "px-3", "text-danger"],
                [1, "px-3", "text-success"],
                [
                  "type",
                  "text",
                  "name",
                  "book",
                  "id",
                  "book",
                  "placeholder",
                  "Book",
                  "minlength",
                  "2",
                  "required",
                  "",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                ["book", "ngModel"],
                [1, "form-field", "d-flex", "align-items-center", "px-3"],
                [
                  "type",
                  "text",
                  "name",
                  "synopsis",
                  "id",
                  "synopsis",
                  "cols",
                  "30",
                  "rows",
                  "10",
                  "placeholder",
                  "Synopsis",
                  "minlength",
                  "120",
                  "maxlength",
                  "250",
                  "required",
                  "",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                ["synopsis", "ngModel"],
                [
                  "type",
                  "url",
                  "name",
                  "imgurl",
                  "id",
                  "imgurl",
                  "placeholder",
                  "Image URL",
                  "required",
                  "",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                ["url", "ngModel"],
                [1, "btn", "mt-3", "mb-1", 3, "disabled"],
              ],
              template: function (n, r) {
                if (
                  (1 & n &&
                    (Ze(0, "app-header"),
                    D(1, "div", 0)(2, "form", 1, 2),
                    K("ngSubmit", function () {
                      return r.editBook();
                    }),
                    D(4, "div", 3)(5, "span"),
                    M(6, "\u{1f464}"),
                    w(),
                    D(7, "input", 4, 5),
                    K("ngModelChange", function (i) {
                      return (r.Book.author = i);
                    }),
                    w(),
                    D(9, "small", 6),
                    M(10, "\u03c7"),
                    w(),
                    D(11, "small", 7),
                    M(12, "\u2713"),
                    w()(),
                    D(13, "div", 3)(14, "span"),
                    M(15, "\u{1f4d6}"),
                    w(),
                    D(16, "input", 8, 9),
                    K("ngModelChange", function (i) {
                      return (r.Book.bookname = i);
                    }),
                    w(),
                    D(18, "small", 6),
                    M(19, "\u03c7"),
                    w(),
                    D(20, "small", 7),
                    M(21, "\u2713"),
                    w()(),
                    D(22, "div", 10)(23, "span"),
                    M(24, "\u{1f58a}\ufe0f"),
                    w(),
                    D(25, "textarea", 11, 12),
                    K("ngModelChange", function (i) {
                      return (r.Book.synopsis = i);
                    }),
                    M(27, "   "),
                    w(),
                    D(28, "small", 6),
                    M(29, "\u03c7"),
                    w(),
                    D(30, "small", 7),
                    M(31, "\u2713"),
                    w()(),
                    D(32, "div", 3)(33, "span"),
                    M(34, "\u{1f5bc}"),
                    w(),
                    D(35, "input", 13, 14),
                    K("ngModelChange", function (i) {
                      return (r.Book.imgUrl = i);
                    }),
                    w(),
                    D(37, "small", 6),
                    M(38, "\u03c7"),
                    w(),
                    D(39, "small", 7),
                    M(40, "\u2713"),
                    w()(),
                    D(41, "button", 15),
                    M(42, " SUBMIT CHANGES "),
                    w()()()),
                  2 & n)
                ) {
                  const o = Ie(3),
                    i = Ie(8),
                    s = Ie(17),
                    a = Ie(26),
                    l = Ie(36);
                  I(7),
                    z("is-invalid", i.invalid && i.touched),
                    pe("ngModel", r.Book.author),
                    I(2),
                    z("d-none", i.valid),
                    I(2),
                    z("d-none", i.invalid),
                    I(5),
                    pe("ngModel", r.Book.bookname),
                    I(2),
                    z("d-none", s.valid),
                    I(2),
                    z("d-none", s.invalid),
                    I(5),
                    pe("ngModel", r.Book.synopsis),
                    I(3),
                    z("d-none", a.valid),
                    I(2),
                    z("d-none", a.invalid),
                    I(5),
                    pe("ngModel", r.Book.imgUrl),
                    I(2),
                    z("d-none", l.valid),
                    I(2),
                    z("d-none", l.invalid),
                    I(2),
                    pe("disabled", o.form.invalid);
                }
              },
              directives: [Bd, pi, ui, tr, er, to, rr, li, eo, la],
              styles: [
                "*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box;font-family:Poppins,sans-serif}body[_ngcontent-%COMP%]{background-image:linear-gradient(to top,#cfd9df 0%,#e2ebf0 100%)}.wrapper[_ngcontent-%COMP%]{max-width:550px;min-height:500px;margin:80px auto;padding:40px 30px 30px;background-color:#ecf0f3;border-radius:15px;box-shadow:13px 13px 20px #cbced1,-13px -13px 20px #fff}textarea[_ngcontent-%COMP%]{width:100%;background-color:transparent;border:none;padding-top:20px;padding-bottom:20px;outline:none;resize:none;text-align:center}.logo[_ngcontent-%COMP%]{width:80px;margin:auto}.logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:80px;object-fit:cover}.wrapper[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%]{font-weight:600;font-size:1.4rem;letter-spacing:1.3px;padding-left:10px;color:#555}.wrapper[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:100%;display:block;border:none;outline:none;background:none;font-size:.85rem;color:#666;padding:10px 15px 10px 10px}.wrapper[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]{padding-left:10px;margin-bottom:20px;border-radius:20px;box-shadow:inset 8px 8px 8px #cbced1,inset -8px -8px 8px #fff}.wrapper[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]   .fas[_ngcontent-%COMP%]{color:#555}.wrapper[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]{box-shadow:none;width:100%;height:40px;background-color:#03a9f4;color:#fff;border-radius:25px;box-shadow:3px 3px 3px #b1b1b1,-3px -3px 3px #fff;letter-spacing:1.3px}.wrapper[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]:hover{background-color:#039be5}.wrapper[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none;font-size:.8rem;color:#03a9f4}.wrapper[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#039be5}@media (max-width: 380px){.wrapper[_ngcontent-%COMP%]{margin:30px 20px;padding:40px 15px 15px}}",
              ],
            })),
            e
          );
        })(),
        lR = (() => {
          class e {
            constructor() {}
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = gt({
              type: e,
              selectors: [["app-home"]],
              decls: 1,
              vars: 0,
              template: function (n, r) {
                1 & n && Ze(0, "router-outlet");
              },
              directives: [Ca],
              styles: [""],
            })),
            e
          );
        })();
      class sD {
        constructor(t, n, r, o) {
          (this.username = t),
            (this.email = n),
            (this.regid = r),
            (this.password = o);
        }
      }
      let aD = (() => {
        class e {
          constructor() {}
          ngOnInit() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵcmp = gt({
            type: e,
            selectors: [["app-auth-header"]],
            decls: 11,
            vars: 0,
            consts: [
              [1, "navbar", "navbar-expand-lg", "navbar-light", "p-3"],
              [
                "type",
                "button",
                "data-toggle",
                "collapse",
                "data-target",
                "#navbarTogglerDemo02",
                1,
                "navbar-toggler",
              ],
              [1, "navbar-toggler-icon"],
              ["id", "navbarTogglerDemo02", 1, "collapse", "navbar-collapse"],
              [1, "navbar-nav", "ml-auto"],
              [1, "nav-item"],
              ["routerLink", "/login", 1, "nav-link"],
              ["routerLink", "/signup", 1, "nav-link"],
            ],
            template: function (n, r) {
              1 & n &&
                (D(0, "nav", 0)(1, "button", 1),
                Ze(2, "span", 2),
                w(),
                D(3, "div", 3)(4, "ul", 4)(5, "li", 5)(6, "a", 6),
                M(7, "Login"),
                w()(),
                D(8, "li", 5)(9, "a", 7),
                M(10, "SignUp"),
                w()()()()());
            },
            directives: [Ai],
            styles: [
              ".navbar[_ngcontent-%COMP%]{padding:0 0 .5rem;display:flex;flex-direction:column;justify-content:space-evenly}.navbar-brand[_ngcontent-%COMP%]{font-family:Poppins,sans-serif;font-size:1.5rem;font-weight:700}.nav-item[_ngcontent-%COMP%]{padding:0 1px}.nav-link[_ngcontent-%COMP%]{font-size:1.2rem;font-family:Poppins,sans-serif}",
            ],
          })),
          e
        );
      })();
      const uR = [
        {
          path: "login",
          component: (() => {
            class e {
              constructor(n, r) {
                (this._auth = n),
                  (this._router = r),
                  (this.User = new sD("", "", 0, "")),
                  (this.Verify = () => {
                    this._auth.login(this.User).subscribe((o) => {
                      localStorage.setItem("token", o.token),
                        this._router.navigate(["/"]);
                    });
                  });
              }
              ngOnInit() {
                this._auth.loggedIn()
                  ? this._router.navigate(["/"])
                  : localStorage.removeItem("updateProductID");
              }
            }
            return (
              (e.ɵfac = function (n) {
                return new (n || e)(y(Ta), y(Ee));
              }),
              (e.ɵcmp = gt({
                type: e,
                selectors: [["app-login"]],
                decls: 31,
                vars: 13,
                consts: [
                  [1, "wrapper"],
                  [1, "text-center", "mt-2", "mb-3", "name"],
                  [1, "logo", "mb-3"],
                  ["src", "assets/title-img.gif", "alt", ""],
                  [1, "p-1", "mt-2", 3, "ngSubmit"],
                  ["userlogin", "ngForm"],
                  [1, "form-field", "d-flex", "align-items-center"],
                  [
                    "type",
                    "email",
                    "name",
                    "email",
                    "id",
                    "userName",
                    "placeholder",
                    "Email",
                    "pattern",
                    "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$",
                    "required",
                    "",
                    3,
                    "ngModel",
                    "ngModelChange",
                  ],
                  ["email", "ngModel"],
                  [1, "px-3", "text-danger"],
                  [1, "px-3", "text-success"],
                  [
                    "type",
                    "password",
                    "name",
                    "password",
                    "id",
                    "pwd",
                    "placeholder",
                    "Password",
                    "minlength",
                    "6",
                    "required",
                    "",
                    3,
                    "ngModel",
                    "ngModelChange",
                  ],
                  ["password", "ngModel"],
                  [1, "btn", "mt-3", "mb-1", 3, "disabled"],
                  [1, "text-center", "fs-6"],
                  ["routerLink", "/login"],
                ],
                template: function (n, r) {
                  if (
                    (1 & n &&
                      (D(0, "div", 0)(1, "div", 1),
                      M(2, "DIGITAL LIBRARY"),
                      w(),
                      D(3, "div", 2),
                      Ze(4, "img", 3),
                      w(),
                      Ze(5, "app-auth-header"),
                      D(6, "form", 4, 5),
                      K("ngSubmit", function () {
                        return r.Verify();
                      }),
                      D(8, "div", 6)(9, "span"),
                      M(10, "\u{1f4e7}"),
                      w(),
                      D(11, "input", 7, 8),
                      K("ngModelChange", function (i) {
                        return (r.User.email = i);
                      }),
                      w(),
                      D(13, "small", 9),
                      M(14, "\u03c7"),
                      w(),
                      D(15, "small", 10),
                      M(16, "\u2713"),
                      w()(),
                      D(17, "div", 6)(18, "span"),
                      M(19, "\u{1f512}"),
                      w(),
                      D(20, "input", 11, 12),
                      K("ngModelChange", function (i) {
                        return (r.User.password = i);
                      }),
                      w(),
                      D(22, "small", 9),
                      M(23, "\u03c7"),
                      w(),
                      D(24, "small", 10),
                      M(25, "\u2713"),
                      w()(),
                      D(26, "button", 13),
                      M(27, " LOGIN "),
                      w()(),
                      D(28, "div", 14)(29, "a", 15),
                      M(30, "Forgot password?"),
                      w()()()),
                    2 & n)
                  ) {
                    const o = Ie(7),
                      i = Ie(12),
                      s = Ie(21);
                    I(11),
                      z("is-invalid", i.invalid && i.touched),
                      pe("ngModel", r.User.email),
                      I(2),
                      z("d-none", i.valid),
                      I(2),
                      z("d-none", i.invalid),
                      I(5),
                      pe("ngModel", r.User.password),
                      I(2),
                      z("d-none", s.valid),
                      I(2),
                      z("d-none", s.invalid),
                      I(2),
                      pe("disabled", o.form.invalid);
                  }
                },
                directives: [aD, pi, ui, tr, er, ua, rr, li, eo, to, Ai],
                styles: [
                  "*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box;font-family:Poppins,sans-serif}body[_ngcontent-%COMP%]{background-image:linear-gradient(to top,#cfd9df 0%,#e2ebf0 100%)}.wrapper[_ngcontent-%COMP%]{max-width:350px;min-height:500px;margin:80px auto;padding:40px 30px 30px;background-color:#ecf0f3;border-radius:15px;box-shadow:13px 13px 20px #cbced1,-13px -13px 20px #fff}.logo[_ngcontent-%COMP%]{width:80px;margin:auto}.logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:80px;object-fit:cover}.wrapper[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%]{font-weight:600;font-size:1.4rem;letter-spacing:1.3px;padding-left:10px;color:#555}.wrapper[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:100%;display:block;border:none;outline:none;background:none;font-size:.85rem;color:#666;padding:10px 15px 10px 10px}.wrapper[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]{padding-left:10px;margin-bottom:20px;border-radius:20px;box-shadow:inset 8px 8px 8px #cbced1,inset -8px -8px 8px #fff}.wrapper[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]   .fas[_ngcontent-%COMP%]{color:#555}.wrapper[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]{box-shadow:none;width:100%;height:40px;background-color:#03a9f4;color:#fff;border-radius:25px;box-shadow:3px 3px 3px #b1b1b1,-3px -3px 3px #fff;letter-spacing:1.3px}.wrapper[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]:hover{background-color:#039be5}.wrapper[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none;font-size:.8rem;color:#03a9f4}.wrapper[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#039be5}@media (max-width: 380px){.wrapper[_ngcontent-%COMP%]{margin:30px 20px;padding:40px 15px 15px}}",
                ],
              })),
              e
            );
          })(),
        },
        {
          path: "signup",
          component: (() => {
            class e {
              constructor(n, r) {
                (this._auth = n),
                  (this._route = r),
                  (this.userCred = new sD("", "", 0, ""));
              }
              ngOnInit() {
                this._auth.loggedIn()
                  ? this._route.navigate(["/"])
                  : localStorage.removeItem("updateProductID");
              }
              submit() {
                console.log(this.userCred),
                  this._auth.saveCred(this.userCred),
                  this._route.navigate(["/login"]);
              }
            }
            return (
              (e.ɵfac = function (n) {
                return new (n || e)(y(Ta), y(Ee));
              }),
              (e.ɵcmp = gt({
                type: e,
                selectors: [["app-signup"]],
                decls: 46,
                vars: 25,
                consts: [
                  [1, "wrapper"],
                  [1, "text-center", "mt-2", "mb-3", "name"],
                  [1, "logo", "mb-3"],
                  ["src", "assets/title-img.gif", "alt", ""],
                  [1, "p-3", "mt-3", 3, "ngSubmit"],
                  ["userlogin", "ngForm"],
                  [1, "form-field", "d-flex", "align-items-center"],
                  [
                    "type",
                    "text",
                    "name",
                    "username",
                    "id",
                    "username",
                    "placeholder",
                    "Username",
                    "minlength",
                    "3",
                    "required",
                    "",
                    3,
                    "ngModel",
                    "ngModelChange",
                  ],
                  ["username", "ngModel"],
                  [1, "px-3", "text-danger"],
                  [1, "px-3", "text-success"],
                  [
                    "type",
                    "email",
                    "name",
                    "email",
                    "id",
                    "email",
                    "placeholder",
                    "Email",
                    "pattern",
                    "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$",
                    "required",
                    "",
                    3,
                    "ngModel",
                    "ngModelChange",
                  ],
                  ["email", "ngModel"],
                  [
                    "type",
                    "number",
                    "name",
                    "regid",
                    "id",
                    "regid",
                    "pattern",
                    "^\\d{2,4}$",
                    "placeholder",
                    "Registration ID",
                    "minlength",
                    "4",
                    "required",
                    "",
                    3,
                    "ngModel",
                    "ngModelChange",
                  ],
                  ["regid", "ngModel"],
                  [
                    "type",
                    "password",
                    "name",
                    "password",
                    "id",
                    "pwd",
                    "placeholder",
                    "Password",
                    "minlength",
                    "6",
                    "required",
                    "",
                    3,
                    "ngModel",
                    "ngModelChange",
                  ],
                  ["password", "ngModel"],
                  [1, "btn", "mt-3", 3, "disabled"],
                ],
                template: function (n, r) {
                  if (
                    (1 & n &&
                      (D(0, "div", 0)(1, "div", 1),
                      M(2, "DIGITAL LIBRARY"),
                      w(),
                      D(3, "div", 2),
                      Ze(4, "img", 3),
                      w(),
                      Ze(5, "app-auth-header"),
                      D(6, "form", 4, 5),
                      K("ngSubmit", function () {
                        return r.submit();
                      }),
                      D(8, "div", 6)(9, "span"),
                      M(10, "\u{1f464}"),
                      w(),
                      D(11, "input", 7, 8),
                      K("ngModelChange", function (i) {
                        return (r.userCred.username = i);
                      }),
                      w(),
                      D(13, "small", 9),
                      M(14, "\u03c7"),
                      w(),
                      D(15, "small", 10),
                      M(16, "\u2713"),
                      w()(),
                      D(17, "div", 6)(18, "span"),
                      M(19, "\u{1f4e7}"),
                      w(),
                      D(20, "input", 11, 12),
                      K("ngModelChange", function (i) {
                        return (r.userCred.email = i);
                      }),
                      w(),
                      D(22, "small", 9),
                      M(23, "\u03c7"),
                      w(),
                      D(24, "small", 10),
                      M(25, "\u2713"),
                      w()(),
                      D(26, "div", 6)(27, "span"),
                      M(28, "\u{1f194}"),
                      w(),
                      D(29, "input", 13, 14),
                      K("ngModelChange", function (i) {
                        return (r.userCred.regid = i);
                      }),
                      w(),
                      D(31, "small", 9),
                      M(32, "\u03c7"),
                      w(),
                      D(33, "small", 10),
                      M(34, "\u2713"),
                      w()(),
                      D(35, "div", 6)(36, "span"),
                      M(37, "\u{1f512}"),
                      w(),
                      D(38, "input", 15, 16),
                      K("ngModelChange", function (i) {
                        return (r.userCred.password = i);
                      }),
                      w(),
                      D(40, "small", 9),
                      M(41, "\u03c7"),
                      w(),
                      D(42, "small", 10),
                      M(43, "\u2713"),
                      w()(),
                      D(44, "button", 17),
                      M(45, "SIGNUP"),
                      w()()()),
                    2 & n)
                  ) {
                    const o = Ie(7),
                      i = Ie(12),
                      s = Ie(21),
                      a = Ie(30),
                      l = Ie(39);
                    I(11),
                      pe("ngModel", r.userCred.username),
                      I(2),
                      z("d-none", i.valid),
                      I(2),
                      z("d-none", i.invalid),
                      I(2),
                      z("border-danger", s.valid),
                      I(3),
                      z("is-invalid", s.invalid && s.touched),
                      pe("ngModel", r.userCred.email),
                      I(2),
                      z("d-none", s.valid),
                      I(2),
                      z("d-none", s.invalid),
                      I(5),
                      pe("ngModel", r.userCred.regid),
                      I(2),
                      z("d-none", a.valid),
                      I(2),
                      z("d-none", a.invalid),
                      I(5),
                      pe("ngModel", r.userCred.password),
                      I(2),
                      z("d-none", l.valid),
                      I(2),
                      z("d-none", l.invalid),
                      I(2),
                      pe("disabled", o.form.invalid);
                  }
                },
                directives: [aD, pi, ui, tr, er, to, rr, li, eo, ua, sd],
                styles: [
                  "*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box;font-family:Poppins,sans-serif}body[_ngcontent-%COMP%]{background-image:linear-gradient(to top,#cfd9df 0%,#e2ebf0 100%)}.wrapper[_ngcontent-%COMP%]{max-width:350px;min-height:500px;margin:80px auto;padding:40px 30px 30px;background-color:#ecf0f3;border-radius:15px;box-shadow:13px 13px 20px #cbced1,-13px -13px 20px #fff}.logo[_ngcontent-%COMP%]{width:80px;margin:auto}.logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:80px;object-fit:cover}.wrapper[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%]{font-weight:600;font-size:1.4rem;letter-spacing:1.3px;padding-left:10px;color:#555}.wrapper[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:100%;display:block;border:none;outline:none;background:none;font-size:.85rem;color:#666;padding:10px 15px 10px 10px}.wrapper[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]{padding-left:10px;margin-bottom:20px;border-radius:20px;box-shadow:inset 8px 8px 8px #cbced1,inset -8px -8px 8px #fff}.wrapper[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%]   .fas[_ngcontent-%COMP%]{color:#555}.wrapper[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]{box-shadow:none;width:100%;height:40px;background-color:#03a9f4;color:#fff;border-radius:25px;box-shadow:3px 3px 3px #b1b1b1,-3px -3px 3px #fff;letter-spacing:1.3px}.wrapper[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]:hover{background-color:#039be5}.wrapper[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none;font-size:.8rem;color:#03a9f4}.wrapper[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#039be5}@media (max-width: 380px){.wrapper[_ngcontent-%COMP%]{margin:30px 20px;padding:40px 15px 15px}}",
                ],
              })),
              e
            );
          })(),
        },
        {
          path: "",
          canActivate: [oR],
          component: lR,
          children: [
            { path: "", component: sR },
            { path: "add", component: rR },
            { path: "update", component: aR },
          ],
        },
      ];
      let cR = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = mt({ type: e })),
            (e.ɵinj = ot({ imports: [[GC.forRoot(uR)], GC] })),
            e
          );
        })(),
        dR = (() => {
          class e {
            constructor() {
              this.title = "Library-Frontend";
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = gt({
              type: e,
              selectors: [["app-root"]],
              decls: 1,
              vars: 0,
              template: function (n, r) {
                1 & n && Ze(0, "router-outlet");
              },
              directives: [Ca],
              styles: [""],
            })),
            e
          );
        })(),
        fR = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = mt({ type: e, bootstrap: [dR] })),
            (e.ɵinj = ot({
              providers: [Ta, xa],
              imports: [[p1, cR, xO, Cv, nR]],
            })),
            e
          );
        })();
      (function YI() {
        Gy = !1;
      })(),
        f1()
          .bootstrapModule(fR)
          .catch((e) => console.error(e));
    },
  },
  (ie) => {
    ie((ie.s = 174));
  },
]);
