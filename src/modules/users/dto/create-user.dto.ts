import { IsEmail, Length } from 'class-validator';
import {
  FIELD_EMAIL_VALIDATION_ERROR,
  FIELD_LENGTH_VALIDATION_ERROR,
} from '../../../consts/ad-validation-const';

export class CreateUserDto {
  @Length(3, 10, { message: FIELD_LENGTH_VALIDATION_ERROR })
  readonly firstName: string;

  @Length(3, 10, { message: FIELD_LENGTH_VALIDATION_ERROR })
  readonly lastName: string;

  @Length(6, 20, { message: FIELD_LENGTH_VALIDATION_ERROR })
  readonly password: string;

  @IsEmail({ message: FIELD_EMAIL_VALIDATION_ERROR })
  readonly email: string;
}
