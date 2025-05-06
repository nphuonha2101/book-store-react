import React, { useState, useEffect } from 'react';
import { StarIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { fetchReviewsByBookId, fetchReviewsMetadataByBookId, addReview, temporalUpdateReview } from '../../../redux/slice/reviewSlice';
import { formatDate } from '../../../utils/formatUtils';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Separator } from '../../ui/separator';
import PaginationComponent from '../Pagination/Pagination';
import { Loading } from "../Loading/Loading";
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Review } from '../../../types/ApiResponse/Review/review';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { toast } from 'sonner';
import AuthUtil from '../../../utils/authUtil';
import { API_ENDPOINTS } from '../../../constants/apiInfo';

interface ProductReviewSectionProps {
  bookId: number;
}

const ProductReviewSection: React.FC<ProductReviewSectionProps> = ({ bookId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [canUserReview, setCanUserReview] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const user = AuthUtil.getUser();
  
  const {
    items: reviews,
    status: reviewsStatus,
    totalReviews,
    averageRating,
    pagination
  } = useSelector((state: RootState) => state.review);

  // Fetch reviews khi component mount hoặc khi bookId thay đổi
  useEffect(() => {
    if (bookId) {
      dispatch(fetchReviewsByBookId({ bookId, page: pageNumber }));
      dispatch(fetchReviewsMetadataByBookId(bookId));
      
        fetchUserCanReview(); // Kiểm tra xem người dùng có thể đánh giá hay không
    }
  }, [dispatch, bookId, pageNumber, user?.id]);

  const fetchUserCanReview = async () => {
    if (AuthUtil.isLogged()) {
    
        const response = await fetch(`${API_ENDPOINTS.REVIEW.CAN_REVIEW.URL}/${bookId}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AuthUtil.getToken()}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            setCanUserReview(data.data);
        }
    }
  };   

  // Handle thay đổi trang
  const handlePageChange = (page: number) => {
    setPageNumber(page);
    // Scroll to reviews section
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <StarIcon
          key={index}
          className={`h-4 w-4 ${
            index < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300'
          }`}
        />
      ));
  };

  // Handle click vào sao trong form đánh giá
  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  // Render tương tác sao trong form đánh giá
  // Khi click vào sao nào thì sao đó sẽ được tô màu vàng
  const renderInteractiveStars = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <StarIcon
          key={index}
          className={`h-6 w-6 cursor-pointer ${
            index < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300'
          }`}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => setRating(index + 1)}
          onMouseLeave={() => setRating(rating)}
        />
      ));
  };

  // Handle submit form đánh giá
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập để gửi đánh giá");
      return;
    }
    
    if (!rating) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const reviewData: Review = {
        rating,
        comment,
        book: { id: bookId },
        user: { id: user.id }
      } as Review;
      
      await dispatch(addReview(reviewData)).unwrap();
      
      // Tạm thời cập nhật đánh giá vào Redux store
      dispatch(temporalUpdateReview(reviewData));
      
      // Reset form
      setRating(0);
      setComment("");
      setCanUserReview(false); 
      toast.success("Đánh giá của bạn đã được gửi thành công");
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message || "Có lỗi xảy ra khi gửi đánh giá");
        } else {
            toast.error("Có lỗi xảy ra khi gửi đánh giá");
        }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Avatar fallback (Chuỗi ký tự đầu tiên của tên)
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Render review item
  // Mỗi đánh giá sẽ có một avatar, tên người dùng, thời gian tạo, số sao và bình luận
  const renderReviewItem = (review: Review) => (
    <div key={review.id} className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.user?.avatar} alt={review.user?.name} />
          <AvatarFallback>{getInitials(review.user?.name || '')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="font-medium">{review.user?.name || 'Người dùng ẩn danh'}</div>
            <div className="text-xs text-gray-500">
              {review.createdAt ? formatDate(review.createdAt) : 'Không có thông tin thời gian'}
            </div>
          </div>
          <div className="flex items-center mt-1">
            {review.rating && renderStars(review.rating)}
          </div>
          <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="shadow-sm mb-6" id="reviews-section">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl">Đánh giá ({totalReviews || 0})</CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Average Rating Summary */}
        {averageRating !== undefined && (
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex items-center">
                {renderStars(Math.round(averageRating))}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Dựa trên {totalReviews} đánh giá
            </div>
          </div>
        )}

        {/* Review Form */}
        {canUserReview && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Viết đánh giá của bạn</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Đánh giá sao</label>
                <div className="flex items-center gap-1">
                  {renderInteractiveStars()}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="review-comment" className="block text-sm font-medium mb-2">
                  Nhận xét của bạn
                </label>
                <Textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này"
                  rows={4}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </Button>
            </form>
          </div>
        )}

        <Separator className="my-4" />

        {/* Reviews List */}
        {reviewsStatus === 'loading' ? (
          <Loading />
        ) : reviews && reviews.length > 0 ? (
          <div>
            <div className="space-y-2">
              {reviews.map(renderReviewItem)}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <PaginationComponent
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductReviewSection;