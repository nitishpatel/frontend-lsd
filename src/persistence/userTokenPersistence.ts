const get = () => localStorage.getItem('userToken');
const set = (value: any) => localStorage.setItem('userToken', value);
const clear = () => localStorage.removeItem('userToken');

export default { get, set, clear };
