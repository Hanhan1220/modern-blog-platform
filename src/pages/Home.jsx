import { useState, useEffect } from 'react'
import BlogCard from '../components/BlogCard'
import { useBlogService } from '../services/blogService'
import { Loader2 } from 'lucide-react'

const Home = () => {
  const { getPosts } = useBlogService()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const postsPerPage = 6

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async (pageNum = 0, reset = false) => {
    try {
      setLoading(true)
      const { data, count } = await getPosts(postsPerPage, pageNum * postsPerPage)
      
      if (reset) {
        setPosts(data)
      } else {
        setPosts(prev => [...prev, ...data])
      }
      
      setHasMore((pageNum + 1) * postsPerPage < count)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 头部 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          欢迎来到现代博客平台
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          分享知识，记录生活，连接世界。在这里发现精彩内容，表达独特观点。
        </p>
      </div>

      {/* 文章列表 */}
      <div className="mb-8">
        {posts.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">暂无文章</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* 加载更多按钮 */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="btn btn-primary flex items-center space-x-2 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>加载中...</span>
              </>
            ) : (
              <span>加载更多</span>
            )}
          </button>
        </div>
      )}

      {/* 初始加载状态 */}
      {loading && posts.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home