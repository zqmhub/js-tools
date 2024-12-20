import tools from './tools.js'

const fileType = {
  // 音频
  '.mp3': 'audio/mp3;',
  '.mp4': 'video/mpeg4;',
  '.wav': 'audio/wav;',
  '.wma': 'audio/x-ms-wma;',
  '.mp2': 'audio/mp2;',
  '.midi': 'audio/mid;',

  // 视频
  '.avi': 'video/avi;',
  '.wmv': 'video/x-ms-wmv;',
  '.mpeg': 'video/mpg;',
  '.rmvb': 'video/rmvb;',

  // 图片
  '.jpeg': 'image/jpeg;',
  '.jpg': 'image/jpeg;',
  '.tif': 'image/tiff;',
  '.bmp': 'application/x-bmp;',
  '.gif': 'image/gif;',
  '.png': 'image/png;',
  '.svg': 'text/xml;',

  // 文档
  '.txt': 'text/plain;',
  '.xls': 'application/x-xls;',
  '.xlsx': 'application/vnd.ms-excel;',
  '.xml': 'text/xml;',
  '.pdf': 'application/pdf;',
  '.ppt': 'application/x-ppt;'
}

const module = {
  getFileFormatByUrl(url) {
    const regExpResult = url.match(/\.[0-9a-z]+$/)
    if (regExpResult) return regExpResult[0]
    return ''
  },

  downloadByUrl(name, url) {
    const element = document.createElement('a')
    element.setAttribute('href', url)
    element.setAttribute('download', `${name}`)
    element.click()
  },

  downloadByBlob(name, format, blobData) {
    if (tools.object.isEmpty(fileType[format])) {
      window.log.error('[tools] downloadByBlob fileType 未匹配, 请检查 format 传值是否正确.')
      return
    }

    let blob = new Blob([blobData], { type: fileType[format] })
    const url = window.URL.createObjectURL(blob)
    const element = document.createElement('a')
    element.setAttribute('href', url)
    element.setAttribute('download', `${name}${format}`)
    element.click()
  }
}

export default module
