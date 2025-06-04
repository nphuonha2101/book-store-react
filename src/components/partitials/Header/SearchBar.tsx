import { ArrowLeft, Search, X, History } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState, useRef, useMemo } from "react";
import { getArray, saveArray } from "../../../utils/localStorageUtils";
import { Book } from "../../../types/ApiResponse/Book/book";
import useFetch from "../../../hooks/useFetch";
import { Button } from "../../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { BookCard } from "../../vendor/Card/BookCard";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";
import { Category } from "../../../types/ApiResponse/Category/category.ts";

export default function SearchBar({ setIsSearchOpen }: { setIsSearchOpen: Dispatch<SetStateAction<boolean>> }) {
    const [searchTermsHistory, setSearchTermsHistory] = useState<string[]>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const storageHistory = getArray("searchTermsHistory");
        if (!storageHistory) {
            saveArray("searchTermsHistory", []);
        }
        setSearchTermsHistory(storageHistory || []);
    }, []);

    const { data: categories } = useFetch<Category[]>(API_ENDPOINTS.CATEGORY.GET_CATEGORIES.URL);

    const fetchOptions = useMemo(() => ({ params: { term: searchTerm, size: 6 } }), [searchTerm]);

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

    const handleBookCardClick = (bookId: number, bookTitle: string) => {
        saveArray("searchTermsHistory", [bookTitle, ...searchTermsHistory]);
        setIsSearchOpen(false);
        navigate("/books/" + bookId);
    };

    return (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in duration-300">
            <div className="w-full max-w-3xl mx-4 bg-background/80 rounded-2xl border border-border/30 shadow-xl backdrop-blur-md overflow-hidden max-h-[85vh] flex flex-col">
                {/* Header Search */}
                <div className="border-b border-border/30 p-4 bg-background/70 backdrop-blur-md">
                    <div className="flex items-center w-full">
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="p-2.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/80 mr-2 transition-all"
                            aria-label="Close search"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex-1 flex items-center bg-background/60 border border-border/40 rounded-full px-5 py-3 mx-2 focus-within:ring-2 focus-within:ring-ring/30 focus-within:border-input transition-all shadow-sm backdrop-blur-md group">
                            <Search className="w-4 h-4 text-muted-foreground mr-3 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sách, tác giả, danh mục..."
                                className="flex-1 outline-none bg-transparent text-foreground placeholder:text-muted-foreground/70"
                                autoFocus
                                ref={searchInputRef}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    className="text-muted-foreground hover:text-foreground transition-colors p-1.5 hover:bg-muted/20 rounded-full"
                                    onClick={clearSearchInput}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area - Scrollable */}
                <div className="overflow-y-auto flex-1">
                    <div className="w-full p-4 space-y-6">
                        {searchTerm === "" ? (
                            <>
                                {/* Lịch sử tìm kiếm */}
                                <div className="bg-background/50 p-5 rounded-xl border border-border/20 shadow-sm backdrop-blur-sm hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-base font-semibold text-foreground flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history mr-2">
                                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                                <path d="M3 3v5h5"></path>
                                                <path d="M12 7v5l4 2"></path>
                                            </svg>
                                            Lịch sử tìm kiếm
                                        </h3>
                                        {searchTermsHistory.length > 0 && (
                                            <button
                                                className="text-xs text-muted-foreground hover:text-destructive px-2 py-1 rounded-full transition-colors hover:bg-destructive/10 border border-transparent hover:border-destructive/20"
                                                onClick={() => {
                                                    saveArray("searchTermsHistory", []);
                                                    setSearchTermsHistory([]);
                                                }}
                                            >
                                                Xóa tất cả
                                            </button>
                                        )}
                                    </div>

                                    {searchTermsHistory && searchTermsHistory.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {searchTermsHistory.map((term, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center bg-background/60 border border-border/40 rounded-full px-3.5 py-1.5 cursor-pointer hover:bg-primary/10 hover:border-primary/20 transition group shadow-sm"
                                                    onClick={() => {
                                                        setSearchTerm(term);
                                                        if (searchInputRef.current) {
                                                            searchInputRef.current.value = term;
                                                        }
                                                    }}
                                                >
                                                    <History className="w-3.5 h-3.5 text-muted-foreground mr-2 group-hover:text-primary transition-colors" />
                                                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">{term}</span>
                                                    <button
                                                        className="ml-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition pl-1"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            const newHistory = searchTermsHistory.filter((_, i) => i !== index);
                                                            saveArray("searchTermsHistory", newHistory);
                                                            setSearchTermsHistory(newHistory);
                                                        }}
                                                        aria-label="Xóa từ khóa"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 border border-dashed border-border/30 rounded-lg bg-muted/10 backdrop-blur-sm">
                                            <p className="text-muted-foreground text-sm">Không có lịch sử tìm kiếm</p>
                                        </div>
                                    )}
                                </div>

                                {/* Phần gợi ý danh mục */}
                                <div className="bg-background/50 p-5 rounded-xl border border-border/20 shadow-sm backdrop-blur-sm hover:shadow-md transition-all">
                                    <h3 className="text-base font-semibold text-foreground flex items-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open mr-2">
                                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                        </svg>
                                        Danh mục phổ biến
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {categories?.map((category, index) => (
                                            <Link
                                                key={index}
                                                to={`/products?categoryIds=${category.id}`}
                                                className="bg-background/60 hover:bg-background/90 border border-border/40 rounded-lg p-3.5 cursor-pointer transition-all flex items-center justify-between group"
                                                onClick={() => setIsSearchOpen(false)}
                                                aria-label={`Xem danh mục ${category.name}`}
                                            >
                                                <span className="text-sm font-medium group-hover:text-primary transition-colors">{category?.name}</span>
                                                <div className="w-6 h-6 rounded-full bg-muted/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                    <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-primary" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-background/50 rounded-xl border border-border/20 p-5 backdrop-blur-sm shadow-sm">
                                <h3 className="text-base font-semibold text-foreground flex items-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search mr-2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.3-4.3"></path>
                                    </svg>
                                    Kết quả tìm kiếm
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {searchResults && searchResults.length > 0 ? (
                                        <>
                                            {searchResults.map((book) => (
                                                <BookCard key={book.id} book={book} onClick={() => handleBookCardClick(book.id, book.title ? book.title : '')} />
                                            ))}
                                            <div className="col-span-full mt-4 flex justify-center">
                                                <Link to={`/search?title=${searchTerm}`} onClick={() => setIsSearchOpen(false)}>
                                                    <Button className="bg-primary/90 hover:bg-primary text-primary-foreground py-2.5 px-5 rounded-full font-medium transition-colors shadow-sm">
                                                        Xem tất cả kết quả
                                                    </Button>
                                                </Link>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="col-span-full text-center py-12 border border-dashed border-border/30 rounded-lg bg-muted/10 backdrop-blur-sm">
                                            <p className="text-muted-foreground">Không tìm thấy sản phẩm phù hợp</p>
                                            <Button
                                                variant="outline"
                                                className="mt-4 border-border/40 rounded-full px-5"
                                                onClick={clearSearchInput}
                                            >
                                                Xóa tìm kiếm
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}