import tools from './tools'

const module = {
  getItem(key) {
    const storageData = sessionStorage.getItem(key)
    if (tools.object.isEmpty(storageData)) return null

    return tools.string.tryJsonParse(storageData)
  },

  setItem(key, value) {
    if (value === undefined) {
      sessionStorage.setItem(key, 'undefined')
      window.log.warning(`[tools] setItem 参数 ${key} 的数值为 undefined .`)
      return
    }
    sessionStorage.setItem(key, JSON.stringify(value))
  }
}

export default module
