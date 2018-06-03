/**
 * author : mat.he;
 * date ： 2018-06;
 * describe : Promise实现;
 */
'use strict';
(function(win) {
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

    function Promise (executor) {
        if (!util.isFunction(executor)) {
            throw new TypeError('The arguments must be a function!');
        }
        var me = this;
        this.value = void 0;
        this.state = PENDING;
        this.callbacks = [];

        function resolve (value) {
            if (value instanceof Promise) {
                return value.then(resolve, reject);
            }

            setTimeout (function () {
                // 异步执行所有回调
            })
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

    win.P = Promise;
})(window);
