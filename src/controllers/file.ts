import { randomUUID } from 'node:crypto';
import { parse } from 'node:path';
import zod from 'zod';

import {
  readTransactionDB,
  readBalanceDB,
  writeTransactionDB,
  writeBalanceDB,
} from '../models/readwrite';
import { Balance, Transactions } from '../types';

export const createtransferSchema = zod.object({
  from: zod.number(),
  amount: zod.number().min(1000),
  to: zod.number(),
  transferDescription: zod.string().optional(),
});

export async function getAllBalance() {
  return readBalanceDB();
}

export async function getAlltranscaction() {
  return readTransactionDB();
}

const validSingleBal = zod.number().min(2).max(10);

export async function getSingleBalance(customerAcctNo: number) {
  customerAcctNo = validSingleBal.parse(customerAcctNo);
  let data = await readBalanceDB();
  return data.filter((acct) => acct.accountNo === customerAcctNo);
}

export async function createAccount(balance: number) {
  const createAccountschema = zod.number().min(1000);
  let arr = Array(10)
    .fill(3)
    .map((val) => Math.floor(Math.random() * 10));
  arr[0] = 3;
  const accNo = Number(arr.join(''));
  //parse
  const validBalance = createAccountschema.parse(balance);

  const account: Balance = {
    accountNo: accNo,
    balance: validBalance,
    createdAt: new Date(),
  };
  let newBalance = await readBalanceDB();
  newBalance.push(account);
  await writeBalanceDB(JSON.stringify(newBalance));
  return account.accountNo;
}


export async function createtransfer(newtransfer: Record<string, unknown>) {


  const validTransferData = createtransferSchema.parse(newtransfer);

  const transfer: Transactions = {
    ...validTransferData,
    reference: randomUUID(),
    createdAt: new Date(),
  };

  let balancesDB = await readBalanceDB();
  let transactionDB = await readTransactionDB();

  //checking for sender account if it exist
  const senderAccountExists = balancesDB.filter(
    (value) => value.accountNo === transfer.from,
  ).length;

  if (!senderAccountExists) {
    throw Error('sender account not found');
  }

  //checking for reciever account if it exist
  const receiverAccountExists = balancesDB.filter(
    (value) => value.accountNo === transfer.to,
  ).length;

  if (!receiverAccountExists) {
    throw Error('reciever account not found');
  }

  //checking for senderIndex
  const senderIndex = balancesDB.findIndex(
    (sender) => sender.accountNo === transfer.from,
  );

  //checking for recieverIndex
  const recieverIndex = balancesDB.findIndex(
    (reciever) => reciever.accountNo === transfer.to,
  );

  // redundant
  // if (recieverIndex === -1) {
  //   throw Error('recieverIndex not found');
  // }

  //check if balance is less than the input amount to withdraw
  if (balancesDB[senderIndex].balance < transfer.amount) {
    throw Error('insufficient funds');
  }

  // perform transfer
  balancesDB[senderIndex].balance -= transfer.amount;
  balancesDB[recieverIndex].balance += transfer.amount;

  // write to balances and transactions databases
  await writeBalanceDB(JSON.stringify(balancesDB));

  transactionDB.push(transfer);
  await writeTransactionDB(JSON.stringify(transactionDB));
  return true;
}

//check if the acount exist, both acounts

//let senderAcctNo = req.body.senderAcctNo
// let recieverAcctNo = req.body.receiverAccountNo
// let amountwithraw= req.body.amount
// let discription = req.body.transferDescription

// to make a transaction
//get the account but the reciever and the recipient
//check if the account exists
//if the account does not exist catch the error
