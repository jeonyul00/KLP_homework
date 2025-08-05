import { MemberSigninResponse } from '@src/types/auth';
import api from './index';

// 회원가입
export const handleSignup = async (formData: FormData): Promise<MemberSigninResponse> => {
  try {
    const response = await api.post<MemberSigninResponse>('/auth/signup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};
