"use strict";
function isNumber(char) {
  return /^[0-9]$/.test(char);
}
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2024-01-03T14:55:29.741Z",
    "2025-09-11T08:06:13.502Z",
    "2024-03-28T20:44:58.916Z",
    "2026-02-25T05:17:36.470Z",
    "2025-04-07T11:29:04.088Z",
    "2024-10-13T17:02:49.651Z",
    "2023-12-18T00:36:22.907Z",
    "2025-06-30T09:48:15.333Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2025-03-23T01:12:59.345Z",
    "2024-07-14T18:49:21.006Z",
    "2023-10-31T23:05:17.912Z",
    "2026-02-10T07:33:40.551Z",
    "2024-12-02T16:27:08.784Z",
    "2025-08-19T12:41:55.330Z",
    "2024-05-26T21:59:03.120Z",
    "2026-01-28T03:18:47.602Z",
  ],
  currency: "EUR",
  locale: "de-DE",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2024-02-11T15:03:48.219Z",
    "2023-12-25T06:54:11.700Z",
    "2025-07-08T22:19:37.064Z",
    "2024-04-16T09:42:53.888Z",
    "2026-03-01T13:25:20.409Z",
    "2024-11-29T04:58:16.973Z",
    "2025-01-17T19:36:02.114Z",
    "2024-06-05T10:07:44.652Z",
  ],
  currency: "CAD",
  locale: "en-CA",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, -90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2023-11-02T03:47:19.582Z",
    "2025-06-14T18:22:41.903Z",
    "2024-09-27T11:05:33.174Z",
    "2026-01-09T23:58:12.667Z",
    "2024-03-19T07:31:55.428Z",
  ],
  currency: "AUD",
  locale: "en-AU",
};

const accounts = [account1, account2, account3, account4];
accounts.forEach((acc) => (acc.hasTakenLoan = false));

const list = document.querySelector(".grid-list");
const balance = document.querySelector(".balance-number");
const bottomIncome = document.getElementById("income");
const bottomInterest = document.getElementById("interest");
const bottomOut = document.querySelector(".out");
const usernameInput = document.getElementById("username");
const pinInput = document.getElementById("pin");
const inputs = document.querySelector(".up-input");
const loginButton = document.querySelector(".up-input-button");
const container = document.querySelector(".container");
const loginMessage = document.querySelector(".login-message");
const transferToInput = document.getElementById("transfer-input");
const closeButton = document.getElementById("close-button");
const transferAmount = document.getElementById("transfer-amount");
const transferButton = document.getElementById("transfer-button");
const closeInput = document.getElementById("close-input");
const closePIN = document.getElementById("close-pin");
const loanButton = document.getElementById("loan-button");
const loanInput = document.getElementById("loan-input");
const sortBtn = document.querySelector(".sort-button");
const balanceDate = document.querySelector(".time-date");
const listDate = document.querySelector(".items-list-date");
const timer = document.querySelector(".timer");
const credentials = document.querySelector(".credentials-container");
usernameInput.value = "";
balance.innerHTML = "";

closeInput.addEventListener("keydown", function (event) {
  if (
    event.key !== "Backspace" &&
    event.key !== "Tab" &&
    !isLetter(event.key)
  ) {
    event.preventDefault();
  }
});
closePIN.addEventListener("keydown", function (event) {
  if (
    event.key !== "Backspace" &&
    event.key !== "Enter" &&
    !isNumber(event.key)
  ) {
    event.preventDefault();
  }
});
transferAmount.addEventListener("keydown", function (event) {
  if (
    event.key !== "Backspace" &&
    event.key !== "Enter" &&
    !isNumber(event.key)
  ) {
    event.preventDefault();
  }
});
pinInput.addEventListener("keydown", function (event) {
  if (
    event.key !== "Backspace" &&
    event.key !== "Enter" &&
    !isNumber(event.key)
  ) {
    event.preventDefault();
  }
});
usernameInput.addEventListener("keydown", function (event) {
  if (
    event.key !== "Backspace" &&
    event.key !== "Tab" &&
    !isLetter(event.key)
  ) {
    event.preventDefault();
  }
});
transferToInput.addEventListener("keydown", function (event) {
  if (
    event.key !== "Backspace" &&
    event.key !== "Tab" &&
    !isLetter(event.key)
  ) {
    event.preventDefault();
  }
});
loanInput.addEventListener("keydown", function (event) {
  if (
    event.key !== "Backspace" &&
    event.key !== "Enter" &&
    !isNumber(event.key)
  ) {
    event.preventDefault();
  }
});
const format = function (value, currency, locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
const displayList = function (acc, sort = false) {
  //combine movements and dates for sorting
  const combined = acc.movements.map((mov, i) => ({
    movement: mov,
    date: acc.movementsDates.at(i),
  }));
  if (sort) combined.sort((a, b) => new Date(a.date) - new Date(b.date));
  //if sort was true...
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  combined.forEach(function (obj, i) {
    //destructure. the names should be the same as the object keys
    const { movement, date } = obj;
    const type = movement > 0 ? "deposit" : "withdrawal";
    const dateObject = new Date(date);
    const daysPassed = calcDaysPassed(new Date(), dateObject);
    let displayDate;
    if (daysPassed === 0) displayDate = "Today";
    else if (daysPassed === 1) displayDate = "Yesterday";
    else if (daysPassed >= 2 && daysPassed <= 7)
      displayDate = `${daysPassed} days ago`;
    else {
      displayDate = new Intl.DateTimeFormat(acc.locale).format(dateObject);
    }
    const formattedMoney = format(movement, acc.currency, acc.locale);
    const html = `<div class="list-items">
            <span class="list-${type}">${i + 1} ${type}</span>
            <span class="items-list-date">${displayDate}</span>
            <span class="money-number">${formattedMoney}</span>
          </div>`;
    list.insertAdjacentHTML("afterbegin", html);
    //create a string of html and this inserts it
  });
};
const createUsernames = function (accs) {
  //don't want a new array, just changes
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      // want a new array
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const calcPrintBalance = function (acc) {
  //store the value
  acc.balance = acc.movements.reduce(
    function (acc, el) {
      return acc + el;
    },
    0, //initial value of the acc
  );
  const formattedBalance = format(acc.balance, acc.currency, acc.locale);
  balance.textContent = formattedBalance;
};

bottomIncome.innerHTML = "";
bottomInterest.innerHTML = "";
bottomOut.innerHTML = "";

const calcBottom = function (acc) {
  format(acc, acc.currency, acc.locale);

  const income = acc.movements
    .filter(function (movement) {
      return movement >= 0;
    })
    .reduce(function (acc, movement) {
      return acc + movement;
    }, 0);
  bottomIncome.textContent = format(income, acc.currency, acc.locale);
  const out = acc.movements
    .filter(function (movement) {
      return movement < 0;
    })
    .reduce(function (acc, movement) {
      return acc + movement;
    }, 0);
  bottomOut.textContent = format(Math.abs(out), acc.currency, acc.locale);
  const interest = acc.movements
    .filter(function (movement) {
      return movement >= 0;
    })
    .map(function (deposit) {
      return (deposit * acc.interestRate) / 100;
    })
    .filter(function (int) {
      //only interests above 1 are included
      return int >= 1;
    })
    .reduce(function (acc, deposit) {
      return acc + deposit;
    }, 0);
  bottomInterest.textContent = format(interest, acc.currency, acc.locale);
};
const updateUI = function (acc) {
  displayList(acc);
  calcPrintBalance(acc);
  calcBottom(acc);
};

const logoutTimer = function () {
  //set the time
  let time = 120;
  const tick = function () {
    {
      //convert minutes and secs
      const min = String(Math.trunc(time / 60)).padStart(2, 0);
      const sec = String(time % 60).padStart(2, 0);
      timer.textContent = `${min}:${sec}`;

      //logout user
      if (time === 0) {
        clearInterval(timerInterval);
        container.classList.add("opacity");
        loginMessage.textContent = "Log in to get started";
        inputs.style.opacity = "100";
      }
      //decrease one second
      time = time - 1;
    }
  };

  // call the timer  immediately then every one second
  tick();
  const timerInterval = setInterval(tick, 1000);
  return timerInterval;
};
let currentAccount, timerInterval; //we need the interval to not disappear

loginButton.addEventListener("click", function (event) {
  event.preventDefault(); //it's a form in html

  currentAccount = accounts.find(function (acc) {
    return acc.username === usernameInput.value;
  });
  if (
    // only happens if the acc exists
    currentAccount?.pin === Number(pinInput.value)
  ) {
    loginMessage.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
    container.classList.remove("opacity");
    inputs.style.opacity = "0";
    pinInput.value = usernameInput.value = "";
    credentials.style.display = "none";
    pinInput.blur();
    // if there's already a timer, clear it
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = logoutTimer();
    updateUI(currentAccount);

    setInterval(() => {
      const now = new Date();
      const options = {
        hour: "numeric",
        minute: "numeric",
        day: "numeric",
        month: "numeric",
        year: "numeric",
      };
      balanceDate.textContent = new Intl.DateTimeFormat(
        currentAccount.locale,
        options,
      ).format(now);
    }, 1000);
    //setInterval(fn, 1000) runs the function every 1000ms (1 second)
  }
});
transferButton.addEventListener("click", function (event) {
  event.preventDefault();

  const amount = Number(transferAmount.value);
  const receiverAcc = accounts.find(function (acc) {
    //looking for the account which has this value
    return acc.username === transferToInput.value;
  });
  if (event.key === "Enter") {
    preventDefault();
    transferToInput.blur();
    transferAmount.focus();
  }
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    //reset the timer
    clearInterval(timerInterval);
    timerInterval = logoutTimer();
  }
  transferToInput.value = transferAmount.value = "";
});
loanButton.addEventListener("click", function (event) {
  event.preventDefault();
  const amount = Math.floor(loanInput.value);
  //mov needs to be greater or equal to 10% of the amount
  if (
    amount > 0 &&
    currentAccount.movements.some(function (mov) {
      return mov >= amount * 0.1;
    })
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timerInterval);
      timerInterval = logoutTimer();
    }, 3000);
  }

  loanInput.value = "";
});
closeButton.addEventListener("click", function (event) {
  event.preventDefault();
  if (
    currentAccount.username === closeInput.value &&
    currentAccount.pin === Number(closePIN.value)
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });
    accounts.splice(index, 1);
    container.classList.add("opacity");
    loginMessage.textContent = "Log in to get started";
    inputs.style.opacity = "100";
  }
  closeInput.value = closePIN.value = "";
});
let sorted = false; // Start unsorted
sortBtn.forEach((button) =>
  button.addEventListener("click", function () {
    displayList(currentAccount, !sorted);
    sorted = !sorted; // Flip the flag for next click
  }),
);

const euroToUsd = 1.1;
// const movementsUsd = account1.movements.map(function(mov){
//   return mov * euroToUsd
// })
const movementsUsd = account1.movements.map((mov) => mov * euroToUsd);
console.log(movementsUsd);
