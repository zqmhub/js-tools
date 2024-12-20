import tools from './tools.js'

const module = {
  /**
   *  @function 转化数据为标准树结构数据
   *  @description
   *  @param { array } treeRaw
   *  @returns { array }
   */
  convertToStandardTree(treeRaw) {
    module.traversalByDepth(treeRaw, (node) => {
      node.value = node.value || ''
      node.label = node.label || ''
      node.isCheck = false
      node.isAble = false
    })

    return treeRaw
  },

  /**
   *  @function 所有节点
   *  @description 以节点index属性为键值列出所有节点
   *  @param { array } tree
   *  @returns { array }
   */
  nodeMap(tree) {
    const nodeMap = {}
    module.traversalByDepth(tree, (node) => {
      nodeMap[node.value] = node
    })

    return nodeMap
  },

  rewriteNode(node, newNode) {
    const ignoreKey = ['children']
    Object.keys(node).forEach((item) => {
      if (!ignoreKey.includes(item)) delete node[item]
    })

    Object.keys(newNode).forEach((item) => {
      node[item] = newNode[item]
    })
  },

  /**
   *  @function 广度优先遍历
   *  @param { array } tree
   *  @param { function } func
   *  @returns { array }
   */
  traversalByBreadth(tree, func) {
    let node = null
    let list = [...tree]
    while ((node = list.shift())) {
      func(node)
      node.children && list.push(...node.children)
    }
  },

  /**
   *  @function 深度优先遍历
   *  @param { array } tree
   *  @param { function } func
   *  @returns { array }
   */
  traversalByDepth(tree, func) {
    tree.forEach((node) => {
      func(node)
      node.children && module.traversalByDepth(node.children, func)
    })
  },

  /**
   *  @function 过滤节点
   *  @description 保留符合过滤函数的节点
   *  @param { array } tree
   *  @param { function } func
   *  @returns { array }
   */
  nodeFilter(tree, func) {
    const tempTree = tree.map((node) => {
      return { ...node }
    })

    return tempTree.filter((node) => {
      node.children = node.children && module.nodeFilter(node.children, func)
      return func(node) || (node.children && node.children.length)
    })
  },

  /**
   *  @function 遍历
   *  @Description 深度优先遍历
   *  @param { array } tree 数组
   *  @param { function } func 节点处理函数
   *  @returns { array }
   */
  ergodicByDepth(tree, func) {
    const nodes = []
    for (let i = 0; i < tree.length; i++) {
      const node = func(tree[i])
      nodes.push(node)
      if (node && node.children && 0 < node.children.length) {
        node.children = module.ergodicByDepth(node.children, func)
      }
    }
    return nodes
  },

  /**
   *  @function 替换节点
   *  @Description 深度优先遍历
   *  @param { array } tree
   *  @param { string } currentNodeIndex
   *  @param { object } node
   *  @returns
   */
  replaceNode(tree, currentNodeIndex, node) {
    /**
     *  @function 深度优先遍历节点
     *  @param { array } tree
     */
    function ergodicByDepth(tree) {
      tree.forEach((item, index) => {
        if (item.index === currentNodeIndex) {
          item = Object.assign(item, node)
          isActionSuccess = true
        }

        if (!isActionSuccess && item && item.children && 0 < item.children.length) {
          item.children.forEach((itemChild) => {
            itemChild.parentIndex = item.index
          })
          ergodicByDepth(item.children)
        }
      })
    }

    let isActionSuccess = false
    ergodicByDepth(tree)
  },

  /**
   *  @function 删除节点
   *  @Description 深度优先遍历
   *  @param { array } tree
   *  @param { string } currentNodeIndex
   *  @returns
   */
  removeNode(tree, currentNodeIndex) {
    /**
     *  @function 深度优先遍历节点
     *  @param { array } tree
     */
    function ergodicByDepth(tree) {
      tree.forEach((item, index) => {
        if (item.index === currentNodeIndex) {
          tree.splice(index, 1)
          isActionSuccess = true
        }

        if (!isActionSuccess && item && item.children && 0 < item.children.length) {
          item.children.forEach((itemChild) => {
            itemChild.parentIndex = item.index
          })
          ergodicByDepth(item.children)
        }
      })
    }

    let isActionSuccess = false
    ergodicByDepth(tree)
  },

  /**
   *  @function tree格式化
   *  @description 添加额外辅助属性
   *  @param { array } tree
   *  @returns { object }
   */
  format(tree, labelKey, valueKey) {
    /**
     *  @function 根节点设置
     *  @param { object } item
     */
    function rootNode(item) {
      let index = 0
      while (nodeMapByIndex.hasOwnProperty(String(index))) {
        index++
      }

      const indexKey = String(index)
      item.index = indexKey
      item.depth = 1
      item.parentIndex = ''
      item.label = item[labelKey]
      item.value = item[valueKey]
      nodeMapByIndex[indexKey] = item
      nodeMapByValue[item.value] = item
    }

    /**
     *  @function 子节点设置
     *  @param { object } item
     *  @param { number } index
     */
    function childNode(item, index) {
      const parentNode = nodeMapByIndex[item.parentIndex]
      const indexKey = `${parentNode.index}-${String(index)}`
      item.index = indexKey
      item.depth = parentNode.depth + 1
      item.label = item[labelKey]
      item.value = item[valueKey]
      nodeMapByIndex[indexKey] = item
      nodeMapByValue[item.value] = item
    }

    /**
     *  @function 节点属性设置
     *  @param { object } item
     *  @param { number } index
     */
    function nodeFormat(item, index) {
      item.hasOwnProperty('parentIndex') ? childNode(item, index) : rootNode(item)
    }

    /**
     *  @function 深度优先遍历节点
     *  @param { array } tree
     */
    function ergodicByDepth(tree) {
      tree.forEach((item, index) => {
        nodeFormat(item, index)
        if (item && item.children && 0 < item.children.length) {
          item.children.forEach((itemChild) => {
            itemChild.parentIndex = item.index
          })
          ergodicByDepth(item.children)
        }
      })
    }

    /**
     *  @function 删除根节点parentIndex属性
     *  @description 通过删除根节点 parentIndex 属性重新计算设置所有节点属性
     *  @param { array } tree
     */
    function deleteRootNodeParentIndex(tree) {
      tree.forEach((item) => {
        delete item.parentIndex
      })
    }

    if (tools.object.isEmpty(labelKey) || tools.object.isEmpty(valueKey)) {
      window.log.error('[tools] format 函数 labelKey 与 valueKey 参数不能为空值.')
      return { nodeMapByValue: {}, nodeMapByIndex: {}, newTree: [] }
    }

    const nodeMapByValue = {}
    const nodeMapByIndex = {}
    deleteRootNodeParentIndex(tree)
    ergodicByDepth(tree)
    return { nodeMapByValue: nodeMapByValue, nodeMapByIndex: nodeMapByIndex, newTree: tree }
  },

  /**
   *  @function 移动节点
   *  @param { array } tree
   *  @param { string } targetNodeIndex 目标节点index
   *  @param { string } currentNodeIndex 当前节点index
   *  @param { number } sort 位置排序
   *  @returns { object }
   */
  moveNodeWithin(tree, targetNodeIndex, currentNodeIndex, sort) {
    // 目标节点是当前节点的子节点则不做处理
    if (targetNodeIndex.indexOf(`${currentNodeIndex}-`) === 0) {
      console.log(`%c [tools] targetNodeIndex 节点不能是 currentNodeIndex 节点的子节点`, 'background: #cc7a7a;')
      return null
    }

    let nodeMap = module.nodeMap(tree)
    let targetNode = {
      value: '',
      label: '',
      isCheck: false,
      isAble: false
    }
    if (targetNodeIndex) targetNode = nodeMap[targetNodeIndex]
    if (targetNodeIndex === '') {
      targetNode = {
        value: '',
        label: '',
        isCheck: false,
        isAble: false,
        children: tree
      }
      tools.array.deleteItemByKey(targetNode.children, 'index', currentNodeIndex)
    }

    const currentNode = tools.object.copy(nodeMap[currentNodeIndex])
    let parentNode = {
      value: '',
      label: '',
      isCheck: false,
      isAble: false
    }

    // 如果存在父级节点则从中删除
    if (currentNode.parentIndex === '') {
      parentNode = {
        value: '',
        label: '',
        isCheck: false,
        isAble: false,
        children: tree
      }
      tools.array.deleteItemByKey(parentNode.children, 'index', currentNodeIndex)
    } else {
      parentNode = nodeMap[currentNode.parentIndex]
      tools.array.deleteItemByKey(parentNode.children, 'index', currentNodeIndex)
    }

    // 添加节点
    let index = null
    if (tools.object.hasKey(targetNode, 'children')) {
      index = sort < targetNode.children.length ? sort : targetNode.children.length
      targetNode.children.splice(index, 0, currentNode)
    } else {
      index = 0
      targetNode.children = [currentNode]
    }
    targetNode.children.forEach((item, index) => {
      item.index = targetNodeIndex ? `${targetNodeIndex}-${index}` : index.toString()
    })

    // 返回更新后的节点
    nodeMap = module.nodeMap(tree)
    return nodeMap[targetNodeIndex ? `${targetNodeIndex}-${index}` : index.toString()]
  }
}

export default module
