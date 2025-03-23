import { BookCardItem } from "./BookCardItem";
import {Book} from "../../../types/ApiResponse/Book/book.ts";

export const BookCard = ({ items }: { items: Book[] }) => {
    return (
        <div>
            {items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((book) => (
                        <BookCardItem key={book.id} book={book} />
                    ))}
                </div>
            ) : (
                <div>Không có dữ liệu</div>
            )}
        </div>
    );
};
