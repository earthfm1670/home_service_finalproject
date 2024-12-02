import { NextRequest, NextResponse } from "next/server";

type MiddlewareMap = {
  [key: string]: (req: NextRequest) => NextResponse<unknown>;
};

// const middlewareMap: MiddlewareMap = {
//   ""
// }

export async function middleware(req: NextRequest, res: NextResponse) {
  console.log("MW Testing");
  console.log(req.method);
  console.log(req.url);
  console.log(req.headers.get("origin"));

  if (req.method === "GET") {
    return new NextResponse(JSON.stringify({ mwm: "MW Tsting" }), {
      status: 200,
    });
  }
  // Logic
  return NextResponse.next();
}

export const config = { matcher: ["/api/admin/management/edit"] };
