import { Carrier } from "./carrier.model";
import { Client } from "./client.model";

export class LoadRequest 
{
    id: number;
    origin: string;
    destination: string;
    loadDetails: string;
    weight: string;
    operation: string;
    tariff: number;
    datetime: Date;
    status: string;
    client: Client;
    carrier: Carrier;
}