import { Blank } from '../components/layout/Blank';
import { Master } from '../components/layout/Master';
import { Home } from '../components/pages/Home/Home';
import { SignIn } from '../components/pages/SignIn/SignIn';
import { RouteProps } from '../types/Route/routeProps.ts';
import SearchResults from '../components/pages/Search/SearchResults.tsx';
import {RouteType} from "../constants/RouteTypes.ts";
import {BookDetail} from "../components/vendor/Book/BookDetail.tsx";

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
    }
];