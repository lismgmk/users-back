import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CustomValidationPipe } from '../../pipes/validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  IFileResponse,
  IPdfResponse,
  IUserResponse,
} from './dto/users-interfaces.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  async getAllUsers(): Promise<IUserResponse[]> {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  @HttpCode(200)
  async getUserById(
    @Param('id', ParseUUIDPipe)
    id: string,
  ): Promise<IUserResponse> {
    return await this.usersService.getUserById(id);
  }

  @Post()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async createUser(
    @Body(new CustomValidationPipe()) createUserDto: CreateUserDto,
  ) {
    return await this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async changeUser(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body(new CustomValidationPipe())
    dto: UpdateUserDto,
  ) {
    return await this.usersService.changeUser({ ...dto, id });
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.deleteUserById(id);
  }

  @Post('/file/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async saveFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IFileResponse> {
    return this.usersService.saveFile(id, file);
  }

  @Post('/add-pdf')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async addPdf(
    @Body(new CustomValidationPipe())
    dto: Pick<UpdateUserDto, 'email'>,
  ): Promise<IPdfResponse> {
    return this.usersService.addPdf(dto.email);
  }
}
