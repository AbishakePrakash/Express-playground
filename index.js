const express = require("express");
const bodyParser = require("body-parser");
// const { default: makeTransaction } = require("./record");

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Hola Amigos!!!" });
});

function makeTransaction(loanAmount, pendingAmount, dueAmount, collection) {
  if (collection > dueAmount) {
  } else {
  }
  console.log("Transaction Successfull");
}

// // POST endpoint
// app.post("/post", (req, res) => {
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

app.post("/collection", (req, res) => {
  var result = {
    error: "None",
    preTransc: {},
    postTransc: {},
  };
  const { userId, loanAmount, pendingAmount, tenure, collection } = req.body;
  console.log(loanAmount);

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

  console.log(result);
  res.status(200).send(result);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
