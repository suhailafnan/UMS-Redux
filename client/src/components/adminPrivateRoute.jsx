import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export function AdminPrivateRoute() {
    const { currentUser } = useSelector(state => state.user);

    // Check if currentUser is available and if they are an admin
    if (!currentUser) {
        return <Navigate to='/admin/sign-in' />;
    }

    return currentUser.isAdmin ? <Outlet /> : <Navigate to='/admin/sign-in' />;
}