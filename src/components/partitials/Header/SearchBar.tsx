import { ArrowLeft, Search, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState, useRef, useMemo } from "react";
import useFetchPost from "../../../hooks/useFetchPost";
import { getArray, saveArray } from "../../../utils/localStorageUtils";
import { API_ENDPOINTS } from "../../../constants/apiInfo";
import { Book } from "../../../types/ApiResponse/Book/book";
import { DEFAULT } from "../../../constants/default";
import useFetch from "../../../hooks/useFetch";
import { Button } from "../../../shadcn-components/ui/button";
import { Link } from "react-router-dom";

export default function SearchBar({ setIsSearchOpen }: { setIsSearchOpen: Dispatch<SetStateAction<boolean>> }) {
    const [searchTermsHistory, setSearchTermsHistory] = useState<string[]>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const storageHistory = getArray("searchTermsHistory");
        if (!storageHistory) {
            saveArray("searchTermsHistory", []);
        }
        setSearchTermsHistory(storageHistory || []);
    }, []);

    // Tạo object ổn định
    const requestBody = useMemo(() => ({ terms: searchTermsHistory }), [searchTermsHistory]);

    const { data: suggestions } = useFetchPost<{ terms: string[] }, Book[]>(
        API_ENDPOINTS.BOOK.SUGGESTIONS.URL,
        requestBody,
        { autoFetch: searchTermsHistory.length > 0 }
    );

    const fetchOptions = useMemo(() => ({ params: { term: searchTerm, size: 4 } }), [searchTerm]);

    const { data: searchResults } = useFetch<Book[]>(
        API_ENDPOINTS.BOOK.SEARCH.URL,
        fetchOptions
    );

    const clearSearchInput = () => {
        if (searchInputRef.current) {
            searchInputRef.current.value = "";
        }
        setSearchTerm("");
    };

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-fade-in">
            <div className="border-b border-border p-4">
                <div className="flex items-center max-w-3xl mx-auto w-full">
                    <button
                        onClick={() => setIsSearchOpen(false)}
                        className="p-2 text-muted-foreground hover:text-primary rounded-full hover:bg-muted mr-2 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>

                    <div className="flex-1 flex items-center border border-input rounded-full px-4 py-2 mx-2 focus-within:ring-2 focus-within:ring-ring focus-within:border-input transition-all">
                        <Search className="w-5 h-5 text-muted-foreground mr-2" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="flex-1 outline-none bg-transparent text-foreground"
                            autoFocus
                            ref={searchInputRef}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="text-muted-foreground hover:text-foreground transition-colors" onClick={clearSearchInput}>
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto w-full p-4">
                    {searchTerm === "" ? (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-foreground mb-4">Có thể bạn quan tâm</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {suggestions && suggestions.length > 0 ? suggestions.map((book) => (
                                    <div key={book.id} className="group relative bg-background border border-border rounded-lg overflow-hidden hover:shadow-md transition-all">
                                        <div className="aspect-w-1 aspect-h-1 bg-muted">
                                            <img
                                                src={book.coverImage || DEFAULT.IMAGE}
                                                alt={book.title}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                                                {book.title || "Sách chưa có tiêu đề"}
                                            </h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                                {book.description || "Mô tả sách"}
                                            </p>
                                            <p className="text-sm font-bold text-primary">
                                                {book.price ? `${book.price} ₫` : "Liên hệ"}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-4 text-center py-8">
                                        <p className="text-muted-foreground">Không có sản phẩm nào</p>
                                    </div>
                                )}
                            </div>
                            {suggestions && suggestions.length > 0 && (
                                <div className="mt-6 text-center">
                                    <button className="bg-transparent border border-input hover:bg-muted text-foreground py-2 px-4 rounded-md text-sm font-medium transition-colors">
                                        Xem thêm sản phẩm
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {searchResults && searchResults.length > 0 ? searchResults.map((book) => (
                                <div key={book.id} className="group bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                    {/* Hình ảnh */}
                                    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-t-xl bg-muted">
                                        <img
                                            src={book.coverImage ? book.coverImage : DEFAULT.IMAGE}
                                            alt={book.title || "Không có tiêu đề"}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => (e.currentTarget.src = DEFAULT.IMAGE)}
                                        />
                                    </div>
                                    {/* Nội dung */}
                                    <div className="p-4 flex flex-col">
                                        <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                            {book.title || "Sách chưa có tiêu đề"}
                                        </h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                            {book.description || "Mô tả sách"}
                                        </p>
                                        <p className="text-sm font-bold text-primary mt-auto">
                                            {book.price ? `${book.price} ₫` : "Liên hệ"}
                                        </p>
                                    </div>
                                </div>

                            )) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-muted-foreground">Không tìm thấy sản phẩm phù hợp</p>
                                </div>
                            )}

                            {(!searchResults || searchResults && searchResults.length == 0) ?? (
                                <Link to="{`/search?term=${searchTerm}`}">
                                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md font-medium transition-colors">
                                        Xem thêm
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}