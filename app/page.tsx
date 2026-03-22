'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError('文件大小不能超过 12MB');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemoveBackground = async () => {
    if (!originalImage) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: originalImage }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '处理失败');
      setProcessedImage(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'no-background.png';
    link.click();
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    fileInputRef.current?.value && (fileInputRef.current.value = '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🎨 AI 背景去除
          </h1>
          <p className="text-xl text-gray-600">
            3秒去除图片背景，无需下载任何软件
          </p>
        </header>

        <main className="max-w-5xl mx-auto">
          {!originalImage ? (
            <div
              className={`border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                dragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
              <div className="text-8xl mb-6">📤</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                点击或拖拽上传图片
              </h2>
              <p className="text-gray-500 mb-4">
                支持 JPG、PNG、WebP，最大 12MB
              </p>
              <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                <span>选择图片</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-700">原图</h3>
                  </div>
                  <div className="p-4 flex items-center justify-center min-h-[400px] bg-gray-50">
                    <img
                      src={originalImage}
                      alt="原图"
                      className="max-w-full max-h-[400px] object-contain"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-700">处理后</h3>
                  </div>
                  <div className="p-4 flex items-center justify-center min-h-[400px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjNmNGY2Ii8+PHJlY3QgeD0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2U0ZTVlNyIvPjxyZWN0IHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlNGU1ZTciLz48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==')]">
                    {processedImage ? (
                      <img
                        src={processedImage}
                        alt="处理后"
                        className="max-w-full max-h-[400px] object-contain"
                      />
                    ) : isLoading ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-500">正在处理中...</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <div className="text-6xl mb-4">✨</div>
                        <p>点击下方按钮去除背景</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                {!processedImage && !isLoading && (
                  <button
                    onClick={handleRemoveBackground}
                    className="bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
                  >
                    🎯 一键去除背景
                  </button>
                )}
                {processedImage && (
                  <button
                    onClick={handleDownload}
                    className="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
                  >
                    📥 下载图片
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="bg-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  🔄 重新上传
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="text-center mt-16 text-gray-500">
          <p>使用 AI 技术，保护您的隐私 - 图片仅在内存中处理</p>
        </footer>
      </div>
    </div>
  );
}
