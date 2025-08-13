
import { Controller, Get, Req, Res, } from '@nestjs/common';
import { join } from 'path';
import { Request, Response } from 'express';


@Controller()
export class AppController {
  @Get('*')
  getIndex(@Req() req: Request, @Res() res: Response) {
    if (
      req.path.startsWith('/api') || // Skip API
      req.path.includes('.')         // Skip files with extensions (assets)
    ) {
      return;
    }

    res.sendFile(join(__dirname, 'static/browser/index.html'));
  }
}
