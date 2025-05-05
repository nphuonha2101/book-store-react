import {Book} from "../Book/book.ts";

export interface OrderItem {
    id: number;
    orderId: number;
    book: Book;
    quantity: number;
    price: number;
}