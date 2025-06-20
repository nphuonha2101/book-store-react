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
    SEND_MAIL: {

        SEND: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/contacts`,
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
    WISHLIST: {
        GET_WISHLIST: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/wishlists/all`,
        },
        GET_WISHLIST_BY_USER: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/wishlists/userId`,
        },
        ADD_TO_WISHLIST: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/wishlists/add`,
        },
        REMOVE_FROM_WISHLIST: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/wishlists/delete`,
        },

    },
    CART: {
        GET_CART: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/carts`,
        },
        GET_CART_BY_USER: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/carts/me`,
        },
        ADD_TO_CART: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/carts/add`,
        },
        REMOVE_FROM_CART: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/carts/delete`,
        },
        UPDATE_CART: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/carts/update`,
        },
        CLEAR_CART: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/carts/clear`,
        },

    },
    VOUCHER: {
        GET_VOUCHERS: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/vouchers/all`,
        },
        APPLY: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/vouchers/apply`,
        },
    },
    RIBBON: {
        ALL: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/ribbons/all`,
        }
    },
    AUTH: {
        EMAIL_EXISTS: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/exist-email`,
        },
        SIGN_IN: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/login`,
        },
        SIGN_UP: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/register`,
        },
        ME: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/me`,
        },
        FORGOT_PASSWORD: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/forgot-password`,
        },
        UPDATE: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/update`,
        },
        OAUTH2: {
            GOOGLE: {
                URL: `${API_INFO.BASE_URL}/oauth2/authorization/google`,
            }
        },
        FCM_TOKEN: {
            ADD: {
                URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/fcm/token`,
            },
            DELETE: {
                URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/fcm/delete`,
            },
        },
        NOTIFICATION: {
            GET: {
                URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/notifications`,
            },
            UNREAD_COUNT: {
                URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/notifications/unread/count`,
            },
            READ: {
                URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/notifications/mark-as-read`,
            },
            READ_ALL: {
                URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/notifications/mark-as-read-all`,
            },
        }
    },
    ADDRESS: {
        GET_ADDRESS: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/addresses`,
        },
        ADD_ADDRESS: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/addresses/add`,
        },
        UPDATE_ADDRESS: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/addresses/update`,
        },
        DELETE_ADDRESS: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/addresses/delete`,
        },
    },
    ORDER: {
        PLACE_ORDER: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/orders/order`,
        },
        GET_HISTORY: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/orders/history`,
        },
        CANCLE_ORDER: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/orders/cancel`,
        },
        GET_BY_ID: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/orders`,
        },
        MAKE_FAILED: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/auth/orders/make-failed`,
        }
    },
    TRANSCRIBE: {
        URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/vosk/transcribe`,
    },
    REVIEW: {
        GET_BOOK_REVIEWS: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/reviews`,
        },
        ADD_REVIEW: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/reviews`,
        },
        METADATA_BY_BOOK: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/reviews/metadata`,
        },
        CAN_REVIEW: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/reviews/can-review`,
        },
    },
    CHAT: {
        SEND: {
            URL: `${API_INFO.BASE_URL}/api/${API_INFO.API_VERSION}/chat/send`,
        }
    }
} as const;