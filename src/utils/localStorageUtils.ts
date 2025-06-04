export const saveString = (key: string, value: string, storage = 'local') => {
    if (storage === 'session') {
        sessionStorage.setItem(key, value);
        return;
    }
    localStorage.setItem(key, value);
}

export const getString = (key: string, storage = 'local'): string | null => {
    if (storage === 'session') {
        return sessionStorage.getItem(key);
    }
    return localStorage.getItem(key);
}

export const saveArray = (key: string, value: string[], storage = 'local') => {
    if (storage === 'session') {
        sessionStorage.setItem(key, JSON.stringify(value));
        return;
    }
    localStorage.setItem(key, JSON.stringify(value));
}

export const getArray = (key: string, storage = 'local'): string[] | null => {
    const item = storage === 'session' ? sessionStorage.getItem(key) : localStorage.getItem(key);
    if (item) {
        return JSON.parse(item);
    }
    return null;
}

export const saveObject = (key: string, value: object, storage = 'local') => {
    if (storage === 'session') {
        sessionStorage.setItem(key, JSON.stringify(value));
        return;
    }
    localStorage.setItem(key, JSON.stringify(value));
}
export const getObject = (key: string, storage = 'local'): object | null => {
    const item = storage === 'session' ? sessionStorage.getItem(key) : localStorage.getItem(key);
    if (item) {
        return JSON.parse(item);
    }
    return null;

}

export const removeItem = (key: string, storage = 'local') => {
    if (storage === 'session') {
        sessionStorage.removeItem(key);
        return;
    }
    localStorage.removeItem(key);
}