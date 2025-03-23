import { Link } from "react-router-dom";
import { Book } from "../../../types/ApiResponse/Book/book.ts";

export const BookCardItem = ({ book }: { book: Book }) => {
    return (
        <div className="w-72 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            {/* Book Cover */}
            <div className="relative h-52">
                <img
                    src={book.coverImage}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Book Info */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-blue-900 text-center">
                    <Link to={`/book/${book.id}`} className="hover:text-orange-400">
                        {book.title}
                    </Link>
                </h3>

                {/* Author */}
                <p className="text-lg text-gray-800 text-center mt-1">{book.authorName}</p>

                {/* Category */}
                <p className="text-xs text-gray-500 text-center italic mt-1">{book.category?.name}</p>

                {/* Price */}
                <p className="text-lg font-bold text-red-600 text-center mt-2">
                    {book.price ? `$${book.price.toFixed(2)}` : "Liên hệ"}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                    <button className="flex-1 py-2 transition-colors text-sm font-medium">
                        Thêm vào giỏ
                    </button>
                    <Link to={`/book/${book.id}`} className="flex-1 bg-green-500 py-2 rounded-lg text-center hover:bg-green-600 transition-colors text-sm font-medium">
                        Mua ngay
                    </Link>
                </div>

                {/* View Details Button */}
                <Link
                    to={`/book/${book.id}`}
                    className="block w-full mt-3 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    Xem chi tiết
                </Link>
            </div>

            {/* Add to List Button */}
            <button
                onClick={() => console.log("Click")}
                className="absolute top-3 right-3 bg-green-300 text-blue-600 rounded-full p-2 shadow-md hover:bg-blue-600 hover:text-white transition-colors"
            >
                <span className="text-lg font-bold">+</span>
            </button>
        </div>
    );
};
