import { BoardDetailResponse, BoardListResponse } from '@src/types/board';
import api from './index';

// 게시판 리스트
export const getBoardList = async ({ page, size }: { page: number; size: number }): Promise<BoardListResponse> => {
  const response = await api.get<BoardListResponse>('/board', {
    params: { page, size },
  });
  return response.data;
};

// 게시판 상세
export const getBoardDetail = async (idx: number): Promise<BoardDetailResponse> => {
  const response = await api.get<BoardDetailResponse>(`/board/detail`, { params: { idx } });
  return response.data;
};

// 게시물 등록
export const handlePostBoard = async (form: FormData, accessToken: string): Promise<{ status: number; message: string }> => {
  const response = await api.post<{ status: number; message: string }>(`/board/regist`, form, {
    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};
