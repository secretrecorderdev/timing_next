export async function POST(req: Request) {
  const raw = await req.json();
  const GRAPHQL_API = process.env.GRAPHQL_API;
  // console.log("그래프 쿼리 에이피아이 GRAPHQL_API", GRAPHQL_API);
  console.log("여기 오는걸 확인 해야 함 body: JSON.stringify(raw),:", JSON.stringify(raw),);
  if (!GRAPHQL_API) {
    return new Response("GRAPHQL_API not defined", { status: 500 });
  }

  const res = await fetch(GRAPHQL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(raw),
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}