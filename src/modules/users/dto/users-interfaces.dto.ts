export interface IPdfResponse {
  type: 'Buffer';
  data: number[];
}

export interface IUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  pdf: IPdfResponse;
}

export interface IFileResponse {
  url: string;
  name: string;
}
