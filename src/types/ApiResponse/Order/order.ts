import {User} from "../User/user.ts";
import {Voucher} from "../Voucher/voucher.ts";
import {Address} from "../Address/Address.ts";
import {OrderItem} from "./orderItem.ts";

export interface Order {
    id: number;
    user: User;
    voucher: Voucher;
    address: Address;
    phone: string;
    note: string;
    status: string;
    totalAmount: number;
    totalDiscount: number;
    orderItems: OrderItem[];
    paymentMethod: number;
    cancellationReason: string;
    createdAt: string; // ISO 8601 format
    shippingFee: number;
}