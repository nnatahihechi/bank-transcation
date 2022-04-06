import path from 'path'
 import fs from 'fs/promises'

import type {Transactions, Balance} from '../types'

const balancePath = path.join(__dirname, '../../data/balance.json')
const transactionPath = path.join(__dirname, '../../data/transaction.json')

export function readTransactionDB(): Promise<Transactions[]> {
return fs.readFile(transactionPath, 'utf8').then((file: string) => {
  return JSON.parse(file)
})
}

export function readBalanceDB():Promise<Balance[]>{
  return fs.readFile(balancePath, 'utf8').then((file: string) => {
    return JSON.parse(file)
  })
}

export function writeTransactionDB(file: string){
  return fs.writeFile(transactionPath, file)

}
export function writeBalanceDB(file: string){
  return fs.writeFile(balancePath, file)

}


