// const { createServer } = require('vite')

// const AppDevserver = require('../../app-devserver')
// const config = require('./bex-config')

// class BexDevServer extends AppDevserver {
//   #server

//   run (quasarConf, __isRetry) {
//     const { diff, queue } = super.run(quasarConf, __isRetry)

//     if (diff('vite', quasarConf) === true) {
//       return queue(() => this.#runVite(quasarConf))
//     }

//     // if (diff('bex', quasarConf) === true) {
//     //   return queue(() => this.#runScripts())
//     // }
//   }

//   async #runVite (quasarConf) {
//     if (this.#server !== void 0) {
//       this.#server.close()
//     }

//     const viteConfig = config.vite(quasarConf)

//     this.#server = await createServer(viteConfig)
//     await this.#server.listen()
//   }
// }

// module.exports = BexDevServer
