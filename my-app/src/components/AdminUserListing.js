// AdminUserListing.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUserListing = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch the list of users from your backend
    axios.get('http://127.0.0.1:8000/admin/users/', {
      headers: {
        Authorization: `Token ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(response => {
      setUsers(response.data);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
  }, []);

  const toggleBlockStatus = (userId, currentStatus) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setErrorMessage('You must be logged in to perform this action.');
      return;
    }

    // Send the request to block/unblock the user
    axios.post(`http://127.0.0.1:8000/admin/block-unblock/${userId}/`, {}, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then(response => {
      // Update user list after the status change
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: !currentStatus } : user
      ));
    })
    .catch(error => {
      setErrorMessage('Failed to update user status.');
      console.error('Error blocking/unblocking user:', error);
    });
  };

  return (
    <div>
      <h1>Admin - User Listing</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.is_active ? 'Active' : 'Blocked'}</td>
              <td>
                <button
                  className={`btn ${user.is_active ? 'btn-danger' : 'btn-success'}`}
                  onClick={() => toggleBlockStatus(user.id, user.is_active)}
                >
                  {user.is_active ? 'Block' : 'Unblock'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserListing;
