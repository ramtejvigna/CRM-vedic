import { create } from 'zustand'
import { ControllerSlice } from './slices/ControllerSlice'
import { ThemeSlice } from './slices/ThemeSlice'
import { AuthSlice } from './slices/AuthSlice'
export const useStore = create((set) => ({
    ...ControllerSlice(set),
    ...ThemeSlice(set),
    ...AuthSlice(set) ,
    activeRoute: "Dashboard",  // Default to Dashboard
    setActiveRoute: (route) => set({ activeRoute: route }),
}))
