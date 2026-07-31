import { normalizeFilters } from '@/lib/filters'
import { getTeamFromDb } from '@/lib/services/team'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filters = normalizeFilters(searchParams)
  const data = await getTeamFromDb(filters)
  return Response.json(data)
}
