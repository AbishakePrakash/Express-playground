// routes.js
import express from "express";
import Book from "./ome_algo_SPOT.js";
import Logger from "./utils/customLog.js";
import { FibonacciHeap } from "@tyriar/fibonacci-heap";

const oflRouter = express.Router();

var bid = [];
var ask = [];

oflRouter.post("/spottrade", (req, res) => {
  const orderData = req.body;

  const book = new Book("1st Order");

  try {
    const addResult = book.addOrder(orderData);

    Logger(addResult);

    if (addResult.status) {
      res.status(201).json({ message: "Order added successfully!" });
    } else {
      res.status(400).json({ message: addResult.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fibonacci
var bidComparator = function (a, b) {
  var ret = a.value - b.value;
  // if (ret === 0) {
  //   ret = a.value.timeStamp - b.value.timeStamp;
  // }

  return ret;
};

var askComparator = function (a, b) {
  var ret = a.value.price - b.value.price;
  if (ret == 0) {
    ret = a.value.timeStamp - b.value.timeStamp;
  }

  return ret;
};

function getNodeByKey(heap, key) {
  // Initialize a queue to store nodes for traversal
  const queue = [];

  // Add all root nodes to the queue
  for (let root = heap.root; root; root = root.next) {
    queue.push(root);
  }
  // console.log("Inside func: ", key, heap);

  // Perform Breadth-First Search (BFS) traversal
  while (queue.length > 0) {
    const currentNode = queue.shift();

    // Check if current node's key matches the target key

    if (currentNode.key === key) {
      return currentNode;
    }

    // Explore child nodes (if applicable in your implementation)
    if (currentNode.child) {
      queue.push(currentNode.child);
      // You might need to iterate through all children using a loop
      // depending on how child nodes are stored (e.g., linked list)
    }
  }

  // If no node is found with the target key, return null
  return null;
}

function shallowCopyHeap(originalHeap) {
  const copyHeap = new FibonacciHeap();

  // Iterate through nodes in original heap
  const nodes = originalHeap.getAllNodes();
  for (const node of nodes) {
    const newNode = new FibonacciHeap.Node(node.value);

    // Copy children by reference (shallow copy)
    if (node.children) {
      newNode.children = node.children;
    }

    copyHeap.insert(newNode);
  }

  return copyHeap;
}

oflRouter.post("/new", (req, res) => {
  const data = req.body;

  function experiment() {
    return new Promise(function (resolve, reject) {
      const bidHeap = new FibonacciHeap(bidComparator);
      const askHeap = new FibonacciHeap(askComparator);

      // console.log(
      //   `Buy order from ${data.name} of ${data.quantity} for ${data.price} has been added to bidQueue`
      // );

      if (data.side === 1) {
        bidHeap.insert(bidHeap.size() + 1, data);
        console.log(`Buy order added to bidQueue: ${data}`);
        bid = [...bid, data];

        while (!bidHeap.isEmpty()) {
          const node = bidHeap.extractMinimum();
          console.log(
            "BidHeap ==> key: " + node.key + ", price: " + node.value.price
          );
        }
      } else if (data.side === 2) {
        askHeap.insert(askHeap.size() + 1, data);
        console.log(`Sell order added to askQueue: ${data}`);
        ask = [...ask, data];
        while (!askHeap.isEmpty()) {
          const node = askHeap.extractMinimum();
          console.log(
            "AskHeap ==> key: " + node.key + ", price: " + node.value.price
          );
        }
      } else {
        reject("Invalid side");
      }

      console.log({ bid }, { ask });

      // const heap = new FibonacciHeap();
      // heap.insert(1, 1);
      // heap.insert(2, 2);
      // heap.insert(3, 3);
      // heap.insert(4, 4);
      // heap.insert(5, 5);
      // heap.insert(6, 6);

      // console.log(heap.findMinimum().value);

      // while (!heap.isEmpty()) {
      //   const node = heap.extractMinimum();
      //   console.log("key: " + node.key + ", value: " + node.value);
      //   heap.insert(node);
      // }

      // console.log(heap.findMinimum().value);

      // var bid = [];
      // var ask = [];

      // while (!bidHeap.isEmpty()) {
      //   const node = heap.extractMinimum();
      //   console.log("key: " + node.key + ", value: " + node.value);

      //   if (data.side === 1) {
      //     bid = [...bid, node];
      //   } else if (data.side === 2) {
      //     bid = [...bid, node];
      //   } else {
      //     reject("Invalid Side");
      //   }

      //   heap1.insert(node.key, node.value);
      // }

      // console.log({ bid }, { ask });

      // while (!heap1.isEmpty()) {
      //   const node = heap1.extractMinimum();
      //   console.log("key: " + node.key + ", value: " + node.value);
      // }

      // console.log("Shallow copy created successfully");

      // /////////////////////////////////////////////////////////////////////////////
      // var selectedNode;

      // console.log(targteNode);

      // while (!copyHeap.isEmpty()) {
      //   const node = copyHeap.extractMinimum();
      //   if (node.key === targteNode) {
      //     selectedNode = node;
      //   }
      //   console.log("KEY: " + node.key + ", VALUE: " + node.value);
      // }

      // console.log(selectedNode.key);

      // console.log(heap.findMinimum().value);

      // heap.decreaseKey(selectedNode, -10);

      // while (!heap.isEmpty()) {
      //   const node = heap.extractMinimum();
      //   console.log("key: " + node.key + ", value: " + node.value);
      // }
      resolve("Order Added");
    });
  }

  var returnData = {
    result: {},
    error: "ok",
  };

  (function () {
    experiment().then(
      function (result) {
        returnData.result = result;
        res.send(returnData);
      },
      function (error) {
        returnData.error = error;
        res.send(returnData);
      }
    );
    // res.send("Hello World");
  })();
});

export default oflRouter;
