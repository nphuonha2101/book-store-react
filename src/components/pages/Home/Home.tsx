import React from "react";
import { HeroSlider } from "../../vendor/Carousel/HeroSlider";
import { BooksContainer } from "../../vendor/Book/BooksContainer.tsx";
import { Book } from "../../../types/ApiResponse/Book/book.ts";
import useFetch from "../../../hooks/useFetch.ts";
import { API_ENDPOINTS } from "../../../constants/ApiInfo.ts";

export const Home: React.FC = () => {
    const { data: books, loading } = useFetch<Book[]>(API_ENDPOINTS.BOOK.GET_BOOKS.URL);

    return (
        <div className="w-full">
            <div className="w-full flex items-center justify-center">
                <HeroSlider />
            </div>
            <BooksContainer items={books ?? []} loading={loading} />
        </div>
    );
};