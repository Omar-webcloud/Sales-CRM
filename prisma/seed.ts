import { subDays, subMonths } from 'date-fns'
import bcrypt from 'bcryptjs'
import { ActivityKind, DealStage, PrismaClient, Role } from '../lib/generated/prisma/client'

const db = new PrismaClient()

const REPS = [
  { name: 'John Okafor', team: 'Enterprise', department: 'Outbound' },
  { name: 'Sarah Lindqvist', team: 'Enterprise', department: 'Inbound' },
  { name: 'Mike Delgado', team: 'Mid-Market', department: 'Outbound' },
  { name: 'Priya Raman', team: 'Mid-Market', department: 'Partnerships' },
  { name: 'Tomás Ferreira', team: 'SMB', department: 'Inbound' },
  { name: 'Hannah Wei', team: 'SMB', department: 'Outbound' },
  { name: 'Ade Balogun', team: 'Enterprise', department: 'Partnerships' },
  { name: 'Elena Kovács', team: 'Mid-Market', department: 'Inbound' },
]

const PRODUCTS = [
  { name: 'Atlas CRM', category: 'Platform' },
  { name: 'Beacon Analytics', category: 'Analytics' },
  { name: 'Comet Outreach', category: 'Engagement' },
  { name: 'Delta Forecast', category: 'Analytics' },
  { name: 'Echo Support', category: 'Service' },
]

const SOURCES = ['Website', 'Outbound', 'Referral', 'Events', 'Partners']
const REGIONS = ['North America', 'EMEA', 'APAC', 'LATAM']
const COMPANIES = ['Northwind', 'Initech', 'Globex', 'Umbrella Foods', 'Soylent Labs', 'Vandelay', 'Stark Retail', 'Acme Freight']
const STAGES: DealStage[] = ['LEADS', 'CONTACTED', 'DEMO', 'PROPOSAL', 'WON', 'LOST']

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function main() {
  console.log('Seeding database...')

  await db.activity.deleteMany()
  await db.notification.deleteMany()
  await db.deal.deleteMany()
  await db.userPreferences.deleteMany()
  await db.user.deleteMany()
  await db.product.deleteMany()

  const passwordHash = await bcrypt.hash('password123', 12)

  const admin = await db.user.create({
    data: {
      email: 'alex.moreau@salespilot.io',
      passwordHash,
      name: 'Alex Moreau',
      role: Role.ADMIN,
      team: 'Enterprise',
      department: 'Outbound',
      timezone: 'Europe/Paris',
      preferences: { create: {} },
      notifications: {
        create: [
          { title: 'Quota alert', body: 'Mid-Market is 12% behind pace for the quarter.', read: false },
          { title: 'Deal won', body: 'Sarah closed Northwind for $48,000.', read: false },
          { title: 'Pipeline review', body: 'Weekly forecast review starts in 30 minutes.', read: true },
        ],
      },
    },
  })

  const reps = await Promise.all(
    REPS.map((rep) =>
      db.user.create({
        data: {
          email: `${rep.name.toLowerCase().replace(/\s+/g, '.')}@salespilot.io`,
          passwordHash,
          name: rep.name,
          role: Role.REP,
          team: rep.team,
          department: rep.department,
          preferences: { create: {} },
        },
      }),
    ),
  )

  const allReps = [admin, ...reps]

  const products = await Promise.all(
    PRODUCTS.map((p) => db.product.create({ data: p })),
  )

  const deals = []
  for (let i = 0; i < 400; i++) {
    const rep = pick(allReps)
    const product = pick(products)
    const stage = pick(STAGES)
    const createdAt =
      Math.random() > 0.3
        ? subDays(new Date(), Math.floor(rand(0, 90)))
        : subMonths(new Date(), Math.floor(rand(1, 11)))

    const deal = await db.deal.create({
      data: {
        title: `${pick(COMPANIES)} — ${product.name}`,
        amount: Math.round(rand(4_000, 95_000) / 100) * 100,
        stage,
        source: pick(SOURCES),
        region: pick(REGIONS),
        repId: rep.id,
        productId: product.id,
        createdAt,
        closedAt: stage === DealStage.WON ? createdAt : null,
      },
    })
    deals.push(deal)
  }

  for (let i = 0; i < 50; i++) {
    const rep = pick(allReps)
    const deal = pick(deals)
    const kind = pick([ActivityKind.WON, ActivityKind.STAGE, ActivityKind.LEAD, ActivityKind.LOST, ActivityKind.NOTE])
    await db.activity.create({
      data: {
        kind,
        action:
          kind === ActivityKind.WON
            ? 'closed a deal with'
            : kind === ActivityKind.LOST
              ? 'marked as lost'
              : kind === ActivityKind.LEAD
                ? 'added a new lead'
                : kind === ActivityKind.NOTE
                  ? 'left a note on'
                  : 'moved to Demo',
        target: deal.title.split(' — ')[0],
        amount: kind === ActivityKind.WON || kind === ActivityKind.LOST ? deal.amount : null,
        userId: rep.id,
        dealId: deal.id,
        createdAt: subDays(new Date(), Math.floor(rand(0, 14))),
      },
    })
  }

  console.log('Seed complete.')
  console.log('Login: alex.moreau@salespilot.io / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
