'use strict';

const account1 = {
  owner: 'Benyamin Sajedi Fard',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  loans: [1300, 450],
  interestRate: 1.2,
  pin: '1111',
  movementsDates: [
    '2019-12-01T13:15:33.035Z',
    '2021-08-30T09:48:16.867Z',
    '2021-11-16T06:04:23.907Z',
    '2022-02-25T14:18:46.235Z',
    '2022-05-05T16:33:06.386Z',
    '2022-07-10T14:43:26.374Z',
    '2023-01-25T18:49:59.371Z',
    '2023-02-14T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  loans: [3400],
  interestRate: 1.5,
  pin: '2222',
  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2022-02-23T07:42:02.383Z',
    '2022-02-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-06-08T14:11:59.604Z',
    '2022-06-27T17:01:17.194Z',
    '2022-10-11T23:36:17.929Z',
    '2023-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  loans: [200, 400],
  interestRate: 0.7,
  pin: '3333',
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2021-01-10T14:43:26.374Z',
    '2021-04-25T18:49:59.371Z',
    '2022-03-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Mark Klein',
  movements: [430, 1000, 700, 50, 90],
  loans: [],
  interestRate: 1,
  pin: '4444',
  movementsDates: [
    '2021-11-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-05-27T17:01:17.194Z',
    '2022-09-11T23:36:17.929Z',
    '2023-01-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE',
};
const accounts = [account1, account2, account3, account4];

// NECESSARY FOR USER ACTIONS
let activeUser,
  acceptanceRatio,
  timer = undefined;
let isAllowedToGetLoan = true;
let isSorted = false;

// DATE TIME
const now = new Date();
const currYear = now.getFullYear();
const currMonth = now.getMonth() + 1;
const currDay = now.getDate();
const currHour = now.getHours();
const currMinute = now.getMinutes();
const currSeconds = now.getSeconds();
