/* json feed for a category */
export async function GET(request: Request, { params }: { params: { source: string } }) {
  return Response.json(
      { category: params.source }
      );
  }