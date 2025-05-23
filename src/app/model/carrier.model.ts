import { User } from "./user.model";

export class Carrier 
{
    id: number;
    dni: string;
    fullName: string;
    phone: string;
    licensePlate: string;
    driverLicense: string;
    status: string;
    user: User;
}