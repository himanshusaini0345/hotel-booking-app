import { Routes, Route, Navigate } from 'react-router-dom';
import { TabMenu } from 'primereact/tabmenu';
import { useNavigate, useLocation } from 'react-router-dom';

// Pages placeholders
import UsersPage from './pages/Users/UsersPage';
import HotelsPage from './pages/Hotels/HotelsPage';
import BookingsPage from './pages/Bookings/BookingsPage';

const NAV_ITEMS = [
    { label: 'Users', icon: 'pi pi-users', path: '/users', element: <UsersPage /> },
    { label: 'Hotels', icon: 'pi pi-building', path: '/hotels', element: <HotelsPage /> },
    { label: 'Bookings', icon: 'pi pi-calendar', path: '/bookings', element: <BookingsPage /> }
];

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine the active index based on the current location
    const activeIndex = NAV_ITEMS.findIndex(item => location.pathname.startsWith(item.path));
    const normalizedIndex = activeIndex >= 0 ? activeIndex : 0;

    const onTabChange = (e: { index: number }) => {
        navigate(NAV_ITEMS[e.index].path);
    };

    return (
        <div className="layout-wrapper" style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                Hotel Booking Management System
            </h1>
            
            <div className="card">
                <TabMenu 
                    model={NAV_ITEMS} 
                    activeIndex={normalizedIndex} 
                    onTabChange={onTabChange}
                    style={{ marginBottom: '2rem' }} 
                />
                
                <Routes>
                    {NAV_ITEMS.map(item => (
                        <Route key={item.path} path={item.path} element={item.element} />
                    ))}
                    <Route path="/" element={<Navigate to="/users" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
