import React from 'react';
import { Navigate } from 'react-router-dom';
import { RouteType } from '../constants/routeTypes';
import { getString } from '../utils/localStorageUtils';

const PrivateRoute = ({ children, routeType }: { children: React.ReactElement, routeType: number }) => {
    const isAuthenticated = !!getString('token');

    if (routeType === RouteType.PRIVATE && !isAuthenticated) {
        return (<Navigate to="/signin" />);
    }

    if (routeType === RouteType.NOT_ALLOW_AUTH && isAuthenticated) {
        return (<Navigate to="/" />);
    }
    return children;

};

export default PrivateRoute;