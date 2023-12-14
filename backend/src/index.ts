import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import cors from "cors";

const app = express();
const secretKey = "very secret key";
app.use(cookieParser());
app.use(cors());

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post("/oeci", (req: Request, res: Response) => {
  const { username, password } = req.body; // Assuming parameters are sent in the request body
  if (!username || !password) {
    return res.status(400).send("Creds missing");
  }
  const credentials = {
    "username":username,
    "password":password
  }

  // Encrypt the parameters
  const cipher = crypto.createCipher("aes192", secretKey);
  let encryptedCredentials = cipher.update(JSON.stringify(credentials), "utf8", "hex");
  encryptedCredentials += cipher.final("hex");

  // Set the encrypted values in a cookie
  res.cookie("encryptedCredentials", encryptedCredentials, { httpOnly: true });

  res.send("Parameters encrypted and stored in cookies");
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
