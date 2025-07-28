export async function POST(req: Request) {
  const body = await req.text();
  const GRAPHQL_API = process.env.GRAPHQL_API;

  if (!GRAPHQL_API) {
    return new Response("GRAPHQL_API not defined", { status: 500 });
  }

  const res = await fetch(GRAPHQL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}