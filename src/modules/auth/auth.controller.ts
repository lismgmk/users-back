import {
  Body,
  Controller,
  HttpCode,
  Ip,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { CustomValidationPipe } from '../../pipes/validation.pipe';
import { BlackListService } from '../black-list/black-list.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly blackListService: BlackListService,
  ) {}

  @HttpCode(204)
  @Post('/registration')
  async createUser(
    @Body(new CustomValidationPipe()) createUser: CreateUserDto,
  ) {
    return this.authService.registration(createUser);
  }

  //   @HttpCode(200)
  //   @Post('/refresh-token')
  //   @UseFilters(new ValidationBodyExceptionFilter())
  //   @UseFilters(new CommonErrorFilter())
  //   @UseGuards(CookieGuard)
  //   async getRefreshAccessToken(
  //     @Res({ passthrough: true }) res: Response,
  //     @GetUser() user: User,
  //     @GetDeviceId()
  //     deviceId: string,
  //     @PuerRefresgToken()
  //     refreshToken: string,
  //   ) {
  //     await this.blackListService.addTokenClearQuery(refreshToken);
  //     const tokens = await this.authService.getRefreshAccessToken(
  //       user.id.toString(),
  //       deviceId,
  //     );

  //     await this.devicesService.changeDeviceExpiredClearQuery({
  //       userId: user.id.toString(),
  //       deviceId: deviceId.toString(),
  //     });
  //     res.cookie('refreshToken', tokens.refreshToken, {
  //       httpOnly: true,
  //       secure: true,
  //     });
  //     return { accessToken: tokens.accessToken };
  //   }

  //   @HttpCode(200)
  //   @Post('/login')
  //   @UseFilters(new ValidationBodyExceptionFilter())
  //   @UseFilters(new CommonErrorFilter())
  //   @UseGuards(LocalStrategyGuard)
  //   async login(
  //     @GetUserId() userId: string,
  //     @Res({ passthrough: true }) res: Response,
  //     @Body(new CustomValidationPipe()) loginAuthDto: LoginAuthDto,
  //     @UserIp() userIp: string,
  //     @DeviceName() deviceName: string,
  //   ) {
  //     const deviceId = uuid();
  //     const tokens = await this.authService.getRefreshAccessToken(
  //       userId,
  //       deviceId,
  //     );

  //     await this.devicesService.createDevice({
  //       id: deviceId,
  //       ip: userIp,
  //       userId,
  //       deviceName,
  //       deviceId: deviceId,
  //     });
  //     res.cookie('refreshToken', tokens.refreshToken, {
  //       httpOnly: true,
  //       secure: true,
  //     });
  //     return { accessToken: tokens.accessToken };
  //   }

  //   @HttpCode(204)
  //   @Post('/password-recovery')
  //   @UseFilters(new ValidationBodyExceptionFilter())
  //   @UseFilters(new CommonErrorFilter())
  //   async passwordRecovery(
  //     @Body(new CustomValidationPipe()) resendingEmail: ResendingEmailDto,
  //   ) {
  //     return this.authService.passwordRecovery(resendingEmail.email);
  //   }

  //   @HttpCode(204)
  //   @Post('/new-password')
  //   @UseFilters(new ValidationBodyExceptionFilter())
  //   @UseFilters(new CommonErrorFilter())
  //   async getNewPassword(
  //     @Body(new CustomValidationPipe()) getNewPassword: GetNewPasswordDto,
  //   ) {
  //     return this.authService.getNewPassword(getNewPassword);
  //   }

  //   @HttpCode(204)
  //   @Post('/logout')
  //   @UseFilters(new CommonErrorFilter())
  //   @UseGuards(CookieGuard)
  //   async logout(
  //     @GetUser() user: User,
  //     @GetDeviceId()
  //     deviceId: string,
  //     @PuerRefresgToken()
  //     refreshToken: string,
  //   ) {
  //     await this.devicesService.deleteAllExcludeCurrent(deviceId, user.id);
  //     await this.blackListService.addTokenClearQuery(refreshToken);
  //     return;
  //   }
}
