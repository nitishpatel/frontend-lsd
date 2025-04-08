const get = (key: string) => {
  const value = localStorage.getItem(key);

  if (value === null) {
    return value;
  }

  return JSON.parse(value);
};

const set = (key: string, value: JSON) => localStorage.setItem(key, JSON.stringify(value));

const clear = (key: string) => localStorage.removeItem(key);

export default { get, set, clear };
