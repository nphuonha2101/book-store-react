import { ArrowLeft, Search, X, History, Mic } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState, useRef, useMemo } from "react";
import useFetchPost from "../../../hooks/useFetchPost";
import { getArray, saveArray } from "../../../utils/localStorageUtils";
import { Book } from "../../../types/ApiResponse/Book/book";
import useFetch from "../../../hooks/useFetch";
import { Button } from "../../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { BookCard } from "../../vendor/Card/BookCard";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";
import { VoiceRecordModal } from "../../vendor/Search/VoiceModal.tsx";

export default function SearchBar({ setIsSearchOpen }: { setIsSearchOpen: Dispatch<SetStateAction<boolean>> }) {
    const [searchTermsHistory, setSearchTermsHistory] = useState<string[]>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const navigate = useNavigate();
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
    const [isProcessingVoice, setIsProcessingVoice] = useState(false);

    useEffect(() => {
        const storageHistory = getArray("searchTermsHistory");
        if (!storageHistory) {
            saveArray("searchTermsHistory", []);
        }
        setSearchTermsHistory(storageHistory || []);
    }, []);

    // Tạo object ổn định
    const requestBody = useMemo(() => (searchTermsHistory), [searchTermsHistory]);

    const { data: suggestions } = useFetchPost<string[], Book[]>(
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

    const handleBookCardClick = (bookId: number, bookTitle: string) => {
        saveArray("searchTermsHistory", [bookTitle, ...searchTermsHistory]);
        setIsSearchOpen(false);
        navigate("/books/" + bookId);
    };

    const handleVoiceRecordingComplete = async (audioBlob: Blob) => {
        try {
            setIsProcessingVoice(true);
            setIsVoiceModalOpen(false);

            // Tạo form data để gửi đến server
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');

            // Gửi dữ liệu đến backend
            const response = await fetch(API_ENDPOINTS.TRANSCRIBE.URL, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Lỗi xử lý giọng nói');
            }

            const data = await response.json();

            // Nếu có kết quả nhận dạng, cập nhật vào ô tìm kiếm
            if (data.text) {
                setSearchTerm(data.text);
                if (searchInputRef.current) {
                    searchInputRef.current.value = data.text;
                }
            }
        } catch (error) {
            console.error('Lỗi xử lý giọng nói:', error);
            alert('Không thể xử lý giọng nói. Vui lòng thử lại sau.');
        } finally {
            setIsProcessingVoice(false);
        }
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

                        <button
                            onClick={() => setIsVoiceModalOpen(true)}
                            className={`p-2 rounded-full transition-colors ml-2 ${isProcessingVoice
                                ? 'bg-primary/20 text-primary animate-pulse'
                                : 'text-muted-foreground hover:text-primary hover:bg-muted'
                                }`}
                            aria-label="Voice search"
                            disabled={isProcessingVoice}
                        >
                            <Mic className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto w-full p-4">
                    {searchTerm === "" ? (
                        <>
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-foreground mb-4">Lịch sử tìm kiếm</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {searchTermsHistory && searchTermsHistory.length > 0 ? searchTermsHistory.map((term, index) => (
                                        <div key={index} onClick={() => {
                                            setSearchTerm(term)
                                            if (searchInputRef.current) {
                                                searchInputRef.current.value = term
                                            }
                                        }} className="cursor-pointer">
                                            <div className="bg-background border border-border rounded-md p-2 text-center flex items-center justify-center gap-2">
                                                <History className="w-4 h-4 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">{term}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-4 text-center py-8">
                                            <p className="text-muted-foreground">Không có lịch sử tìm kiếm</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-foreground mb-4">Có thể bạn quan tâm</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {suggestions && suggestions.length > 0 ? suggestions.map((book) => (
                                        <div key={book.id} onClick={() => { handleBookCardClick(book.id, book.title ? book.title : '') }} className="cursor-pointer">
                                            <BookCard book={book} />
                                        </div>
                                    )) : (
                                        <div className="col-span-4 text-center py-8">
                                            <p className="text-muted-foreground">Không có sản phẩm nào</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchResults && searchResults.length > 0 ? (
                                <>
                                    {searchResults.map((book) => (
                                        <BookCard key={book.id} book={book} onClick={() => handleBookCardClick(book.id, book.title ? book.title : '')} />
                                    ))}
                                    <div className="col-span-full mt-4 flex justify-center">
                                        <Link to={`/search?title=${searchTerm}`} onClick={() => setIsSearchOpen(false)}>
                                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md font-medium transition-colors">
                                                Xem thêm
                                            </Button>
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-muted-foreground">Không tìm thấy sản phẩm phù hợp</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <VoiceRecordModal
                isOpen={isVoiceModalOpen}
                onClose={() => setIsVoiceModalOpen(false)}
                onRecordingComplete={handleVoiceRecordingComplete}
            />
        </div>
    );
}