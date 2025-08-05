import { BoardListResponse } from '@src/types/board';
import api from './index';

// 게시판 리스트
export const getBoardList = async ({ page, size }: { page: number; size: number }): Promise<BoardListResponse> => {
  try {
    const response = await api.get<BoardListResponse>('/board', {
      params: { page, size },
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};
