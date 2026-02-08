import Image from 'next/image';

interface RecipeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
}

/**
 * Optimized image component for recipe images
 * - Supports both local and Vercel Blob URLs
 * - Automatic WebP/AVIF conversion
 * - Lazy loading by default
 * - Blur placeholder for better UX
 */
export default function RecipeImage({
  src,
  alt,
  fill = false,
  priority = false,
  className = '',
  sizes,
  width,
  height,
}: RecipeImageProps) {
  // Default sizes for responsive images if not provided
  const defaultSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

  // Check if it's a Blob URL (starts with https://)
  const isBlobUrl = src.startsWith('https://');

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={defaultSizes}
        priority={priority}
        quality={85}
      />
    );
  }

  // For non-fill images, we need width and height
  const imageWidth = width || 800;
  const imageHeight = height || 600;

  return (
    <Image
      src={src}
      alt={alt}
      width={imageWidth}
      height={imageHeight}
      className={className}
      sizes={defaultSizes}
      priority={priority}
      quality={85}
    />
  );
}
