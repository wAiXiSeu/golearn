import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, getUserProfile, getLessonProgress, markLessonComplete } from '../lib/supabase'
import type { Profile, LessonProgressRow } from '../lib/supabase'

type UserStore = {
  user: Profile | null
  isAuthenticated: boolean
  lessonProgress: LessonProgressRow[]
  
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchProfile: () => Promise<void>
  fetchProgress: () => Promise<void>
  completeLesson: (lessonId: string, score: number) => Promise<void>
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      lessonProgress: [],
      
      login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        const profile = await getUserProfile(data.user.id)
        set({ user: profile, isAuthenticated: true })
      },
      
      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, isAuthenticated: false, lessonProgress: [] })
      },
      
      fetchProfile: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const profile = await getUserProfile(user.id)
          set({ user: profile, isAuthenticated: true })
        }
      },
      
      fetchProgress: async () => {
        const { user } = get()
        if (!user) return
        
        const progress = await getLessonProgress(user.id)
        set({ lessonProgress: progress })
      },
      
      completeLesson: async (lessonId, score) => {
        const { user } = get()
        if (!user) return
        
        await markLessonComplete(user.id, lessonId, score)
        await get().fetchProgress()
      },
    }),
    {
      name: 'golearn-user',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)