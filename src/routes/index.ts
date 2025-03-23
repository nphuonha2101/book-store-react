import { Blank } from '../components/layout/Blank';
import { Master } from '../components/layout/Master';
import { Home } from '../components/pages/Home/Home';
import { SignIn } from '../components/pages/SignIn/SignIn';
import { RouteType } from '../constants/routeTypes.ts';
import { RouteProps } from '../types/Route/routeProps.ts';
import SearchResults from '../components/pages/Search/SearchResults.tsx';

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
    // AUTH
    {
        path: '/signin',
        Component: SignIn,
        Layout: Blank,
        routeType: RouteType.PUBLIC
    }
];