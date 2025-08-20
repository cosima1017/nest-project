import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // 可以在这里进行一些定制化处理，比如添加自定义的逻辑
}
