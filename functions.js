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

const dateTwoDigitsFormat = date => date.toString().padStart(2, 0);

const intlDate = (
  specDate,
  {
    year = 'numeric',
    month = 'long',
    day = 'numeric',
    hour = undefined,
    minute = undefined,
  }
) =>
  new Intl.DateTimeFormat(activeUser.locale, {
    year,
    month,
    day,
    hour,
    minute,
  }).format(specDate);

const intlCurrency = value =>
  new Intl.NumberFormat(activeUser.locale, {
    style: 'currency',
    currency: activeUser.locale === 'en-US' ? 'USD' : 'EUR',
    useGrouping: true,
  }).format(value);

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
    locale: navigator.language,
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
    if (seconds >= 10)
      labelTimer.textContent = `${dateTwoDigitsFormat(minutes)}:${seconds}`;
    else
      labelTimer.textContent = `${dateTwoDigitsFormat(
        minutes
      )}:${dateTwoDigitsFormat(seconds)}`;
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
  const daysDiff = currDay - day;
  if (year === currYear && month === currMonth && daysDiff < 7) {
    switch (daysDiff) {
      case 0:
        return 'today';
      case 1:
        return 'yesterday';
      case 2:
        return `${daysDiff} days ago`;
      case 3:
        return `${daysDiff} days ago`;
      case 4:
        return `${daysDiff} days ago`;
      case 5:
        return `${daysDiff} days ago`;
      case 6:
        return `${daysDiff} days ago`;
      case 7:
        return `a week ago`;
    }
  } else return false;
}

function renderTransactions(mov) {
  transactions.innerHTML = '';
  mov.forEach((element, idx) => {
    const trDate = new Date(
      activeUser.movementsDates[activeUser.movements.indexOf(element)]
    );
    const shownDate =
      renderDate(
        trDate.getFullYear(),
        trDate.getMonth() + 1,
        trDate.getDate()
      ) ||
      intlDate(trDate, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
    let transactionType = element > 0 ? 'deposit' : 'withdrawal';
    transactions.insertAdjacentHTML(
      'afterbegin',
      `<div class="movements__row ${idx % 2 === 0 ? 'odd-movement' : ''}">
        <div class="movements__type movements__type--${transactionType}">${
        activeUser.movements.indexOf(element) + 1
      } ${transactionType}</div>
        <div class="movements__date">${shownDate}</div>
        <div class="movements__value">${intlCurrency(element)}</div>
      </div>`
    );
  });
}

function renderWelcome(username) {
  if (5 < currHour && 11 >= currHour) return `Good morning, ${username}! 🌇`;
  else if (11 < currHour && 15 >= currHour)
    return `Good afternoon, ${username}! 🌞`;
  else if (15 < currHour && 20 >= currHour)
    return `Hey ${username}, good evening! 🌆`;
  else if (20 < currHour) return `Have a good night, ${username}! 🌃`;
  return `Hey there, night owl! 🦉`;
}

function updateUI(user = activeUser) {
  const totalBalance = intlCurrency(sumUpTransactions(user));
  const totalDeposits = intlCurrency(sumUpDiff(user, tr => tr > 0));
  console.log(sumUpDiff(user, tr => tr < 0));
  const totalWithdrawal = intlCurrency(Math.abs(sumUpDiff(user, tr => tr < 0)));
  const totalInterest = intlCurrency(sumUpInterest(user));

  // Display account heading (welcome, date and total balance)
  labelWelcome.textContent = renderWelcome(user.owner);
  labelDate.textContent = intlDate(now, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
  labelBalance.textContent = `${totalBalance}`;

  // Display Transactions
  renderTransactions(user.movements);

  // Display account summary
  labelSumIn.textContent = `${totalDeposits}`;
  labelSumOut.textContent = `${totalWithdrawal}`;
  labelSumInterest.textContent = `${totalInterest}`;
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
