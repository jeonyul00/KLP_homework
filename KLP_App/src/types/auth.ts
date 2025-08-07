import { DefaultResponse } from './common';

export interface MemberResponse extends DefaultResponse {
  status: number;
  message: string;
  accessToken: string;
  refreshToken: string;
  id: number;
  nickname: string;
  thumbnail: string;
}
