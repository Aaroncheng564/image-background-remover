import { NextRequest, NextResponse } from 'next/server';

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

    // 调用 remove.bg API
    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY || 'demo',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_file_b64: base64Data,
        size: 'auto',
      }),
    });

    if (!removeBgResponse.ok) {
      const errorText = await removeBgResponse.text();
      console.error('Remove.bg API error:', removeBgResponse.status, errorText);
      return NextResponse.json(
        { error: '背景去除失败，请稍后重试' },
        { status: removeBgResponse.status }
      );
    }

    // 获取处理后的图片并转换为 base64
    const resultBuffer = await removeBgResponse.arrayBuffer();
    const resultBase64 = Buffer.from(resultBuffer).toString('base64');
    const resultImage = `data:image/png;base64,${resultBase64}`;

    return NextResponse.json({ result: resultImage });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
