var property = function(key) {
	return function(obj) {
		return obj == null ? void 0 : obj[key];
	};
};

//返回一个函数 这个函数只有一个参数 是一个对象 


 // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  // 判断一个给定的对象是否有某些键值对
  _.matcher = _.matches = function(attrs) {
  	attrs = _.extendOwn({}, attrs);
  	return function(obj) {
  		return _.isMatch(obj, attrs);
  	};
  };

_.isMatch = function(object, attrs) {
    // 提取 attrs 对象的所有 keys
    var keys = _.keys(attrs), length = keys.length;

    // 如果 object 为空
    // 根据 attrs 的键值对数量返回布尔值
    if (object == null) return !length;

    // 这一步有必要？
    var obj = Object(object);

    // 遍历 attrs 对象键值对
    for (var i = 0; i < length; i++) {
    	var key = keys[i];

      // 如果 obj 对象没有 attrs 对象的某个 key
      // 或者对于某个 key，它们的 value 值不同
      // 则证明 object 并不拥有 attrs 的所有键值对
      // 则返回 false
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }

  return true;
};

  _.extendOwn = _.assign = createAssigner(_.keys);

  // An internal function for creating assigner functions.
  // 有三个方法用到了这个内部函数
  // _.extend & _.extendOwn & _.defaults
  // _.extend = createAssigner(_.allKeys);
  // _.extendOwn = _.assign = createAssigner(_.keys);
  // _.defaults = createAssigner(_.allKeys, true);
  var createAssigner = function(keysFunc, undefinedOnly) {
    // 返回函数
    // 经典闭包（undefinedOnly 参数在返回的函数中被引用）
    // 返回的函数参数个数 >= 1
    // 将第二个开始的对象参数的键值对 "继承" 给第一个参数
    return function(obj) {
    	var length = arguments.length;
      // 只传入了一个参数（或者 0 个？）
      // 或者传入的第一个参数是 null
      if (length < 2 || obj == null) return obj;

      // 枚举第一个参数除外的对象参数
      // 即 arguments[1], arguments[2] ...
      for (var index = 1; index < length; index++) {
        // source 即为对象参数
        var source = arguments[index],
            // 提取对象参数的 keys 值
            // keysFunc 参数表示 _.keys
            // 或者 _.allKeys
            keys = keysFunc(source),
            l = keys.length;

        // 遍历该对象的键值对
        for (var i = 0; i < l; i++) {
        	var key = keys[i];
          // _.extend 和 _.extendOwn 方法
          // 没有传入 undefinedOnly 参数，即 !undefinedOnly 为 true
          // 即肯定会执行 obj[key] = source[key]
          // 后面对象的键值对直接覆盖 obj
          // ==========================================
          // _.defaults 方法，undefinedOnly 参数为 true
          // 即 !undefinedOnly 为 false
          // 那么当且仅当 obj[key] 为 undefined 时才覆盖
          // 即如果有相同的 key 值，取最早出现的 value 值
          // *defaults 中有相同 key 的也是一样取首次出现的
          if (!undefinedOnly || obj[key] === void 0)
          	obj[key] = source[key];
      }
  }

      // 返回已经继承后面对象参数属性的第一个参数对象
      return obj;
  };
};

// Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  // ===== //
  // _.keys({one: 1, two: 2, three: 3});
  // => ["one", "two", "three"]
  // ===== //
  // 返回一个对象的 keys 组成的数组
  // 仅返回 own enumerable properties 组成的数组
  _.keys = function(obj) {
    // 容错
    // 如果传入的参数不是对象，则返回空数组
    if (!_.isObject(obj)) return [];

    // 如果浏览器支持 ES5 Object.key() 方法
    // 则优先使用该方法
    if (nativeKeys) return nativeKeys(obj);

    var keys = [];

    // own enumerable properties
    for (var key in obj)
      // hasOwnProperty
  if (_.has(obj, key)) keys.push(key);

    // Ahem, IE < 9.
    // IE < 9 下不能用 for in 来枚举某些 key 值
    // 传入 keys 数组为参数
    // 因为 JavaScript 下函数参数按值传递
    // 所以 keys 当做参数传入后会在 `collectNonEnumProps` 方法中改变值
    if (hasEnumBug) collectNonEnumProps(obj, keys);

    return keys;
};

  // Retrieve all the property names of an object.
  // 返回一个对象的 keys 数组
  // 不仅仅是 own enumerable properties
  // 还包括原型链上继承的属性
  _.allKeys = function(obj) {
    // 容错
    // 不是对象，则返回空数组
    if (!_.isObject(obj)) return [];

    var keys = [];
    for (var key in obj) keys.push(key);

    // Ahem, IE < 9.
    // IE < 9 下的 bug，同 _.keys 方法
    if (hasEnumBug) collectNonEnumProps(obj, keys);

    return keys;
};


//cb return的是这个函数  传入 value  (暂时不知道value 和 cb 是啥 )


_.iteratee = function(value, context) {
	return cb(value, context, Infinity);
};

//这个是默认的迭代器？


var cb = function(value, context, argCount) {
	if (value == null) return _.identity;
	if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	if (_.isObject(value)) return _.matcher(value);
	return _.property(value);
};





