import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";

export type AuthUiState = {
  authExpired: boolean;
};

export const authUiStore = createStore<AuthUiState>(() => ({
  authExpired: false,
}));

export function showAuthExpired() {
  authUiStore.setState({ authExpired: true });
}

export function hideAuthExpired() {
  authUiStore.setState({ authExpired: false });
}

export function useAuthUiStore<T>(selector: (s: AuthUiState) => T): T {
  return useStore(authUiStore, selector);
}

