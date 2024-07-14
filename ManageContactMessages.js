import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import './ManageContactMessages.css';

const ManageContactMessages = ({ username, onLogout }) => {
    const [messages, setMessages] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = () => {
        axios.get('http://localhost:5000/api/admin/contact_messages')
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });
    };

    const sortMessages = () => {
        const sortedMessages = [...messages].sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setMessages(sortedMessages);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/admin/contact_messages/${id}`)
            .then(response => {
                alert('Message deleted successfully');
                fetchMessages();
            })
            .catch(error => {
                console.error('Error deleting message:', error);
            });
    };

    return (
        <div className="container">
            <AdminDashboard username={username} onLogout={onLogout} />
            <h2>Contact Messages</h2>
            <button onClick={sortMessages}>
                Sort by Date ({sortOrder === 'asc' ? 'Oldest First' : 'Latest First'})
            </button>
            <div className="messages-list">
                {messages.map(message => (
                    <div key={message.id} className="message">
                        <p><strong>Name:</strong> {message.name}</p>
                        <p><strong>Email:</strong> {message.email}</p>
                        <p><strong>Message:</strong> {message.message}</p>
                        <p><strong>Date:</strong> {new Date(message.created_at).toLocaleString()}</p>
                        <button onClick={() => handleDelete(message.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageContactMessages;
