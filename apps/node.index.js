const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 8000;

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing application/json
app.use(bodyParser.json());

// GET endpoint
app.get("/", (req, res) => {
  res.json({ message: "Hello, this is a GET request!" });
});

// POST endpoint
app.post("/post", (req, res) => {
  const { body } = req;
  console.log("Received POST request with data:", body);
  res.json(body);
});

// POST endpoint for FormData
app.post("/postFormData", (req, res) => {
  const formData = req.body;
  console.log("Received FormData:", formData);
  res.json(formData);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
