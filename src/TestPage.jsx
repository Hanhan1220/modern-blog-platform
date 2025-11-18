import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const TestPage = () => {
  const [status, setStatus] = useState('正在初始化...')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('正在连接 Supabase...')
        
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        console.log('Testing connection with:', {
          url: supabaseUrl,
          hasKey: !!supabaseAnonKey
        })
        
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('环境变量未配置')
        }
        
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        setStatus('正在测试数据库连接...')
        
        // 测试连接
        const { data: testData, error: testError } = await supabase
          .from('posts')
          .select('count')
          .limit(1)
        
        if (testError) {
          throw new Error(`数据库连接失败: ${testError.message}`)
        }
        
        setStatus('正在获取文章数据...')
        
        // 获取文章数据
        const { data: posts, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .limit(5)
        
        if (postsError) {
          throw new Error(`获取文章失败: ${postsError.message}`)
        }
        
        setStatus('连接成功！')
        setData(posts)
        
      } catch (err) {
        console.error('Test error:', err)
        setError(err.message)
        setStatus('连接失败')
      }
    }
    
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">数据库连接测试</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">连接状态</h2>
          <div className={`p-4 rounded ${status.includes('成功') ? 'bg-green-100 text-green-800' : status.includes('失败') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
            {status}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">错误信息</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {data && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">获取到的文章数据</h2>
            <div className="space-y-4">
              {data.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded p-4">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-gray-600 mt-2">{post.excerpt}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    创建时间: {new Date(post.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">环境变量检查</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ 已配置' : '❌ 未配置'}</div>
            <div>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ 已配置' : '❌ 未配置'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage