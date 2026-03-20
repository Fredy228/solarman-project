"use client";

import { create } from "zustand";

type SendRequestState = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useSendRequestStore = create<SendRequestState>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}));
