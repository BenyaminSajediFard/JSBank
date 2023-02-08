'use strict';

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Benyamin Sajedi Fard',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  loans: [1300, 450],
  interestRate: 1.2,
  pin: '1111',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  loans: [3400],
  interestRate: 1.5,
  pin: '2222',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  loans: [200, 400],
  interestRate: 0.7,
  pin: '3333',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  loans: [],
  interestRate: 1,
  pin: '4444',
};

const accounts = [account1, account2, account3, account4];
let activeUser = undefined;
let timer = undefined;

// Elements
const labelWelcome = document.querySelector('.app-welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelMessageTitle = document.querySelector('.message-board--header');
const labelMessageContent = document.querySelector('.message-board--content');

const registrationMode = document.querySelector('.registration');
const signMode = document.querySelector('.navbar');
const messageBoard = document.querySelector('.message-board');
const containerApp = document.querySelector('.app');
const transactions = document.querySelector('.movements');

const btnSwitchMode = document.querySelector('.signin-switch');
const btnRegister = document.querySelector('.register__btn');
const btnLogin = document.querySelector('.login__btn');
const btnLogout = document.querySelector('.btn__logout');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnRequest = document.querySelector('.form__btn--req');
const btnLoan = document.querySelector('.form__btn--loan');
const btnSort = document.querySelector('.btn--sort');

const inputRegisterUsername = document.querySelector('.register--user');
const inputRegisterPin = document.querySelector('.register--pin');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputRequestFrom = document.querySelector('.request--from');
const inputRequestAmount = document.querySelector('.request--amount');

/////////////////////////////////////////////////
// Functions
function showMessage(title, msg, duration) {
  messageBoard.classList.toggle('hidden');
  messageBoard.style.zIndex = 999;
  setTimeout(() => messageBoard.classList.toggle('hidden'), duration * 1000);
  labelMessageTitle.textContent = title;
  labelMessageContent.innerHTML = msg;
}

function genRandNum(threshold) {
  return Math.floor(Math.random() * threshold) + 1;
}

function createNickname(fullName) {
  return fullName
    .split(' ')
    .reduce((acc, curr) => acc + curr[0], '')
    .toLowerCase();
}

function createUser(username, pin) {
  const newUser = {
    owner: username,
    movements: [100],
    interestRate: 1,
    pin,
  };
  accounts.push(newUser);
  showMessage(
    'Success!',
    `Your account was created with Username: <strong>${createNickname(
      newUser.owner
    ).toUpperCase()}</strong> <br/>Now you can use this short handed name to login to your panel 🏡`,
    8
  );
  return newUser;
}

function checkUserSignIn(username, pin) {
  accounts.forEach(function (account) {
    if (
      createNickname(account.owner) === username.toLowerCase() &&
      account.pin === pin
    )
      activeUser = account;
    else return false;
  });
}

function checkForExistingUser(username) {
  accounts.forEach(acc => {
    if (acc.owner.toLocaleLowerCase() === username) {
      showMessage(
        '🔴 User already exists!',
        'An account with the same owner was found.<br/>Either sign-in to your account or use another username',
        3
      );
    } else return true;
  });
}

function startTimerCountDown() {
  let minutes = 5;
  let seconds = 0;
  timer = setInterval(() => {
    seconds--;
    if (minutes === 0 && seconds === 0) {
      showMessage(
        '⏰ Timeout reached',
        'Access timeout for your account login reached.<br/>If you need more time, please sign-in again...',
        3
      );
      logoutAction(timer);
    }
    if (seconds < 0) {
      minutes--;
      seconds = 59;
    }
    if (seconds >= 10) labelTimer.textContent = `0${minutes}:${seconds}`;
    else labelTimer.textContent = `0${minutes}:0${seconds}`;
  }, 1000);
}

function sumUpTransactions(user) {
  return user.movements.reduce((acc, curr) => acc + curr, 0);
}

function sumUpDiff(user, condition) {
  return user.movements.filter(condition).reduce((acc, curr) => acc + curr, 0);
}

function sumUpInterest(user) {
  const totalDeposit = sumUpDiff(user, tr => tr > 0);
  return totalDeposit * user.interestRate - totalDeposit;
}

function renderUserData(user = activeUser) {
  const totalBalance = sumUpTransactions(user);
  const totalDeposits = sumUpDiff(user, tr => tr > 0);
  const totalWithdrawal = sumUpDiff(user, tr => tr < 0);
  const totalInterest = sumUpInterest(user);

  labelWelcome.textContent = `Welcome ${user.owner} 👋`;
  labelBalance.textContent = `$${totalBalance}`;
  labelSumIn.textContent = `$${totalDeposits}`;
  labelSumOut.textContent = `$${Math.abs(totalWithdrawal)}`;
  labelSumInterest.textContent = `$${totalInterest}`;

  transactions.innerHTML = '';
  user.movements.forEach((element, idx) => {
    let transType = element > 0 ? 'deposit' : 'withdrawal';
    transactions.insertAdjacentHTML(
      'afterbegin',
      `<div class="movements__row">
        <div class="movements__type movements__type--${transType}">${
        idx + 1
      } ${transType}</div>
        <div class="movements__date">${'date unknown'}</div>
        <div class="movements__value">$${Math.abs(element)}</div>
      </div>`
    );
  });
}

function findByUsername(username) {
  return accounts.filter(el => createNickname(el.owner) === username);
}

function creditTransfer(user, recipient, amount) {
  user.movements.push(-amount);
  recipient.movements.push(amount);
}

function logoutAction(timer) {
  signMode.classList.remove('hidden');
  containerApp.classList.add('hidden');
  clearInterval(timer);
  activeUser = undefined;
}

/////////////////////////////////////////////////
// Event Handlers
btnSwitchMode.addEventListener('click', function () {
  registrationMode.classList.add('hidden');
  signMode.classList.remove('hidden');
});

btnRegister.addEventListener('click', function (e) {
  e.preventDefault();
  let username = inputRegisterUsername.value.toLowerCase();
  let pin = inputRegisterPin.value;
  if (username && pin && pin.length >= 4) {
    if (checkForExistingUser(username)) {
      createUser(username, pin);
      registrationMode.classList.add('hidden');
      signMode.classList.remove('hidden');
    }
  } else showMessage('Wrong inputs', 'Name or Pin is empty or Pin length is less than 4.', 3);
});

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const usernameInput = inputLoginUsername.value;
  const pinInput = inputLoginPin.value;
  checkUserSignIn(usernameInput, pinInput);
  if (activeUser) {
    signMode.classList.add('hidden');
    containerApp.classList.remove('hidden');
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    renderUserData();
    startTimerCountDown();
  } else showMessage('⛔ Wrong entries', "Hey, You've entered wrong user or wrong pin.", 3);
});

btnLogout.addEventListener('click', function () {
  showMessage(
    '🚶 Logged out successfully',
    'You were logged out of panel.<br/>Returning to log in page',
    2
  );
  logoutAction(timer);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const destinationAcc = inputTransferTo.value;
  const transferAmount = Number(inputTransferAmount.value);
  const clearInputs = () => {
    inputTransferAmount.value = '';
    inputTransferTo.value = '';
  };
  if (transferAmount <= 0) {
    showMessage(
      'Invalid transfer value',
      'Entered transfer value should be more than zero.',
      3
    );
    clearInputs();
  } else if (sumUpTransactions(activeUser) - 10 < transferAmount) {
    showMessage(
      '💸 Transfer value exceeded the credit',
      'The amount you are trying to transfer exceeds your accounts credit',
      3
    );
  } else {
    const recipient = findByUsername(destinationAcc).at(0);
    if (recipient) {
      creditTransfer(activeUser, recipient, transferAmount);
      renderUserData(activeUser);
      clearInputs();
    } else {
      showMessage(
        '🙅 No such user!',
        'Specified user could not be found on system',
        3
      );
    }
  }
});

btnRequest.addEventListener('click', function (e) {
  e.preventDefault();
  const requestFrom = inputRequestFrom.value;
  const requestAmount = Number(inputRequestAmount.value);
  const contact = findByUsername(requestFrom).at(0);
  if (contact && requestAmount >= 10) {
    const userAcceptance = genRandNum(2);
    const contactBalance = sumUpTransactions(contact);
    console.log(contactBalance);
    if (userAcceptance == 1) {
      if (contactBalance - 10 >= requestAmount) {
        showMessage(
          '👍 Request accepted!',
          `Your request was sent and ${contact.owner} accepted your request.<br/>They will transfer the credits eventually.`,
          3
        );
        const timeToDeliver = genRandNum(60);
        setTimeout(() => {
          creditTransfer(contact, activeUser, requestAmount);
          renderUserData(activeUser);
          showMessage(
            '🥳 Hooray!',
            `User ${contact.owner} has transferred $${requestAmount} to your account.`,
            5
          );
        }, timeToDeliver * 1000);
      } else
        showMessage(
          '⛔ There is a problem!',
          `${contact.owner} received your transfer request and has accepted it,<br/>but due to their lack of credits the transaction was cancelled.`,
          5
        );
    } else
      showMessage(
        '💔 Request was denied!',
        `${contact.owner} denied your credit transfer request from their account.<br/>You can contact them and ask for permission or try again later...`,
        5
      );
  } else showMessage('🚫 Invalid request entries!', `Either ${requestFrom} was not found or request amount is less than 10.<br/>Try again with correct entries...`, 3);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanRequestAmount = Number(inputLoanAmount.value);
  const allowedLoanAmount = sumUpDiff(activeUser, tr => tr > 0) * 1.25;
  const permittedAmount = activeUser.loans.reduce(
    (acc, curr) => acc - curr,
    allowedLoanAmount
  );
  if (loanRequestAmount <= permittedAmount) {
    const timeToDeliver = genRandNum(10);
    inputLoanAmount.value = '';
    showMessage(
      '🎉 Congratulations!',
      'Your loan request was accepted.<br/>The requested amount will be transferred to your account in due time...',
      2
    );
    setTimeout(function () {
      activeUser.movements.push(loanRequestAmount);
      activeUser.loans.push(loanRequestAmount);
      renderUserData(activeUser);
    }, timeToDeliver * 1000);
  } else {
    showMessage(
      '📈 Loan quota exceeded!',
      'The amount you requested is more than the allowed percentage,<br/>which is calculated considering your total deposits.',
      3
    );
    inputLoanAmount.value = '';
  }
});

/////////////////////////////////////////////////
