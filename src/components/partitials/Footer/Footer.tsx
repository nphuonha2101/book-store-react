import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Truck, Shield, Package, Info } from 'lucide-react';
import { Logo } from '../../vendor/Logo/Logo';

const Footer = () => {
    return (
        <footer className="bg-background border-t border-border">
            {/* Nội dung Footer chính */}
            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Thông tin Công ty */}
                    <div>
                        <Logo width='90px' className='mb-4' />
                        <p className="mt-5 mb-4 text-muted-foreground">Điểm đến lý tưởng cho sách thuộc mọi thể loại. Khám phá, đọc và mở rộng tầm nhìn của bạn.</p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Liên kết nhanh */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary">Liên kết nhanh</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Trang chủ</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Sách bán chạy</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Sách mới phát hành</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Khuyến mãi đặc biệt</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Thể loại sách</a></li>
                        </ul>
                    </div>

                    {/* Dịch vụ khách hàng */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary">Dịch vụ khách hàng</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Tài khoản của tôi</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Lịch sử đơn hàng</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Theo dõi đơn hàng</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Trả hàng & Hoàn tiền</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Trung tâm hỗ trợ</a></li>
                        </ul>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary">Liên hệ với chúng tôi</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-primary" />
                                <span className="text-muted-foreground">(123) 456-7890</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="text-primary" />
                                <span className="text-muted-foreground">hotro@nhachsach.com</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin size={16} className="text-primary mt-1" />
                                <span className="text-muted-foreground">123 Đường Đọc Sách, Thành phố Sách, BK 12345</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Tính năng */}
                <div className="mt-12 pt-8 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <Package size={24} className="mb-2 text-primary" />
                            <h4 className="font-semibold mb-1">Miễn phí vận chuyển</h4>
                            <p className="text-sm text-muted-foreground">Cho đơn hàng trên 300.000đ</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Truck size={24} className="mb-2 text-primary" />
                            <h4 className="font-semibold mb-1">Giao hàng nhanh chóng</h4>
                            <p className="text-sm text-muted-foreground">Trong vòng 3-5 ngày làm việc</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <Shield size={24} className="mb-2 text-primary" />
                            <h4 className="font-semibold mb-1">Đảm bảo chất lượng sản phẩm</h4>
                            <p className="text-sm text-muted-foreground">
                                Sách mới 100% và chính hãng
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <Info size={24} className="mb-2 text-primary" />
                            <h4 className="font-semibold mb-1">Chăm sóc 27/7</h4>
                            <p className="text-sm text-muted-foreground">
                                Hỗ trợ khách hàng 24/7 qua điện thoại và email
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bản tin */}
                <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-xl font-bold mb-2 text-primary">Đăng ký nhận bản tin của chúng tôi</h3>
                            <p className="text-muted-foreground">Cập nhật thông tin về sách mới và ưu đãi độc quyền</p>
                        </div>
                        <div className="w-full md:w-2/5">
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Địa chỉ email của bạn"
                                    className="bg-background border border-input text-foreground py-2 px-4 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                                />
                                <button className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-r-md font-medium transition-colors">
                                    Đăng ký
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer dưới cùng */}
            <div className="bg-muted py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} NPBookStore. Tất cả các quyền được bảo lưu.</p>
                        </div>
                        <div>
                            <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Điều khoản dịch vụ</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Cài đặt cookie</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;