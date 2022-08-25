/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
export default function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false

  // 没有原型对象？ 试了一下，即使一个空对象也是有原型的啊
  let proto = Object.getPrototypeOf(obj)
  if (proto === null) return true

  // 找到最上层的原型对象
  let baseProto = proto
  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto)
  }

  // 如果最上层的原型对象也是一样的话就认为是PlainObject,啥意思？
  return proto === baseProto
}
