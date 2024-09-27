import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}


// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { constants } from 'src/utils/constants';
// import { Request } from 'express';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   canActivate(context: ExecutionContext) {
//     const ctx = context.switchToHttp();
//     const request = ctx.getRequest<Request>();
    
//     // Check if the request URL is in the BY_PASS_URLS array
//     for (let x = 0; x < constants.BY_PASS_URLS.length; x++) {
//       if (request.url === constants.BY_PASS_URLS[x]) return true; // Use '===' for comparison
//     }
    
//     // Call the default canActivate method from AuthGuard
//     return super.canActivate(context);
//   }
// }