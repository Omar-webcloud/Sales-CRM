import { getOverview, normalizeFilters } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filters = normalizeFilters(searchParams)
  // Simulated network latency so loading states are exercised.
  await new Promise((resolve) => setTimeout(resolve, 350))
  return Response.json(getOverview(filters))
}
