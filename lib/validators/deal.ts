import { z } from 'zod'

const dealStage = z.enum(['LEADS', 'CONTACTED', 'DEMO', 'PROPOSAL', 'WON', 'LOST'])

export const createDealSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  stage: dealStage.optional(),
  source: z.string().min(1),
  region: z.string().min(1),
  productId: z.string().min(1),
  repId: z.string().min(1).optional(),
})

export const updateDealSchema = z.object({
  title: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  stage: dealStage.optional(),
  source: z.string().min(1).optional(),
  region: z.string().min(1).optional(),
  productId: z.string().min(1).optional(),
  repId: z.string().min(1).optional(),
})
