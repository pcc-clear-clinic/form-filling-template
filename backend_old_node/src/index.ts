import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import cors from "cors";
import bodyParser from "body-parser";
import axios, { AxiosInstance } from "axios";
import fetch from "node-fetch";
import zlib from 'zlib';

const algorithm = "aes-256-cbc"; // The encryption algorithm

const secretKey = crypto
  .createHash("sha256")
  .update(String("secret"))
  .digest("base64")
  .slice(0, 32);
console.log("Secret Key:", secretKey);

function encryptData(data: string): string {
  const iv = crypto.randomBytes(16); // Generate a random IV for encryption
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");
  return `${iv.toString("hex")}:${encryptedData}`; // Prepend IV to the encrypted data
}

function decryptData(encryptedData: string): string {
  const [ivHex, encryptedText] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv,
  );
  let decryptedData = decipher.update(encryptedText, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post("/oeci", async (req: Request, res: Response) => {
  const { username, password } = req.body; // Assuming parameters are sent in the request body
  if (!username || !password) {
    return res.status(400).send("Creds missing");
  }
  const credentials = {
    username: username,
    password: password,
  };

  const encryptedCredentials = encryptData(JSON.stringify(credentials));

  res.cookie("encryptedCredentials", encryptedCredentials, { httpOnly: true });

  const oeciLoginUrl =
    "https://publicaccess.courts.oregon.gov/PublicAccessLogin/login.aspx";

  const loginPayload = {
    UserName: username,
    Password: password,
    ValidateUser: "1",
    dbKeyAuth: "JusticePA",
    SignOn: "Sign+On",
  };

  const session: AxiosInstance = axios.create({
    baseURL: "https://publicaccess.courts.oregon.gov", // Replace with your API base URL
    timeout: 30000,
    withCredentials: true, // Enable sending credentials (like cookies)
  });

  const headers = {
    "Accept-Encoding" :"gzip, deflate, br",
    
    "Connection":
      "keep-alive",
    "Content-Length":
      85,
    "Cookie":"_ga_8VWBKP4KJ1=GS1.1.1700074004.4.0.1700074004.0.0.0; _ga=GA1.1.329895859.1699549076; ASP.NET_SessionId=p5afhk55ifdp3t55qm3mfe55; OJDCMSP=!rTH53ssbGq094gF3uUM+qtk2ulcTyrge4vZXDznwrVKGDAOmjsQpqAazLk2h8sSnR7pGNfOz76OIIRI=",
    "Content-Type":
    "application/x-www-form-urlencoded",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
  };

  try {
    const response = await session.post(
      oeciLoginUrl,
      loginPayload,
      { headers: headers },
    );
   console.log("Data:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }

  const defaultResponse = await session.get(
    "https://publicaccess.courts.oregon.gov/PublicAccessLogin/default.aspx"
  )
  // console.log("defaultResponse", defaultResponse)

  const caseResponse = await session.get(
    "https://publicaccess.courts.oregon.gov/PublicAccessLogin/CaseDetail.aspx?CaseID=20955552",
  );
  // console.log("caseResponse", caseResponse)
  res.send("Parameters encrypted and stored in a cookie");
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

