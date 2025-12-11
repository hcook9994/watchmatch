import express from "express";
import cors from "cors";
import { createUser } from "./database/user.js";

const app = express();
const port = 3000;

// Enable CORS for all origins (simple)
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
});

app.post("/login", async (req, res) => {
  console.log("request for login: ", req);
  res.contentType("application/json");
  res.status(200);
  res.send(JSON.stringify({ message: "Login successful" }));
  console.log("Create user: ");
  await createUser("newuser", "email");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
