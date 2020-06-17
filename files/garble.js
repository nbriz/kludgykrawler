// auto scroll the page
let i = 0
setInterval(() => { i++; window.scrollTo(0, i) }, 1000 / 30)

// add source code to page (shoutOut Mark Napier's Shredder)
const sourceCode = document.documentElement.outerHTML
const overlay = document.createElement('div')
overlay.style.position = 'absolute'
overlay.style.left = '0px'
overlay.style.top = '0px'
overlay.style.zIndex = '9999999'
overlay.style.fontFamily = 'monospace'
overlay.innerText = sourceCode
document.body.appendChild(overlay)
