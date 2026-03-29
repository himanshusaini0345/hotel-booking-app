import { create } from 'zustand';

interface NavigationState {
    lastUrls: Record<string, string>;
    setLastUrl: (path: string, url: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
    lastUrls: {},
    setLastUrl: (path, url) => set((state) => ({
        lastUrls: {
            ...state.lastUrls,
            [path]: url
        }
    })),
}));
