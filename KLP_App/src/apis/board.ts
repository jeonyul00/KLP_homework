import { BoardDetailResponse, BoardListResponse } from '@src/types/board';
import { DefaultResponse } from '@src/types/common';
import api from './index';

// 게시글 목록 조회
export const getBoardList = async ({ page, size }: { page: number; size: number }): Promise<BoardListResponse> => {
  const response = await api.get<BoardListResponse>('/board', {
    params: { page, size },
  });
  return response.data;
};

// 게시글 상세 조회
export const getBoardDetail = async (idx: number): Promise<BoardDetailResponse> => {
  const response = await api.get<BoardDetailResponse>('/board/detail', {
    params: { idx },
  });
  return response.data;
};

// 게시글 등록
export const handlePostBoard = async (form: FormData, accessToken: string): Promise<DefaultResponse> => {
  const response = await api.post<DefaultResponse>('/board/regist', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// 게시글 수정
export const handleUpdateBoard = async (form: FormData, accessToken: string): Promise<DefaultResponse> => {
  const response = await api.post<DefaultResponse>('/board/update', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// 게시글 삭제
export const deleteBoard = async (boardIdx: number, accessToken: string): Promise<DefaultResponse> => {
  const response = await api.post<DefaultResponse>(
    '/board/delete',
    { boardIdx },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  return response.data;
};

// 댓글 등록
export const handlePostComment = async (idx: number, accessToken: string, comment: string): Promise<DefaultResponse> => {
  const response = await api.post<DefaultResponse>(
    '/board/comment',
    { idx, comment },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (commentIdx: number, accessToken: string): Promise<DefaultResponse> => {
  const response = await api.post<DefaultResponse>(
    '/board/comment/delete',
    { idx: commentIdx },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  return response.data;
};
