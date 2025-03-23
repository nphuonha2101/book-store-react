import React from "react";
import { HeroSlider } from "../../vendor/Carousel/HeroSlider";
import {BookCard} from "../../vendor/Book/BookCard.tsx";
import {Book} from "../../../types/ApiResponse/Book/book.ts";
import useFetch from "../../../hooks/useFetch.ts";
import {API_ENDPOINTS} from "../../../constants/apiInfo.ts";

export const Home: React.FC = () => {
    const { data: books, loading, error } = useFetch<Book[]>(API_ENDPOINTS.BOOK.GET_BOOKS.URL);

    return (
        <div className="w-full">
            <div className="w-full flex items-center justify-center">
                <HeroSlider />
                <BookCard items={books ?? []} />
            </div>
        </div>
    );
};