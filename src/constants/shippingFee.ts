export function getShippingFee(orderValue: number): number {
    if (orderValue < 100000) {
        return 30000;
    } else if (orderValue < 200000) {
        return 20000;
    } else if (orderValue < 300000) {
        return 10000;
    } else {
        return 0;
    }
}