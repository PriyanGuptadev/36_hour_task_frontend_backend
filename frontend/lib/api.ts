// frontend/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAlerts() {
  const res = await fetch(`${API_URL}/api/alerts`);
  return res.json();
}
