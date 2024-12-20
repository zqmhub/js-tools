import object from './object'

const module = {
  tryJsonParse(value) {
    if (object.isEmpty(value)) {
      window.log.error(`[tools / string.ts] tryJsonParse value 为空值.`)
      return null
    }

    let result = value
    let mayBeObject = false
    if (value.charAt(0) === '{' && value.charAt(value.length - 1) === '}') mayBeObject = true
    if (value.charAt(0) === '[' && value.charAt(value.length - 1) === ']') mayBeObject = true
    if (mayBeObject) {
      try {
        result = JSON.parse(value)
        return result
      } catch (error) {
        window.log.error(`[tools / string.ts] tryJsonParse 转换失败.`)
        return null
      }
    }

    return result
  },

  /**
   *  @function 首字母转大写
   *  @description 将字符串的首个字母转换成大写
   *  @param { String } value
   *  @returns
   */
  firstUpperCase(value) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
    return value
  },

  /**
   *  @function 首字母转小写
   *  @description 将字符串的首个字母转换成小写
   *  @param { String } value
   *  @returns
   */
  firstLowerCase(value) {
    value = value.charAt(0).toLowerCase() + value.slice(1)
    return value
  },

  /**
   *  @function 复制内容到粘贴板
   *  @param { String } value
   *  @returns
   */
  toClipboard(value) {
    const element = document.createElement('textarea')
    element.setAttribute('id', 'input-copy-box')
    element.value = value
    document.getElementsByTagName('body')[0].appendChild(element)
    document.getElementById('input-copy-box').select()
    document.execCommand('copy')
    document.getElementById('input-copy-box').remove()
  }
}

export default module
