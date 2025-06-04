import { Wallet, Coins } from "lucide-react";

export const PAYMENT_METHOD = [
    {
        id: 0,
        name: 'Thanh toán khi nhận hàng',
        description: 'Thanh toán khi nhận hàng (COD) là hình thức thanh toán mà bạn sẽ thanh toán cho người giao hàng khi nhận hàng tại nhà.',
        icon: Coins,
    },
    {
        id: 1,
        name: 'Ví điện tử',
        description: 'Ví điện tử là hình thức thanh toán trực tuyến thông qua các ứng dụng ví điện tử như Momo, ZaloPay, Payoo...',
        icon: Wallet,
    },
];