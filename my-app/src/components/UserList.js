import React, { useState, useEffect } from 'react';
import { toggleStatus as updateUserStatus } from './toggleStatus'; // Adjust the file path if needed

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingUser, setUpdatingUser] = useState(null);

    useEffect(() => {
        fetch('/api/users/')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch users');
                }
                return res.json();
            })
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const handleToggleBlockStatus = (userId, isActive) => {
        const newStatus = !isActive;

        // Optimistic update
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, is_active: newStatus } : user
            )
        );

        setUpdatingUser(userId); // Indicate which user is being updated

        updateUserStatus(userId, isActive, getCsrfToken())
            .then((updatedStatus) => {
                console.log(`User ${userId} status updated to ${updatedStatus ? 'Active' : 'Blocked'}`);
            })
            .catch(() => {
                alert('An error occurred while updating the user status');
                // Revert optimistic update on error
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === userId ? { ...user, is_active: isActive } : user
                    )
                );
            })
            .finally(() => {
                setUpdatingUser(null); // Clear the updating state
            });
    };

    const getCsrfToken = () => {
        const cookieValue = document.cookie
            .split('; ')
            .find((row) => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    };

    if (loading) {
        return <div>Loading users...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mt-5">
            <h3 className="text-center bg-secondary text-light p-3">User List</h3>
            <table className="table border">
                <thead>
                    <tr className="text-center">
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Last Login</th>
                        <th>Action</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr className="text-center" key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.last_login}</td>
                            <td>
                                <button
                                    type="button"
                                    className={`btn ${user.is_active ? 'btn-danger' : 'btn-success'}`}
                                    onClick={() => handleToggleBlockStatus(user.id, user.is_active)}
                                    disabled={updatingUser === user.id} // Disable if this user is being updated
                                >
                                    {updatingUser === user.id ? (
                                        <span className="spinner-border spinner-border-sm"></span> // Show spinner while updating
                                    ) : user.is_active ? (
                                        'Block'
                                    ) : (
                                        'Unblock'
                                    )}
                                </button>
                            </td>
                            <td>{user.is_active ? 'Active' : 'Blocked'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;
