import { Book } from "../Book/book";

export interface RibbonItem {
    id?: number;
    ribbonId?: number;
    book?: Book;
}