import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/db";

type RegisterRequestBody = {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  agreementChecked: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    name,
    phoneNumber,
    email,
    password,
    agreementChecked,
  }: RegisterRequestBody = req.body;

  // Validate name
  if (!/^[a-zA-Z'-]+(?: [a-zA-Z'-]+)*$/.test(name.trim())) {
    return res.status(400).json({
      message:
        "Name must contain only letters, apostrophes, or hyphens, with single spaces allowed between words",
    });
  }

  // Validate phone number (simple regex, you might want to use a more comprehensive one)
  if (!/^\+?[\d\s-]+$/.test(phoneNumber)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }

  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !email.endsWith(".com")) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate password length
  if (password.length <= 12) {
    return res
      .status(400)
      .json({ message: "Password must be longer than 12 characters" });
  }

  // Check agreement
  if (!agreementChecked) {
    return res
      .status(400)
      .json({ message: "You must agree to the terms and conditions" });
  }
  // Check if email is unique
  const { data: existingUser, error: existingUserError } = await supabase.query(
    `
    SELECT email FROM users WHERE email = $1
  `,
    [email]
  );

  if (existingUserError) {
    return res.status(500).json({ message: "Error checking email uniqueness" });
  }

  if (existingUser && existingUser.length > 0) {
    return res.status(400).json({ message: "Email already in use" });
  }

  // Register the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  // If registration is successful, add additional user info to a custom table
  if (data?.user) {
    // Start a transaction
    const { error: transactionError } = await supabase.rpc("begin_transaction");
    if (transactionError) {
      return res.status(500).json({ message: "Error starting transaction" });
    }
    try {
      // Insert user profile
      const { error: profileError } = await supabase.query(
        `
      INSERT INTO users (user_id, name, phone_number)
      VALUES ($1, $2, $3)
    `,
        [data.user.id, name, phoneNumber]
      );

      if (profileError) throw new Error("Error creating user profile");

      // Update user type
      const { error: userTypeError } = await supabase.query(
        `
      UPDATE users
      SET user_type = 'customer'
      WHERE user_id = $1
    `,
        [data.user.id]
      );

      if (userTypeError) throw new Error("Error setting user type");

      // Commit the transaction
      await supabase.rpc("commit_transaction");
    } catch (error) {
      // Rollback the transaction
      await supabase.rpc("rollback_transaction");
      // Delete the auth user
      await supabase.auth.admin.deleteUser(data.user.id);
      return res.status(500).json({ message: error.message });
    }
  }

  res.status(200).json({ user: data?.user });
}
