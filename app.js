'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Abdul Hamid',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-01-16T14:11:59.604Z',
    '2023-01-17T23:36:17.929Z',
    '2023-01-22T17:01:17.194Z',
    '2023-01-23T10:51:36.790Z',
  ],
  currency: 'BDT',
  locale: 'bn-BN', // de-DE
};

const account2 = {
  owner: 'Abdur Rahman',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// formatting dates in movements
const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  const localeLan = currentAccount.locale === 'bn-BN' ? 'দিন আগে' : 'Days Ago';
  const localeLanToday = currentAccount.locale === 'bn-BN' ? 'আজকে' : 'Today';
  const locallanYesterday =
    currentAccount.locale === 'bn-BN' ? 'গতকাল' : 'Yesterday';
  if (daysPassed === 0) return `${localeLanToday}`;
  if (daysPassed === 1) return `${locallanYesterday}`;
  if (daysPassed <= 7)
    return `${new Intl.NumberFormat(currentAccount.locale).format(
      daysPassed
    )} ${localeLan}`;

  // const getDay = `${date.getDate()}`.padStart(2, '0');
  // const getMonth = `${date.getMonth() + 1}`.padStart(2, '0');

  // const getYear = date.getFullYear();
  // // display dates
  // return (labelDate.textContent = `${getDay}/${getMonth}/${getYear}`);

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatted = function (locale, currency, value) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Display Movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const sortedMovs = sort
    ? acc.movements?.slice().sort((a, b) => a - b)
    : acc.movements;

  sortedMovs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);
    const formattedMov = formatted(acc.locale, acc.currency, mov);

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <!-------- Display dates ------------>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
    </div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Create Usernames

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((user) => user[0])
      .join('');
  });
};
createUsername(accounts);

// Calculate Current Balance

// const calcBalance = function (movements) {
//   const balance = movements.reduce(function (acc, mov) {
//     return acc + mov;
//   }, 0);
//   labelBalance.textContent = `${balance} EUR`;
// };
// calcBalance(account1.movements);

const calcBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatted(acc.locale, acc.currency, acc.balance);
};

// Calculate summary and display it on UI
const calcDisplaySummary = function (acc) {
  const balanceIn = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatted(acc.locale, acc.currency, balanceIn);

  const balanceOut = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatted(
    acc.locale,
    acc.currency,
    Math.abs(balanceOut)
  );

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit, i, arr) => {
      return (deposit * acc.interestRate) / 100;
    })
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = formatted(
    acc.locale,
    acc.currency,
    Math.floor(interest)
  );
};

const updateUI = function (acc) {
  // Display Balance
  calcBalance(acc);

  // Display Movements
  displayMovements(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

// logout timer
const logoutTimer = function () {
  let time = 120;
  const tick = function () {
    // Set timer to 5 min
    // 300 / 60 = 5 (min) and 300 % 60 = 180
    let min = String(Math.trunc(time / 60)).padStart(2, '0');
    let second = String(Math.trunc(time % 60)).padStart(2, '0');

    // In each time update the UI
    labelTimer.textContent = `${min}:${second}`;

    // When 0 times, logout the user or hide UI
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      currentAccount = null;
      labelWelcome.innerHTML = 'Log in to get started';
    }
    // Decrease the time
    time--;
  };
  // Immediately call the function
  tick();
  // Call the function in every seconds
  const timer = setInterval(tick, 1000);

  return timer;
};

// Resetting timer after new activity
document.querySelector('html').addEventListener('click', function () {
  // Logout timer
  if (timer) clearInterval(timer);
  timer = logoutTimer();
});
// Implement login functionality
let currentAccount, timer;

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();

  // Store the current account to the currentAccount variable
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI message
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Internationalizing Dates (Intl)
    // Experimenting API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Update the UI
    updateUI(currentAccount);
  } else {
    alert('Wrong Credentials');
  }
});

// Implement the transfer money functionality

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // Store the receiver account from input value
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  // Store the transfer amount
  const amount = +inputTransferAmount.value;

  inputTransferAmount.blur();
  // It the conditions become true than execute the transactions
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount?.balance &&
    inputTransferTo.value !== currentAccount.username
  ) {
    // Add a negative movement to the currectAccount
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    // Add a positive movement to the receiver account
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Reset timer
    clearInterval(timer);
    timer = logoutTimer();
    // Update the UI
    updateUI(currentAccount);
  } else {
    console.log('Something went wrong!');
  }

  // Clear the inputs
  inputTransferTo.value = inputTransferAmount.value = '';
});

// Implementing the loan functionalities

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    inputLoanAmount.value = '';
    setTimeout(function () {
      // Add positive movement to the current account
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update the UI
      updateUI(currentAccount);
      inputLoanAmount.value = '';
    }, 2500);
  } else {
    inputLoanAmount.value = '';
    alert('Your loan amount does not followed our criteria');
  }
});

// Implementing the close account functionality

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // Check the credentials
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const getIndex = accounts.findIndex(
      (acc) => acc.username === inputCloseUsername.value
    );
    accounts.splice(getIndex, 1);
    // Clear the inputs
    inputCloseUsername.value = inputClosePin.value = '';
    // Hide UI
    containerApp.style.opacity = 0;
  }
});

// Implementing the sorting functionality
// let sorted = true;
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
  // if (sorted === true) {
  //   sorted = false;
  // } else {
  //   sorted = true;
  // }
});

// Starting Numbers, Dates and Timers
// Base 10 numbers: 0 - 9 ex: 10 / 3 = 3.333333
// Binary Base numbers: 0 - 1
console.log(10 === 10.0);
// Convertion
console.log(0.1 + 0.5);
console.log(0.1 + 0.5 === 0.6);
console.log(0.1 + 0.2 === 0.3);
console.log(0.1 + 0.2);
console.log(20);
console.log(+'20');

// Parsing
// It will rid the unnecessary strings from a value itself
console.log(Number.parseInt('10xx')); //10
console.log(Number.parseInt('10xx')); // 10
console.log(Number.parseInt(10)); // 10

// Floating
// It will convert string to number with the decimal
console.log(Number.parseInt(' 10.11Hello ')); // Expected 10
console.log(Number.parseFloat('  10.11Hello  ')); // Expexted 10.11

// isNaN
// If value is NaN // Not a Number
console.log(Number.isNaN('20'));
console.log(Number.isNaN(20));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN('hello'));
console.log(Number.isNaN(10 / 0));

// Cheaking if value is a number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20'));
console.log(Number.isFinite(10 / 0)); // Expecting false > because it's infinite

// Cheaking if value is integer
console.log(Number.isInteger(10));
console.log(Number.isInteger(10.1));
console.log(Number.isInteger(10 / 3));
console.log(Number.isInteger('10'));
console.log(Number.isInteger(100));

// Math and Rounding section

console.log(Math.sqrt(25));
console.log(Math.sqrt(100));
console.log(Math.sqrt(49));
console.log(Math.sqrt(16));
console.log(25 ** (1 / 2)); // 25 ** .5 : 5
console.log(100 ** 0.5); // expected output: 10
console.log(8 ** (1 / 2));
console.log(8 ** (1 / 3));

console.log(Math.max(10, 11, 15, 340, 30, 4, 40));
console.log(Math.max(10, 11, 15, '340', 30, 4, 40));
console.log(Math.max(10, 11, 15, '340px', 30, 4, 40));
console.log(Math.min(10, 11, 12, 24, 45, 5));

// Calculate radius of a circle
// Formual: πr^2
console.log(Math.PI * Number.parseInt('10px') ** 2);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
// 0...1 * (max - min + 1) + min
console.log(randomInt(10, 20));

// 12 - 13 = 1 + 1 = 2 * 0.9678984652406257 = 1.9357969304812515 = truncate = 1 + 12 = 13
// Example 02 :
// 15, 20 => 20 - 15 = 5 + 1 = 6 * 0.2524318742580869 = 1.5145912455485213 = truncate = 1 + 15 = 16
//  15, 20 => 20 - 15 = 5 + 1 = 6 * 0.3660484467838132 = 2.1962906807028792 = truncate = 2 + 15 = 17

const randomInt2 = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

console.log(randomInt2(23, 25));
// 0...(max - min + 1) => 9 + 1=> 10 + min(10) = 20

// Math.round() will always give us the nearest integer
console.log(Math.round(11.2)); // Expected: 11;
console.log(Math.round(11.8)); // Expected: 12;

// Math.ceil() will rounding up to the integer
console.log(Math.ceil(15.9)); // Expected: 16;
console.log(Math.ceil(15.1)); // Expected: 16;
console.log(Math.ceil(21.1)); // Expected: 22;

// Math.floor() will rounding down to the integer
console.log(Math.floor(23.2)); // Expected: 23;
console.log(Math.floor(27.9)); // Expected: 27;

// Differences between Math.trunc() and Math.floor();
// Math.trunc() delete the decimal part where Math.floor() rounding down to the integer
// NOTE: Math.floor() is much better when we deal with negative numbers
console.log(Math.trunc(-31.1)); // Expected: -31;
console.log(Math.floor(-31.1)); // Expected: -32;

// Math.floor() will rounding down to the integer;
console.log(Math.floor(21.9)); // Expexted: 21;

// Rounding Decimals;
// NOTE: toFixed() returns a string;
console.log(+(11.1).toFixed()); // Default toFixed value is 0 // Expected: 11;
console.log(+(11.1).toFixed(0)); // Expected: 11;
console.log(+(11.1).toFixed(3)); // Expected: 11.100
console.log(+(11.1111).toFixed(2)); // Expected: 11.11

// JS Remainder operator
console.log(5 % 2); // Expected Output: 1;
console.log(10 % 2);
console.log(11 % 3);

const isEven = (n) => n % 2 === 0;
console.log(isEven(10));
console.log(isEven(5));
console.log(isEven(568));

labelBalance.addEventListener('click', function (e) {
  e.preventDefault();
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orange';
    if (i % 3 === 0) row.style.backgroundColor = 'lightblue';
  });
});

const myNum1 = 100_100_100;
console.log(myNum1);

const PI = 3.14_16;
console.log(PI);

const convertNum = Number('100_100_100');
console.log(convertNum);

// BIG INT

console.log(2 ** 54);
console.log(Number.MAX_SAFE_INTEGER);

console.log(121212121265543214659874321313131313n);
console.log(BigInt(41212121));

// BigInt operations
console.log(1234569871234654646541854154994524242425474n * 631646456n);

console.log(616321231n + 121154455n);

const massiveNum = 12313131312121221213232132132n;
const regularNum = 21321;
console.log(massiveNum * BigInt(regularNum));

// Exception
console.log(20n > 15);
console.log(20n === 20n);
console.log(typeof 20);

// Divisions
console.log(16n / 3n);
console.log(10 / 3);

// JS New Date()
const date = new Date();
console.log(date);
console.log(new Date('Jan 22 2023 12:04:35'));
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2050, 9, 20, 12, 45, 21));
console.log(new Date(2023, 1, 29)); // Expected Wed Mar 01 2023 00:00:00 GMT+0600

// Working with dates
const today = new Date();
console.log(today.getFullYear());
console.log(today.getMonth());
console.log(today.getDate());
console.log(today.getDay());
console.log(today.getHours());
console.log(today.getMinutes());
console.log(today.getSeconds());
console.log(today.getMilliseconds());
console.log(today.toISOString());
console.log(today.getTime());

console.log(new Date(1674368586305));
const future2050 = new Date(2050, 0, 1, 5, 1, 10);
console.log(future2050.getTime());

console.log(new Date(2524604470000));
future2050.setFullYear(2100);
console.log(future2050);

console.log(`hamidIsMyName`.padStart(20, '0'));

document.querySelector('.logout-btn').addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = undefined;
  labelWelcome.textContent = 'Log in to get started';
  containerApp.style.opacity = 0;
});

// document.querySelector('body').addEventListener('click', function (e) {
//   e.preventDefault();
//   const newDate = new Date();
//   const day = `${newDate.getDate()}`.padStart(2, '0');
//   const month = `${newDate.getMonth() + 1}`.padStart(2, '0');
//   const year = newDate.getFullYear();

//   console.log(`${day}/${month}/${year}`);
// });

// Operations with date
const future = new Date(2024, 6, 22);
console.log(+future);

console.log(new Date(1721584800000));

// Days Differences between two future dates
const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
console.log(calcDaysPassed(new Date(2024, 6, 30), new Date(2024, 6, 27)));

// Internationalizing Numbers (Intl)
const num = 36313133221.21;

console.log(
  'US ',
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num)
);
console.log(
  'Britain',
  new Intl.NumberFormat('en-GB', {
    style: 'unit',
    unit: 'mile-per-hour',
  }).format(num)
);
console.log('German', new Intl.NumberFormat('de-DE').format(num));
console.log(
  'Syria ',
  new Intl.NumberFormat('ar-SY', {
    style: 'unit',
    unit: 'mile-per-hour',
  }).format(num)
);
console.log('Arabic', new Intl.NumberFormat('ar').format(num));
// Local number from browser
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, {
    style: 'unit',
    unit: 'celsius',
  }).format(num)
);
console.log(
  'BAN ',
  new Intl.NumberFormat('bn-BN', {
    style: 'currency',
    currency: 'BDT',
  }).format(num)
);

// setTimeout = this method calls a function after a millisecond.

// 1 second = 1000 milliseconds
setTimeout(() => console.log('I will be printed after 2 seconds!'), 2000);

// setTimeout(
//   (ing1, ing2) => {
//     console.log(`Here is your delicious burger with ${ing1}, and ${ing2}`);
//   },
//   2000,
//   'Chicken',
//   'Sauce'
// );

// clearTimeout method can prevent any funtion from starting.

const ingredients = ['chicken', 'onion'];
const burgerTimer = setTimeout(
  (ing1, ing2) =>
    console.log(`Here is your delicious burger with ${ing1} and ${ing2}`),
  1000,
  ...ingredients
);

console.log(burgerTimer);

if (ingredients.includes('hot sauce')) {
  clearTimeout(burgerTimer);
}

// setInterval method calls function after a certain / specified intervals
const displayAfterSecond = setInterval(function () {
  const date = new Date();
  console.log(date);
}, 1000);
clearInterval(displayAfterSecond);

// const watch = function () {
//   const time = new Date();
//   const clock = Intl.DateTimeFormat('bn-BN', {
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric',
//   }).format(time);
//   const showTime = (document.querySelector('body').innerHTML = clock);
//   return showTime;
// };
// setInterval(watch, 1000);

// setInterval(showTime, 1000);
// function showTime() {
//   let time = new Date();
//   let hour = time.getHours();
//   let min = time.getMinutes();
//   let sec = time.getSeconds();
//   let currentTime = hour + ':' + min + ':' + sec;

//   document.getElementById('timer2').innerHTML = currentTime;
// }
// showTime();

const timer2 = function () {
  const time = new Date();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  let session = 'AM';
  if (hours === 0) return (hours = 12);
  if (hours > 12) {
    hours = hours - 12;
    session = 'PM';
  } // 13 - 12 = 1
  // Adding 0 prefix into hours
  hours = hours < 10 ? '0' + hours : hours;
  // Adding 0 prefix into minutes
  minutes = minutes < 10 ? '0' + minutes : minutes;
  // Adding 0 prefix into seconds
  seconds = seconds < 10 ? '0' + seconds : seconds;

  const showTime = `${hours}:${minutes}:${seconds} ${session}`;
  const displayTime = (document.querySelector('#timer2').innerHTML = showTime);
  return displayTime;
};
setInterval(timer, 1000);
