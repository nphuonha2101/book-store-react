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
        },
    },

    BOOK: {
        GET_BOOKS: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/books/all`,
        },

        BOOK_DETAIL: {
            URL_DETAIL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/books`,
        },
        SUGGESTIONS: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/books/suggest`,
        },
        SEARCH: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/books/search`,
        },
        FILTER: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/books/filter`,
        },
        GET_REVIEW: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/books/reviews`,
        }
    },
    CATEGORY: {
        GET_CATEGORIES: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/categories/all`,
        },
    },
    CART: {
        GET_CART: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/carts/all`,
        },
        GET_CART_BY_USER: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/carts/`,
        },
        ADD_TO_CART: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/carts/add`,
        },
        REMOVE_FROM_CART: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/carts/delete`,
        },
        UPDATE_CART: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/carts/update`,
        },
    },
    AUTH: {
        SIGN_IN: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/login`,
        },
        SIGN_UP: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/register`,
        },
        ME: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/me`,
        },
        UPDATE: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/update`,
        },
        OAUTH2: {
            GOOGLE: {
                URL: `${API_INFO.BASE_URL}/oauth2/authorization/google`,
            }
        }
    }
} as const;