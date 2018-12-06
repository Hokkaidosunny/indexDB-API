export const timeStamp = () => {
  return new Date().getTime()
}

export const showErrorMsg = msg => {
  console.error(`[indexdb-api]: ${msg}`)
}
