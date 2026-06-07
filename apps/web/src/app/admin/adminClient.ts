export async function fetchAdminStats(secret: string) {
  const res = await fetch("/api/admin/stats", {
    method: "GET",
    headers: {
      "x-admin-secret": secret
    }
  });

  if (!res.ok) throw new Error("Invalid admin secret");
  return res.json();
}
