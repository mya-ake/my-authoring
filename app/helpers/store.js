export const createModuleTypes = ({ moduleName, types }) => {
  const obj = Object.assign({}, types)
  Object.keys(types).forEach((key) => {
    obj[key] = `${moduleName}/${obj[key]}`
  })
  return Object.freeze(obj)
}
