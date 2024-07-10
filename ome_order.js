class Order {
  constructor(id, userId, side, price, quantity, status, timeStamp) {
    this.id = id;
    this.userId = userId;
    this.side = side;
    this.price = price;
    this.quantity = quantity;
    this.status = status;
    this.timeStamp = timeStamp;
  }
}

Order.STATUS = Object.freeze({
  ACTIVE: 1,
});

Order.SIDE = Object.freeze({
  BID: 1, // Buyer
  ASK: 2, // Seller
});

export default Order;
