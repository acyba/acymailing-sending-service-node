import {Cname} from "./info";

export interface ApiResponse {
    message: string;
}

export interface ApiResponseDomain extends ApiResponse {
    cnameRecords?: Cname[],
    status?: string
}
