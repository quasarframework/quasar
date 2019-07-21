const BEXChunkData={"null":{"js":["0.js","1.js","2.js","3.js","4.js","5.js"]},"app":{"js":["app.js"]}};/* eslint-disable no-undef */
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

  script.src = chrome.extension.getURL(url)
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
  div.id = 'q-app'
  document.body.prepend(div)
  document.body.classList.add('q-app-injected')

  const chunks = BEXChunkData

  for (let chunkKey of Object.keys(chunks)) {
    if (chunkKey !== 'app') {
      if (chunks[chunkKey].css) {
        for (let file of chunks[chunkKey].css) {
          console.log('Loading CSS: ', `www/${file}`)
          addCss(file)
        }
      }
    }
  }

  for (let chunkKey of Object.keys(chunks)) {
    if (chunkKey !== 'app') {
      for (let file of chunks[chunkKey].js) {
        console.log('Loading script: ', `www/${file}`)
        loadScript(`www/${file}`, () => {
        })
      }
    }
  }

  if (chunks.app.css) {
    addCss(chunks.app.css[0])
  }

  loadScript(`www/${chunks.app.js[0]}`, () => {
    /*
    const head = document.getElementsByTagName('head')[0]
    head.innerHTML = head.innerHTML.replace(/__chrome_ext_id__/g, chrome.runtime.id)

    const images = document.getElementsByTagName('img')
    for (let image of images) {
      if (image.src.indexOf('__chrome_ext_id__') > -1) {
        image.src = image.src.replace('__chrome_ext_id__', chrome.runtime.id)
      } else if (image.src.indexOf('/statics/') > -1) {
        image.src = chrome.extension.getURL('www' + '/' + image.src.substring(image.src.indexOf('statics/')))
      }
    }
    */
  })
}
