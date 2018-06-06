## About
基于Promise A+ 规范编写的 Promise ES5 兼容方案

## Getting started

基本API

```javascript

// 添加解决(fulfillment)和拒绝(rejection)回调到当前 promise, 返回一个新的 promise, 将以回调的返回值来resolve
P.prototype.then(onFulfilled, onRejected)


// 添加一个拒绝(rejection) 回调到当前 promise, 返回一个新的promise
// 当这个回调函数被调用，新 promise 将以它的返回值来resolve
// 否则如果当前promise 进入fulfilled状态，则以当前promise的完成结果作为新promise的完成结果
P.prototype.catch(onRejected)


// 返回一个状态由给定value决定的Promise对象
// 如果该值是一个Promise对象，则直接返回该对象
// 如果该值是thenable(即，带有then方法的对象)，返回的Promise对象的最终状态由then方法执行决定
// 否则的话(该value为空，基本类型或者不带then方法的对象),返回的Promise对象状态为fulfilled，并且将该value传递给对应的then方法
// 通常而言，如果你不知道一个值是否是Promise对象，使用P.resolve(value) 来返回一个Promise对象,这样就能将该value以Promise对象形式使用
P.resolve(value)


// 返回一个状态为失败的Promise对象，并将给定的失败信息传递给对应的处理方法
P.reject(reason)


// 这个方法返回一个新的promise对象
// 该promise对象在iterable参数对象里所有的promise对象都成功的时候才会触发成功，一旦有任何一个iterable里面的promise对象失败则立即触发该promise对象的失败
// 这个新的promise对象在触发成功状态以后，会把一个包含iterable里所有promise返回值的数组作为成功回调的返回值，顺序跟iterable的顺序保持一致
// 如果这个新的promise对象触发了失败状态，它会把iterable里第一个触发失败的promise对象的错误信息作为它的失败错误信息
// P.all方法常被用于处理多个promise对象的状态集合
P.all(iterable)


// 当iterable参数里的任意一个子promise被成功或失败后，父promise马上也会用子promise的成功返回值或失败详情作为参数调用父promise绑定的相应句柄，并返回该promise对象
P.race(iterable)
```