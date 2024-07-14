import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PrebookingForm.css';
import UserDashboard from './UserDashboard';

const PrebookingForm = ({onLogout}) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [specialRequests, setSpecialRequests] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [comment, setComment] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/menu_items');
                setMenuItems(response.data);
            } catch (error) {
                console.error('There was an error fetching the menu items!', error);
            }
        };

        fetchMenuItems();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newPrebooking = { 
            username, 
            email, 
            phone, 
            item_name: itemName, 
            quantity, 
            special_requests: specialRequests, 
            date, 
            time, 
            comment 
        };

        try {
            await axios.post('http://localhost:5000/api/prebookings', newPrebooking);
            setUsername('');
            setEmail('');
            setPhone('');
            setItemName('');
            setQuantity(1);
            setSpecialRequests('');
            setDate('');
            setTime('');
            setComment('');
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Hide pop-up after 3 seconds
        } catch (error) {
            console.error('There was an error submitting the prebooking!', error);
        }
    };

    return (
        <div className="prebooking-form">
            <UserDashboard username={username} onLogout={onLogout} />
            <h2>Prebook Your Bakery Items</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Phone:</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div>
                    <label>Item Name:</label>
                    <select value={itemName} onChange={(e) => setItemName(e.target.value)} required>
                        <option value="">Select Item</option>
                        {menuItems.map(item => (
                            <option key={item.id} value={item.name}>
                                {item.name} - ${item.price.toFixed(2)}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Quantity:</label>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" />
                </div>
                <div>
                    <label>Special Requests:</label>
                    <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)}></textarea>
                </div>
                <div>
                    <label>Date:</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                    <label>Time:</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
                <div>
                    <label>Comment:</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
            {showPopup && <div className="popup">Prebooking submitted successfully!</div>}
        </div>
    );
};

export default PrebookingForm;
