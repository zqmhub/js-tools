const module = {
  tableSetSelections(selections, tableData, tableRef) {
    const tempSelections = selections.map((item) => item.value)

    tableData.forEach((item) => {
      if (tempSelections.includes(item.value)) item.isCheck = true
      if (tableRef && tableRef.value) tableRef.value.toggleRowSelection(item, item.isCheck)
    })
  },

  byPage(array, pageNo, pageSize) {
    const indexBegin = (pageNo - 1) * pageSize
    const indexEnd = pageNo * pageSize
    return array.slice(indexBegin, indexEnd)
  },

  findItemTypeObject(array, key, value) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index]
      if (element[key] === value) {
        return element
      }
    }
    return null
  },

  deleteItemTypeString(array, value) {
    while(array.includes(value)) {
      array.splice(array.indexOf(value), 1)
    }
  },

  deleteItemByKey(array, key, value) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index]
      if (element[key] === value) {
        array.splice(index, 1)
        break
      }
    }
  },

  swapItem(array, targetNodeIndex, currentNodeIndex) {
    array.splice(currentNodeIndex, 1, ...array.splice(targetNodeIndex, 1, array[currentNodeIndex]))
  }
}

export default module
