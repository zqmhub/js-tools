const module = {
  hex() {
    return '#' + Math.random().toString(16).substring(2, 7)
  },

  hexToRgba(hex, opacity = '1') {
    if (!hex) hex = '#ededed'
    const rgb = [parseInt('0x' + hex.slice(1, 3)), parseInt('0x' + hex.slice(3, 5)), parseInt('0x' + hex.slice(5, 7))]
    const rgba = `rgba(${rgb},${opacity})`
    return rgba
  },

  rgbaToHex(rgba) {
    var arr = rgba.slice(4, rgba.length - 1).split(',')
    let color = '#'
    for (var i = 0; i < arr.length; i++) {
      var t = Number(arr[i]).toString(16)
      if (t == '0') t = t + '0'
      color += t
    }
    return color
  }
}

export default module
