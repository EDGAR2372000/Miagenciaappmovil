import { Carrier } from "./carrier.model";
import { Client } from "./client.model";
import { Request } from 'src/app/model/request.model';

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
    requests: Request[];
    alreadyRequested?: boolean;
}