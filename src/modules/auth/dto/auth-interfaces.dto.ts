export interface IRegistrationDto {
  login: string;
  password: string;
  email: string;
  userIp: string;
}
export interface IRegistrationConfirmationResponse {
  login: string;
  createdAt: Date;
  email: string;
  id: string;
}
