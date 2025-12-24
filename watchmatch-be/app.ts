import express from "express";
import cors from "cors";
import { createUser } from "./database/user.js";
import { loginAuthentication } from "./domain/login.js";

const app = express();
const port = 3000;

// Enable CORS for all origins (simple)
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
});

app.post("/login", async (req, res) => {
  const response = await loginAuthentication(
    req.body.username,
    req.body.password
  );
  if (!response.status) {
    res.contentType("application/json");
    res.status(401);
    res.send(JSON.stringify({ message: "Invalid credentials" }));
    return;
  }
  res.contentType("application/json");
  res.status(200);
  res.send(
    JSON.stringify({ message: "Login successful", userId: response.userId })
  );
});

app.post("/create_user", async (req, res) => {
  await createUser(req.body.username, req.body.email, req.body.password);
  res.contentType("application/json");
  res.status(200);
  res.send(JSON.stringify({ message: "User creation successful" }));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
