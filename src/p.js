/**
 * author : mat.he;
 * date ： 2018-06;
 * describe : Promise实现;
 */
'use strict';

(function (definition) {
    // CommonJS
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === 'function' && define.amd) {
        define(definition);

    } else if (typeof window !== 'undefined' || typeof self !== 'undefined') {
        var global = typeof window !== 'undefined' ? window : self;
        var previousP = global.P;
        global.P = definition();
        global.P.noConflict = function () {
            global.P = previousP;
            return this;
        };

    } else {
        throw new Error('This environment was not anticipated by p.');
    }
})(function() {
    var PENDING = 0,
        FULFILLED = 1,
        REJECTED = 2;
        util = {},
        typeArr = ['Function', 'Object', 'Array'];
    
    (function () {
        typeArr.foreach(function (item) {
            util['is' + item] = function (type) {
                return Object.prototype.toString.call(type) === '[object ' + item + ']';
            }
        })
    })();

    function Promise (resolver) {
        if (!util.isFunction(resolver)) {
            throw new TypeError('The arguments must be a function!');
        }
        var me = this;
        this.value = void 0;
        this.state = PENDING;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        function resolve (value) {
            if (me.status !== PENDING) {
                return;
            }

            if (value instanceof Promise) {
                return value.then(resolve, reject);
            }

            setTimeout (function () {
                // 异步执行所有回调
                me.status = FULFILLED;
                me.value = value;
                me.onFulfilledCallbacks.forEach(function (item) {
                    item(value);
                });
            });
        }

        function reject (reason) {
            if (me.status !== PENDING) {
                return;
            }
            
            setTimeout (function () {
                // 异步执行所有回调
                me.status = REJECTED;
                me.value = reason;
                me.onRejectedCallbacks.forEach(function (item) {
                    item(value);
                });
            });
        }

        try {
            resolver(resolve.bind(this), reject.bind(this));
        } catch (e) {
            reject.call(this, e);
        }
    }

    Promise.prototype.then = function (onFulfilled, onRejected) {

    }

    Promise.prototype.catch = function (onRejected) {

    }

    Promise.all = function () {

    }

    Promise.race = function () {

    }
})