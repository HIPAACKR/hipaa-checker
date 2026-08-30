import axios from 'axios';
import { toast } from 'react-toastify';

import API_ENDPOINTS from '@/utils/apiEndpoints';

import { clearCookies } from './helper';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_BASE_URL_V2 = process.env.NEXT_PUBLIC_API_BASE_URL_V2;
export const LLM_BASE_URL = process.env.NEXT_PUBLIC_LLM_API_BASE_URL;

const getBaseUrl = (version) => {
  switch (version) {
    case 1:
      return API_BASE_URL;
    case 2:
      return API_BASE_URL_V2;
    case 3:
      return LLM_BASE_URL;
    default:
      return API_BASE_URL;
  }
};

// To prevent multiple toast and redirects
let isHandlingSessionExpiry = false;

const handleSessionExpired = () => {
  if (isHandlingSessionExpiry) return;

  clearCookies();
  localStorage.clear();

  const pathname = window.location.pathname;
  // Only show toast and redirect if inside /user-account
  if (pathname.startsWith('/user-account')) {
    isHandlingSessionExpiry = true;

    toast.error('Authentication failed, please Sign In again', {
      autoClose: 2500,
      onClose: () => {
        window.location.href = '/sign-in';
        isHandlingSessionExpiry = false;
      },
    });
  }
};

const createAxiosInstance = (version = 1, token = false) => {
  const baseURL = getBaseUrl(version);

  const instance = axios.create({
    baseURL: baseURL,
    withCredentials:
      typeof window !== 'undefined' && new URL(baseURL).origin === window.location.origin,
    headers: {
      Accept: '*/*',
    },
  });

  if (token) {
    const authHeaders = getAuthHeaders(true);
    if (authHeaders.Authorization) {
      instance.defaults.headers.common['Authorization'] = authHeaders.Authorization;
    }
  }

  instance.interceptors.request.use(
    (config) => {
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      } else {
        config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        handleSessionExpired();
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

const getAuthHeaders = (needsJWTToken ) => {
  if (!needsJWTToken) return {};

  try {
    const localData = JSON.parse(localStorage.getItem('user'));
    const jwt_token = localData?.jwt_token;

    return {
      Authorization: `Bearer ${jwt_token}`,
    };
  } catch (error) {
    return {
      Authorization: `Bearer undefined`,
    };
  }
}

export const post = async (
  url = '',
  data = {},
  token = false,
  multiform = false,
  version = 1,
  onUploadProgress = null,
  signal = null,
) => {
  const instance = createAxiosInstance(version, token);

  const config = {};

  if (onUploadProgress) {
    config.onUploadProgress = onUploadProgress;
  }

  if (signal) {
    config.signal = signal;
  }

  return instance.post(url, data, config);
};

export const put = async (
  url = '',
  data = {},
  token = false,
  multiform = false,
  version = 1,
  onUploadProgress = null,
  signal = null,
) => {
  const instance = createAxiosInstance(version, token);

  const config = {};

  if (onUploadProgress) {
    config.onUploadProgress = onUploadProgress;
  }

  if (signal) {
    config.signal = signal;
  }

  return instance.put(url, data, config);
};

export const patch = async (
  url = '',
  data = {},
  token = false,
  multiform = false,
  version = 1,
  onUploadProgress = null,
) => {
  const instance = createAxiosInstance(version, token);

  const config = {};

  if (onUploadProgress) {
    config.onUploadProgress = onUploadProgress;
  }

  return instance.patch(url, data, config);
};

export const get = async (url = '', token = false, version = 1) => {
  const instance = createAxiosInstance(version, token);
  return instance.get(url);
};

export const remove = async (url = '', token = false, version = 1) => {
  const instance = createAxiosInstance(version, token);
  return instance.delete(url);
};

export const getUserData = async (token = true, version = 1) => {
  try {
    const response = await get(API_ENDPOINTS.USER, token, version);
    return response.data?.user || null;
  } catch (error) {
    if (error.response?.status >= 400 && error.response?.status < 500) {
      clearCookies();
      localStorage.clear();
    }
    return null;
  }
};