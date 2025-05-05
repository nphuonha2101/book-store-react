import {User} from "../User/user.ts";

export interface Review {
    id ?: number;
    bookId ?: number;
    userId ?: User;
    rating ?: number;
    comment ?: string;
}