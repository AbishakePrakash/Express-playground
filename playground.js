class User {
  constructor(username, password, age) {
    (this.username = username),
      (this.password = password),
      (this.age = age),
      (this.data = {});
  }

  insert(key, value) {
    this.data[key] = value;
  }
}

const newUser = new User("jk", "jk@1234", 24);

newUser.insert("sports", "volleyball");

// Logger(newUser);

class MyClass {
  constructor(company) {
    this.company = company;
    this.data = {}; // Initialize an empty object
  }

  // Method to add a key-value pair
  addKeyValuePair(key, value) {
    this.data[key] = value;
  }

  // Method to display the data
  displayData() {
    Logger(this.data);
  }
}

// Create an instance of the class
const myInstance = new MyClass("Gravitus");

// Add key-value pairs
myInstance.addKeyValuePair("firstName", "John");
myInstance.addKeyValuePair("lastName", "Doe");
myInstance.addKeyValuePair("age", 30);

// Display the data
// myInstance.displayData(); // { firstName: "John", lastName: "Doe", age: 30 }.

// Logger(myInstance);

function getRandomValueInRange(min, max) {
  // if (min > max) {
  //   [min, max] = [max, min];
  // }

  // return Math.floor(Math.random() * (max - min + 1)) + min;

  let diff = max - min;

  const orderIndex = (min + diff / 2).toFixed(4);

  return orderIndex;
}

Logger(getRandomValueInRange(10000, 10039.125));

function makeTransaction(loanAmount, pendingAmount, dueAmount, collection) {
  if (collection > dueAmount) {
  } else {
  }
  Logger("Transaction Successfull");
}
