import express, { json, urlencoded } from "express";
import router from "./routes.js";
// const { default: makeTransaction } = require("./record");

const app = express();
const port = 4000;

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(router)

app.get("/", (req, res) => {
  res.json({ message: "Hola Amigos!!!" });
});

function makeTransaction(loanAmount, pendingAmount, dueAmount, collection) {
  if (collection > dueAmount) {
  } else {
  }
  console.log("Transaction Successfull");
}

// POST endpoint
// app.get("/post", (req, res) => {
//   const { body } = req;
//   console.log("Received POST request with data:", body);
//   res.json(body);
// });

// // POST endpoint for FormData
// app.post("/postFormData", (req, res) => {
//   const formData = req.body;
//   console.log("Received FormData:", formData);
//   res.json(formData);
// });

// app.post("/collection", (req, res) => {
//   var result = {
//     error: "None",
//     preTransc: {},
//     postTransc: {},
//   };
//   const { userId, loanAmount, pendingAmount, tenure, collection } = req.body;
//   console.log(loanAmount);

//   const dueAmount = loanAmount / tenure;
//   const paidAmount = loanAmount - pendingAmount;
//   const paidDues = (loanAmount - pendingAmount) / dueAmount;
//   const remainingDues = tenure - paidDues;
//   const revisedPendingAmount =
//     pendingAmount + (dueAmount - collection) - dueAmount;

//   // const dueAmountbyBal = pendingAmount / (tenure - dueId + 1);
//   result.preTransc.loanAmount = loanAmount;
//   result.preTransc.pendingAmount = pendingAmount;
//   result.preTransc.collection = collection;
//   result.preTransc.paidAmount = paidAmount;
//   result.preTransc.dueAmount = dueAmount;
//   result.preTransc.paidDues = paidDues;
//   result.preTransc.remainingDues = remainingDues;
//   result.postTransc.pendingAmount = revisedPendingAmount;
//   result.postTransc.paidDues = paidDues++;
//   result.postTransc.remainingDues = remainingDues--;
//   result.postTransc.dueAmount = revisedPendingAmount / (remainingDues - 1);

//   // makeTransaction(loanAmount, pendingAmount, dueAmount, collection);

//   console.log(result);
//   res.status(200).send(result);
// });

// app.post("/password", (req, res) => {
//   // Assuming req.body contains the user's data including the password
//   const userData = req.body;
  
//   // Retrieve the password from the request body
//   const password = userData.password;

//   // Load the encryption key and IV from environment variables
//   const masterKey = Buffer.from("gravitus_nova"); // Replace with your environment variable
//   const iv = crypto.randomBytes(16); // Generate a random IV for each encryption

//   if (!password || !masterKey) {
//       return res.status(400).json({ error: "Invalid request" });
//   }

//   try {
//       // Create a cipher with AES-256-CBC algorithm
//       const cipher = crypto.createCipheriv("aes-256-cbc", masterKey, iv);

//       // Encrypt the password
//       let encrypted = cipher.update(password, "utf-8", "hex");
//       encrypted += cipher.final("hex");

//       // Send the encrypted password along with the IV
//       res.status(200).json({ encryptedPassword: encrypted, iv: iv.toString("hex") });
//   } catch (error) {
//       console.error("Encryption failed:", error);
//       res.status(500).json({ error: "Internal server error" });
//   }
// });


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
