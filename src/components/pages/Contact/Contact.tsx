import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card.tsx";
import { Button } from "../../ui/button.tsx";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";

// Định nghĩa schema xác thực form liên hệ
const ContactSchema = z.object({
    email: z.string().email({ message: "Vui lòng nhập email hợp lệ" }).min(1, { message: "Email không được để trống" }),
    message: z.string().min(10, { message: "Tin nhắn phải có ít nhất 10 ký tự" }).max(500, { message: "Tin nhắn không được dài quá 500 ký tự" }),
});

type ContactInputs = z.infer<typeof ContactSchema>;

export const ContactAbout = () => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactInputs>({
        resolver: zodResolver(ContactSchema),
        defaultValues: {
            email: "",
            message: "",
        },
    });

    const onSubmit = async (data: ContactInputs) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // Timeout 15 giây

            const response = await fetch(`${API_ENDPOINTS.SEND_MAIL.SEND.URL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || "Không thể gửi thông tin liên hệ");
            }

            toast.success("Thông tin liên hệ đã được gửi thành công!");
            reset(); // Xóa form sau khi gửi thành công
        } catch (error: any) {
            console.error("Contact form error:", error);
            if (error.name === "AbortError") {
                toast.error("Yêu cầu đã hết thời gian. Vui lòng kiểm tra kết nối và thử lại.");
            } else {
                toast.error(error.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Về Chúng Tôi</h1>
                <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                    Book Store - Nơi kết nối đam mê đọc sách và lan tỏa tri thức
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                <div>
                    <h2 className="text-3xl font-bold mb-6">Câu Chuyện Của Chúng Tôi</h2>
                    <p className="text-gray-700 mb-4">
                        Chào mừng bạn đến với <strong>Book Store</strong>! Chúng tôi là một cửa hàng sách trực tuyến,
                        nơi bạn có thể tìm thấy hàng ngàn cuốn sách từ nhiều thể loại khác nhau.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Được thành lập vào năm 2023, chúng tôi tự hào là nơi kết nối những người yêu sách với những tác phẩm
                        ý nghĩa. Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn tìm kiếm cuốn sách phù hợp nhất.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Sứ mệnh của chúng tôi là mang đến cho bạn những trải nghiệm đọc sách tuyệt vời nhất, lan tỏa tri thức
                        và niềm đam mê đọc sách đến mọi người.
                    </p>
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold mb-4">Tầm Nhìn & Sứ Mệnh</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-blue-50 border-0">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl text-blue-600">Tầm Nhìn</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Trở thành nền tảng sách trực tuyến hàng đầu tại Việt Nam.</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-blue-50 border-0">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl text-blue-600">Sứ Mệnh</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Lan tỏa tri thức và niềm đam mê đọc sách đến mọi người.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div className="w-full h-80 md:h-96 rounded-lg flex items-center justify-center">
                        <img src="https://vanhoadoisong.vn/wp-content/uploads/2022/09/100-hinh-nen-anh-quyen-sach-cho-powerpoint-may-tinh-dien-thoai-4.jpg" alt=""/>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 mb-12">
                <h2 className="text-3xl font-bold text-center mb-12">Giá Trị Cốt Lõi</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="bg-white border-0 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl text-center">Chất Lượng</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p>Chúng tôi cam kết cung cấp những cuốn sách chất lượng cao với nội dung giá trị.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-0 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl text-center">Đa Dạng</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p>Đáp ứng đa dạng nhu cầu đọc sách với nhiều thể loại từ văn học đến khoa học.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-0 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl text-center">Dịch Vụ</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p>Hỗ trợ khách hàng tận tâm và chuyên nghiệp trong mọi giao dịch.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                <div>
                    <h2 className="text-3xl font-bold mb-6">Liên Hệ Với Chúng Tôi</h2>
                    <p className="text-gray-700 mb-6">
                        Chúng tôi luôn sẵn sàng lắng nghe ý kiến và giải đáp thắc mắc của bạn. Hãy liên hệ với chúng tôi
                        qua các kênh dưới đây hoặc để lại tin nhắn.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                            <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-medium">Địa Chỉ</h3>
                                <p className="text-gray-600">123 Đường Sách, Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <Phone className="w-6 h-6 text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-medium">Số Điện Thoại</h3>
                                <p className="text-gray-600">(84) 123 456 789</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <Mail className="w-6 h-6 text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-medium">Email</h3>
                                <p className="text-gray-600">support@bookstore.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold mb-4">Giờ Mở Cửa</h3>
                        <ul className="space-y-2">
                            <li className="flex justify-between">
                                <span>Thứ Hai - Thứ Sáu:</span>
                                <span>8:30 - 20:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Thứ Bảy:</span>
                                <span>9:00 - 18:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Chủ Nhật:</span>
                                <span>9:00 - 17:00</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl">Gửi Tin Nhắn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    id="email"
                                                    type="email"
                                                    placeholder="Nhập email của bạn"
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    className="w-full"
                                                />
                                                {errors.email && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors.email.message}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Tin Nhắn</Label>
                                    <Controller
                                        name="message"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <textarea
                                                    {...field}
                                                    id="message"
                                                    placeholder="Nhập tin nhắn của bạn"
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    rows={5}
                                                    className="w-full"
                                                />
                                                {errors.message && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors.message.message}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            Đang gửi...
                                        </>
                                    ) : (
                                        "Gửi Tin Nhắn"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-16">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5177881826164!2d106.69507237465576!3d10.771594089387621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3c586421ef%3A0xb606461945f53fa9!2zTmd1ecOqbiBI4buvdSwgUuG6oW5oIFRyb25nIFTDom4sIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1659158004075!5m2!1svi!2s"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bản đồ vị trí cửa hàng"
                    className="rounded-lg"
                />
            </div>
        </div>
    );
};