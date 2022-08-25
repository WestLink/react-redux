import verifyPlainObject from '../utils/verifyPlainObject'

export function defaultMergeProps(stateProps, dispatchProps, ownProps) {
  return { ...ownProps, ...stateProps, ...dispatchProps }
}

export function wrapMergePropsFunc(mergeProps) {
  // 第一层嵌套函数作为初始化，作为最内层嵌套函数执行结果记录的地方
  return function initMergePropsProxy(
    dispatch, { displayName, pure, areMergedPropsEqual }
  ) {
    let hasRunOnce = false
    let mergedProps // 存储最终合并完成的属性

    // 第二层嵌套函数，作为实际属性合并操作的代理
    return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
      // 做一遍实际合并的操作
      const nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps)

      if (hasRunOnce) { // 不是第一次执行
        // TODO pure的意思是啥？
        if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) // 如果合并后的属性与之前不同，也就是props发生了变化
          mergedProps = nextMergedProps

      } else {
        hasRunOnce = true
        mergedProps = nextMergedProps // 这个就相当于合并结果的初始化了

        if (process.env.NODE_ENV !== 'production')
          verifyPlainObject(mergedProps, displayName, 'mergeProps')
      }

      return mergedProps
    }
  }
}

export function whenMergePropsIsFunction(mergeProps) {
  return (typeof mergeProps === 'function')
    ? wrapMergePropsFunc(mergeProps)
    : undefined
}

export function whenMergePropsIsOmitted(mergeProps) {
  return (!mergeProps)
    ? () => defaultMergeProps
    : undefined
}

export default [
  whenMergePropsIsFunction,
  whenMergePropsIsOmitted
]
