import {Book} from "../Book/book.ts";

export interface CartItem {
    id ?: number;
    userId ?: number;
    book ?: Book;
    quantity ?: number;
    price ?: number;
    bookId ?: number;

}