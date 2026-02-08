import Image from 'next/image';

interface RecipeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

/**
 * Optimized image component for recipe images with automatic format selection
 * Supports both local and Vercel Blob storage URLs
 * - Automatic AVIF/WebP conversion
 * - Lazy loading (unless priority=true)
 * - Responsive sizing
 */
export default function RecipeImage({ 
  src, 
  alt, 
  width = 800, 
  height = 600, 
  priority = false, 
  className = '' 
}: RecipeImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      loading={priority ? undefined : 'lazy'}
      style={{ objectFit: 'cover' }}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
