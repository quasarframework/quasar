/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

export default ({ app, isReady, port }) => {
  return isReady().then(() => {
    app.listen(port, () => {
      console.log('Server listening at port ' + port)
    })
  })
}
