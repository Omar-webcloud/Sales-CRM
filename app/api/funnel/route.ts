import { normalizeFilters } from '@/lib/filters'
import { getFunnelFromDb } from '@/lib/services/funnel'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filters = normalizeFilters(searchParams)
  const data = await getFunnelFromDb(filters)
  return Response.json(data)
}
