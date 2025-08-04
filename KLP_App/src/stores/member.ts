import { create } from 'zustand';

export type Member = {
  accessToken: string;
  name: string;
  email: string;
};

const initialMember: Member = {
  accessToken: '',
  name: '',
  email: '',
};

type MemberStore = {
  member: Member;
  isLoading: boolean;
  setMember: (member: Partial<Member>) => void;
  setLoading: (value: boolean) => void;
};

export const useMember = create<MemberStore>(set => ({
  member: initialMember,
  isLoading: false,
  setMember: member => set(state => ({ member: { ...state.member, ...member } })),
  setLoading: value => set({ isLoading: value }),
}));
