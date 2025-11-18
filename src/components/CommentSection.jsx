import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { MessageCircle, Send } from 'lucide-react'
import { useBlogService } from '../services/blogService'
import toast from 'react-hot-toast'

const CommentSection = ({ postId }) => {
  const { getComments, addComment } = useBlogService()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const data = await getComments(postId)
      setComments(data)
    } catch (error) {
      toast.error('加载评论失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    
    if (!newComment.trim()) {
      toast.error('请输入评论内容')
      return
    }

    setSubmitting(true)
    try {
      const commentData = {
        post_id: postId,
        content: newComment.trim(),
        author_id: null, // 简化版本，实际应用中应该有用户认证
      }
      
      const newCommentData = await addComment(commentData)
      setComments(prev => [...prev, newCommentData])
      setNewComment('')
      toast.success('评论发表成功')
    } catch (error) {
      toast.error('发表评论失败')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })
  }

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MessageCircle size={20} className="mr-2" />
          评论
        </h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <MessageCircle size={20} className="mr-2" />
        评论 ({comments.length})
      </h3>

      {/* 评论表单 */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="写下你的评论..."
          className="textarea mb-3"
          rows="3"
        />
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Send size={16} />
          <span>{submitting ? '发表中...' : '发表评论'}</span>
        </button>
      </form>

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            暂无评论，快来发表第一条评论吧！
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-sm font-medium">
                      {comment.author?.username?.[0]?.toUpperCase() || 'A'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {comment.author?.username || '匿名用户'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection