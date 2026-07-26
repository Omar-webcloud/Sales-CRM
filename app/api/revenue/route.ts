import { getRevenue, normalizeFilters } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filters = normalizeFilters(searchParams)
  await new Promise((resolve) => setTimeout(resolve, 350))
  return Response.json(getRevenue(filters))
}
