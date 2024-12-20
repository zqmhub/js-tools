// 2023.03 typescript.4 pass
const module = {
  copy(value) {
    let json = null
    try {
      json = JSON.parse(JSON.stringify(value))
    } catch (error) {
      console.log(error)
      return value
    }
    return json || value
  },

  /**
   *  @function 对象存在自定属性
   *  @param { object } object 判断对象
   *  @param { string | array } key 判断属性名称或属性集合
   *  @returns { boolean }
   */
  hasKey(object, key) {
    if (object === null || object === undefined) {
      window.log.error(`[tools] hasKey ${key} 的判断对象为 null 或者 undefined.`)
      return false
    }

    let hasKey = true
    if (Array.isArray(key)) {
      key.forEach((item) => {
        if (!Object.prototype.hasOwnProperty.call(object, item)) hasKey = false
      })
    } else {
      hasKey = Object.prototype.hasOwnProperty.call(object, key)
    }
    return hasKey
  },

  /**
   *  @function 获取数据类型
   *  @param { any } value 判断数据
   *  @returns { string }
   */
  getType(value) {
    const typeMap = {
      '[object Boolean]': 'Boolean',
      '[object String]': 'String',
      '[object Number]': 'Number',
      '[object Array]': 'Array',
      '[object Arguments]': 'Arguments',
      '[object Function]': 'Function',
      '[object Error]': 'Error',
      '[object RegExp]': 'RegExp',
      '[object Date]': 'Date',
      '[object Object]': 'Object',
      '[object Null]': 'Null',
      '[object Undefined]': 'Undefined',
      '[object Symbol]': 'Symbol'
    }
    const type = Object.prototype.toString.call(value)
    return typeMap[type]
  },

  /**
   *  @function 是字符类型
   *  @param { any } value 判断数据
   *  @returns { boolean }
   */
  isString(value) {
    return module.getType(value) === 'String'
  },

  /**
   *  @function 是数字类型
   *  @param { any } value 判断数据
   *  @returns { boolean }
   */
  isNumber(value) {
    return module.getType(value) === 'Number'
  },

  /**
   *  @function 是数组类型
   *  @param { any } value 判断数据
   *  @returns { boolean }
   */
  isArray(value) {
    return module.getType(value) === 'Array'
  },

  /**
   *  @function 是函数类型
   *  @param { any } value 判断数据
   *  @returns { boolean }
   */
  isFunction(value) {
    return module.getType(value) === 'Function'
  },

  /**
   *  @function 是对象类型
   *  @param { any } value 判断数据
   *  @returns { boolean }
   */
  isObject(value) {
    return module.getType(value) === 'Object'
  },

  /**
   *  @function 是否空数据
   *  @param { any } value 判断数据
   *  @returns { boolean }
   */
  isEmpty(value) {
    if (['', 'null', 'undefined', null, undefined].includes(value)) return true
    if (module.isObject(value)) return !Object.keys(value).length
    if (module.isArray(value)) return !value.length
    return false
  },

  /**
   *  @function 重置数据中的无效值为空值
   *  @param { object } value 判断数据
   *  @returns { boolean }
   */
  removeResponseNull(value, replaceValue = '') {
    let keys = Object.keys(value)
    keys.forEach((item, index) => {
      if (value[item] === null || value[item] === undefined) value[item] = replaceValue
    })
  }
}

export default module

// isBigInt
// isBoolean
// isNil
// isNumber
// isString
// isSymbol
// isUndefined
