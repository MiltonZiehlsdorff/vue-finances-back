const { env } = process

const isProduction = env.NODE_ENV === 'production'

const endpoint = `${env.PRISMA_ENDPOINT}/${env.PRISMA_SERVICE}/${env.PRISMA_STAGE}`
const secret = env.PRISMA_SERVICE_SECRET
const playground = isProduction ? false : '/'

const corsHosts = env.CLIENT_HOSTS || ['localhost:8000', '127.0.0.1:8000'].join('|')
const corsProtocols = isProduction ? 'wss|https' : 'ws|http'
const origin = new RegExp(`(${corsProtocols}):\/\/(${corsHosts})(.+)?`)
const credentials = true

console.log('config.js-origin: ', origin)
console.log('config.js-endpoint: ', endpoint)
console.log('config.js-isProduction: ', isProduction)
console.log('config.js-corsHosts: ', corsHosts)

module.exports = {
  endpoint,
	env,
	isProduction,
	origin,
  credentials,
	playground,
	secret
}