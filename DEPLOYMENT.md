# 部署指南

本文档详细说明如何将现代博客平台部署到 Supabase 和 Netlify。

## 📋 部署前准备

### 1. 注册账号
- [Supabase](https://supabase.com) - 注册免费账号
- [Netlify](https://netlify.com) - 注册免费账号
- [GitHub](https://github.com) - 注册账号（用于代码托管）

### 2. 准备项目
确保项目代码已推送到 GitHub 仓库。

## 🗄️ Supabase 配置

### 1. 创建新项目
1. 登录 Supabase 控制台
2. 点击 "New Project"
3. 选择组织，输入项目名称（如：modern-blog）
4. 设置数据库密码
5. 选择地区（建议选择离用户最近的地区）
6. 点击 "Create new project"

### 2. 获取项目信息
项目创建完成后，在 Settings > API 中获取：
- Project URL
- anon public key

### 3. 设置数据库结构
1. 进入项目控制台
2. 点击左侧菜单 "SQL Editor"
3. 点击 "New query"
4. 复制项目根目录下的 `supabase-schema.sql` 文件内容
5. 粘贴到 SQL 编辑器中
6. 点击 "Run" 执行 SQL

### 4. 配置 Row Level Security (RLS)
数据库结构已包含 RLS 策略，确保：
- 已启用 RLS
- 策略配置正确

## 🌐 Netlify 部署

### 1. 连接 GitHub 仓库
1. 登录 Netlify 控制台
2. 点击 "New site from Git"
3. 选择 "GitHub"
4. 授权 Netlify 访问你的 GitHub 账号
5. 选择要部署的仓库

### 2. 配置构建设置
在 Build settings 中设置：
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18`（或更高版本）

### 3. 设置环境变量
在 Environment variables 中添加：
```
VITE_SUPABASE_URL=你的_supabase_project_url
VITE_SUPABASE_ANON_KEY=你的_supabase_anon_key
```

### 4. 部署配置
确保 `netlify.toml` 文件在项目根目录，包含：
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 5. 开始部署
点击 "Deploy site" 开始部署。Netlify 会：
1. 克隆代码仓库
2. 安装依赖
3. 构建项目
4. 部署到 CDN

## 🔧 高级配置

### 1. 自定义域名
在 Netlify 中：
1. 进入 Site settings > Domain management
2. 点击 "Add custom domain"
3. 输入域名（如：blog.yourdomain.com）
4. 配置 DNS 记录

### 2. HTTPS 证书
Netlify 自动为所有站点提供免费 HTTPS 证书。

### 3. 表单处理
如需添加联系表单，可以：
1. 在 HTML 中添加 `data-netlify="true"` 属性
2. 在 Netlify 控制台查看表单提交

### 4. 函数功能
如需服务端功能，可以使用 Netlify Functions：
1. 在项目根目录创建 `netlify/functions` 目录
2. 编写 JavaScript/TypeScript 函数
3. 部署后可通过 `/.netlify/functions/function-name` 访问

## 📊 监控和维护

### 1. 性能监控
- Netlify Analytics：访问统计
- Supabase Dashboard：数据库使用情况
- Google Analytics：用户行为分析

### 2. 错误监控
- Netlify Build logs：构建错误
- Browser console：前端错误
- Supabase Logs：数据库错误

### 3. 备份策略
- Supabase 自动备份（7天免费）
- GitHub 代码版本控制
- 定期导出重要数据

## 🚀 部署后检查清单

### 1. 功能测试
- [ ] 首页正常加载
- [ ] 文章列表显示
- [ ] 文章详情页正常
- [ ] 评论功能可用
- [ ] 标签页面正常
- [ ] 写文章功能可用

### 2. 性能检查
- [ ] 页面加载速度 < 3秒
- [ ] 移动端适配正常
- [ ] 图片加载优化

### 3. SEO 检查
- [ ] Meta 标签完整
- [ ] Open Graph 标签
- [ ] 结构化数据
- [ ] 站点地图

### 4. 安全检查
- [ ] HTTPS 正常工作
- [ ] 环境变量安全
- [ ] 数据库权限正确

## 🔄 持续部署

### 1. 自动部署
Netlify 默认配置为：
- 推送到 main 分支时自动部署
- Pull Request 时自动预览

### 2. 分支策略
建议使用：
- `main`：生产环境
- `develop`：开发环境
- `feature/*`：功能分支

### 3. 部署钩子
可以配置部署钩子，在部署完成后：
- 发送通知到 Slack/微信
- 触发测试流程
- 更新部署状态

## 🆘 常见问题

### 1. 构建失败
- 检查 `package.json` 中的构建命令
- 确认 Node.js 版本兼容
- 查看构建日志中的错误信息

### 2. 环境变量问题
- 确认变量名正确（以 `VITE_` 开头）
- 检查 Supabase URL 和密钥格式
- 重新部署以应用新变量

### 3. 数据库连接问题
- 确认 Supabase 项目 URL 正确
- 检查 anon key 是否有效
- 验证 RLS 策略配置

### 4. 路由问题
- 确认 `netlify.toml` 中的重定向规则
- 检查 React Router 配置
- 验证所有路由都能正常访问

## 📞 获取帮助

如遇到问题，可以：
1. 查看 [Netlify 文档](https://docs.netlify.com)
2. 查看 [Supabase 文档](https://supabase.com/docs)
3. 搜索 GitHub Issues
4. 提交新的 Issue

---

**恭喜！** 🎉 你的现代博客平台现在已经成功部署到生产环境了！

**下一步建议：**
- 添加更多功能（如用户认证、搜索等）
- 优化性能和用户体验
- 推广你的博客平台