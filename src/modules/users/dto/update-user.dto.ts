import { IsEmail, IsOptional, Length } from 'class-validator';
import {
  FIELD_EMAIL_VALIDATION_ERROR,
  FIELD_LENGTH_VALIDATION_ERROR,
} from '../../../consts/ad-validation-const';

export class UpdateUserDto {
  @IsOptional()
  @Length(3, 10, { message: FIELD_LENGTH_VALIDATION_ERROR })
  readonly firstName: string;

  @IsOptional()
  @Length(3, 10, { message: FIELD_LENGTH_VALIDATION_ERROR })
  readonly lastName: string;

  @IsOptional()
  @IsEmail({ message: FIELD_EMAIL_VALIDATION_ERROR })
  readonly email: string;
}
