//TODO log out api
//TODO check req.cookie if corract name

import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the user by invalidating their session
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       400:
 *         description: No session found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No session found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout failed
 *                 error:
 *                   type: string
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Method Not Allowed
 */

export default async function userLogout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const token = req.cookies["sb:token"]; //เช็คชื่อ req.cookies

    //กรณีที่ไม่มี token จะดีดกลับ
    if (!token) {
      return res.status(400).json({ message: "No session found" });
    }

    //ฟังก์ชั่น supabase.signOut จะไม่รีเทิร์นอะไรออกมาถ้าไม่เกิดข้อผิดพลาด
    //หลังทำการเช็ค token แล้ว ฟังก์ชั่น supabase.signOut จะอ่าน sb:token อัตโนมัติ
    const { error } = await supabase.auth.signOut();

    //ถ้า error จะรีเทิร์น 400
    if (error) {
      return res
        .status(500)
        .json({
          message: "Logout failed",
          error: `Internal sever error: ${error.message}`,
        });
    }

    //ถ้าสำเร็จทุกอย่าง จะรีเทิร์น 200
    return res.status(200).json({ message: "Logged out successfully" });
  }

  //กรณี method ไม่ใช่ post จะรีเทิร์น 405
  return res.status(405).json({ message: "Method Not Allowed" });
}

//สำหรับ fron end
/**
 * 1.ส่ง req ไปหา logout
 * 2.รับ res ถ้าเป็น 200 ให้ถอด token ออก
 * 3.ถ้าไม่ได้ให้ขึ้น error message
 *
 * โครงโค้ด
 *
 * const hadleLogout = ()=>{
 *  try{
 *      const respond = await axios.post('/api/auth/logout')
 *
 *      if(respond.ok ???) {
 *          localstorage.removeItem("token")
 *          setState({...state, user: null})
 *          navigate("/")
 *       }
 *  } catch(err){
 *      console.log(err.message)
 *      return
 *      }
 * }
 */
