import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, CreditCard, Truck, Shield } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-background border-t border-border">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary">NPBookStore</h3>
                        <p className="mb-4 text-muted-foreground">Your ultimate destination for books across all genres. Discover, read, and expand your horizons.</p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Best Sellers</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">New Releases</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Special Offers</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Book Categories</a></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary">Customer Service</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">My Account</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Order History</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Track Order</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Returns & Refunds</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary">Contact Us</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-primary" />
                                <span className="text-muted-foreground">(123) 456-7890</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="text-primary" />
                                <span className="text-muted-foreground">support@bookstore.com</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin size={16} className="text-primary mt-1" />
                                <span className="text-muted-foreground">123 Reading Lane, Bookville, BK 12345</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-12 pt-8 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <Truck size={24} className="mb-2 text-primary" />
                            <h4 className="font-semibold mb-1">Free Shipping</h4>
                            <p className="text-sm text-muted-foreground">On orders over $50</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <CreditCard size={24} className="mb-2 text-primary" />
                            <h4 className="font-semibold mb-1">Secure Payment</h4>
                            <p className="text-sm text-muted-foreground">100% secure payment</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Shield size={24} className="mb-2 text-primary" />
                            <h4 className="font-semibold mb-1">Money Back Guarantee</h4>
                            <p className="text-sm text-muted-foreground">Within 30 days</p>
                        </div>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-xl font-bold mb-2 text-primary">Subscribe to Our Newsletter</h3>
                            <p className="text-muted-foreground">Stay updated with new releases and exclusive offers</p>
                        </div>
                        <div className="w-full md:w-2/5">
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="bg-background border border-input text-foreground py-2 px-4 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                                />
                                <button className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-r-md font-medium transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-muted py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-muted-foreground text-sm">© 2025 BookStore. All rights reserved.</p>
                        </div>
                        <div>
                            <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Cookies Settings</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;