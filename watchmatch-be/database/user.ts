import pool from "../postgres.js";

export const createUser = async (username: string, email: string) => {
  try {
    const insertUser =
      "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(insertUser, [username, email]);

    const createdUser = result.rows[0];
    console.log("User created:", createdUser);
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};
