import { create } from 'zustand';

export type Member = {
  accessToken: string;
  id: number;
  nickname: string;
  thumbnail: string;
};

const initialMember: Member = {
  accessToken: '',
  id: 0,
  nickname: '',
  thumbnail: '',
};

type MemberStore = {
  member: Member;
  isLoading: boolean;
  setMember: (member: Partial<Member>) => void;
  setLoading: (value: boolean) => void;
  logoutMember: () => void;
};

export const useMember = create<MemberStore>(set => ({
  member: initialMember,
  isLoading: false,
  setMember: member => set(state => ({ member: { ...state.member, ...member } })),
  setLoading: value => set({ isLoading: value }),
  logoutMember: () => set({ member: initialMember, isLoading: false }),
}));
