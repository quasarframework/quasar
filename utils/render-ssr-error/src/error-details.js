
export function getErrorDetails (err) {
  return {
    name: err.name,
    message: err.message
  }
}
