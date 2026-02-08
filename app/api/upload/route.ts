import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Generate unique filename with timestamp and sanitized name
    const timestamp = Date.now();
    let sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^[.-]+/, '') // Remove leading dots and dashes
      .replace(/[.-]+$/, ''); // Remove trailing dots and dashes
    
    // Ensure filename is not empty and has valid characters
    if (!sanitizedName || sanitizedName.length === 0) {
      sanitizedName = 'image';
    }
    
    const filename = `${timestamp}-${sanitizedName}`;

    // Upload to Vercel Blob in recipes folder
    const blob = await put(`recipes/${filename}`, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
