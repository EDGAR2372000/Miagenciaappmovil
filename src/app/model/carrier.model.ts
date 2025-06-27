import { User } from "./user.model";

export class Carrier 
{
    id: number;
    nameCompany: string;
    rucCompany: string;
   // dni: string;
   // fullName: string;
    phone: string;
    status: string;
    user: User;
    bankName?: string;
    accountNumber?: string;
    interbankCode?: string;
}