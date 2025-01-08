import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

export default async function getMedai(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method not allow" });
  }
  const userId = req.query.userId;
  console.log(userId);

  const { data: getImage, error: getImageError } = await supabase.storage
    .from(`profile_pictures`)
    .list(userId + "/", {
      limit: 10,
      offset: 0,
      sortBy: { column: `name`, order: `asc` },
    });
  if (getImage) {
    console.log("getImage");
    console.log(getImage);
  }
  if (getImageError) {
    console.log("getImageError");
    console.log(getImageError);
  }
  return res
    .status(222)
    .json({ message: "API Test Image fetching", image: getImage });
}
