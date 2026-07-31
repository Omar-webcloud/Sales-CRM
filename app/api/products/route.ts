import { normalizeFilters } from '@/lib/filters'
import { getProductsFromDb } from '@/lib/services/products'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filters = normalizeFilters(searchParams)
  const data = await getProductsFromDb(filters)
  return Response.json(data)
}
