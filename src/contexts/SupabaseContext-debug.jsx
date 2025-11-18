import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const SupabaseContext = createContext()

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

export const SupabaseProvider = ({ children }) => {
  const [supabase, setSupabase] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initSupabase = () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        console.log('Supabase URL:', supabaseUrl)
        console.log('Supabase Key exists:', !!supabaseAnonKey)
        
        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project')) {
          throw new Error('请配置 Supabase 环境变量')
        }
        
        const client = createClient(supabaseUrl, supabaseAnonKey)
        setSupabase(client)
        
        // 获取初始会话
        const getSession = async () => {
          try {
            const { data: { session }, error } = await client.auth.getSession()
            if (error) {
              console.error('Session error:', error)
              setError(error.message)
            } else {
              setUser(session?.user ?? null)
            }
          } catch (err) {
            console.error('Get session error:', err)
            setError(err.message)
          } finally {
            setLoading(false)
          }
        }
        
        getSession()
        
        // 监听认证状态变化
        const { data: { subscription } } = client.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session)
            setUser(session?.user ?? null)
            setLoading(false)
          }
        )

        return () => subscription.unsubscribe()
        
      } catch (err) {
        console.error('Supabase initialization error:', err)
        setError(err.message)
        setLoading(false)
      }
    }
    
    initSupabase()
  }, [])

  // 显示错误信息
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">连接错误</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="text-sm text-gray-600">
            <p>请检查：</p>
            <ul className="list-disc list-inside mt-2">
              <li>Supabase 项目是否正确创建</li>
              <li>环境变量是否正确配置</li>
              <li>网络连接是否正常</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // 显示加载状态
  if (loading || !supabase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在连接数据库...</p>
        </div>
      </div>
    )
  }

  const value = {
    supabase,
    user,
    loading,
    error,
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}