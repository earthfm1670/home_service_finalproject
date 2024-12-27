import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export default async function authorizationCheck(req: NextRequest) {
  //1. access authorization
  const authorization = req.headers.get("Authorization");
  if (!authorization || !authorization.startsWith(`Bearer `)) {
    console.log("user has NO token--------------------------------");
    return NextResponse.next();
  }

  // 2. check if token is valid
  const trimedToken = authorization.split(" ")[1];
  console.log(`Auth check. I`);
  //2.1 check if sercret key is exit for the sake of TS
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    console.error("SECRET_KEY is not defined in environment variables");
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
  console.log(`Auth check. II`);
  // 3. set payload and userRole to req
  // const payload = await new Promise<any>((resolve, reject) => {
  //   jwt.verify(trimedToken, secretKey, (err, decode) => {
  //     console.log(`Auth check. III`);
  //     if (err) {
  //       console.log(`Auth check.IV`);
  //       reject(`Auth check. III ${err.message}`);
  //     } else {
  //       resolve(decode);
  //     }
  //   });
  // });
  const { payload } = await jwtVerify(
    trimedToken,
    new TextEncoder().encode(secretKey)
  );
  req.headers.set(`userRole`, JSON.stringify(payload));
  //response.headers.set(`userPayload`, JSON.stringify(payload)); << not work
  console.log(`Auth check. III`);
  console.log("user has token---------------------------------------");
  return NextResponse.next();
}
//PASS

/** AFTER FINISHING: ADD THIS CODE BELOW TRY CATCH TO DETECTH EXPIRED TOKEN
 * try {
    const { payload } = await jwtVerify(
      trimedToken,
      new TextEncoder().encode(secretKey)
    );
    const response = NextResponse.next();
    response.headers.set(`userPayload`, JSON.stringify(payload));
    console.log("user has token---------------------------------------");
    return response;
  } catch (err) {
    if (err.code === "ERR_JWT_EXPIRED") {
      console.log("JWT has expired");
      return NextResponse.json({
        status: 401,
        message: "Token has expired. Please log in again.",
      });
    }
  }
 * 
 */
