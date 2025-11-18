import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import { useBlogService } from '../services/blogService'
import { Tag, ArrowLeft, Loader2 } from 'lucide-react'

const TagDetail = () => {
  const { tag } = useParams()
  const { getPostsByTag, getTags } = useBlogService()
  const [posts, setPosts] = useState([])
  const [tagInfo, setTagInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [tag])

  const fetchData = async () => {
    try {
      const [postsData, tagsData] = await Promise.all([
        getPostsByTag(tag),
        getTags()
      ])
      
      setPosts(postsData)
      const currentTag = tagsData.find(t => t.slug === tag)
      setTagInfo(currentTag)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!tagInfo) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Tag size={48} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">标签不存在</h1>
          <Link to="/tags" className="btn btn-primary">
            返回标签列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 返回按钮 */}
      <Link
        to="/tags"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>返回标签列表</span>
      </Link>

      {/* 标签信息 */}
      <div className="card mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <Tag size={24} className="text-primary-600" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              #{tagInfo.name}
            </h1>
            <p className="text-gray-600">
              共 {posts.length} 篇文章
            </p>
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      <div>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              暂无相关文章
            </h2>
            <p className="text-gray-600 mb-6">
              该标签下还没有文章，试试其他标签吧
            </p>
            <Link to="/create" className="btn btn-primary">
              写第一篇文章
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                相关文章
              </h2>
              <p className="text-gray-600">
                发现与 "{tagInfo.name}" 相关的所有内容
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TagDetail