import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteType } from '../constants/routeTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { requestPermissionAndGetToken } from '../assets/js/firebase-messaging';

const PrivateRoute = ({ children, routeType, path }: { children: React.ReactElement, routeType: number, path?: string }) => {
    const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const registerServiceWorker = async () => {
            if ("serviceWorker" in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
                    setSwRegistration(registration);

                    const fcmToken = localStorage.getItem("fcmToken");
                    if (!fcmToken && isAuthenticated) {
                        await requestPermissionAndGetToken(registration);
                    }
                } catch (err) {
                    console.error("SW registration error:", err);
                }
            }
        };

        registerServiceWorker();
    }, [isAuthenticated]);

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