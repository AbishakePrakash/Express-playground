"use strict";

// import async from "async";
import moment from "moment";
import Order from "./ome_order.js";
import { FibonacciHeap } from "@tyriar/fibonacci-heap";
import Logger from "./utils/customLog.js";
var config = { deciAccuracy: 0.01 };

// OrderTypes.js
var OrderTypes = {
  LIMIT: 1,
  MARKET: 2,
};

var SIDE = Order.SIDE;

// Trade.js
class Trade {
  constructor(
    price,
    quantity,
    newOrders,
    childOrders,
    rejectedOrders,
    timeStamp
  ) {
    this.fillPrice = price;
    this.fillQuantity = quantity;
    this.newOrders = newOrders;
    this.childOrders = childOrders;
    this.rejectedOrders = rejectedOrders;
    this.executionTime = timeStamp;
  }
}

var bidComparator = function (a, b) {
  // Logger(a, b);

  var ret = b.value.price - a.value.price;
  if (ret == 0) {
    ret = a.value.timeStamp - b.value.timeStamp;
  }

  return ret;
};

var askComparator = function (a, b) {
  var ret = a.value.price - b.value.price;
  if (ret == 0) {
    ret = a.value.timeStamp - b.value.timeStamp;
  }

  return ret;
};

export default class Book {
  constructor(name) {
    this.name = name;
    this.init = 0;
    this.sid = 0;

    this.askNodes = [];
    this.bidNodes = [];

    // Buy orders
    this._bids = new FibonacciHeap(bidComparator);

    // Sell orders
    this._asks = new FibonacciHeap(askComparator);
  }

  lenBids() {
    return this._bids.size();
  }

  lenAsks() {
    return this._asks.size();
  }

  // @return returns the closest bid Order
  peekBid() {
    return this._bids.findMinimum().value;
  }

  // @return returns the closest ask Order
  peekAsk() {
    return this._asks.findMinimum().value;
  }

  // @return returns the ordered list of bids
  bidsToArray() {
    var bids = [];
    var oldBids = this._bids;
    this._bids = new FibonacciHeap(bidComparator);

    while (!oldBids.isEmpty()) {
      var bid = oldBids.extractMinimum().value;
      this._bids.insert(bid);
      bids.push(bid);
    }

    return bids;
  }

  // @return returns the ordered list of asks
  asksToArray() {
    var asks = [];
    var oldAsks = this._asks;
    this._asks = new FibonacciHeap(askComparator);

    while (!oldAsks.isEmpty()) {
      var ask = oldAsks.extractMinimum().value;
      this._asks.insert(ask);
      asks.push(ask);
    }

    return asks;
  }

  delOrder(order, sid) {
    var _this = this;
    var element = "none";

    if (parseInt(order.side) == 1) {
      for (var i = 0; i < this.bidNodes.length; i++) {
        if (this.bidNodes[i].sid == sid) {
          element = i;
        }
      }

      if (element != "none") {
        var nodeObj = this.bidNodes[element].node;
        _this._bids.delete(nodeObj);

        this.bidNodes.splice(parseInt(element), 1);
        return true;
      } else {
        return false;
      }
    } else if (parseInt(order.side) == 2) {
      for (var i = 0; i < this.askNodes.length; i++) {
        if (this.askNodes[i].sid == sid) {
          element = i;
        }
      }

      if (element != "none") {
        var nodeObj = this.askNodes[element].node;
        _this._asks.delete(nodeObj);

        this.askNodes.splice(parseInt(element), 1);
        return true;
      } else {
        return false;
      }
    }
  }

  // TODO: BETTER SYSTEM FOR MSGING ORDER FAILURES
  // @return returns true if order accepted. returns false if order failed.
  addOrder(order) {
    var _this = this;
    // Logger(order);

    // Logger(order.sid, SIDE.BID, SIDE.ASK);
    Logger(order.sid, SIDE.BID, SIDE.ASK);

    if (order.side === SIDE.BID) {
      if (this.lenAsks() == 0 && order.type === OrderTypes.MARKET) {
        return false;
      }

      if (order.sid == undefined) {
        _this.sid = parseInt(_this.sid) + 1;
        order.sid = _this.sid;
      }

      var resObj = _this._bids.insert(order.sid, order);
      this.bidNodes.push({ sid: order.sid, node: resObj });

      return { status: false, order: order };
    } else if (order.side === SIDE.ASK) {
      if (this.lenBids() == 0 && order.type === OrderTypes.MARKET) {
        return false;
      }

      if (order.sid == undefined) {
        _this.sid = parseInt(_this.sid) + 1;
        order.sid = _this.sid;
      }

      var resObj = _this._asks.insert(order.sid, order);
      this.askNodes.push({ sid: order.sid, node: resObj });

      return { status: false, order: order };
    } else {
      return { status: false, message: "Invalid Side" };
    }
  }

  settleBook() {
    var _this = this;
    var trades = [];

    // 0 liquidity on other side
    var i = 0;
    var tradeExecuted = true;

    while (tradeExecuted) {
      i++;
      tradeExecuted = false;

      if (_this._bids.size() === 0 || _this._asks.size() === 0) {
        continue;
      } else {
        var aggroOrder = null;
        var posLiqOrder = null;

        // One market , one limit on top.
        if (_this.peekAsk().type === OrderTypes.MARKET) {
          aggroOrder = _this._asks.extractMinimum().value;
          posLiqOrder = _this._bids.extractMinimum().value;
        } else if (_this.peekBid().type === OrderTypes.MARKET) {
          aggroOrder = _this._bids.extractMinimum().value;
          posLiqOrder = _this._asks.extractMinimum().value;
        }

        //if Both Limit and price match exists
        if (aggroOrder == null) {
          if (
            this.getSpread() <
            config.deciAccuracy - config.deciAccuracy / 2
          ) {
            aggroOrder = _this._asks.extractMinimum().value;
            posLiqOrder = _this._bids.extractMinimum().value;
          } else {
            continue;
          }
        }

        // Two market orders should never collide since market ordrs are not allowed to exist on illiquid books
        var newOrders = [];
        var parentOrder =
          aggroOrder.quantity > posLiqOrder.quantity ? aggroOrder : posLiqOrder;

        var fillQuantity = Math.min(aggroOrder.quantity, posLiqOrder.quantity);
        var leftoverQuantity =
          Math.max(aggroOrder.quantity, posLiqOrder.quantity) - fillQuantity;

        var failed = [];
        if (
          leftoverQuantity > config.deciAccuracy &&
          leftoverQuantity >= parentOrder.minQty
        ) {
          let newOrder = Object.assign({}, parentOrder);

          // For updating parent volume
          newOrder.additionalI = newOrder.sid;

          _this.sid = parseInt(_this.sid) + 1;
          newOrder.sid = _this.sid;

          newOrder.quantity = leftoverQuantity;
          newOrders.push(newOrder);

          var addRes = _this.addOrder(newOrder);
          if (!addRes.status) {
            newOrder.node = addRes.node;
            failed.push(newOrder);
          }
        } else if (leftoverQuantity > config.deciAccuracy) {
          let newOrder = Object.assign({}, parentOrder);

          // For updating parent volume
          newOrder.additionalI = newOrder.sid;

          _this.sid = parseInt(_this.sid) + 1;
          newOrder.sid = _this.sid;

          newOrder.quantity = leftoverQuantity;
          newOrder.status = "-3";
          newOrders.push(newOrder);
        }

        aggroOrder.matchedBy = posLiqOrder.userId;
        aggroOrder.matchedSid = posLiqOrder.sid;

        // Market Maker
        aggroOrder.newStatus = 1;

        posLiqOrder.matchedBy = aggroOrder.userId;
        posLiqOrder.matchedSid = aggroOrder.sid;

        // Market Taker
        posLiqOrder.newStatus = 0;

        if (parseInt(aggroOrder.timeStamp) < parseInt(posLiqOrder.timeStamp)) {
          aggroOrder.aPrice = aggroOrder.price;
          posLiqOrder.aPrice = aggroOrder.price;
        } else {
          aggroOrder.aPrice = posLiqOrder.price;
          posLiqOrder.aPrice = posLiqOrder.price;
        }

        trades.push(
          new Trade(
            posLiqOrder.price,
            fillQuantity,
            newOrders,
            [aggroOrder, posLiqOrder],
            failed,
            moment().format("x")
          )
        );
        // Add order to bookID
        tradeExecuted = true;
        continue;
      }
    }

    return trades;
  }

  getSpread() {
    return this.peekAsk().price - this.peekBid().price;
  }
}
