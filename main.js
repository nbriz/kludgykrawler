const { app, screen, BrowserWindow, ipcMain } = require('electron')
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
let win, stats
let STOP = false
let DELAY = 4000
let LIST = []

function createWindow () {
  const wa = screen.getPrimaryDisplay().workArea

  win = new BrowserWindow({
    width: Math.floor(wa.width * 0.5),
    height: Math.floor(wa.height * 0.5),
    x: Math.floor(wa.x + wa.width * 0.25 + 20),
    y: Math.floor(wa.y + wa.height * 0.25+ 20),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    },
    icon: `${__dirname}/icons/icon.png`
  })

  stats = new BrowserWindow({
    width: Math.floor(wa.width * 0.25),
    height: Math.floor(wa.height * 0.5),
    x: Math.floor(wa.x + wa.width * 0.25 - 20),
    y: Math.floor(wa.y + wa.height * 0.25 - 20),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    },
    icon: `${__dirname}/icons/icon.png`
  })
  stats.loadFile('index.html')
  // stats.webContents.openDevTools()
}

function fixURL (url) {
  return (url.indexOf('http') === 0) ? url : `http://${url}`
}

function updateWindow (url) {
  win.loadURL(url)
  LIST.push(url)
  const css = fs.readFileSync(`${__dirname}/files/garble.css`).toString()
  const js = fs.readFileSync(`${__dirname}/files/garble.js`).toString()
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(css)
    win.webContents.executeJavaScript(js)
  })
}

function krawl (url, cb) {
  url = fixURL(url)
  axios.get(url).then(res => {
    const code = res.request.res.statusCode
    if (code !== 200) return cb(code)

    updateWindow(url)

    const $ = cheerio.load(res.data)
    const urls = $('a').map((i, el) => $(el).attr('href')).get()
    if (urls.length > 0) {
      const i = Math.floor(Math.random() * urls.length)
      let newURL = urls[i]
      newURL = (urls[i].indexOf('http') === 0) ? urls[i] : `${url}${urls[i]}`
      if (!STOP) setTimeout(() => krawl(newURL), DELAY)
    } else {
      STOP = true
      LIST.push('[DEAD END]')
    }
  }).catch(err => { cb(err.errno) })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ipcMain.on('start-url', (e, url) => {
  STOP = false
  LIST = []
  krawl(url, (err) => { if (err) e.reply('error', err) })
})

ipcMain.on('stop-krawl', (e, url) => {
  STOP = true
})

ipcMain.on('get-list', (e, url) => {
  e.reply('updated-list', LIST)
})

ipcMain.on('show-url', (e, url) => {
  url = fixURL(url)
  updateWindow(url)
})
