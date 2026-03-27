import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TabMenu } from 'primereact/tabmenu';
import { useNavigate, useLocation } from 'react-router-dom';

// Pages placeholders
import UsersPage from './pages/Users/UsersPage';
import HotelsPage from './pages/Hotels/HotelsPage';
import BookingsPage from './pages/Bookings/BookingsPage';

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { label: 'Users', icon: 'pi pi-users', command: () => navigate('/users') },
        { label: 'Hotels', icon: 'pi pi-building', command: () => navigate('/hotels') },
        { label: 'Bookings', icon: 'pi pi-calendar', command: () => navigate('/bookings') }
    ];

    // Find active index
    let activeIndex = 0;
    if (location.pathname.startsWith('/hotels')) activeIndex = 1;
    if (location.pathname.startsWith('/bookings')) activeIndex = 2;

    return (
        <div className="layout-wrapper" style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                Hotel Booking Management System
            </h1>
            
            <div className="card">
                <TabMenu model={items} activeIndex={activeIndex} style={{ marginBottom: '2rem' }} />
                
                <Routes>
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/hotels" element={<HotelsPage />} />
                    <Route path="/bookings" element={<BookingsPage />} />
                    <Route path="/" element={<Navigate to="/users" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
