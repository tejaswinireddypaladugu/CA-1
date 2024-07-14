import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManagePrebookings.css';
import AdminDashboard from './AdminDashboard';

const ManagePrebookings = ({username, onLogout}) => {
    const [prebookings, setPrebookings] = useState([]);

    useEffect(() => {
        const fetchPrebookings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/prebookings');
                setPrebookings(response.data);
            } catch (error) {
                console.error('There was an error fetching the prebookings!', error);
            }
        };

        fetchPrebookings();
    }, []);

    return (
        <div className="prebooking-list">
            <AdminDashboard username={username} onLogout={onLogout} />
            <h2>Prebookings</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Special Requests</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Comment</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {prebookings.map((prebooking) => (
                        <tr key={prebooking.id}>
                            <td>{prebooking.username}</td>
                            <td>{prebooking.email}</td>
                            <td>{prebooking.phone}</td>
                            <td>{prebooking.item_name}</td>
                            <td>{prebooking.quantity}</td>
                            <td>{prebooking.special_requests}</td>
                            <td>{prebooking.date}</td>
                            <td>{prebooking.time}</td>
                            <td>{prebooking.comment}</td>
                            <td>{prebooking.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManagePrebookings;
