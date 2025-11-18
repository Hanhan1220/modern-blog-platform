#!/bin/bash

echo "🚀 现代博客平台 - 快速启动脚本"
echo "=================================="

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18 或更高版本"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
else
    echo "✅ 依赖已安装"
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "⚠️  未找到 .env 文件"
    echo "📝 正在从 .env.example 创建 .env 文件..."
    cp .env.example .env
    echo "📝 请编辑 .env 文件，填入你的 Supabase 配置："
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    echo ""
    echo "📖 详细配置说明请查看 README.md 和 DEPLOYMENT.md"
fi

echo ""
echo "🎯 选择启动模式："
echo "1) 开发模式 (npm run dev)"
echo "2) 构建项目 (npm run build)"
echo "3) 预览构建结果 (npm run preview)"
echo ""

read -p "请选择 (1-3): " choice

case $choice in
    1)
        echo "🔧 启动开发服务器..."
        npm run dev
        ;;
    2)
        echo "🏗️  构建项目..."
        npm run build
        echo "✅ 构建完成！文件位于 dist/ 目录"
        ;;
    3)
        if [ ! -d "dist" ]; then
            echo "🏗️  先构建项目..."
            npm run build
        fi
        echo "👀 启动预览服务器..."
        npm run preview
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac