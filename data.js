'use strict';

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
let isAllowedToGetLoan = true;
let isSorted = false;
let timer = undefined;
