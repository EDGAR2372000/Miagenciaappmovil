import { User } from "./user.model";

export class Client 
{
    id: number;
    dni: string;
    fullName: string;
    phone: string;
    user: User;
}