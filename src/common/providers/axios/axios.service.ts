import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  AxiosResponse,
  AxiosRequestConfig,
  RawAxiosResponseHeaders,
} from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  IHttpResponse,
  IErrorResponse,
  IAxiosError,
} from '../../interfaces/axios.interface';

@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {}

  private async handleRequest<T>(
    request: Promise<AxiosResponse<T>>,
  ): Promise<IHttpResponse<T>> {
    try {
      const response = await request;
      return this.formatResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private formatResponse<T>(response: AxiosResponse<T>): IHttpResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as RawAxiosResponseHeaders,
      config: response.config,
    };
  }

  private handleError(error: unknown): HttpException {
    const errorResponse: IErrorResponse = {
      message: 'internal server error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    if (error && typeof error === 'object') {
      if ('response' in error) {
        const axiosError = error as IAxiosError;
        if (axiosError.response) {
          const { data, status } = axiosError.response;
          errorResponse.status = status;
          errorResponse.error = data;

          if (typeof data === 'object' && data !== null && 'message' in data) {
            errorResponse.message =
              (data as { message?: string }).message || '请求失败';
          } else {
            errorResponse.message = '请求失败';
          }
        }
      } else if ('request' in error) {
        errorResponse.message = '请求超时或网络错误';
        errorResponse.status = HttpStatus.REQUEST_TIMEOUT;
      } else if ('message' in error) {
        errorResponse.message = (error as { message: string }).message;
      }
    }

    return new HttpException(errorResponse, errorResponse.status);
  }

  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<IHttpResponse<T>> {
    return this.handleRequest(
      firstValueFrom(this.httpService.get<T>(url, config)),
    );
  }

  async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<IHttpResponse<T>> {
    return this.handleRequest(
      firstValueFrom(this.httpService.post<T>(url, data, config)),
    );
  }

  async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<IHttpResponse<T>> {
    return this.handleRequest(
      firstValueFrom(this.httpService.put<T>(url, data, config)),
    );
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<IHttpResponse<T>> {
    return this.handleRequest(
      firstValueFrom(this.httpService.delete<T>(url, config)),
    );
  }

  async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<IHttpResponse<T>> {
    return this.handleRequest(
      firstValueFrom(this.httpService.patch<T>(url, data, config)),
    );
  }
}
