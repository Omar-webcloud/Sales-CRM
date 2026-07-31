import { normalizeFilters } from '@/lib/filters'
import { getOverviewFromDb } from '@/lib/services/overview'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filters = normalizeFilters(searchParams)
  const data = await getOverviewFromDb(filters)
  return Response.json(data)
}
