// Payload CMS REST API client.
// When Payload is running (npm run dev:cms), this fetches live data.
// For static builds, data falls back to src/data/site.ts.

const PAYLOAD_URL = import.meta.env.PAYLOAD_URL ?? 'http://localhost:3000';

type FetchOptions = {
  collection: string;
  limit?: number;
  where?: Record<string, unknown>;
  sort?: string;
};

export async function fetchCollection<T>({ collection, limit = 100, where, sort }: FetchOptions): Promise<T[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (sort) params.set('sort', sort);
  if (where) params.set('where', JSON.stringify(where));

  const res = await fetch(`${PAYLOAD_URL}/api/${collection}?${params}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    console.warn(`[payload] Failed to fetch ${collection}: ${res.status}`);
    return [];
  }

  const data = await res.json();
  return data.docs as T[];
}

export async function fetchGlobal<T>(slug: string): Promise<T | null> {
  const res = await fetch(`${PAYLOAD_URL}/api/globals/${slug}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    console.warn(`[payload] Failed to fetch global ${slug}: ${res.status}`);
    return null;
  }

  return res.json() as Promise<T>;
}
