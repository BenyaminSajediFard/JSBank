'use strict';

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
