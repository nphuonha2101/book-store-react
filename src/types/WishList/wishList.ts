import {Book} from "../ApiResponse/Book/book.ts";

export interface WishList {
    id ?: number;
    userId ?: number;
    book ?: Book;
}