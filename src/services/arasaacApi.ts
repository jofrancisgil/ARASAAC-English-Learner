/**
 * Client for the official ARASAAC Pictograms API (https://arasaac.org/developers/api)
 */

export interface ArasaacSearchResult {
  _id: number;
  keywords: Array<{ keyword: string; type: number; plurality?: string }>;
  schematic?: boolean;
  sex?: boolean;
  violence?: boolean;
  aac?: boolean;
  categories?: string[];
  synsets?: string[];
}

const API_BASE = 'https://api.arasaac.org/api/pictograms/en';
const searchCache = new Map<string, ArasaacSearchResult[]>();

export const searchArasaacPictograms = async (
  query: string
): Promise<ArasaacSearchResult[]> => {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  if (searchCache.has(trimmed)) {
    return searchCache.get(trimmed)!;
  }

  try {
    const res = await fetch(`${API_BASE}/search/${encodeURIComponent(trimmed)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return [];
      }
      throw new Error(`ARASAAC API responded with status ${res.status}`);
    }

    const data: ArasaacSearchResult[] = await res.json();
    const results = Array.isArray(data) ? data.slice(0, 24) : [];
    searchCache.set(trimmed, results);
    return results;
  } catch (error) {
    console.warn('ARASAAC API search error (offline or unreachable):', error);
    return [];
  }
};
