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

// 게시물 수정
export const handleUpdateBoard = async (formData: FormData, accessToken: string) => {
  const response = await api.post(`/board/update`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 댓글 등록
export const handlePostComment = async (idx: number, accessToken: string, comment: string): Promise<{ status: number; message: string }> => {
  const response = await api.post<{ status: number; message: string }>(
    `/board/comment`,
    { idx, comment },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return response.data;
};

// 게시물 삭제
export const deleteBoard = async (boardIdx: number, accessToken: string): Promise<{ status: number; message: string }> => {
  const res = await api.post<{ status: number; message: string }>(
    `/board/delete`,
    { boardIdx },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return res.data;
};

// 댓글 삭제
export const deleteComment = async (commentIdx: number, accessToken: string): Promise<{ status: number; message: string }> => {
  const response = await api.post<{ status: number; message: string }>(
    `/board/comment/delete`,
    { idx: commentIdx },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return response.data;
};
