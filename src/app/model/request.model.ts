import { Carrier } from "./carrier.model";
import { LoadRequest } from "./load-requests.model";

export class Request 
{
    id: number;
    suggestedPrice: number;
    status: string;
    datetime: Date;
    carrier: Carrier;
    loadRequest: LoadRequest;
    paid: boolean;
    urlPdfContract?: string;
}