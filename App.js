import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import ContactUs from './components/ContactUs';
import PlaceOrder from './components/PlaceOrder';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import ManageMenu from './components/ManageMenu';
import ManageOrders from './components/ManageOrders';
import Register from './components/Register';
import Login from './components/Login';
import Menu from './components/Menu';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardMenu from './components/DashboardMenu';
import ManageContactMessages from './components/ManageContactMessages';
import ContactMessages from './components/ContactMessage';
import { UserProvider } from './context/UserContext';
import Feedback from './components/Feedback';
import ManageFeedback from './components/ManageFeedback';
import PrebookingForm from './components/PreBookingForm';
import ManagePrebookings from './components/ManagePrebookings';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <UserProvider>
            <Router>
                <div className="app-container">
                    <Routes>
                        <Route path="/" element={<Home onLogin={handleLogin} />} />
                        <Route path="/api/menu" element={<DashboardMenu />} />
                        <Route path="/api/contact" element={<ContactUs />} />
                        <Route path="/api/place_order" element={<PlaceOrder onLogout={handleLogout} />} />
                        <Route path="/api/feedbacks" element={<Feedback onLogout={handleLogout} />} />
                        <Route path="/api/prebookings" element={<PrebookingForm onLogout={handleLogout} />} />
                        <Route path="/api/register" element={<Register />} />
                        <Route path="/api/login" element={<Login onLogin={handleLogin} />} />

                        {user && user.role === 'admin' && (
                            <>
                                <Route path="/api/admin/dashboard" element={<AdminDashboard username={user.username} onLogout={handleLogout} />} />
                                <Route path="/api/admin/menu" element={<ManageMenu username={user.username} onLogout={handleLogout}/>} />
                                <Route path="/api/admin/orders" element={<ManageOrders username={user.username} onLogout={handleLogout}/>} />
                                <Route path="/api/admin/prebookings" element={<ManagePrebookings username={user.username} onLogout={handleLogout}/>} />
                                <Route path="/api/admin/contact_messages" element={<ManageContactMessages username={user.username} onLogout={handleLogout}/>} />
                                <Route path="/api/admin/feedbacks" element={<ManageFeedback username={user.username} onLogout={handleLogout}/>} />
                                <Route path="/api/admin" element={<Navigate to="/api/admin/dashboard" />} />
                            </>
                        )}

                        {user && user.role === 'user' && (
                            <>
                                <Route path="/api/user/dashboard" element={<UserDashboard username={user.username} onLogout={handleLogout} />} />
                                <Route path="/api/user/menu" element={<Menu username={user.username} onLogout={handleLogout}/>} />
                                <Route path="/api/place_order" element={<PlaceOrder username={user.username} onLogout={handleLogout}/>} />
                                <Route path="/api/prebookings" element={<PrebookingForm username={user.username} onLogout={handleLogout}/>} />
                                <Route path="/api/contact_messages" element={<ContactMessages username={user.username} onLogout={handleLogout}/>} />
                                <Route path="/api/feedbacks" element={<Feedback username={user.username} onLogout={handleLogout}/>} />
                                <Route path="/user" element={<Navigate to="/api/user/dashboard" />} />
                            </>
                        )}

                        {!isLoggedIn && (
                            <>
                                <Route path="/api/login" element={<Login onLogin={handleLogin} />} />
                                <Route path="/api/register" element={<Register />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </>
                        )}
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
};

export default App;
