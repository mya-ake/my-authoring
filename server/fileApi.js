const ipcPromise = require('ipc-promise')
const fs = require('fs')

const registerFileApi = () => {
  ipcPromise.on('file:open', (fileName) => {
    const file = fs.readFileSync(fileName, 'utf8')
    return Promise.resolve(file)
  })

  ipcPromise.on('file:save', ({fileName, data}) => {
    try {
      fs.writeFileSync(fileName, data, {encoding: 'utf8'})
      return Promise.resolve(true)
    } catch (err) {
      console.error('file:save', err)
      return Promise.resolve(false)
    }
  })
}

module.exports = {
  registerFileApi,
}
