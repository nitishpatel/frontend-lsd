const get = () => localStorage.getItem('userName');
const set = (value: any) => localStorage.setItem('userName', value);
const clear = () => localStorage.removeItem('userName');

export default { get, set, clear };
