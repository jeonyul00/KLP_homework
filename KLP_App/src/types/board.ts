export type BoardType = {
  idx: number;
  title: string;
  nickname: string;
  create_date: string;
};

export type BoardListResponse = {
  status: number;
  message: string;
  data: BoardType[];
  hasNext: boolean;
};

export type BoardDetailResponse = {
  idx: number;
  title: string;
  nickname: string;
  contents: string;
  create_date: string;
  images?: any[];
  comments?: CommentResponse[];
};

export type CommentResponse = {
  idx: number;
  nickname: string;
  contents: string;
  create_date: string;
};
