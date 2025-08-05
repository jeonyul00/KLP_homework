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
