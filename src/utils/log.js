const logger = console
const quasar = 'Quasar :'

export default {
  info (...args) {
    logger.log(quasar, ...args)
  },
  warn (...args) {
    logger.warn(quasar, ...args)
  },
  error (...args) {
    logger.error(quasar, ...args)
  }
}
