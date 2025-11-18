import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Calendar, User, ArrowLeft, Tag as TagIcon } from 'lucide-react'
import CommentSection from '../components/CommentSection'
import { useBlogService } from '../services/blogService'
import toast from 'react-hot-toast'

const BlogDetail = () => {
  const { id } = useParams()
  const { getPost } = useBlogService()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const data = await getPost(id)
      if (data) {
        setPost(data)
      } else {
        toast.error('文章不存在')
      }
    } catch (error) {
      toast.error('加载文章失败')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy年MM月dd日', { locale: zhCN })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-4/5"></div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">文章不存在</h1>
          <Link to="/" className="btn btn-primary">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 返回按钮 */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>返回首页</span>
      </Link>

      {/* 文章头部 */}
      <article className="card mb-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center space-x-1">
              <User size={16} />
              <span>{post.author?.username || '匿名'}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tagItem, index) => (
                <Link
                  key={index}
                  to={`/tags/${tagItem.tag.slug}`}
                  className="inline-flex items-center space-x-1 text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-200 transition-colors"
                >
                  <TagIcon size={14} />
                  <span>{tagItem.tag.name}</span>
                </Link>
              ))}
            </div>
          )}

          {post.cover_image && (
            <div className="rounded-lg overflow-hidden mb-6">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}
        </header>

        {/* 文章内容 */}
        <div className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* 评论区 */}
      <CommentSection postId={post.id} />
    </div>
  )
}

export default BlogDetail