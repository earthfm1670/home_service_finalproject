import { supabase, adminSupabase } from "@/utils/supabase";
import { IncomingForm } from "formidable";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "next";
import { error } from "console";

// Set API route to accept files
export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing for multipart/form-data
  },
};

export default async function editUserProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    console.log("Method not allowed");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const userId = req.query.userId;

  //--------Pares form data-----------------
  const form = new IncomingForm();
  let fields;
  let files;
  try {
    [fields, files] = await form.parse(req);
  } catch (e) {
    const error = e as Error;
    console.log(error.message);
    res.status(400).json({
      message: "Error occur during pares file",
      error: error.message,
    });
  }
  console.log("fields: ", fields);
  console.log("files: ", files);

  //-----------------Main query-------------------
  if (fields && files) {
    const userName = fields.userName[0];
    const phoneNumber = fields.phoneNumber[0];
    const address = fields.address[0] || "";
   // const imageFile = files.image[0];
    const imageFileBuffer = fs.readFileSync(files.image[0].filepath);
    console.log("Parsed fields: ", fields);
    console.log("Parsed files: ", files);
    console.log("Name: ", userName);
    console.log("Phone: ", phoneNumber);
    console.log("Address: ", address);
    console.log("Image: ", imageFileBuffer);
    if (imageFileBuffer) {
      const { data: insertedImageUrl, error: insertedImageError } =
        await adminSupabase.storage
          .from("profile_pictures")
          .upload(userId + "/" + uuidv4(), imageFileBuffer);
      if (insertedImageUrl) {
        console.log("insert image successful");
      }
      if (insertedImageError) {
        console.log("insert image Error");
        console.log(insertedImageError);
      }
    }
  }

  res.status(200).json({
    message: "Profile updated successfully",
    status: 200,
  });
}
//---For Edge Runtime Version-------------------------------------------------------------------
// //For Edge runtime
// import { NextRequest, NextResponse } from "next/server";
// export default async function edgeRuntimeEditUserProfile(req: NextRequest) {
//   if (req.method !== "PUT") {
//     console.log("Method not allowed");
//     return NextResponse.json({ error: "Method not allowed", status: 503 });
//   }
//   const data = await req.formData();
//   const file: File | null = data.get("image") as unknown as File;
//   const byte = await file.arrayBuffer();
//   const buffer = Buffer.from(byte);
//   console.log("File check");
//   console.log(file);
//   console.log("Buffer check");
//   console.log(buffer);

//   //   const { userName, phoneNumber, address, image } = req.body;
//   //   const userId = req;
//   //   console.log("check profile edit api");
//   //   console.log(req.body);
//   //   console.log(userId);
//   //   console.log(userName);
//   //   console.log(phoneNumber);
//   //   console.log(address);
//   //   console.log(image);
//   //   console.log("_______________________");
//   return NextResponse.json({
//     message: "Edit profile successfully",
//     status: 200,
//   });
// }
//------------------------------------------------------------
//For Node runtime
