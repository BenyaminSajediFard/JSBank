'use strict';

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

function calcAccountsBalance(accounts) {
  return accounts
    .flatMap(acc => acc.movements)
    .reduce((acc, curr) => acc + curr, 0);
}

function sumUpTransactions(user) {
  return user.movements.reduce((acc, curr) => acc + curr, 0);
}

function sumUpDiff(user, condition) {
  return user.movements.filter(condition).reduce((acc, curr) => acc + curr, 0);
}

function sumUpInterest(user) {
  return user.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * user.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
}

function sortTransactions(user) {
  return [...user.movements].sort((a, b) => a - b);
}

function renderTransactions(transactionList) {
  transactions.innerHTML = '';
  transactionList.forEach((element, idx) => {
    let transactionType = element > 0 ? 'deposit' : 'withdrawal';
    transactions.insertAdjacentHTML(
      'afterbegin',
      `<div class="movements__row">
        <div class="movements__type movements__type--${transactionType}">${
        idx + 1
      } ${transactionType}</div>
        <div class="movements__date">${'date unknown'}</div>
        <div class="movements__value">$${element}</div>
      </div>`
    );
  });
}

function updateUI(user = activeUser) {
  const totalBalance = sumUpTransactions(user);
  const totalDeposits = sumUpDiff(user, tr => tr > 0);
  const totalWithdrawal = sumUpDiff(user, tr => tr < 0);
  const totalInterest = sumUpInterest(user);

  labelWelcome.textContent = `Welcome ${user.owner} 👋`;
  labelBalance.textContent = `$${totalBalance}`;
  labelSumIn.textContent = `$${totalDeposits}`;
  labelSumOut.textContent = `$${Math.abs(totalWithdrawal)}`;
  labelSumInterest.textContent = `$${totalInterest}`;

  renderTransactions(user.movements);
}

function findByUsername(username) {
  return accounts.find(el => createNickname(el.owner) === username);
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
