import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Calendar, User, MessageCircle, Tag as TagIcon } from 'lucide-react'

const BlogCard = ({ post }) => {
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy年MM月dd日', { locale: zhCN })
  }

  return (
    <article className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col h-full">
        {post.cover_image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        
        <div className="flex-1">
          <Link to={`/blog/${post.id}`}>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tagItem, index) => (
                <Link
                  key={index}
                  to={`/tags/${tagItem.tag.slug}`}
                  className="inline-flex items-center space-x-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <TagIcon size={12} />
                  <span>{tagItem.tag.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span>{post.author?.username || '匿名'}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <MessageCircle size={14} />
            <span>{post.comment_count || 0}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogCard