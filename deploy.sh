#!/bin/bash

echo "🚀 现代博客平台 - 自动部署脚本"
echo "================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查必要工具
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 未安装，请先安装${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ $1 已安装${NC}"
    fi
}

echo -e "${BLUE}🔍 检查必要工具...${NC}"
check_tool "git"
check_tool "node"
check_tool "npm"

# 检查环境变量
echo -e "${BLUE}🔧 检查环境配置...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  未找到 .env 文件${NC}"
    echo -e "${YELLOW}📝 请先配置 Supabase：${NC}"
    echo "1. 访问 https://supabase.com 创建项目"
    echo "2. 运行 supabase-schema.sql 中的 SQL"
    echo "3. 获取 Project URL 和 anon key"
    echo "4. 更新 .env 文件"
    exit 1
fi

# 检查 .env 是否已配置
if grep -q "your-project-id" .env; then
    echo -e "${YELLOW}⚠️  请先在 .env 文件中配置你的 Supabase 信息${NC}"
    echo -e "${YELLOW}📝 编辑 .env 文件，替换以下内容：${NC}"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    exit 1
fi

echo -e "${GREEN}✅ 环境配置检查通过${NC}"

# 安装依赖
echo -e "${BLUE}📦 安装依赖...${NC}"
npm install

# 构建项目
echo -e "${BLUE}🏗️  构建项目...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 构建成功${NC}"
else
    echo -e "${RED}❌ 构建失败${NC}"
    exit 1
fi

# Git 操作
echo -e "${BLUE}📤 准备推送到 GitHub...${NC}"

# 检查是否已连接远程仓库
if ! git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}⚠️  未连接 GitHub 仓库${NC}"
    echo "请先在 GitHub 创建仓库，然后运行："
    echo "git remote add origin https://github.com/你的用户名/仓库名.git"
    echo "git push -u origin main"
    exit 1
fi

# 提交更改
git add .
git commit -m "Update: Ready for deployment"

echo -e "${GREEN}✅ 代码已提交${NC}"

# 推送到 GitHub
echo -e "${BLUE}📤 推送到 GitHub...${NC}"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 推送成功${NC}"
else
    echo -e "${RED}❌ 推送失败${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 部署准备完成！${NC}"
echo ""
echo -e "${BLUE}📋 下一步操作：${NC}"
echo "1. 访问 https://netlify.com"
echo "2. 点击 'New site from Git'"
echo "3. 选择 GitHub 并连接你的仓库"
echo "4. 配置构建设置："
echo "   - Build command: npm run build"
echo "   - Publish directory: dist"
echo "5. 在 Environment variables 中添加："
echo "   - VITE_SUPABASE_URL: $(grep VITE_SUPABASE_URL .env | cut -d'=' -f2)"
echo "   - VITE_SUPABASE_ANON_KEY: $(grep VITE_SUPABASE_ANON_KEY .env | cut -d'=' -f2)"
echo "6. 点击 'Deploy site'"
echo ""
echo -e "${YELLOW}📝 部署完成后，你将获得一个 Netlify URL，这就是要提交的链接！${NC}"