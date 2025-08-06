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
  status: number;
  message: string;
  data: {
    board: {
      idx: number;
      title: string;
      contents: string;
      nickname: string;
      author: number;
      create_date: string;
    };
    images: BoardImageType[];
    comments: CommentResponse[];
  };
};

export type BoardImageType = {
  image: string;
  order: string;
};

export type CommentResponse = {
  idx: number;
  board_idx: number;
  author: number;
  nickname: string;
  contents: string;
  create_date: string;
};
