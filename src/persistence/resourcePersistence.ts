const get = (key: any) => localStorage.getItem(key);
const set = (key: any, value: any) => localStorage.setItem(key, value);
const clear = (key: any) => localStorage.removeItem(key);

const localStorageFunctions = { get, set, clear };

export default localStorageFunctions;
