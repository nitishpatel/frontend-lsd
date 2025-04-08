const ENV = import.meta.env;

export const PAGE_URL = `${window.location.protocol}//${window.location.hostname}`;
export const API_URL = ENV.VITE_APP_API_URL || `${PAGE_URL}:8000/`;
export const VITE_APP_WALLET_CONNECT_PROJECT_ID = ENV.VITE_APP_WALLET_CONNECT_PROJECT_ID;
export const GRAPHQL_API_URL = ENV.VITE_APP_GRAPHQL_URL || `${PAGE_URL}:4000/`;
