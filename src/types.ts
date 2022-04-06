export interface Transactions {
    reference:string
    from:number
    amount:number
    to:number
    transferDescription?:string
    createdAt: Date
}

export interface Balance{
  accountNo:number
  balance:number
  createdAt:Date
}
