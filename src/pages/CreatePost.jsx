import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Eye, ArrowLeft } from 'lucide-react'
import { useBlogService } from '../services/blogService'
import toast from 'react-hot-toast'

const CreatePost = () => {
  const navigate = useNavigate()
  const { createPost } = useBlogService()
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    cover_image: '',
    published: true,
  })
  const [submitting, setSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const generateExcerpt = () => {
    if (formData.content && !formData.excerpt) {
      const plainText = formData.content
        .replace(/#{1,6}\s+/g, '') // 移除标题标记
        .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
        .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
        .replace(/`(.*?)`/g, '$1') // 移除代码标记
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
        .replace(/\n+/g, ' ') // 换行转为空格
        .trim()
      
      const excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '')
      setFormData(prev => ({ ...prev, excerpt }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('请输入文章标题')
      return
    }
    
    if (!formData.content.trim()) {
      toast.error('请输入文章内容')
      return
    }

    generateExcerpt()

    setSubmitting(true)
    try {
      const postData = {
        ...formData,
        author_id: null, // 简化版本，实际应用中应该有用户认证
        created_at: new Date().toISOString(),
      }
      
      const newPost = await createPost(postData)
      toast.success('文章发表成功！')
      navigate(`/blog/${newPost.id}`)
    } catch (error) {
      toast.error('发表失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  const MarkdownPreview = ({ content }) => {
    return (
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ 
          __html: content
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/`(.*)`/gim, '<code>$1</code>')
            .replace(/\n/gim, '<br />')
        }} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>返回</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {previewMode ? '预览文章' : '写文章'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>{previewMode ? '编辑' : '预览'}</span>
          </button>
        </div>
      </div>

      {/* 表单/预览 */}
      <div className="card">
        {!previewMode ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                文章标题
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="请输入文章标题..."
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                文章摘要（可选）
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="请输入文章摘要..."
                className="textarea"
                rows="3"
              />
            </div>

            <div>
              <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700 mb-2">
                封面图片 URL（可选）
              </label>
              <input
                type="url"
                id="cover_image"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                文章内容（支持 Markdown）
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="# 标题&#10;&#10;这里是文章内容...&#10;&#10;## 子标题&#10;&#10;- 列表项 1&#10;- 列表项 2&#10;&#10;**粗体文本** 和 *斜体文本*"
                className="textarea font-mono"
                rows="15"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                立即发布
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{submitting ? '发布中...' : '发布文章'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {formData.title || '无标题'}
              </h1>
              
              {formData.excerpt && (
                <p className="text-lg text-gray-600 mb-6">
                  {formData.excerpt}
                </p>
              )}

              {formData.cover_image && (
                <div className="rounded-lg overflow-hidden mb-6">
                  <img
                    src={formData.cover_image}
                    alt="封面图片"
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
            </div>

            <div className="prose max-w-none">
              <MarkdownPreview content={formData.content || '暂无内容'} />
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={() => setPreviewMode(false)}
                className="btn btn-secondary"
              >
                返回编辑
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Markdown 语法提示 */}
      {!previewMode && (
        <div className="card mt-6">
          <h3 className="text-lg font-semibold mb-3">Markdown 语法提示</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <code className="bg-gray-100 px-2 py-1 rounded"># 一级标题</code>
              <p className="text-gray-600 mt-1">一级标题</p>
            </div>
            <div>
              <code className="bg-gray-100 px-2 py-1 rounded">## 二级标题</code>
              <p className="text-gray-600 mt-1">二级标题</p>
            </div>
            <div>
              <code className="bg-gray-100 px-2 py-1 rounded">**粗体文本**</code>
              <p className="text-gray-600 mt-1">粗体文本</p>
            </div>
            <div>
              <code className="bg-gray-100 px-2 py-1 rounded">*斜体文本*</code>
              <p className="text-gray-600 mt-1">斜体文本</p>
            </div>
            <div>
              <code className="bg-gray-100 px-2 py-1 rounded">- 列表项</code>
              <p className="text-gray-600 mt-1">无序列表</p>
            </div>
            <div>
              <code className="bg-gray-100 px-2 py-1 rounded">[链接文本](url)</code>
              <p className="text-gray-600 mt-1">链接</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreatePost