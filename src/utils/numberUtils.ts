// Format price to VND
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(price)
        .replace('₫', 'VND');
};