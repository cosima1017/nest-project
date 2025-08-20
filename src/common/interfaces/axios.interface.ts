import { AxiosRequestConfig, RawAxiosResponseHeaders } from 'axios';

export interface IHttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders;
  config: AxiosRequestConfig;
}

export interface IErrorResponse {
  message: string;
  status: number;
  error?: unknown;
}

// Axios 错误的标准结构
export interface IAxiosError {
  response?: {
    data?:
      | {
          message?: string;
        }
      | unknown;
    status: number;
  };
  request?: unknown;
  message?: string;
}
