import {BookImage} from "./bookImage.ts";
import {Category} from "../Category/category.ts";

export interface Book {
    id: number;
    title ?: string;
    authorName ?: string;
    description ?: string;
    isbn ?: string;
    coverImage ?: string;
    images ?: BookImage[];
    price ?: number;
    quantity ?: number;
    available ?: boolean;
    publishedAt ?: string;
    category ?: Category;

}