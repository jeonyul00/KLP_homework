export interface DefaultResponse {
  status: number;
  message: string;
}

export interface BoardSummary {
  idx: number;
  title: string;
  nickname: string;
  create_date: string;
}

export type BoardType = BoardSummary;

export interface BoardListResponse extends DefaultResponse {
  data: BoardSummary[];
  hasNext: boolean;
}

export interface BoardImage {
  image: string;
  order: string;
}

export type BoardImageType = BoardImage;

export interface BoardComment {
  idx: number;
  board_idx: number;
  author: number;
  nickname: string;
  contents: string;
  create_date: string;
}

export type CommentResponse = BoardComment;

export interface BoardDetailData {
  board: {
    idx: number;
    title: string;
    contents: string;
    nickname: string;
    author: number;
    create_date: string;
  };
  images: BoardImage[];
  comments: BoardComment[];
}

export interface BoardDetailResponse extends DefaultResponse {
  data: BoardDetailData;
}
