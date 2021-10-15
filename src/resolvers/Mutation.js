const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const { getUserId } = require('./../utils')
const { endpoint } = require('./../config')

const JWT_SECRET = process.env.JWT_SECRET
console.log('0000000000000000000-process.env.PRISMA_ENDPOINT: ', process.env.PRISMA_ENDPOINT)
//$PRISMA_ENDPOINT='http://prisma.localhost'
console.log('1111111111111111111-process.env.PRISMA_ENDPOINT: ', process.env.PRISMA_ENDPOINT)

//console.log('111111111111111111111-process.env.PRISMA.DOMAIN: ', process.env.PRISMA.DOMAIN)
console.log('222222222222222222222-endpoint: ', endpoint)
console.log('333333333333333333333-process.env.PRISMA_STAGE: ', process.env.PRISMA_STAGE)
console.log('444444444444444444444-process.env.PRISMA_PORT: ', process.env.PRISMA_PORT)

console.log('55555555555555555555-endpoint: ', endpoint)




function createAccount (_, { description }, ctx, info) {
  const userId = getUserId(ctx)
  return ctx.db.mutation.createAccount({
    data: {
      description,
      user: {
        connect: { 
          id: userId
        }
      }
    }
  }, info)
} 

function createCategory (_, { description, operation }, ctx, info) {
  const userId = getUserId(ctx)
  return ctx.db.mutation.createCategory({
    data: {
      description,
      operation,
      user: {
        connect: { 
          id: userId
        }
      }
    }
  }, info)
}

function createRecord (_, args, ctx, info) {

  const date = moment(args.date)
  if (!date.isValid()) {
    throw new Error('Invalid date!')
  }

let { amount, type } = args
if (
	(type === 'DEBIT' && amount > 0) ||
  (type === 'CREDIT' && amount < 0)
) {
	amount = -amount
}

  const userId = getUserId(ctx)
  return ctx.db.mutation.createRecord({
    data: {
      user: {
        connect: { id: userId }
      },
      account: {
        connect: { id: args.accountId }
      },
      category: {
        connect: { id: args.categoryId }
      },
      amount, 
      type,
      date: args.date,
      description: args.description,
      tags: args.tags,
      note: args.note
    }
  }, info)
}

async function login (_, {email, password }, ctx, info) {
  
  //console.log('11111111111111111111-, fieldName: ', fieldName)
  //console.log('22222222222222222222-args: ', args)
  //console.log('33333333333333333333-info: ', info)
  console.log('666666666666666666666666-process.env.PRISMA_ENDPOINT: ', process.env.PRISMA_ENDPOINT)
  console.log('7777777777777777777777-process.env.process.env.PLAYGROUND_URL: ', process.env.PLAYGROUND_URL)
 

  const user = await ctx.db.query.user({ where: { email } })
  if (!user) {
    throw new Error('Invalid credentials - email!')
  }
  console.log('888888888888888888888')
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new Error('Invalid credentials - password')
  }
  console.log('999999999999999999999')
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2h' })

  console.log('Password: ', password);

  return {
    token,
    user
  }
}

async function signup (_, args, ctx, info) {

  const password = await bcrypt.hash(args.password, 10)
  const user = await ctx.db.mutation.createUser({ data: { ...args, password } })

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2h' })

  console.log('Password: ', password);

  return {
    token,
    user
  }

}

module.exports = {
  createAccount,
  createCategory,
  createRecord,
  signup,
  login
}