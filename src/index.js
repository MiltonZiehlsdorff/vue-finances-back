const { GraphQLServer } = require('graphql-yoga')
const Binding = require('prisma-binding')
const { prisma } = require('./generated/prisma-client')

const { endpoint, origin, playground, secret } = require('./config')
const resolvers = require('./resolvers')

const server = new GraphQLServer({
  typeDefs: `${__dirname}/schema.graphql`,
  resolvers,
  context: request => ({
    ...request,
    db: new Binding.Prisma({
      typeDefs: `${__dirname}/generated/graphql-schema/prisma.graphql`,
      endpoint,
      secret
    }),
    prisma
  })
})

console.log('index-endpoint: ', endpoint)
console.log('index-origin: ', origin)
console.log('index-playground: ', playground)
console.log('index-secret: ', secret)
/* console.log('index-typeDefs: ', typeDefs) */
console.log('index-__dirname: ', __dirname )

server.start({
playground,
	cors: { 
		origin },
	port:4000
}).then(() => console.log('Server running on http://localhost:4000...'))

// Segunda vez Milton............