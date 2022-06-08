import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { createUserRequest } from './dto/create-user.request';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  async createUser(@Body() body: createUserRequest): Promise<void> {
    return this.appService.createUser(body);
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('files'))
  handleuploadfile(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return 'file uploaded API'
  }
}
