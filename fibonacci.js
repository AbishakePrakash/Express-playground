// Import npm module
import { FibonacciHeap } from "@tyriar/fibonacci-heap";

// Construct FibonacciHeap
const heap = new FibonacciHeap();
// // Insert keys only
// heap.insert(3);
// heap.insert(7);
// // Insert keys and values
// heap.insert(8, { foo: "bar" });
// heap.insert(1, { foo: "baz" });

// // Extract all nodes in order
// while (!heap.isEmpty()) {
//   const node = heap.extractMinimum();
//   Logger("key: " + node.key + ", value: " + node.value);
// }
// // > key: 1, value: [object Object]
// // > key: 3, value: undefined
// // > key: 7, value: undefined
// // > key: 8, value: [object Object]

// // Construct custom compare FibonacciHeap
// const heap2 = new FibonacciHeap(function (a, b) {
//   return (a.key + a.value).localeCompare(b.key + b.value);
// });
// heap2.insert("2", "B");
// heap2.insert("1", "a");
// heap2.insert("1", "A");
// heap2.insert("2", "b");

// // Extract all nodes in order
// while (!heap2.isEmpty()) {
//   const node = heap2.extractMinimum();
//   Logger("key: " + node.key + ", value: " + node.value);
// }
// // > key: 1, value: a
// // > key: 1, value: A
// // > key: 2, value: b
// // > key: 2, value: B

heap.insert(654, "adca");
heap.insert(463, "aoidoas");
heap.insert(134, "saxsa");
heap.insert(793, "sarf");
heap.insert(786, "vdaae");
heap.insert(176, "aeda");
heap.insert(913, "aedae");

Logger(heap.decreaseKey(653));
