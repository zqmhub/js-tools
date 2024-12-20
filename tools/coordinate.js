import tools from './tools.js'

// 直角坐标系
const module = {
  /**
   *  @function 角度转换成弧度
   *  @param { number } angle 角度, 取值范围 0 - 360
   *  @return { number }
   */
  angleToRadian(angle) {
    return tools.math.equation(`${Math.PI * 2} * ${angle} / 360`)
  },

  /**
   *  @function 弧度转换成角度
   *  @param { number } radian 弧度, 取值范围 0 - 1
   *  @return { number }
   */
  radianToAngle(radian) {
    return tools.math.equation(`${radian} * (360 / (${Math.PI * 2}))`)
  },

  /**
   *  @function 根据点集合寻找外切直角矩形
   *  @description 此函数不适用于不规则的四边形.
   *  @param { Array } points
   *  @return { Object }
   */
  pointsFindEnclosingRect(points) {
    if (!tools.object.isArray(points) || points.length < 4) {
      window.log.error('[tools] pointsFindEnclosingRect 函数的 points 参数必须为数组, 且包含至少四个点坐标对象.')
      return null
    }

    let minX = points[0].x
    let minY = points[0].y
    let maxX = points[0].x
    let maxY = points[0].y
    points.forEach((item) => {
      minX = Math.min(minX, item.x)
      minY = Math.min(minY, item.y)
      maxX = Math.max(maxX, item.x)
      maxY = Math.max(maxY, item.y)
    })

    return { minX, minY, maxX, maxY }
  },

  rotatePoint(centerPoint, rotatePoint, angle) {
    // 弧度 = ⾓度 * Math.PI / 180
    // ⾓度 = 弧度 * 180 / Math.PI
    const radian = module.angleToRadian(angle)

    const differenceX = tools.math.subtract(rotatePoint.x, centerPoint.x)
    const differenceY = tools.math.subtract(rotatePoint.y, centerPoint.y)
    let x = tools.math.equation(`${differenceX} * ${Number(Math.cos(radian).toFixed(2))} - ${differenceY} * ${Number(Math.sin(radian).toFixed(2))} + ${centerPoint.x}`)
    let y = tools.math.equation(`${differenceX} * ${Number(Math.sin(radian).toFixed(2))} + ${differenceY} * ${Number(Math.cos(radian).toFixed(2))} + ${centerPoint.y}`)
    return { x, y }
  },

  rotateRect(centerPoint, diagonalPoints, angle) {
    if (!(tools.object.isArray(diagonalPoints) && diagonalPoints.length === 2)) {
      window.log.error('[tools] rotateRect 函数的 diagonalPoints 参数必须为数组, 且包含两个点坐标对象.')
      return
    }

    const diagonalBegin = module.rotatePoint(centerPoint, diagonalPoints[0], angle)
    const diagonalEnd = module.rotatePoint(centerPoint, diagonalPoints[1], angle)
    const points = [
      { x: diagonalBegin.x, y: diagonalBegin.y },
      { x: diagonalEnd.x, y: diagonalBegin.y },
      { x: diagonalBegin.x, y: diagonalEnd.y },
      { x: diagonalEnd.x, y: diagonalEnd.y }
    ]
    return points
  }
}

export default module
