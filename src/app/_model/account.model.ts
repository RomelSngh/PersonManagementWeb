import { accountStatus } from "./accountStatus.model"

export interface account {
    code:number
    personCode:number
    accountNumber:string
    outstandingBalance:number  
    statusId:number 
}

export interface accountWithStatus {
    code:number
    personCode:number
    accountNumber:string
    outstandingBalance:number
    statusId:number  
    statusName:string 
}