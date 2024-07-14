import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import './ManageOrders.css'; // Import your CSS file

const ManageOrders = ({ username, onLogout }) => {
    const [orders, setOrders] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc'); // State for sorting order

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        axios.get('http://localhost:5000/api/admin/orders')
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the orders!', error);
            });
    };

    const sortOrders = () => {
        const sortedOrders = [...orders].sort((a, b) => {
            const dateA = new Date(a.order_date);
            const dateB = new Date(b.order_date);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setOrders(sortedOrders);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="container">
            <AdminDashboard username={username} onLogout={onLogout} />
            <h2>Manage Orders</h2>
            <button className="button" onClick={sortOrders}>
                Sort by Order Date ({sortOrder === 'asc' ? 'Oldest First' : 'Latest First'})
            </button>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Order Date</th>
                        <th>Total Amount</th>
                        <th>Quantity</th>
                        <th>Order Items</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{new Date(order.order_date).toLocaleString()}</td>
                            <td>€{parseFloat(order.total_amount).toFixed(2)}</td>
                            <td>{order.quantity}</td>
                            <td>{order.order_items}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageOrders;