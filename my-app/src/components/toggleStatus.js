export const toggleStatus = async (userId, isActive, csrfToken) => {
    const newStatus = !isActive;

    try {
        const response = await fetch(`/update_user_status/${userId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ is_active: newStatus }),
        });

        if (!response.ok) {
            throw new Error('Failed to update user status');
        }

        console.log(`Status updated successfully for user ${userId}`);
        return newStatus; // Return the new status if the update is successful
    } catch (error) {
        console.error('Error updating user status:', error);
        throw error; // Re-throw the error to handle it in the calling component
    }
};
