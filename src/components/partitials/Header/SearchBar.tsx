import { ArrowLeft, Search, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useFetchPost from "../../../hooks/useFetchPost.ts";
import "../../../utils/localStorageUtil.ts";
import { getArray, saveArray } from "../../../utils/localStorageUtils.ts";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";
// import { useState } from "react";

const SearchBar = ({ setIsSearchOpen }: { setIsSearchOpen: Dispatch<SetStateAction<boolean>> }) => {
    const [searchTermsHistory, setSearchTermsHistory] = useState<string[]>([]);
    useEffect(() => {
        const searchTermsHistory = getArray("searchTermsHistory");
        if (!searchTermsHistory) {
            saveArray("searchTermsHistory", []);
        }
        setSearchTermsHistory(searchTermsHistory || []);
    }, []);

    const { data: suggestions, loading, error, fetchData } = useFetchPost<{ terms: string[] }, any>(API_ENDPOINTS.BOOK.SUGGESTIONS.URL, { terms: searchTermsHistory });

    return (
        <>
            <div className="fixed inset-0 bg-white z-50 flex flex-col animate-fade-in">
                <div className="border-b border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center max-w-3xl mx-auto w-full">
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="p-2 text-gray-700 hover:text-indigo-600 rounded-full hover:bg-gray-100 mr-2 transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>

                        <div className="flex-1 flex items-center border border-gray-300 rounded-full px-4 py-2 mx-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                            <Search className="w-5 h-5 text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="flex-1 outline-none bg-transparent"
                                autoFocus
                            />
                            <button className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <button
                            className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                        >
                            Tìm
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto w-full p-4">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Có thể bạn quan tâm</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {suggestions ? suggestions.map((product) => (
                                    <div key={product.id} className="group">
                                        <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden relative shadow-sm group-hover:shadow transition-all">
                                            <div className="h-40 bg-gray-200 group-hover:opacity-90 transition-opacity"></div>
                                            {product.discount && (
                                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                                    -{product.discount}
                                                </span>
                                            )}
                                            {product.isNew && (
                                                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                    Mới
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">{product.name}</p>
                                            <p className="text-sm font-medium text-gray-900">{product.price}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center w-full">
                                        <p className="text-gray-500">Không có sản phẩm nào</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 text-center">
                                <button className="bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md text-sm font-medium transition-colors">
                                    Xem thêm sản phẩm
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Danh mục nổi bật</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {['Smartphone', 'Laptop', 'Tablet', 'Headphone', 'Smartwatch', 'Accessories'].map((category, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer">
                                        <div className="text-center">
                                            <div className="h-12 w-12 bg-indigo-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                                                <span className="text-indigo-600 font-bold">{category.charAt(0)}</span>
                                            </div>
                                            <p className="text-sm font-medium">{category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchBar;
