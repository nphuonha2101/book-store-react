import { Blank } from '../components/layout/Blank';
import { Master } from '../components/layout/Master';
import { Home } from '../components/pages/Home/Home';
import { SignIn } from '../components/pages/SignIn/SignIn';
import { RouteType } from '../constants/RouteTypes';
import { RouteProps } from '../types/Route/Route';

export const routes: RouteProps[] = [
    {
        path: '/',
        Component: Home,
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