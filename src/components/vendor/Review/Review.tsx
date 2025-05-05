import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import AuthUtil from "../../../utils/authUtil.ts";
import { AppDispatch, RootState } from "../../../redux/store.ts";
import {
    fetchReviewsByBookId,
    addReview,
    updateReview,
    deleteReview,
    resetReviewState,
} from "../../../redux/slice/ReviewSlice.ts";
import Logger from "../../../utils/logger.ts";
import {Label} from "../../ui/label.tsx";
import {Input} from "../../ui/input.tsx";
import {Button} from "../../ui/button.tsx";
import {Review} from "../../../types/ApiResponse/Review/review.ts";

const ReviewComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = AuthUtil.getUser();
    const { items: reviews, status, error } = useSelector((state: RootState) => state.review);
    const bookId = useSelector((state: RootState) => state.product.currentBookId);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [editingReview, setEditingReview] = useState<Review | null>(null);

    useEffect(() => {
        if (bookId) {
            Logger.log("bookId", bookId);
            dispatch(fetchReviewsByBookId(bookId));
        }
        return () => {
            dispatch(resetReviewState());
        };
    }, [dispatch, bookId]);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để gửi đánh giá");
            return;
        }
        if (!bookId) {
            toast.error("Không tìm thấy thông tin sản phẩm");
            return;
        }

        const reviewRequest: Review = {
            userId: user.id,
            bookId: parseInt(bookId),
            rating,
            comment,
        };

        try {
            if (editingReview) {
                reviewRequest.id = editingReview.id;
                await dispatch(updateReview(reviewRequest))
                    .unwrap()
                    .then(() => {
                        toast.success("Đã cập nhật đánh giá!");
                        setEditingReview(null);
                    })
                    .catch((error) => {
                        toast.error(`Lỗi khi cập nhật: ${error}`);
                    });
            } else {
                await dispatch(addReview(reviewRequest))
                    .unwrap()
                    .then(() => {
                        toast.success("Đã gửi đánh giá!");
                    })
                    .catch((error) => {
                        toast.error(`Lỗi khi gửi: ${error}`);
                    });
            }
            setRating(0);
            setComment("");
        } catch (error) {
            Logger.error("Error submitting review:", error);
        }
    };

    const handleEditReview = (review: Review) => {
        setEditingReview(review);
        setRating(review.rating || 0);
        setComment(review.comment || "");
    };

    const handleDeleteReview = (id: number) => {
        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để xóa đánh giá");
            return;
        }

        dispatch(deleteReview({ id }))
            .unwrap()
            .then(() => {
                toast.success("Đã xóa đánh giá!");
            })
            .catch((error) => {
                toast.error(`Lỗi khi xóa: ${error}`);
            });
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
        setRating(0);
        setComment("");
    };

    if (!user?.id) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vui lòng đăng nhập</h2>
                <p className="text-gray-600">Bạn cần đăng nhập để xem và gửi đánh giá.</p>
                <Link to="/signin" className="text-blue-500 hover:underline">
                    Đăng nhập ngay
                </Link>
            </div>
        );
    }

    if (!bookId) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Không tìm thấy sản phẩm</h2>
                <p className="text-gray-600">Vui lòng quay lại trang chi tiết sản phẩm.</p>
                <Link to="/products" className="text-blue-500 hover:underline">
                    Khám phá sản phẩm ngay
                </Link>
            </div>
        );
    }

    if (status === "loading") {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải danh sách đánh giá...</p>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p className="text-red-500">Lỗi: {error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">Đánh Giá Sản Phẩm</h2>

            {/* Form đánh giá */}
            <form
                onSubmit={handleSubmitReview}
                className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="rating">Đánh giá (1-5 sao)</Label>
                        <Input
                            type="number"
                            id="rating"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value))}
                            placeholder="Nhập số sao (1-5)"
                            required
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label htmlFor="comment">Bình luận</Label>
                        <Input
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Nhập bình luận của bạn"
                            required
                            className="w-full"
                        />
                    </div>
                    <div className="flex space-x-2">
                        {editingReview && (
                            <Button
                                variant="outline"
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-gray-200 hover:bg-gray-300"
                            >
                                Hủy
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={status === "loading"}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            {editingReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Danh sách đánh giá */}
            {reviews.length === 0 ? (
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Chưa có đánh giá nào
                    </h3>
                    <p className="text-gray-600">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-lg shadow-md p-4 relative"
                        >
                            <div>
                                <p className="text-lg font-semibold text-gray-800">
                                    {review.userId?.fullName} - {review.rating} sao
                                </p>
                                <p className="text-gray-600">{review.comment}</p>
                            </div>
                            {review.userId?.id === user?.id && (
                                <div className="absolute top-2 right-2 flex space-x-2">
                                    <button
                                        onClick={() => handleEditReview(review)}
                                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
                                        aria-label="Edit review"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReview(review.id!)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                                        aria-label="Delete review"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewComponent;