import { MemberResponse } from '@src/types/auth';
import api from './index';

// 최초 호출
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

// 로그인
export const handleSignin = async (form: { id: string; pwd: string }): Promise<MemberResponse> => {
  try {
    const response = await api.post<MemberResponse>('/auth/signin', form);
    return response.data;
  } catch (e) {
    throw e;
  }
};
