# 🎨 AI Background Remover

一个使用 Next.js + Tailwind CSS 构建的 AI 背景去除工具。

## ✨ 功能特性

- 📤 **点击或拖拽上传图片** - 支持 JPG、PNG、WebP 格式
- 🎯 **一键去除背景** - 使用 Remove.bg API 提供高质量效果
- 🔄 **实时对比预览** - 左右对比原图和处理后的图片
- 📥 **一键下载** - 直接下载透明背景的 PNG 图片
- 📱 **响应式设计** - 完美适配手机和桌面浏览器
- 🔒 **隐私保护** - 图片仅在内存中处理，不存储

## 🚀 快速开始

### 1. 获取 Remove.bg API Key

访问 [https://www.remove.bg/api](https://www.remove.bg/api) 注册并获取免费 API Key。

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env`，然后填入你的 API Key：

```bash
cp .env.example .env
# 编辑 .env 文件，填入你的 REMOVE_BG_API_KEY
```

### 4. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 📦 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAaroncheng564%2Fimage-background-remover)

在 Vercel 项目设置中添加环境变量 `REMOVE_BG_API_KEY`。

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **AI 服务**: Remove.bg API

## 📝 MVP 功能清单

- [x] 图片上传（点击 + 拖拽）
- [x] 一键去除背景
- [x] 结果对比展示
- [x] 图片下载
- [x] 重新上传
- [x] 加载状态
- [x] 错误提示

## 📄 许可证

MIT License
