import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

// Add JWT token to every request
instance.interceptors.request.use((config) => {
<<<<<<< Updated upstream
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});
=======
    const token = localStorage.getItem('foodFusionUser');
    const parsedToken = token ? JSON.parse(token).token : null; // Adjust based on your storage structure
    
    if (parsedToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${parsedToken}`;
    }
    return config;
  });
>>>>>>> Stashed changes

export default instance;
