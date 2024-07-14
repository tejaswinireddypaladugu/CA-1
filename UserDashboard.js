import React from 'react';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = ({ username, onLogout }) => {
    const handleLogout = () => {
        if (typeof onLogout === 'function') {
            onLogout();
        }
    };

    return (
        <div className="user-dashboard">
            <h1>Welcome to Your Dashboard, {username}!</h1>
            <nav>
                <ul>
                    <li><Link to="/api/user/menu">View Menu</Link></li>
                    <li><Link to="/api/place_order">Place Order</Link></li>
                    <li><Link to="/api/prebookings">Prebookings</Link></li>
                    <li><Link to="/api/contact_messages">Contact Us</Link></li>
                    <li><Link to="/api/feedbacks">Feedback</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </nav>
        </div>
    );
};

export default UserDashboard;