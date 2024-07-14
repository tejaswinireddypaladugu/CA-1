import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FeedbackForm.css';
import UserDashboard from './UserDashboard';

const Feedback = ({ onLogout }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [feedbacks, setFeedbacks] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    const ratingSymbols = ['😡', '😟', '😐', '😊', '😍'];

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const newFeedback = { username, email, comment, rating };
    
        try {
            const response = await axios.post('http://localhost:5000/api/feedback', newFeedback);
            setFeedbacks([...feedbacks, response.data]);
            setUsername('');
            setEmail('');
            setComment('');
            setRating(0);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Hide pop-up after 3 seconds
        } catch (error) {
            console.error('There was an error submitting the feedback!', error);
            // Optionally, display an error message to the user
        }
    };

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/feedback');
                setFeedbacks(response.data);
            } catch (error) {
                console.error('There was an error fetching the feedbacks!', error);
            }
        };

        fetchFeedbacks();
    }, []);

    return (
        <div className="feedback">
            <UserDashboard username={username} onLogout={onLogout} />
            <h2>Customer Feedback</h2>
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
                    <label>Comment:</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} required></textarea>
                </div>
                <div>
                    <label>Rating:</label>
                    <div className="rating">
                        {ratingSymbols.map((symbol, index) => (
                            <span
                                key={index}
                                className={`rating-symbol ${rating === index + 1 ? 'selected' : ''}`}
                                onClick={() => setRating(index + 1)}
                            >
                                {symbol}
                            </span>
                        ))}
                    </div>
                </div>
                <button type="submit">Submit</button>
            </form>
            {showPopup && <div className="popup">Feedback submitted successfully!</div>}
        </div>
    );
};

export default Feedback;