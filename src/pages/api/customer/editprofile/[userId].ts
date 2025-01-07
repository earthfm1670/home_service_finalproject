import { adminSupabase } from "@/utils/supabase";
import { IncomingForm } from "formidable";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";

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
  //   console.log("fields: ", fields);
  //   console.log("files: ", files);

  //-----------------Image Query-------------------
  if (fields && files) {
    const userName = fields.userName?.[0];
    const phoneNumber = fields.phoneNumber?.[0];
    const userAddress = fields.address?.[0] || "";
    const file = files.image?.[0];
    let imageFile;
    let imagePath;

    if (file) {
      imageFile = await fs.readFile(file.filepath);
    }

    // const imageFile = files.image[0];
    if (file && imageFile) {
      console.log(imageFile);
      const { data: insertedImageUrl, error: insertedImageError } =
        await adminSupabase.storage
          .from("profile_pictures")
          .upload(userId + "/" + uuidv4(), imageFile, {
            contentType: "image/jpeg",
            upsert: true,
          });
      if (insertedImageUrl) {
        console.log("insert image successful");
        imagePath = insertedImageUrl.fullPath;
        console.log("image path:", imagePath);
      }
      if (insertedImageError) {
        console.log("insert image Error");
        console.log(insertedImageError.message);
        res.status(400).json({
          message: "insert image fail",
        });
      }
      //------With Image Main Query-----------------------------------
      try {
        const { data, error } = await adminSupabase
          .from("users")
          .upsert({
            user_id: userId,
            name: userName,
            phone_number: phoneNumber,
            address: userAddress,
            profile_picture_url: `https://frqdeijtcguxcozmpucc.supabase.co/storage/v1/object/public/${imagePath}`,
          })
          .select();

        if (data) {
          console.log("Update profile with image success: ");
          console.log(data);
        }
        if (error) {
          console.log("Update profile with image fale: ");
          console.log(error);
          console.log("_____________________");
          console.log(error.message);
          res.status(400).json({
            message: "Update profile fail",
            error: error.message,
          });
        }
      } catch (e) {
        console.log(e);
        const error = e as Error;
        console.log(error.message);
        res.status(500).json({
          message: "Update profile fail",
          error: error.message,
        });
      }
      return res.status(200).json({
        message: "Profile updated successfully",
      });
    } else {
      //------Main Query Witout Image-----------------------------------
      try {
        const { data, error } = await adminSupabase
          .from("users")
          .upsert({
            user_id: userId,
            name: userName,
            phone_number: phoneNumber,
            address: userAddress,
          })
          .select();

        if (data) {
          console.log("Update profile without image success: ");
          console.log(data);
        }
        if (error) {
          console.log("Update profile without image fale: ");
          console.log(error);
          console.log("_____________________");
        }
      } catch (e) {
        const error = e as Error;
        console.log(error.message);
        res.status(500).json({
          message: "Update profile fail",
          error: error.message,
        });
      }
    }
  }

  res.status(500).json({
    error: "Internal server error",
  });
}

//------base image url >> `https://frqdeijtcguxcozmpucc.supabase.co/storage/v1/object/public/${imagePath}`,
