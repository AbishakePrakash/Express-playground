// routes.js
import express from "express";
import { encryptData, decryptData } from "./encryption.js";
import myAlgo from "./ome_algo_SPOT.js";
import Logger from "./utils/customLog.js";

//ofc

const classObj = new myAlgo();

const router = express.Router();

router.post("/postFormData", (req, res) => {
  const formData = req.body;
  Logger("Received FormData:", formData);
  res.json(formData);
});

// Two way encription
router.post("/encrypt", (req, res) => {
  const { data } = req.body;
  if (!data) {
    res.send("Please send data to encrypt");
  }
  const encryptedData = encryptData(data.pass);
  Logger("Data Encrypted");
  res.status(200).json({ encryptedData });
});
router.post("/decrypt", (req, res) => {
  const { encryptedData } = req.body;
  if (!encryptedData) {
    res.send("Please send encryptedData to encrypt");
  }
  try {
    const data = decryptData(encryptedData);
    Logger("Data Decrypted");
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
});

// Challenge
router.post("/challenge", (req, res) => {
  const { data } = req.body;
  if (!data) {
    res.send("Please send data to encrypt");
  }
  const encryptedData = bcrypt;
  Logger("Data Encrypted");
  res.status(200).json({ encryptedData });
});

// POST endpoint
router.get("/post", (req, res) => {
  const { body } = req;
  Logger("Received POST request with data:", body);
  res.json(body);
});

// POST endpoint for FormData
router.post("/postFormData", (req, res) => {
  const {
    assetName,
    purchaseDate,
    vendor,
    purchaseValue,
    assetLife,
    rfid,
    currentValue,
    calibrationDue,
    endOfWarranty,
    productSerialNumber,
    categories,
    departments,
    locations,
    subsets,
  } = req.body;

  Logger("Received FormData");

  res.status(200).json(result);
});

router.post("/collection", (req, res) => {
  var result = {
    error: "None",
    preTransc: {},
    postTransc: {},
  };
  const { userId, loanAmount, pendingAmount, tenure, collection } = req.body;
  Logger(loanAmount);

  const dueAmount = loanAmount / tenure;
  const paidAmount = loanAmount - pendingAmount;
  const paidDues = (loanAmount - pendingAmount) / dueAmount;
  const remainingDues = tenure - paidDues;
  const revisedPendingAmount =
    pendingAmount + (dueAmount - collection) - dueAmount;

  // const dueAmountbyBal = pendingAmount / (tenure - dueId + 1);
  result.preTransc.loanAmount = loanAmount;
  result.preTransc.pendingAmount = pendingAmount;
  result.preTransc.collection = collection;
  result.preTransc.paidAmount = paidAmount;
  result.preTransc.dueAmount = dueAmount;
  result.preTransc.paidDues = paidDues;
  result.preTransc.remainingDues = remainingDues;
  result.postTransc.pendingAmount = revisedPendingAmount;
  result.postTransc.paidDues = paidDues++;
  result.postTransc.remainingDues = remainingDues--;
  result.postTransc.dueAmount = revisedPendingAmount / (remainingDues - 1);

  // makeTransaction(loanAmount, pendingAmount, dueAmount, collection);

  Logger(result);
  res.status(200).send(result);
});
router.post("/password", (req, res) => {
  // Assuming req.body contains the user's data including the password
  const userData = req.body;

  // Retrieve the password from the request body
  const password = userData.password;

  // Load the encryption key and IV from environment variables
  const masterKey = Buffer.from("gravitus_nova"); // Replace with your environment variable
  const iv = crypto.randomBytes(16); // Generate a random IV for each encryption

  if (!password || !masterKey) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    // Create a cipher with AES-256-CBC algorithm
    const cipher = crypto.createCipheriv("aes-256-cbc", masterKey, iv);

    // Encrypt the password
    let encrypted = cipher.update(password, "utf-8", "hex");
    encrypted += cipher.final("hex");

    // Send the encrypted password along with the IV
    res
      .status(200)
      .json({ encryptedPassword: encrypted, iv: iv.toString("hex") });
  } catch (error) {
    console.error("Encryption failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
