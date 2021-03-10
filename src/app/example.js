// example bind
var person1 = { firstName: "Khoa", lastName: "Nguyễn" };
var person2 = { firstName: "Vân", lastName: "Thanh" };

function say(greeting0, greeting1) {
  console.log(
    greeting0 + "," + greeting1 + " " + this.firstName + " " + this.lastName
  );
}

var sayHelloKhoa = say.bind(person1, "Hello", "Good morning");
var sayHelloVan = say.bind(person2, "Hello", "Good morning");

sayHelloKhoa(); // => Hello,Good morning Khoa Nguyễn
sayHelloVan(); // => Hello,Good morning Vân Thanh



function log(level, time, message) {
  console.log(level + " - " + time + ": " + message);
}

// Không có this nên set this là null
// Set mặc định 2 tham số level và time
var logErrToday = log.bind(null, "Error", "Today");

// Hàm này tương ứng với log('Error', 'Today', 'Server die.')
logErrToday("Server die.");
// Error - Today: Server die.

// end example bind





// example call

var person1 = {firstName: 'Khoa', lastName: 'Nguyễn'};
var person2 = {firstName: 'Vân', lastName: 'Thanh'};

function say(greeting1, greeting2) {
 console.log(greeting1 + ',' + greeting2 + ' ' + this.firstName + ' ' + this.lastName);
}

say.call(person1, 'Hello', 'Good morning'); // => Hello,Good morning Khoa Nguyen
say.call(person2, 'Hello', 'Good morning'); // => Hello,Good morning Vân Thanh

// end example call



// example apply

var person1 = {firstName: 'Khoa', lastName: 'Nguyễn'};
var person2 = {firstName: 'Vân', lastName: 'Thanh'};

function say(greeting0, greeting1) {
 console.log(greeting0 + ',' + greeting1 + ' ' + this.firstName + ' ' + this.lastName);
}

say.apply(person1, ['Hello', 'Good moring']); // => Hello,Good moring Khoa Nguyễn
say.apply(person2, ['Hello', 'Good moring']); // => Hello,Good moring Vân Thanh

// end example apply