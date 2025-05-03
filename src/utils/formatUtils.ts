// Format price to VND
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(price)
        .replace('₫', 'VND');
};

export const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('vi-VN', options);
}

export const daysUntilNow = (date: string): number => {
    const today = new Date();
    const targetDate = new Date(date);
    const timeDiff = targetDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Calculate the time difference between a given date and now. (In reverse order)
 * 
 * @param date - Date string in ISO format (e.g., "2023-10-01T00:00:00Z")
 * @returns a string indicating the time difference from now
 */
export const diffTimeUtilNow = (date: string): string => {
    const today = new Date();
    const targetDate = new Date(date);
    const timeDiff = today.getTime() - targetDate.getTime(); // Reversed to get past time

    const days = Math.floor(timeDiff / (1000 * 3600 * 24));
    const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    if (timeDiff < 0) { // Future time
        const posTimeDiff = Math.abs(timeDiff);
        const futureDays = Math.floor(posTimeDiff / (1000 * 3600 * 24));
        const futureHours = Math.floor((posTimeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
        const futureMinutes = Math.floor((posTimeDiff % (1000 * 3600)) / (1000 * 60));
        const futureSeconds = Math.floor((posTimeDiff % (1000 * 60)) / 1000);

        if (futureDays > 0) return `Còn ${futureDays} ngày`;
        if (futureHours > 0) return `Còn ${futureHours} giờ`;
        if (futureMinutes > 0) return `Còn ${futureMinutes} phút`;
        return `Còn ${futureSeconds} giây`;
    } else { // Past time
        if (days > 0) return `${days} ngày trước`;
        if (hours > 0) return `${hours} giờ trước`;
        if (minutes > 0) return `${minutes} phút trước`;
        return `${seconds} giây trước`;
    }
}