/**
 * author : mat.he;
 * date ： 2018-06;
 * describe : Promise实现;
 */
'use strict';

(function (definition) {
    var me = this;
    // CommonJS
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = definition();

        // RequireJS
    } else if (typeof define === 'function' && define.amd) {
        define(definition);

    } else if (typeof window !== 'undefined' || typeof me !== 'undefined') {
        var global = typeof window !== 'undefined' ? window : me,
            previousP = global.P,
            Promise = global.Promise;
        if (Promise) {
            global.P = Promise;
        } else {
            global.P = definition();
        }

        global.P.noConflict = function () {
            global.P = previousP;
            return this;
        };

    } else {
        throw new Error('This environment was not anticipated by p.');
    }
})(function () {
    var PENDING = 0,
        FULFILLED = 1,
        REJECTED = 2,
        NOOP = {},
    utils = {},
        typeArr = ['Function', 'Object', 'Array'];

    (function () {
        typeArr.foreach(function (item) {
            utils['is' + item] = function (type) {
                return Object.prototype.toString.call(type) === '[object ' + item + ']';
            }
        })
    })();

    function resolve(value) {
        var me = this;
        if (me.status !== PENDING) {
            return;
        }

        if (value instanceof Promise) {
            return value.then(resolve, reject);
        }

        setTimeout(function () {
            // 异步执行所有回调
            me.status = FULFILLED;
            me.value = value;
            me.onFulfilledCallbacks.forEach(function (item) {
                item(value);
            });
        });
    }

    function reject(reason) {
        var me = this;
        if (me.status !== PENDING) {
            return;
        }

        setTimeout(function () {
            // 异步执行所有回调
            me.status = REJECTED;
            me.value = reason;
            me.onRejectedCallbacks.forEach(function (item) {
                item(value);
            });
        });
    }

    function Promise(resolver) {
        if (!utils.isFunction(resolver)) {
            throw new TypeError('The arguments must be a function!');
        }
        var me = this;
        this.value = void 0;
        this.state = PENDING;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        try {
            resolver(resolve.bind(this), reject.bind(this));
        } catch (e) {
            reject.call(this, e);
        }
    }

    Promise.prototype.then = function (onFulfilled, onRejected) {
        var me = this,
            promise,
            resolver;

        onFulfilled = utils.isFunction(onFulfilled) ? onFulfilled : function (value) {
            return value;
        }
        onRejected = utils.isFunction(onRejected) ? onRejected : function (reason) {
            throw reason;
        }

        if (me.status === PENDING) {
            return promise = new Promise(function (resolve, reject) {
                me.onFulfilledCallbacks.push(function (value) {
                    try {
                        var value = onFulfilled(value);
                        resolvePromise(promise, value, resolve, reject);
                    } catch (reason) {
                        reject(reason);
                    }
                })

                me.onRejectedCallbacks.push(function (reason) {
                    try {
                        var reason = onRejected(reason);
                        resolvePromise(promise, reason, resolve, reject);
                    } catch (reason) {
                        reject(reason);
                    }
                })
            })
        }

        if (me.status === FULFILLED) {
            resolver = onFulfilled;
        }

        if (me.status === REJECTED) {
            resolver = onRejected;
        }

        return createPromise(resolver, me.value);
    }

    function createPromise(resolver, value) {
        var promise;
        return promise = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    value = resolver(value);
                    resolvePromise(promise, value, resolve, reject);
                } catch (reason) {
                    reject(reason);
                }
            });
        })
    }

    function resolvePromise(promise, value, resolve, reject) {
        var then,
            called = false;

        if (promise === value) {
            return reject(new TypeError('Chaining cycle detected for promise!'));
        }

        if (value instanceof Promise) {
            if (value.status === PENDING) {
                return value.then(function (v) {
                    resolvePromise(promise, v, resolve, reject)
                }, reject);
            }
            return value.then(resolve, reject);
        }

        if (!value && (utils.isObject(value) || utils.isFunction(value))) {
            try {
                then = value.then;
                if (utils.isFunction(then)) {
                    then.call(value, function (v) {
                        // 此三处只可执行一次，以谁先为准
                        if (called) {
                            return;
                        }
                        called = true;
                        return resolvePromise(promise, v, resolve, reject);
                    }, function (r) {
                        // 此三处只可执行一次，以谁先为准
                        if (called) {
                            return;
                        }
                        called = true;
                        return reject(r);
                    });
                } else {
                    resolve(x)
                }
            } catch (error) {
                // 此三处只可执行一次，以谁先为准
                if (called) {
                    return;
                }
                called = true;
                return reject(error);
            }
        } else {
            resolve(value);
        }
    }

    Promise.prototype.catch = function (onRejected) {
        return this.then(null, onRejected);
    }

    Promise.resolve = function (value) {
        if (value instanceof this) {
            return value;
        }
        var promise = new this(NOOP);
        return resolve(promise, value);
    }

    Promise.reject = function (reason) {
        var promise = new this(NOOP);
        return reject(promise, reason);
    }

    Promise.all = function (array) {
        var me = this;

        if (!utils.isArray(array)) {
            return this.reject(new TypeError('The Params must be an array'));
        }

        var len = array.length,
            called = false;
        if (!len) {
            return this.resolve([]);
        }

        var valueArr = new Array(len),
            resolved = 0,
            i = -1,
            promise = new this(NOOP);

        function RunResolver(value, index) {
            me.resolve(value).then(resolveAll, function (error) {
                if (!called) {
                    called = true;
                    reject.call(promise, error);
                }
            });

            function resolveAll(value) {
                valueArr[i] = value;
                if (++resolved === len && !called) {
                    called = true;
                    resolve.call(promise, valueArr);
                }
            }
        }

        while (++i < len) {
            RunResolver(array[i], i);
        }

        return promise;
    }

    Promise.race = function (array) {
        var me = this;

        if (!utils.isArray(array)) {
            return this.reject(new TypeError('The Params must be an array'));
        }

        var len = array.length,
            called = false;
        if (!len) {
            return this.resolve([]);
        }

        var i = -1,
            promise = new this(NOOP);

        function RunResolver(value) {
            me.resolve(value).then(function (response) {
                if (!called) {
                    called = true;
                    resolve.call(promise, response);
                }
            }, function (error) {
                if (!called) {
                    called = true;
                    reject.call(promise, error);
                }
            });
        }

        while (++i < len) {
            RunResolver(array[i]);
        }

        return promise;
    }

    return Promise;
})