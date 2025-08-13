import { join } from 'path';
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {

  @Get()
  root(@Res() res: Response) {
    if (process.env.NODE_ENV === 'production') {
      res.sendFile(join(process.cwd(), 'dist/chatBHP-server/static/index.html'));
    }
  }
}
