import { useState, useEffect } from 'react';
import axios from 'axios';

const useProfile = (user_id = null, headers, reloadProfile = false) => {
    const [profile, setProfile] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [errorProfile, setErrorProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            // If no valid headers are provided, don't try to fetch
            if (!headers || !headers.Authorization || headers.Authorization === 'Bearer null') {
                setProfile(null);
                return;
            }
            setLoadingProfile(true);
            try {
                const response = await axios.get(process.env.REACT_APP_API_USER_PROFILE, { headers });
                
                if (response.data.status === 200) {
                    setProfile(response.data.profile); 
                } else {
                    setErrorProfile(response.data);
                    console.error('Failed to fetch profile:', response.data);
                }
            } catch (err) {
                setErrorProfile('Error retrieving profile');
                console.error('Error:', err);
                // Reset profile on error
                setProfile(null);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, [user_id, headers, reloadProfile]);

    return { profile, loadingProfile, errorProfile };
};

export default useProfile;