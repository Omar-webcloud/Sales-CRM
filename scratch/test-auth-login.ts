import 'dotenv/config'
import { authenticateUser } from '../lib/auth-server'

async function testLogin() {
  console.log('Testing authenticateUser...')
  try {
    const user = await authenticateUser('alex.moreau@salespilot.io', 'password123')
    console.log('Authenticated User Result:', user)
  } catch (err) {
    console.error('Error during authenticateUser:', err)
  }
}

testLogin()
