import {Book} from "../../../types/ApiResponse/Book/book.ts";
import {BookCard} from "../Card/BookCard.tsx";

export const BooksContainer = ({
                                   items,
                                   loading,
                                   title = "Danh sách sách"
                               }: {
    items: Book[],
    loading: boolean,
    title?: string
}) => {
    return (
        <div className="container mx-auto px-4 py-6">
            {/* Title Section */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <div className="mt-2 h-1 w-24 bg-primary"></div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center flex-row space-x-4">
                        {items.map((book) => (
                            <div className="p-4" key={book.id}>
                                <BookCard book={book} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">Không có dữ liệu</div>
                )}
            </div>
        </div>
    );
};
