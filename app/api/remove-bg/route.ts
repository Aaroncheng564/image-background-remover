import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: '请提供图片' },
        { status: 400 }
      );
    }

    // 从 base64 中提取图片数据
    const base64Data = image.split(',')[1];
    if (!base64Data) {
      return NextResponse.json(
        { error: '图片格式错误' },
        { status: 400 }
      );
    }

    // 转换 base64 为 Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 创建 FormData
    const formData = new FormData();
    const blob = new Blob([bytes], { type: 'image/png' });
    formData.append('image_file', blob, 'image.png');
    formData.append('size', 'auto');

    // 调用 remove.bg API
    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY || 'demo',
      },
      body: formData,
    });

    if (!removeBgResponse.ok) {
      const errorText = await removeBgResponse.text();
      console.error('Remove.bg API error:', removeBgResponse.status, errorText);
      return NextResponse.json(
        { error: `背景去除失败: ${errorText}` },
        { status: removeBgResponse.status }
      );
    }

    // 获取处理后的图片并转换为 base64
    const resultBuffer = await removeBgResponse.arrayBuffer();
    const resultBytes = new Uint8Array(resultBuffer);
    let resultBase64 = '';
    for (let i = 0; i < resultBytes.length; i++) {
      resultBase64 += String.fromCharCode(resultBytes[i]);
    }
    const resultImage = `data:image/png;base64,${btoa(resultBase64)}`;

    return NextResponse.json({ result: resultImage });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}