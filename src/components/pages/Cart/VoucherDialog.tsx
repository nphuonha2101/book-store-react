import React, { useEffect, useState } from 'react';
import { Copy, Check, ShoppingBag, Clock, Tag } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../../shadcn-components/ui/dialog';
import { Button } from '../../../shadcn-components/ui/button';
import { Badge } from '../../../shadcn-components/ui/badge';
import { Card, CardContent } from '../../../shadcn-components/ui/card';
import { toast } from 'react-toastify';
import { daysUntilNow, formatDate, formatPrice } from '../../../utils/formatUtils';
import { Voucher } from '../../../types/ApiResponse/Voucher/voucher';
import { Separator } from '../../../shadcn-components/ui/separator';
import { API_ENDPOINTS } from '../../../constants/ApiInfo';
import AuthUtil from '../../../utils/authUtil';

export const VoucherDialog: React.FC<{
    onSelectVoucher?: (voucher: Voucher) => void;
    categoryIds?: number[];
    minSpend?: number;
}> = ({ onSelectVoucher, categoryIds, minSpend }) => {
    const [open, setOpen] = useState(false);
    const [voucherCode, setVoucherCode] = useState<string>('');
    const [selectedVoucherCode, setSelectedVoucherCode] = useState<string | null>(null);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.VOUCHER.GET_VOUCHERS.URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${AuthUtil.getToken()}`,
                    },
                    body: JSON.stringify({
                        categoryIds: categoryIds,
                        minSpend: minSpend,
                    }),
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch vouchers');
                }
                const data = await response.json();
                setVouchers(data.data || []);
            } catch (error: unknown) {
                console.error('Error fetching vouchers:', error instanceof Error ? error.message : 'Unknown error');
            }
        }

        if (categoryIds && categoryIds.length > 0 && minSpend) {
            fetchVouchers();
        }
    }
        , [categoryIds, minSpend]);

    const copyToClipboard = (code: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn sự kiện lan truyền lên card
        navigator.clipboard.writeText(code || '');
        toast.success('Đã sao chép mã giảm giá vào bộ nhớ tạm!');
    };

    const handleSelectVoucher = (voucher: Voucher) => {
        setSelectedVoucherCode(voucher.code ?? '');
        if (onSelectVoucher) {
            onSelectVoucher(voucher);
        }
        setOpen(false);
    };

    const handlePromptVoucher = () => {
        if (voucherCode.trim() === '') {
            toast.error('Vui lòng nhập mã giảm giá!');
            return;
        }
        for (const voucher of vouchers) {
            if (voucher.code === voucherCode) {
                handleSelectVoucher(voucher);
                setSelectedVoucherCode(voucher.code ?? '');
                return;
            }
        }
        toast.error('Mã giảm giá không hợp lệ!');
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="w-full border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                <Tag className="h-4 w-4 text-primary" />
                                Mã giảm giá
                            </h3>
                            {selectedVoucherCode && (
                                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                                    Đã áp dụng
                                </Badge>
                            )}
                        </div>

                        {selectedVoucherCode ? (
                            <div className="flex items-center gap-2 w-full border rounded-md p-2 bg-blue-50/50">
                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-2 py-1 font-mono">
                                    {selectedVoucherCode}
                                </Badge>
                                <div className="flex-1 text-xs text-gray-500">Voucher đã áp dụng</div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 hover:bg-red-50 hover:text-red-500"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onSelectVoucher) onSelectVoucher({} as Voucher);
                                        setSelectedVoucherCode(null);

                                    }}
                                >
                                    Hủy
                                </Button>
                            </div>
                        ) : (
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Nhập mã voucher"
                                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                                    value={voucherCode || ''}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                {voucherCode && (
                                    <Button
                                        size="sm"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePromptVoucher();
                                        }}
                                    >
                                        Áp dụng
                                    </Button>
                                )}
                            </div>
                        )}

                        <Button
                            variant="link"
                            className="text-primary hover:text-primary/80 p-0 h-auto w-fit flex items-center gap-1 text-sm"
                        >
                            <Tag className="h-3.5 w-3.5" />
                            <span>{selectedVoucherCode ? 'Đổi voucher khác' : 'Chọn voucher từ danh sách'}</span>
                        </Button>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl p-0 overflow-hidden max-h-[90vh]">
                <div className="sticky top-0 z-10 bg-white border-b">
                    <DialogHeader className="px-6 pt-6 pb-4">
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <Tag className="h-5 w-5 text-primary" />
                            Ưu Đãi Đặc Biệt
                        </DialogTitle>
                        <DialogDescription>
                            Chọn voucher để áp dụng cho đơn hàng của bạn
                        </DialogDescription>
                    </DialogHeader>
                    <Separator />
                </div>

                {!vouchers || vouchers && vouchers.length === 0 ? (
                    <div className="flex items-center justify-center h-full p-6 text-gray-500">
                        Không có voucher nào phù hợp với điều kiện của bạn.
                    </div>
                ) :
                    (
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {vouchers && vouchers.map((voucher) => (
                                    <Card
                                        key={voucher.id}
                                        className={`overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border ${selectedVoucherCode === voucher.code
                                            ? 'border-primary shadow-md shadow-primary/20'
                                            : 'border-gray-200'
                                            }`}
                                        onClick={() => handleSelectVoucher(voucher)}
                                    >
                                        <div className="relative">
                                            {selectedVoucherCode === voucher.code && (
                                                <div className="absolute top-0 right-0 z-10">
                                                    <Badge className="bg-primary text-white rounded-none rounded-bl-md px-3 py-1">
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Đã chọn
                                                    </Badge>
                                                </div>
                                            )}

                                            <div className="h-40 relative overflow-hidden">
                                                <img
                                                    src={voucher.thumbnail || "/placeholder-voucher.jpg"}
                                                    alt={`Voucher ${voucher.code}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                                <Badge className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-md">
                                                    Giảm {voucher.discount}%
                                                </Badge>

                                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                                    <div className="font-bold text-lg mb-1">Mã giảm giá</div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Clock className="h-4 w-4" />
                                                        <span>Còn {voucher.expiredDate ? daysUntilNow(voucher.expiredDate) : '?'} ngày</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <CardContent className="p-4">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                                            <ShoppingBag className="h-3.5 w-3.5" />
                                                            Đơn tối thiểu:
                                                            <span className="font-medium text-gray-700">
                                                                {voucher.minSpend ? formatPrice(voucher.minSpend) : 'Không có'}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-md border border-dashed border-gray-300">
                                                    <div className="font-mono font-bold text-base flex-1 text-center text-primary">
                                                        {voucher.code}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-gray-200"
                                                        onClick={(e) => copyToClipboard(voucher.code || '', e)}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="text-xs text-gray-500 flex justify-between items-center">
                                                    <span>HSD: {voucher.expiredDate ? formatDate(voucher.expiredDate) : 'Không rõ'}</span>
                                                    <Button
                                                        size="sm"
                                                        variant={selectedVoucherCode === voucher.code ? "default" : "outline"}
                                                        className={`min-w-24 ${selectedVoucherCode === voucher.code ? 'bg-primary' : ''}`}
                                                    >
                                                        {selectedVoucherCode === voucher.code ? 'Đã Chọn' : 'Áp Dụng'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )
                }
            </DialogContent>
        </Dialog>
    );
};