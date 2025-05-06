import { Blank } from '../components/layout/Blank';
import { Master } from '../components/layout/Master';
import { Home } from '../components/pages/Home/Home';
import { SignIn } from '../components/pages/SignIn/SignIn';
import { RouteProps } from '../types/Route/routeProps.ts';
import SearchResults from '../components/pages/Search/SearchResults.tsx';
import { BookDetail } from "../components/pages/BookDetail/BookDetail.tsx";
import { SignUp } from "../components/pages/SignUp/SignUp.tsx";
import { UserProfile } from '../components/pages/User/UserProfile.tsx';
import { RouteType } from "../constants/routeTypes.ts";
import { Cart } from "../components/pages/Cart/Cart.tsx";
import Wishlist from "../components/pages/WishList/WishList.tsx";
import { UserAddress } from "../components/pages/User/UserAddress.tsx";
import { ForgotPassword } from '../components/pages/FogotPasswd/FogotPasswd.tsx';
import { Checkout } from '../components/pages/Checkout/Checkout.tsx';
import Products from '../components/pages/Products/Products.tsx';
import { ContactAbout } from "../components/pages/Contact/Contact.tsx";
import { OrderSuccess } from '../components/pages/OrderStatus/OrderSuccess.tsx';
import { OrderFailed } from '../components/pages/OrderStatus/OrderFailed.tsx';
import OrderHistory from '../components/vendor/Order/OrderHistory.tsx';
import OrderDetail from '../components/vendor/Order/OrderDetail.tsx';

export const routes: RouteProps[] = [
    {
        path: '/',
        Component: Home,
        Layout: Master,
        routeType: RouteType.PUBLIC
    },
    {
        path: '/search',
        Component: SearchResults,
        Layout: Master,
        routeType: RouteType.PUBLIC
    },
    {
        path: '/books/:id',
        Component: BookDetail,
        Layout: Master,
        routeType: RouteType.PUBLIC

    },
    {
        path: '/signin',
        Component: SignIn,
        Layout: Blank,
        routeType: RouteType.NOT_ALLOW_AUTH
    },
    {
        path: '/profile',
        Component: UserProfile,
        Layout: Master,
        routeType: RouteType.PRIVATE
    },
    {
        path: '/addresses',
        Component: UserAddress,
        Layout: Master,
        routeType: RouteType.PRIVATE
    },
    {
        path: '/signup',
        Component: SignUp,
        Layout: Blank,
        routeType: RouteType.NOT_ALLOW_AUTH
    },
    {
        path: '/carts',
        Component: Cart,
        Layout: Master,
        routeType: RouteType.PRIVATE
    },
    {
        path: '/forgot-password',
        Component: ForgotPassword,
        Layout: Blank,
        routeType: RouteType.NOT_ALLOW_AUTH
    },
    {
        path: '/wishlists',
        Component: Wishlist,
        Layout: Master,
        routeType: RouteType.PRIVATE
    },
    {
        path: '/checkout',
        Component: Checkout,
        Layout: Master,
        routeType: RouteType.PRIVATE
    },
    {
        path: '/products',
        Component: Products,
        Layout: Master,
        routeType: RouteType.PUBLIC
    },
    {
        path: '/contact-us',
        Component: ContactAbout,
        Layout: Master,
        routeType: RouteType.PUBLIC
    },
    {
        path: '/order-success/:orderId',
        Component: OrderSuccess,
        Layout: Master,
        routeType: RouteType.PRIVATE
    },
    {
        path: '/order-failed/:orderId',
        Component: OrderFailed,
        Layout: Master,
        routeType: RouteType.PRIVATE
    },
    {
        path: '/orders',
        Component: OrderHistory,
        Layout: Master,
        routeType: RouteType.PRIVATE
    },
    {
        path: '/orders/:id',
        Component: OrderDetail,
        Layout: Master,
        routeType: RouteType.PRIVATE
    }
];