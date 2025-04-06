export interface Voucher {
    id?: number;
    thumbnail?: string;
    code?: string;
    discount?: number;
    minSpend?: number;
    expiredDate?: string;
}