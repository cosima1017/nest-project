export interface IResponse<T> {
  code?: number;
  message?: string;
  data?: T;
  //   timestamp: number;
}

export interface IPaginatedResponse<T> extends Omit<IResponse<T>, 'data'> {
  rows: T[];
  total: number;
}

// export interface IPaginatedResponse<T> extends IResponse<IPagination<T>> {}
