import { MemberResponse } from '@src/types/auth';
import api from './index';

export const initCheck = async (refreshToken: string): Promise<MemberResponse> => {
  try {
    const response = await api.post<MemberResponse>('/auth/init', undefined, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};

// 회원가입
export const handleSignup = async (formData: FormData): Promise<MemberResponse> => {
  try {
    const response = await api.post<MemberResponse>('/auth/signup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};
