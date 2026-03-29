import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string
  rating: number
  rank: string
  created_at: string
  settings: Record<string, unknown>
}

export type LessonProgressRow = {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  score: number
  completed_at: string
}

export type PuzzleAttemptRow = {
  id: string
  user_id: string
  puzzle_id: string
  correct: boolean
  attempts: number
  time_spent: number
  created_at: string
}

export type SavedGameRow = {
  id: string
  user_id: string
  title: string
  sgf_content: string
  board_size: number
  result: string
  created_at: string
  metadata: Record<string, unknown>
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data as Profile
}

export async function getLessonProgress(userId: string) {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
  
  if (error) throw error
  return data as LessonProgressRow[]
}

export async function markLessonComplete(userId: string, lessonId: string, score: number) {
  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      score,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()
  
  if (error) throw error
  return data as LessonProgressRow
}

export async function savePuzzleAttempt(attempt: Omit<PuzzleAttemptRow, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('puzzle_attempts')
    .insert({
      ...attempt,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()
  
  if (error) throw error
  return data as PuzzleAttemptRow
}

export async function saveGame(userId: string, game: Omit<SavedGameRow, 'id' | 'user_id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('saved_games')
    .insert({
      user_id: userId,
      ...game,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()
  
  if (error) throw error
  return data as SavedGameRow
}

export async function getUserGames(userId: string) {
  const { data, error } = await supabase
    .from('saved_games')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as SavedGameRow[]
}