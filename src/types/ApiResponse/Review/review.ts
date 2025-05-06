import {User} from "../User/user.ts";
import {Book} from "../Book/book.ts";

export interface Review {
    id ?: number;
    user ?: User;
    book ?: Book;
    rating ?: number;
    comment ?: string;
    createdAt ?: string;
}