import { normalizeFilters } from '@/lib/filters'
import { getRevenueFromDb } from '@/lib/services/revenue'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filters = normalizeFilters(searchParams)
  const data = await getRevenueFromDb(filters)
  return Response.json(data)
}
