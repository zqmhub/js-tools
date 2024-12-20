import Big from 'big.js'
import tools from './tools.js'

const module = {
  randomNumberBoth(min, max) {
    const range = max - min
    const random = Math.random()
    const number = min + Math.round(random * range)
    return number
  },

  equationOptimize(equation) {
    //
  },

  /**
   *  @function 校验算式格式
   *  @param { string } equation 算式表达式
   *  @returns { boolean }
   */
  checkEquationFormat(equation) {
    // 校验算式元素位置.
    // const equationBegin = '^(\(+)?([\-+])?[0-9.]+(\)+)?'
    // const symbol = '[/*\-+](?=((\(+)?[0-9.]+(\)+)?))'
    // const number = '(?<=([/*\-+]))(\(+)?[0-9.]+(\)+)?'
    // const equationEnd = '([0-9.]+(\)+)?)?$'

    const mathFuncs = ['sin(', 'cos(', 'tan(']
    mathFuncs.forEach((item) => {
      equation = equation.replace(item, '(')
    })

    let isPassLocation = false
    let regExp = /^(\(+)?([\-+])?[0-9.]+(\)+)?([/*\-+](?=((\(+)?([\-+])?[0-9.]+(\)+)?))|(?<=([/*\-+]))(\(+)?([\-+])?[0-9.]+(\)+)?)+([0-9.]+(\)+)?)?$/gi
    isPassLocation = regExp.test(equation.replace(/[ ]/g, ''))

    // 校验算式括号匹配数量.
    let isPassBracket = false
    const leftBracket = equation.match(/\(/gi) || []
    const rightBracket = equation.match(/\)/gi) || []
    isPassBracket = leftBracket.length === rightBracket.length

    // 校验算式数字格式
    let isNumber = true
    const numbers = equation.match(/[0-9.]+/gi) || []
    regExp = /^([\-+])?([1-9]{1}[0-9]{0,}(.[0-9]+)?$)|(^0\.[0-9]+$)|(^0$)/
    numbers.forEach((item) => {
      if (!regExp.test(item)) isNumber = false
    })

    if (!isPassLocation) window.log.error(`[tools] checkEquationFormat 算式语法错误. ${equation}`)
    if (!isPassBracket) window.log.error(`[tools] checkEquationFormat 算式括号配对错误. ${equation}`)
    if (!isNumber) window.log.error(`[tools] checkEquationFormat 算式包含非数字. ${equation}`)

    return isPassLocation && isPassBracket && isNumber
  },

  /**
   *  @function 算式求值
   *  @param { string } equation 算式表达式
   *  @returns { string }
   */
  equation(equation) {
    // 元素出栈准备计算.
    function popStack() {
      const numberB = stackNumber.pop()
      const numberA = stackNumber.pop()
      const symbol = stackSymbol.pop()

      const numberResult = compute(numberA, numberB, symbol)
      stackNumber.push(numberResult)
    }

    function replaceStack() {
      const numberA = stackNumber.pop()
      const symbol = stackSymbol.pop()      

      const numberResult = compute(numberA, '0', symbol)
      stackNumber.push(numberResult)
    }

    // 元素计算.
    function compute(numberA, numberB, symbol) {      
      numberA = Number(numberA)
      numberB = Number(numberB)

      if (symbol === '+') return module.addition(numberA, numberB)
      if (symbol === '-') return module.subtract(numberA, numberB)
      if (symbol === '*') return module.multiply(numberA, numberB)
      if (symbol === '/') return module.division(numberA, numberB)
      if (symbol === 'sin(') return module.sin(numberA)
      if (symbol === 'cos(') return module.cos(numberA)
      if (symbol === 'tan(') return module.tan(numberA)
    }

    function isNumber(element) {
      if (symbolMap.includes(element)) return
      stackNumber.push(element)
    }

    // 判断符号优先级.
    function getPreferentialSymbol(current) {
      function getPreferential(symbol) {
        let level = null
        symbolPreferential.forEach((item, index) => {
          if (0 <= item.indexOf(symbol)) level = index
        })
        return level
      }

      const symbolFinal = stackSymbol[stackSymbol.length - 1] || null
      if (symbolFinal === null) return null
      if ([leftBracket, ...mathFuncs].includes(symbolFinal)) return null

      const currentLevel = getPreferential(current)
      const prevLevel = getPreferential(stackSymbol[stackSymbol.length - 1])
      return currentLevel <= prevLevel ? 'prev' : 'current'
    }

    function contrastSymbol(currentSymbol) {
      if (getPreferentialSymbol(currentSymbol) === 'prev') {
        popStack()
      }

      const symbolFinal = stackSymbol[stackSymbol.length - 1]
      if (currentSymbol === forward && mathFuncs.includes(symbolFinal)) {
        replaceStack()
        return
      }
      if (currentSymbol === forward && symbolFinal === leftBracket) stackSymbol.pop()
      if (currentSymbol === forward) return
      stackSymbol.push(currentSymbol)
    }

    function isSymbol(element) {
      if (!symbolMap.includes(element)) return
      if ([leftBracket, ...mathFuncs].includes(element)) {
        stackSymbol.push(element)
        return
      }
      if (element === rightBracket) {
        contrastSymbol(forward)
        return
      }

      contrastSymbol(element)
    }

    function pushStack(element) {
      isNumber(element)
      isSymbol(element)
    }

    // main
    if (!module.checkEquationFormat(equation)) return
    const equationElement = equation.match(/[0-9.]+|sin\(|[()/*\-+]/gi)

    // 合并数字前的正负号.
    let hasPrevSymbol = true
    const mergeSymbol = ['+', '-', '*', '/']
    equationElement.forEach((item, index) => {
      if (hasPrevSymbol && mergeSymbol.includes(item)) {
        equationElement[index + 1] = `${item}${equationElement[index + 1]}`
        equationElement[index] = null
      }

      hasPrevSymbol = mergeSymbol.includes(item)
    })
    tools.array.deleteItemTypeString(equationElement, null)

    const forward = '<<'
    const leftBracket = '('
    const rightBracket = ')'
    const mathFuncs = ['sin(', 'cos(', 'tan(']
    const symbolPreferential = [
      //
      ['<<'],
      ['+', '-'],
      ['*', '/'],
      [leftBracket, rightBracket, ...mathFuncs]
    ]
    let symbolMap = []
    symbolPreferential.forEach((item) => {
      symbolMap = symbolMap.concat(item)
    })

    const stackNumber = []
    const stackSymbol = []
    equationElement.forEach((item, index) => {
      pushStack(item)
      if (index === equationElement.length - 1) {
        while (0 < stackSymbol.length) {
          contrastSymbol(forward)
        }
      }
    })
    return stackNumber[0]
  },

  /**
   *  @function 加法
   *  @param { number } prev
   *  @param { number } next
   *  @returns { number }
   */
  addition(prev, next) {
    return Number(new Big(prev).plus(next).toString())
  },

  /**
   *  @function 减法
   *  @param { number } prev
   *  @param { number } next
   *  @returns { number }
   */
  subtract(prev, next) {
    return Number(new Big(prev).minus(next).toString())
  },

  /**
   *  @function 乘法
   *  @param { number } prev
   *  @param { number } next
   *  @returns { number }
   */
  multiply(prev, next) {
    return Number(new Big(prev).times(next).toString())
  },

  /**
   *  @function 除法
   *  @param { number } prev
   *  @param { number } next
   *  @returns { number }
   */
  division(prev, next) {
    return Number(new Big(prev).div(next).toString())
  },

  sin(current) {
    return Number(Math.asin(current).toString())
  },

  cos(current) {
    return Number(Math.acos(current).toString())
  },

  tan(current) {
    return Number(Math.atan(current).toString())
  }
}

export default module
