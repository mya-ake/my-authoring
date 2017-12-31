const { ENV } = require('./configs/env')
process.env = Object.assign(process.env, ENV)

const { server, config } = require('./server/app')

// Listen the server
server.listen(process.env.npm_package_config_nuxt_port, '0.0.0.0')
const _NUXT_URL_ = `http://localhost:${process.env.npm_package_config_nuxt_port}`
// eslint-disable-next-line
console.log(`Nuxt working on ${_NUXT_URL_}`)

// Electron
const electron = require('electron')
const path = require('path')
const url = require('url')
const http = require('http')

let win = null

const POLL_INTERVAL = 300
const pollServer = () => {
  http.get(_NUXT_URL_, (res) => {
    const SERVER_DOWN = res.statusCode !== 200
    SERVER_DOWN ? setTimeout(pollServer, POLL_INTERVAL) : win.loadURL(_NUXT_URL_)
  })
    .on('error', pollServer)
}

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const newWin = () => {
  win = new BrowserWindow({
    width: config.electron.width || 800,
    height: config.electron.height || 600,
  })
  if (!config.dev) {
    return win.loadURL(_NUXT_URL_)
  }
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }))
  win.on('closed', () => { win = null })
  pollServer()
}

app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
