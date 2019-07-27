// This file is where you will put your listeners for front end to back end communication.

export default function attachHooks (bridge, Vue) {
  bridge.on('test', p => {
    console.log('Got message: ', p)
  })
}
