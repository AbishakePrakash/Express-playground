// routes.js
import express from 'express'
import { encryptData, decryptData } from './encryption.js'

const router = express.Router()


// Basic Data & Form Data
router.get("/post", (req, res) => {
  const { body } = req;
  console.log("Received POST request with data:", body);
  res.json(body);
});

router.post("/postFormData", (req, res) => {
  const formData = req.body;
  console.log("Received FormData:", formData);
  res.json(formData);
});


// Two way encription

router.post('/encrypt', (req, res) => {
  const {data}  = req.body
  if (!data) {
    res.send("Please send data to encrypt")
  }
  const encryptedData = encryptData(data)
  console.log("Data Encrypted");
  res.status(200).json({ encryptedData })
})

router.post('/decrypt', (req, res) => {
  const { encryptedData } = req.body
  if (!encryptedData) {
    res.send("Please send encryptedData to encrypt")
  }
 try {
  const data = decryptData(encryptedData)
  console.log("Data Decrypted");
  res.status(200).json({ data })
 } catch (error) {
  console.error(error);
  res.status(400).json({error})
 }
})


export default router