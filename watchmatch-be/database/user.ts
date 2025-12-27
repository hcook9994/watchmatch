import pool from "../postgres.js";
import { z } from "zod";

// TODO: add password handling
// TODO: add uuid userId (can it replace existing id field?)
// TODO: define user type/interface in codebase

// TODO: separate type file
const zUser = z.object({
  user_id: z.number(),
  username: z.string(),
  email: z.string(), // define specific validation for email
  password: z.string(),
  created_at: z.date(),
});

type User = z.infer<typeof zUser>;

// Create a new user
export const createUserDB = async (input: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const insertUser =
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";
    const result = await pool.query(insertUser, [
      input.username,
      input.email,
      input.password,
    ]);
    const createdUser = result.rows[0];
    console.log("User created:", createdUser);
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

// Retrieve user by username
export const getUserByName = async (username: string): Promise<User | null> => {
  try {
    const getUserQuery = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(getUserQuery, [username]);

    if (result.rows.length === 0) {
      console.log("User not found");
      return null;
    } else if (result.rows.length > 1) {
      console.warn("Multiple users found with the same username");
    }

    const parsed = zUser.safeParse(result.rows[0]);
    if (!parsed.success) {
      console.error("User from database failed validation:", parsed.error);
      return null;
    }
    const validatedUser = parsed.data;

    return validatedUser;
  } catch (err) {
    console.error("Error retrieving user:", err);
    throw err;
  }
};
