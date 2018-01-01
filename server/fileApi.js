const ipcPromise = require('ipc-promise')
const fs = require('fs')

const registerFileApi = () => {
  ipcPromise.on('file:open', (fileName) => {
    const file = fs.readFileSync(fileName, 'utf8')
    return Promise.resolve(file)
  })
}

module.exports = {
  registerFileApi,
}
