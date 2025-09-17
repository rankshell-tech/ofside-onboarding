export async function createCashfreeOrder(payload: {
  amount: number;
  email: string;
  phone: string;
}) {
  const res = await fetch("/api/createOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create order");

  return data;
}
