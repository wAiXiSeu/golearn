import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SettingsStore = {
  theme: 'light' | 'dark'
  showCoordinates: boolean
  stoneStyle: 'classic' | 'flat'
  soundEnabled: boolean
  autoSave: boolean
  
  setTheme: (theme: 'light' | 'dark') => void
  setShowCoordinates: (show: boolean) => void
  setStoneStyle: (style: 'classic' | 'flat') => void
  setSoundEnabled: (enabled: boolean) => void
  setAutoSave: (autoSave: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      showCoordinates: true,
      stoneStyle: 'classic',
      soundEnabled: false,
      autoSave: true,
      
      setTheme: (theme) => set({ theme }),
      setShowCoordinates: (show) => set({ showCoordinates: show }),
      setStoneStyle: (style) => set({ stoneStyle: style }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setAutoSave: (autoSave) => set({ autoSave }),
    }),
    {
      name: 'golearn-settings',
    }
  )
)