// import path from 'path'
//  import fs from 'fs'
import express from 'express';
import zod from 'zod';

import {
  getAllBalance,
  getAlltranscaction,
  getSingleBalance,
  createAccount,
  createtransfer,
} from '../controllers/file';
const router = express.Router();

//post: create the account
router.post('/createAccount', async function (req, res) {
  const createdfile = req.body.balance;
  try {
    const newAccount = createAccount(createdfile);
    res.status(200).json(await newAccount);
  } catch (err) {
    if (err instanceof zod.ZodError) {
      res.status(404).json({ error: err.flatten() });
    }
  }
});

//get: get Single Balance
router.get('/balance/:accountNumber', async function (req, res) {
  const customerAcctNo = +req.params.accountNumber;
  const balanceFile = await getSingleBalance(customerAcctNo);
  balanceFile.length
    ? res.status(200).json({ balanceFile })
    : res.status(404).json({ msg: 'invalid account number' });
});

//get: get all balances
router.get('/balance', async function (req, res) {
  const file = await getAllBalance();
  res.status(200).json({ file });
});

//post: perform transfer transcation
router.post('/transfer', async (req, res) => {
  let transferBody = req.body;

  try {
    const x = await createtransfer(transferBody);
    res.status(200).json({ msg: 'Transfer' });
  } catch (err) {
    if (err instanceof zod.ZodError) {
      res.status(404).json({ error: err.flatten() });

      return;
    }

    if (err instanceof Error) {
      res.status(404).json({ msg: err.message });
    }
  }
});

export default router;

