import { ArrowLeft, Trash2, ShoppingCart, Minus, Plus } from "lucide-react";
import {useEffect, useState} from "react";
import { Button } from "../../../shadcn-components/ui/button";
import useFetchPost from "../../../hooks/useFetchPost";
import { API_ENDPOINTS } from "../../../constants/apiInfo";
import {useNavigate } from "react-router-dom";
import {CartItem} from "../../../types/ApiResponse/Cart/cart.ts";

export default function CartItemComponent({ setIsCartOpen, userId }: { setIsCartOpen: (open: boolean) => void, userId: number }) {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Fetch cart items for the user
    const { data: fetchedCartItems } = useFetchPost<number, CartItem[]>(
        API_ENDPOINTS.CART.GET_CART_BY_USER.URL,
        userId,
        { autoFetch: true }
    );

    // Update cart items when fetched
    useEffect(() => {
        if (fetchedCartItems) {
            setCartItems(fetchedCartItems);
        }
    }, [fetchedCartItems]);

    // Calculate total price
    const calculateTotal = () => {
        return cartItems.reduce((total, item) =>
            total + (item.book?.price || 0) * (item.quantity || 0), 0
        );
    };

    // Update cart item quantity
    const updateQuantity = async (bookId: number, newQuantity: number) => {
        try {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const response = useFetchPost(API_ENDPOINTS.CART.UPDATE_CART.URL, {
                userId,
                book: {id: bookId},
                quantity: newQuantity
            });

            if (response) {
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item.book?.id === bookId
                            ? { ...item, quantity: newQuantity }
                            : item
                    )
                );
            }
        } catch (error) {
            console.error("Failed to update cart item", error);
        }
    };

    // Remove item from cart
    const removeCartItem = async (bookId: number) => {
        try {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useFetchPost(API_ENDPOINTS.CART.REMOVE_FROM_CART.URL, {
                userId,
                book: {id: bookId}
            });

            setCartItems(prevItems =>
                prevItems.filter(item => item.book?.id !== bookId)
            );
        } catch (error) {
            console.error("Failed to remove cart item", error);
        }
    };

    // Navigate to checkout
    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate("/checkout");
    };

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-fade-in">
            {/* Header */}
            <div className="border-b border-border p-4">
                <div className="flex items-center max-w-3xl mx-auto w-full">
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 text-muted-foreground hover:text-primary rounded-full hover:bg-muted mr-2 transition-colors"
                        aria-label="Close cart"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>

                    <div className="flex-1 flex items-center">
                        <ShoppingCart className="w-5 h-5 text-muted-foreground mr-2" />
                        <h2 className="text-lg font-medium text-foreground">
                            Giỏ hàng của bạn
                        </h2>
                    </div>
                </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto w-full p-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Giỏ hàng của bạn đang trống</p>
                            <Button
                                onClick={() => {
                                    setIsCartOpen(false);
                                    navigate("/books");
                                }}
                                className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                Khám phá sách
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.book?.id}
                                        className="flex items-center border border-border rounded-md p-4 gap-4"
                                    >
                                        {/* Book Image */}
                                        <img
                                            src={item.book?.coverImage}
                                            alt={item.book?.title}
                                            className="w-20 h-28 object-cover rounded-md"
                                        />

                                        {/* Book Details */}
                                        <div className="flex-1">
                                            <h3 className="font-medium text-foreground">
                                                {item.book?.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm">
                                                {item.book?.authorName}
                                            </p>
                                            <p className="font-semibold mt-2">
                                                ${item.book?.price?.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center border border-border rounded-full">
                                            <button
                                                onClick={() => updateQuantity(
                                                    item.book?.id || 0,
                                                    Math.max(1, (item.quantity || 1) - 1)
                                                )}
                                                className="p-2 hover:bg-muted rounded-l-full"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-4">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(
                                                    item.book?.id || 0,
                                                    (item.quantity || 1) + 1
                                                )}
                                                className="p-2 hover:bg-muted rounded-r-full"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeCartItem(item.book?.id || 0)}
                                            className="text-destructive hover:bg-destructive/10 p-2 rounded-full"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Total and Checkout */}
                            <div className="mt-6 border-t border-border pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-medium">Tổng cộng</span>
                                    <span className="text-xl font-bold">
                                        ${calculateTotal().toFixed(2)}
                                    </span>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground py-3"
                                >
                                    Thanh toán
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}