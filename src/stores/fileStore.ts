import { create } from 'zustand';

interface FileStore {
  showHidden: boolean;
  toggleHidden: () => void;
}

export const useFileStore = create<FileStore>((set) => ({
  showHidden: false,
  toggleHidden: () => set((state) => ({ showHidden: !state.showHidden })),
}));
