const BEXChunkData={"null":{"js":["0.js","1.js","2.js","3.js","4.js","5.js"]},"app":{"js":["app.js"]}};
/* eslint-disable no-undef */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

function loadScript (url, callback) {
  var script = document.createElement('script')
  script.type = 'text/javascript'
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null
        callback()
      }
    }
  } else {
    script.onload = function () {
      callback()
    }
  }
  
  script.src = chrome.extension.getURL(`www/${url}`)
  document.getElementsByTagName('head')[0].appendChild(script)
}

function addCss (src) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', chrome.extension.getURL(`www/${src}`))
  document.head.appendChild(link)
}

window.onload = function () {
  const div = document.createElement('div')
  div.id = 'q-bex-app'
  document.body.prepend(div)
  document.body.classList.add('q-app-injected')
  
  const chunks = BEXChunkData
  
  for (let chunkKey of Object.keys(chunks)) {
    if (chunkKey !== 'app') {
      if (chunks[chunkKey].css) {
        for (let file of chunks[chunkKey].css) {
          addCss(file)
        }
      }
    }
  }
  
  for (let chunkKey of Object.keys(chunks)) {
    if (chunkKey !== 'app') {
      for (let file of chunks[chunkKey].js) {
        loadScript(file, () => {})
      }
    }
  }
  
  if (chunks.app) {
    if (chunks.app.css) {
      addCss(chunks.app.css[0])
    }
    loadScript(chunks.app.js[0], () => {})
  }
}()
