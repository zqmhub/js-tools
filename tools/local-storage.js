import tools from './tools.js'

const module = {
  getItem(key) {
    const storageData = localStorage.getItem(key)
    if (tools.object.isEmpty(storageData)) return null

    return tools.string.tryJsonParse(storageData)
  },

  setItem(key, value) {
    if (value === undefined) {
      localStorage.setItem(key, 'undefined')
      window.log.warning(`[tools] setItem 参数 ${key} 的数值为 undefined .`)
      return
    }
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export default module
