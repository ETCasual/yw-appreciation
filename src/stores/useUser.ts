import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  number: string;
  setNumber: (no: string) => void;
};

const createState: StateCreator<UserState> = (set) => ({
  number: "",
  setNumber: (no) => {
    set({ number: no });
  },
});

export const useUser = create(
  persist(createState, { name: "user-state-appreciation" }),
);
