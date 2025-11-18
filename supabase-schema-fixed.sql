-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建文章表
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建文章标签关联表
CREATE TABLE IF NOT EXISTS post_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建点赞表
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- 创建更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入示例标签
INSERT INTO tags (name, slug, description) VALUES
('技术', 'tech', '技术相关文章'),
('生活', 'life', '生活感悟和分享'),
('设计', 'design', '设计相关内容'),
('产品', 'product', '产品思考和经验'),
('前端', 'frontend', '前端开发技术'),
('后端', 'backend', '后端开发技术'),
('数据库', 'database', '数据库相关内容'),
('人工智能', 'ai', '人工智能和机器学习'),
('移动开发', 'mobile', '移动应用开发'),
('DevOps', 'devops', '运维和部署相关')
ON CONFLICT (slug) DO NOTHING;

-- 插入示例用户
INSERT INTO users (username, email, bio) VALUES
('admin', 'admin@example.com', '系统管理员'),
('author', 'author@example.com', '内容创作者'),
('developer', 'developer@example.com', '全栈开发工程师')
ON CONFLICT (email) DO NOTHING;

-- 插入示例文章
INSERT INTO posts (title, slug, excerpt, content, published, author_id) VALUES
(
  '欢迎来到现代博客平台',
  'welcome-to-modern-blog',
  '这是一个功能完整的博客平台，支持文章发布、评论和标签管理。',
  '# 欢迎来到现代博客平台

这是一个基于 React 和 Supabase 构建的现代化博客平台。

## 主要功能

- 📝 文章发布和管理
- 💬 评论系统
- 🏷️ 标签分类
- 📱 响应式设计
- 🚀 现代化 UI

## 技术栈

- **前端**: React 18 + Vite + Tailwind CSS
- **后端**: Supabase
- **部署**: Netlify
- **状态管理**: React Context

欢迎体验这个现代化的博客平台！',
  true,
  (SELECT id FROM users WHERE username = 'admin' LIMIT 1)
),
(
  '如何使用 Markdown 写作',
  'how-to-use-markdown',
  '学习 Markdown 语法，提高写作效率。',
  '# 如何使用 Markdown 写作

Markdown 是一种轻量级标记语言，非常适合写作。

## 基本语法

### 标题

使用 `#` 号创建标题：

```markdown
# 一级标题
## 二级标题
### 三级标题
```

### 文本格式

- **粗体文本**: 使用 `**文本**`
- *斜体文本*: 使用 `*文本*`
- `代码`: 使用反引号

### 列表

无序列表：
```markdown
- 项目 1
- 项目 2
- 项目 3
```

有序列表：
```markdown
1. 第一步
2. 第二步
3. 第三步
```

### 链接和图片

链接：`[链接文本](URL)`
图片：`![图片描述](图片URL)`

开始使用 Markdown 吧！',
  true,
  (SELECT id FROM users WHERE username = 'author' LIMIT 1)
),
(
  'React 18 新特性介绍',
  'react-18-new-features',
  '了解 React 18 带来的新功能和改进。',
  '# React 18 新特性介绍

React 18 带来了许多激动人心的新特性。

## 并发特性

### Suspense

Suspense 让你能够声明式地指定组件的加载状态。

### 自动批处理

React 18 自动批处理更多类型的更新，减少渲染次数。

## 新的 Hooks

### useId

生成唯一 ID，避免 hydration 不匹配。

### useDeferredValue

延迟更新非关键部分。

## 过渡

使用 `startTransition` 标记非紧急更新。

```jsx
import { startTransition } from ''react'';

startTransition(() => {
  setQuery(input);
});
```

这些新特性让 React 应用更加高效和用户友好。',
  true,
  (SELECT id FROM users WHERE username = 'developer' LIMIT 1)
)
ON CONFLICT (slug) DO NOTHING;

-- 为文章添加标签关联
INSERT INTO post_tags (post_id, tag_id) 
SELECT p.id, t.id 
FROM posts p, tags t 
WHERE p.slug = 'welcome-to-modern-blog' AND t.slug IN ('tech', 'frontend')
ON CONFLICT (post_id, tag_id) DO NOTHING;

INSERT INTO post_tags (post_id, tag_id) 
SELECT p.id, t.id 
FROM posts p, tags t 
WHERE p.slug = 'how-to-use-markdown' AND t.slug IN ('tech', 'life')
ON CONFLICT (post_id, tag_id) DO NOTHING;

INSERT INTO post_tags (post_id, tag_id) 
SELECT p.id, t.id 
FROM posts p, tags t 
WHERE p.slug = 'react-18-new-features' AND t.slug IN ('tech', 'frontend', 'design')
ON CONFLICT (post_id, tag_id) DO NOTHING;

-- 插入示例评论
INSERT INTO comments (content, post_id, author_id) VALUES
(
  '很棒的平台！界面设计很现代化。',
  (SELECT id FROM posts WHERE slug = 'welcome-to-modern-blog' LIMIT 1),
  (SELECT id FROM users WHERE username = 'author' LIMIT 1)
),
(
  '期待看到更多功能！',
  (SELECT id FROM posts WHERE slug = 'welcome-to-modern-blog' LIMIT 1),
  (SELECT id FROM users WHERE username = 'developer' LIMIT 1)
),
(
  'Markdown 语法总结得很清晰，对新手很有帮助！',
  (SELECT id FROM posts WHERE slug = 'how-to-use-markdown' LIMIT 1),
  (SELECT id FROM users WHERE username = 'admin' LIMIT 1)
)
ON CONFLICT DO NOTHING;

-- 更新文章评论数
UPDATE posts SET comment_count = (
  SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id
);

-- 创建 Row Level Security (RLS) 策略（仅在 auth 表存在时）
DO $$
BEGIN
    -- 检查 auth 表是否存在
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'auth' AND table_schema = 'auth') THEN
        
        ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
        ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
        ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

        -- 允许所有人查看已发布的文章
        DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON posts;
        CREATE POLICY "Published posts are viewable by everyone" ON posts
            FOR SELECT USING (published = true);

        -- 允许所有人查看评论
        DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
        CREATE POLICY "Comments are viewable by everyone" ON comments
            FOR SELECT USING (true);

        -- 允许所有人创建评论
        DROP POLICY IF EXISTS "Anyone can create comments" ON comments;
        CREATE POLICY "Anyone can create comments" ON comments
            FOR INSERT WITH CHECK (true);

        -- 允许所有人查看点赞
        DROP POLICY IF EXISTS "Likes are viewable by everyone" ON likes;
        CREATE POLICY "Likes are viewable by everyone" ON likes
            FOR SELECT USING (true);

        -- 允许认证用户点赞
        DROP POLICY IF EXISTS "Authenticated users can like posts" ON likes;
        CREATE POLICY "Authenticated users can like posts" ON likes
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');

        -- 允许用户取消自己的点赞
        DROP POLICY IF EXISTS "Users can unlike their own likes" ON likes;
        CREATE POLICY "Users can unlike their own likes" ON likes
            FOR DELETE USING (auth.uid = user_id);
            
        RAISE NOTICE 'RLS policies created successfully';
    ELSE
        RAISE NOTICE 'Auth table not found, skipping RLS policies';
    END IF;
END $$;