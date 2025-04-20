import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from '../../ui/card.tsx';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../../ui/select.tsx';
import { Input } from '../../ui/input.tsx';
import { Button } from '../../ui/button.tsx';
import { Label } from '../../ui/label.tsx';
import PaginationComponent from '../../vendor/Pagination/Pagination.tsx';
import { Search, RefreshCw } from 'lucide-react';
import { Category } from '../../../types/ApiResponse/Category/category.ts';
import useFetch from '../../../hooks/useFetch.ts';
import { API_ENDPOINTS } from '../../../constants/apiInfo.ts';
import { BookCard } from '../../vendor/Card/BookCard.tsx';
import { Loading } from "../../vendor/Loading/Loading.tsx";

// Define TypeScript interfaces
interface Book {
    id: number;
    authorName: string;
    coverImage: string;
    price: number;
    categoryIds: string[];
}

export default function Products() {
    // Get search parameters from URL
    const [searchParams, setSearchParams] = useSearchParams();
    const [pageNumber, setPageNumber] = useState<number>(0);

    // Form state values (temporary values before submitting)
    const [tempAuthor, setTempAuthor] = useState<string>('');
    const [tempSelectedCategories, setTempSelectedCategories] = useState<string[]>([]);
    const [tempMinPrice, setTempMinPrice] = useState<string>('');
    const [tempMaxPrice, setTempMaxPrice] = useState<string>('');

    // State values that are actually used for API requests
    const [author, setAuthor] = useState<string>('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [pageSize, setPageSize] = useState<string>('10');

    // Initialize form values from URL params on component mount
    useEffect(() => {
        setTempAuthor(searchParams.get('authorName') || '');
        setTempSelectedCategories(searchParams.get('categoryIds')?.split(',') || []);
        setTempMinPrice(searchParams.get('minPrice') || '');
        setTempMaxPrice(searchParams.get('maxPrice') || '');

        setAuthor(searchParams.get('authorName') || '');
        setSelectedCategories(searchParams.get('categoryIds')?.split(',') || []);
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
    }, [searchParams]);

    const queryParams = useMemo(() => ({
        params: {
            authorName: author,
            categoryIds: selectedCategories,
            minPrice: minPrice,
            maxPrice: maxPrice,
            page: pageNumber,
            size: pageSize,
        }
    }), [author, selectedCategories, minPrice, maxPrice, pageNumber, pageSize]);

    const { data: categories } = useFetch<Category[]>(API_ENDPOINTS.CATEGORY.GET_CATEGORIES.URL);
    const { data: books, loading: isLoading, pagination } = useFetch<Book[]>(API_ENDPOINTS.BOOK.FILTER.URL, queryParams);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Update actual state values with temporary form values
        setAuthor(tempAuthor);
        setSelectedCategories(tempSelectedCategories);
        setMinPrice(tempMinPrice);
        setMaxPrice(tempMaxPrice);

        // Reset page number when applying new filters
        setPageNumber(0);

        // Update search parameters
        const newParams = new URLSearchParams(searchParams);

        if (tempAuthor) newParams.set('authorName', tempAuthor);
        else newParams.delete('authorName');

        if (tempSelectedCategories.length > 0) newParams.set('categoryIds', tempSelectedCategories.join(','));
        else newParams.delete('categoryIds');

        if (tempMinPrice) newParams.set('minPrice', tempMinPrice);
        else newParams.delete('minPrice');

        if (tempMaxPrice) newParams.set('maxPrice', tempMaxPrice);
        else newParams.delete('maxPrice');

        setSearchParams(newParams);
    };

    // Handle form reset
    const handleReset = () => {
        // Reset temporary form values
        setTempAuthor('');
        setTempSelectedCategories([]);
        setTempMinPrice('');
        setTempMaxPrice('');

        // Reset actual state values
        setAuthor('');
        setSelectedCategories([]);
        setMinPrice('');
        setMaxPrice('');

        // Reset URL params except for the search term
        const newParams = new URLSearchParams();
        setSearchParams(newParams);
    };

    // Handle category selection
    const handleCategoryChange = (value: string) => {
        // For now, just set single category since multiple selection is in development
        setTempSelectedCategories([value]);
    };

    return (
        <div className="container py-8 mx-auto px-4">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Filter Card */}
                <div className="md:col-span-1">
                    <Card className="shadow-sm">
                        <CardHeader className="bg-muted">
                            <CardTitle className="text-lg">Lọc</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form id="filterForm" onSubmit={handleSubmit} className="space-y-4">

                                <div className="space-y-2">
                                    <Label htmlFor="author">Tác giả</Label>
                                    <Input
                                        type="text"
                                        id="author"
                                        name="authorName"
                                        placeholder="Nhập tên tác giả"
                                        value={tempAuthor}
                                        onChange={(e) => setTempAuthor(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Thể loại</Label>
                                    <Select
                                        value={tempSelectedCategories[0] || ''}
                                        onValueChange={handleCategoryChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn thể loại" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories && categories.map((category) => (
                                                <SelectItem key={category.id} value={`${category.id}`}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Chức năng chọn nhiều đang được phát triển
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="minPrice">Giá tối thiểu</Label>
                                    <Input
                                        type="number"
                                        id="minPrice"
                                        name="minPrice"
                                        placeholder="0"
                                        min="0"
                                        step="1000"
                                        value={tempMinPrice}
                                        onChange={(e) => setTempMinPrice(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maxPrice">Giá tối đa</Label>
                                    <Input
                                        type="number"
                                        id="maxPrice"
                                        name="maxPrice"
                                        placeholder="1000000"
                                        min="0"
                                        step="1000"
                                        value={tempMaxPrice}
                                        onChange={(e) => setTempMaxPrice(e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-center gap-2 mt-6">
                                    <Button type="submit" className="flex items-center gap-1">
                                        <Search className="h-4 w-4" />
                                        Tìm kiếm
                                    </Button>
                                    <Button type="button" variant="outline" onClick={handleReset} className="flex items-center gap-1">
                                        <RefreshCw className="h-4 w-4" />
                                        Đặt lại
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Book Results */}
                <div className="md:col-span-3">
                    {/* Pagination Info */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div className="text-sm text-muted-foreground">
                            Đang hiển thị {pageNumber + 1} trên {pagination ? pagination.totalPages : 1} trang
                        </div>
                        <Select
                            value={pageSize}
                            onValueChange={(value) => {
                                setPageSize(value)
                                setPageNumber(0)
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="10 kết quả mỗi trang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10 kết quả mỗi trang</SelectItem>
                                <SelectItem value="20">20 kết quả mỗi trang</SelectItem>
                                <SelectItem value="50">50 kết quả mỗi trang</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Books Grid */}
                    {isLoading ? (
                        <Loading />
                    ) : books && books.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                            {books.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border rounded-md bg-muted/20">
                            <p className="text-muted-foreground">Không tìm thấy kết quả phù hợp</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <PaginationComponent
                            pagination={pagination}
                            onPageChange={(newPage) => setPageNumber(newPage)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}