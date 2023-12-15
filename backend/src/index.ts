import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import cors from "cors";
import bodyParser from 'body-parser';


const algorithm = 'aes-256-cbc'; // The encryption algorithm

const secretKey = crypto.createHash('sha256').update(String("secret")).digest('base64').slice(0, 32);
console.log('Secret Key:', secretKey);


function encryptData(data: string): string {
  const iv = crypto.randomBytes(16); // Generate a random IV for encryption
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return `${iv.toString('hex')}:${encryptedData}`; // Prepend IV to the encrypted data
}

function decryptData(encryptedData: string): string {
  const [ivHex, encryptedText] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
  let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
}

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post("/oeci", (req: Request, res: Response) => {
  
  console.log("req.body",req.body );
  const { username, password } = req.body; // Assuming parameters are sent in the request body
  if (!username || !password) {
    return res.status(400).send("Creds missing");
  }
  const credentials = {
    "username":username,
    "password":password
  }

  const encryptedCredentials = encryptData(JSON.stringify(credentials));

  res.cookie("encryptedCredentials", encryptedCredentials, { httpOnly: true });

  res.send("Parameters encrypted and stored in a cookie");
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
