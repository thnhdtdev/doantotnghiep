// AdminService.js
import axios from 'axios';

export const getStats = async (accessToken) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin/stats`, {
        headers: {
            token: `Bearer ${accessToken}`,
        }
    });
    return res.data;
};
