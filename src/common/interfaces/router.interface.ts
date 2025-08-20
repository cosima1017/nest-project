export interface IRouter {
  id: number;
  name: string;
  parentId: number;
  path: string;
  component: string;
  redirect: string;
  meta: string;
  alwaysShow: boolean;
  hidden: boolean;
  sort: number;
  createTime: Date;
  updateTime: Date;
  children: IRouter[];
  status: boolean;
  keepAlive: boolean;
  icon: string;
}
