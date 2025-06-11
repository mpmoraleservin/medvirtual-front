import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ViewportState {
  viewport: number
  setViewport: (size: number) => void
}

export const useViewportStore = create<ViewportState>()(
  devtools(
      (set) => ({
        viewport: 1920,
        setViewport: (size) => set(() => ({ viewport: size })),
      }),
      {
        name: 'viewport-storage',
      },
  ),
)