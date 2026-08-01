import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../lib/generated/prisma/client'

const connectionString = process.env.DATABASE_URL?.replace(/[?&]schema=[^&]*/, '')

console.log('Connecting with string:', connectionString)

const adapter = new PrismaPg({ connectionString })
const db = new PrismaClient({ adapter })

async function test() {
  try {
    const count = await db.user.count()
    console.log('Success! User count:', count)
  } catch (err) {
    console.error('Prisma Error:', err)
  } finally {
    await db.$disconnect()
  }
}

test()
