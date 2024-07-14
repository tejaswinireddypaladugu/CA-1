import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import './ManageFeedback.css';

const ManageFeedback = ({ username, onLogout }) => {
    const [feedback, setFeedback] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc'); // State for sorting order

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = () => {
        axios.get('http://localhost:5000/api/admin/feedback')
            .then(response => {
                setFeedback(response.data);
            })
            .catch(error => {
                console.error('Error fetching feedback:', error);
            });
    };

    const sortFeedback = () => {
        const sortedFeedback = [...feedback].sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setFeedback(sortedFeedback);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/admin/feedback/${id}`)
            .then(response => {
                alert('Feedback deleted successfully');
                fetchFeedback();
            })
            .catch(error => {
                console.error('Error deleting feedback:', error);
            });
    };

    return (
        <div className="container">
            <AdminDashboard username={username} onLogout={onLogout} />
            <h2>Manage Feedback</h2>
            <button className="button" onClick={sortFeedback}>
                Sort by Date ({sortOrder === 'asc' ? 'Oldest First' : 'Latest First'})
            </button>
            <div className="feedback-list">
                {feedback.map(item => (
                    <div key={item.id} className="feedback-item">
                        <p><strong>Username:</strong> {item.username}</p>
                        <p><strong>Feedback:</strong> {item.feedback}</p>
                        <p><strong>Date:</strong> {new Date(item.created_at).toLocaleString()}</p>
                        <button className="button" onClick={() => handleDelete(item.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageFeedback;