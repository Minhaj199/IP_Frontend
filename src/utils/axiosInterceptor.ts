import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { AppError } from "./customError";

const client = axios.create({
  baseURL: import.meta.env.VITE_BACKENT_URL,
});

// Request Interceptor
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
client.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error) => {
    if (error.response?.status === 401) {
      if ("errorType" in error.response.data) {
        throw {
          message: error.response.data.message,
          errorType: error.response.data.errorType,
          result: error.response.data.result,
        };
      } else {
        return Promise.reject(new Error("unexpeced error"));
      }
    }
    if (!error?.response?.data?.success) {
      throw {
        message: error.response.data.message,
        errorType: error.response.data.errorType,
        result: error.response.data.result,
      };
    } else {
      return Promise.reject(new Error(error.response.data.message));
    }
  }
);

export const request = async <T>(options: AxiosRequestConfig): Promise<T> => {
  try {
    return await client(options);
  } catch (error: any) {
    if ("errorType" in error) {
      throw new AppError(error.message, error.errorType, error.result).toJSON();
    } else {
      throw new Error("unexpted error");
    }
  }
};
