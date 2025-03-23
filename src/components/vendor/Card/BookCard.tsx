import { ShoppingCart } from "lucide-react";
import { Button } from "../../../shadcn-components/ui/button";
import { Book } from "../../../types/ApiResponse/Book/book";
import { formatPrice } from "../../../utils/numberUtils";

export const BookCard = ({ book }: { book: Book }) => {
    return (
        <div className="group">
            <div className="relative aspect-[3/4] overflow-hidden rounded-md">
                <img
                    src={book.coverImage}
                    alt={book.title}
                    className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105 group-hover:brightness-90 group-hover:blur-sm"
                />
                <div className="absolute inset-0 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <Button className="w-full flex items-center gap-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                        <ShoppingCart className="h-4 w-4" />
                        Thêm vào giỏ hàng
                    </Button>
                </div>
            </div>
            <div className="p-2">
                <p className="text-sm text-muted-foreground mt-2">{book.authorName}</p>
                <h3 className="font-medium hover:text-primary transition-colors mt-1 line-clamp-2">
                    <a href={`/books/${book.id}`}>{book.title}</a>
                </h3>
                <p className="font-semibold text-foreground mt-1">{formatPrice(book.price ? book.price : 0)}</p>
            </div>
        </div>
    )
}