import { useSupabase } from '../contexts/SupabaseContext'

export const useBlogService = () => {
  const { supabase } = useSupabase()

  // 获取所有文章
  const getPosts = async (limit = 10, offset = 0) => {
    try {
      const { data, error, count } = await supabase
        .from('posts')
        .select(`
          *,
          author:author_id(username, avatar_url),
          tags:post_tags(tag:tag_id(name, slug))
        `, { count: 'exact' })
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return { data, count }
    } catch (error) {
      console.error('Error fetching posts:', error)
      return { data: [], count: 0 }
    }
  }

  // 获取单篇文章
  const getPost = async (id) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:author_id(username, avatar_url),
          tags:post_tags(tag:tag_id(name, slug))
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching post:', error)
      return null
    }
  }

  // 创建文章
  const createPost = async (postData) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }

  // 更新文章
  const updatePost = async (id, postData) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  }

  // 删除文章
  const deletePost = async (id) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting post:', error)
      return false
    }
  }

  // 获取评论
  const getComments = async (postId) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:author_id(username, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching comments:', error)
      return []
    }
  }

  // 添加评论
  const addComment = async (commentData) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([commentData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  // 获取所有标签
  const getTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select(`
          *,
          post_tags(count)
        `)
        .order('name')

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching tags:', error)
      return []
    }
  }

  // 根据标签获取文章
  const getPostsByTag = async (tagSlug) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:author_id(username, avatar_url),
          tags:post_tags(tag:tag_id(name, slug))
        `)
        .eq('published', true)
        .eq('tags.tag.slug', tagSlug)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching posts by tag:', error)
      return []
    }
  }

  return {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    getComments,
    addComment,
    getTags,
    getPostsByTag,
  }
}