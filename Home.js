import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import ContactUs from './ContactUs';
import './Home.css';
import DashboardMenu from './DashboardMenu';

const Home = ({ onLogin }) => {
    const [activeComponent, setActiveComponent] = useState(null);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'register':
                return <Register />;
            case 'login':
                return <Login onLogin={onLogin} />;
            case 'viewMenu':
                return <DashboardMenu />;
            case 'contactUs':
                return <ContactUs />;
            default:
                return null;
        }
    };

    return (
        <div className="home-container">
            <h1>Welcome to Sunshine Bakery</h1>
            <div className="home-buttons">
                <button onClick={() => setActiveComponent('register')}>Register</button>
                <button onClick={() => setActiveComponent('login')}>Login</button>
                <button onClick={() => setActiveComponent('viewMenu')}>View Menu</button>
                <button onClick={() => setActiveComponent('contactUs')}>Contact Us</button>
            </div>
            <div className="component-container">
                {renderComponent()}
            </div>
        </div>
    );
};

export default Home;