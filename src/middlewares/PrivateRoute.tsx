import React from 'react';
import { Navigate } from 'react-router-dom';
import { RouteType } from '../constants/routeTypes';
import { getString } from '../utils/localStorageUtils';

const PrivateRoute = ({ children, routeType, path }: { children: React.ReactElement, routeType: number, path?: string }) => {
    const isAuthenticated = !!getString('token');

    if (routeType === RouteType.PRIVATE && !isAuthenticated) {
        if (path) {
            return (<Navigate to={`/signin?continue=${path}`} />);
        }
        return (<Navigate to="/signin" />);
    }

    if (routeType === RouteType.NOT_ALLOW_AUTH && isAuthenticated) {
        return (<Navigate to="/" />);
    }
    return children;

};

export default PrivateRoute;