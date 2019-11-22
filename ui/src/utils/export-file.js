export default function (fileName, rawData, mimeType) {
  const link = document.createElement('a')

  link.download = fileName
  link.href = window.URL.createObjectURL(
    new Blob([ rawData ], { type: mimeType || 'text/plain' })
  )

  link.style.position = 'fixed' // avoid scrolling to bottom
  document.body.appendChild(link)

  link.click()
  link.remove()
}
