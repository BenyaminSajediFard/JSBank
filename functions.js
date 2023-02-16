'use strict';

function showMessage(title, msg, duration) {
  messageBoard.classList.toggle('hidden');
  messageBoard.style.zIndex = 999;
  setTimeout(() => messageBoard.classList.toggle('hidden'), duration * 1000);
  labelMessageTitle.textContent = title;
  labelMessageContent.innerHTML = msg;
}

const genRandNum = threshold => Math.floor(Math.random() * threshold) + 1;

const submitDate = (date = new Date()) => date.toISOString();

const createNickname = fullName =>
  fullName
    .split(' ')
    .reduce((acc, curr) => acc + curr[0], '')
    .toLowerCase();

function createUser(username, pin) {
  const newUser = {
    owner: username,
    movements: [100],
    movementsDates: [submitDate()],
    locale: 'en-US',
    interestRate: 1,
    pin,
  };
  accounts.push(newUser);
  showMessage(
    'Success!',
    `Your account was created with Username: <strong>${createNickname(
      newUser.owner
    ).toUpperCase()}</strong> <br/>Now you can use this shorthanded name to login to your panel 🏡`,
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

const checkForExistingUser = username =>
  accounts.some(acc => createNickname(acc.owner) === createNickname(username));

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

const calcAccountsBalance = accounts =>
  accounts.flatMap(acc => acc.movements).reduce((acc, curr) => acc + curr, 0);

const sumUpTransactions = user =>
  user.movements.reduce((acc, curr) => acc + curr, 0);

const sumUpDiff = (user, condition) =>
  user.movements.filter(condition).reduce((acc, curr) => acc + curr, 0);

function sumUpInterest(user) {
  return user.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * user.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
}

const sortTransactions = user => [...user.movements].sort((a, b) => a - b);

function renderDate(year, month, day) {
  if (year === currYear && month === currMonth && currDay - day < 7) {
    switch (currDay - day) {
      case 0:
        return 'less than a day';
      case 1:
        return 'yesterday';
      case 2:
        return 'two days ago';
      case 3:
        return 'three days ago';
      case 4:
        return 'four days ago';
      case 5:
        return 'five days ago';
      case 6:
        return 'six days ago';
      case 7:
        return 'a week ago';
    }
  } else return `${currDay}/${currMonth}/${currYear}`;
}

function renderTransactions(mov) {
  transactions.innerHTML = '';
  mov.forEach((element, idx) => {
    const transactionDate = new Date(activeUser.movementsDates[idx]);
    const transYear = transactionDate.getFullYear();
    const transMonth = transactionDate.getMonth() + 1;
    const transDay = transactionDate.getDate();
    const shownDate = renderDate(transYear, transMonth, transDay);
    let transactionType = element > 0 ? 'deposit' : 'withdrawal';
    transactions.insertAdjacentHTML(
      'afterbegin',
      `<div class="movements__row ${idx % 2 === 0 ? 'odd-movement' : ''}">
        <div class="movements__type movements__type--${transactionType}">${
        activeUser.movements.indexOf(element) + 1
      } ${transactionType}</div>
        <div class="movements__date">${shownDate}</div>
        <div class="movements__value">$${element.toFixed(2)}</div>
      </div>`
    );
  });
}

function renderWelcome(username) {
  if (5 < currHour < 11) return `Good morning, ${username}! 🌇`;
  else if (11 <= currHour <= 14) return `Good afternoon, ${username}! 🌞`;
  else if (14 < currHour <= 20) return `Hey ${username}, good evening! 🌆`;
  else if (20 < currHour <= 0) return `Have a good night, ${username}! 🌃`;
  else return `Hey there night owl 🦉`;
}

function updateUI(user = activeUser) {
  const totalBalance = sumUpTransactions(user);
  const totalDeposits = sumUpDiff(user, tr => tr > 0);
  const totalWithdrawal = sumUpDiff(user, tr => tr < 0);
  const totalInterest = sumUpInterest(user);

  labelWelcome.textContent = renderWelcome(user.owner);
  labelDate.textContent = `${currDay}/${currMonth}/${currYear}`;
  labelBalance.textContent = `$${totalBalance.toFixed(2)}`;
  labelSumIn.textContent = `$${totalDeposits.toFixed(2)}`;
  labelSumOut.textContent = `$${Math.abs(totalWithdrawal).toFixed(2)}`;
  labelSumInterest.textContent = `$${totalInterest.toFixed(2)}`;

  renderTransactions(user.movements);
}

const findByUsername = username =>
  accounts.find(el => createNickname(el.owner) === username);

function creditTransfer(user, recipient, amount) {
  user.movements.push(-amount);
  user.movementsDates.push(submitDate());
  recipient.movements.push(amount);
  recipient.movementsDates.push(submitDate());
}

function logoutAction(timer) {
  signMode.classList.remove('hidden');
  containerApp.classList.add('hidden');
  clearInterval(timer);
  activeUser = undefined;
}
