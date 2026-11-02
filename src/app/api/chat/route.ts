export async function POST() {
  return Response.json({ error: "This feature has been retired." }, { status: 410 });
}
