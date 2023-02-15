'use strict';

// SWITCH TO LOGIN
btnSwitchMode.addEventListener('click', function () {
  registrationMode.classList.add('hidden');
  signMode.classList.remove('hidden');
});

// REGISTER
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

// LOGIN
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
    updateUI();
    startTimerCountDown();
  } else showMessage('⛔ Wrong entries', "You've entered wrong user or wrong pin.", 3);
});

// LOGOUT
btnLogout.addEventListener('click', function () {
  showMessage('🚶 Logged out successfully', 'You were logged out of panel.', 2);
  logoutAction(timer);
});

// TRANSFER ACTION
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
    const recipient = findByUsername(destinationAcc);
    if (recipient) {
      creditTransfer(activeUser, recipient, transferAmount);
      updateUI(activeUser);
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

// REQUEST ACTION
btnRequest.addEventListener('click', function (e) {
  e.preventDefault();
  const requestFrom = inputRequestFrom.value;
  const requestAmount = Number(inputRequestAmount.value);
  const contact = findByUsername(requestFrom);
  const clearInputs = () => {
    inputRequestFrom.value = '';
    inputRequestAmount.value = '';
  };

  if (contact && contact != activeUser && requestAmount >= 10) {
    const userAcceptance = genRandNum(2);
    const contactBalance = sumUpTransactions(contact);
    if (userAcceptance == 1) {
      if (contactBalance - 10 >= requestAmount) {
        showMessage(
          '👍 Request accepted!',
          `Your request was sent and ${contact.owner} accepted your request.<br/>They will transfer the credits eventually.`,
          3
        );
        clearInputs();
        const timeToDeliver = genRandNum(60);
        setTimeout(() => {
          creditTransfer(contact, activeUser, requestAmount);
          updateUI(activeUser);
          showMessage(
            '🥳 Hooray!',
            `User ${contact.owner} has transferred $${requestAmount} to your account.`,
            5
          );
        }, timeToDeliver * 1000);
      } else {
        showMessage(
          '⛔ There is a problem!',
          `${contact.owner} received your transfer request and has accepted it,<br/>but due to their lack of credits the transaction was cancelled.`,
          5
        );
        clearInputs();
      }
    } else
      showMessage(
        '💔 Request was denied!',
        `${contact.owner} denied your credit transfer request from their account.<br/>You can contact them and ask for permission or try again later...`,
        3
      );
  } else {
    showMessage(
      '🚫 Invalid request entries!',
      `Either ${requestFrom} was not found or request amount is less than 10.<br/>Try again with correct entries...`,
      3
    );
    clearInputs();
  }
});

// LOAN ACTION
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanRequestAmount = Number(inputLoanAmount.value);
  const allowedLoanAmount = sumUpDiff(activeUser, tr => tr > 0) * 1.25;
  const permittedAmount = activeUser.loans.reduce(
    (acc, curr) => acc - curr,
    allowedLoanAmount
  );
  if (isAllowedToGetLoan) {
    if (loanRequestAmount <= permittedAmount) {
      const timeToDeliver = genRandNum(10);
      inputLoanAmount.value = '';
      showMessage(
        '🎉 Congratulations!',
        'Your loan request was accepted.<br/>The requested amount will be transferred to your account in due time...',
        2
      );
      isAllowedToGetLoan = false;
      setTimeout(() => {
        setTimeout(() => {
          isAllowedToGetLoan = true;
        }, 60 * 1000);
        activeUser.movements.push(loanRequestAmount);
        activeUser.loans.push(loanRequestAmount);
        updateUI(activeUser);
      }, timeToDeliver * 1000);
    } else {
      showMessage(
        '📈 Loan quota exceeded!',
        'The amount you requested is more than the allowed percentage,<br/>which is calculated considering your total deposits.',
        3
      );
      inputLoanAmount.value = '';
    }
  } else {
    showMessage(
      '⏰ Loan timeout not reached!',
      'You have recently received a loan from bank.<br>You should wait for your turn in nearly 6 months from now...',
      4
    );
  }
});

// SORT
btnSort.addEventListener('click', function () {
  if (!isSorted) {
    const sorted = sortTransactions(activeUser);
    renderTransactions(sorted);
    btnSort.classList.add('sorted');
    isSorted = true;
  } else {
    renderTransactions(activeUser.movements);
    btnSort.classList.remove('sorted');
    isSorted = false;
  }
});
