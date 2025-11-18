import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBlogService } from '../services/blogService'
import { Tag, Loader2 } from 'lucide-react'

const Tags = () => {
  const { getTags } = useBlogService()
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const data = await getTags()
      setTags(data)
    } catch (error) {
      console.error('Error fetching tags:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">标签云</h1>
          <p className="text-gray-600">浏览所有标签</p>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-full px-4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 头部 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">标签云</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          通过标签发现感兴趣的内容，每个标签代表一个独特的主题领域
        </p>
      </div>

      {/* 标签统计 */}
      <div className="card mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {tags.length}
          </div>
          <p className="text-gray-600">个标签</p>
        </div>
      </div>

      {/* 标签列表 */}
      {tags.length === 0 ? (
        <div className="text-center py-12">
          <Tag size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">暂无标签</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 标签云视图 */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">标签云</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {tags.map((tag) => {
                const postCount = tag.post_tags?.[0]?.count || 0
                const sizeClass = postCount > 10 ? 'text-lg' : postCount > 5 ? 'text-base' : 'text-sm'
                const colorClass = postCount > 10 ? 'text-primary-600' : postCount > 5 ? 'text-primary-500' : 'text-primary-400'
                
                return (
                  <Link
                    key={tag.id}
                    to={`/tags/${tag.slug}`}
                    className={`${sizeClass} ${colorClass} hover:text-primary-700 transition-colors`}
                  >
                    <span className="inline-block bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-full">
                      {tag.name} ({postCount})
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* 详细列表视图 */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">标签列表</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tags.map((tag) => {
                const postCount = tag.post_tags?.[0]?.count || 0
                
                return (
                  <Link
                    key={tag.id}
                    to={`/tags/${tag.slug}`}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Tag size={16} className="text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{tag.name}</h3>
                        <p className="text-sm text-gray-500">{tag.slug}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold text-primary-600">
                        {postCount}
                      </div>
                      <p className="text-xs text-gray-500">篇文章</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tags