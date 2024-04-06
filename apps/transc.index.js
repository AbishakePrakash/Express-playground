const express = require("express");
const app = express();

const requestBody = {
  recipient_address: "recipient_address_3",
  deposit_amount: 1000,
  transaction_charges: 12.5,
};

const walletBalances = {
  recipient_address_1: 1000,
  recipient_address_2: 1010,
  recipient_address_3: 3000,
};

app.post("/transaction", (req, res) => {
  const { recipient_address, deposit_amount, transaction_charges } =
    requestBody;
  const recipientBalance = walletBalances[recipient_address] || 0;
  if (recipientBalance < deposit_amount + transaction_charges) {
    return res
      .status(400)
      .send({ error: "Insufficient funds", balance: recipientBalance });
  }

  const transactionSuccessful = true;

  if (transactionSuccessful) {
    walletBalances[recipient_address] -= deposit_amount + transaction_charges;
    console.log(
      `Recipient's wallet balance after transaction: ${walletBalances[recipient_address]}`
    );

    res.status(200).json({
      data: walletBalances[recipient_address],
      message: "Transaction successful",
    });
  } else {
    res.status(400).json({ message: "Transaction failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Hola, amigos");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
