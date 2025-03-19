export const API_INFO = {
    BASE_URL: import.meta.env.VITE_REACT_APP_API_BASE_URL,
    API_VERSION: import.meta.env.VITE_REACT_APP_API_VERSION,
    // API_KEY: process.env.REACT_APP_API_KEY,
    // API_SECRET: process.env.REACT_APP_API_SECRET,
} as const;

export const API_ENDPOINTS = {
    SLIDER: {
        GET_SLIDER: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/sliders/all`,
        }
    }
} as const;