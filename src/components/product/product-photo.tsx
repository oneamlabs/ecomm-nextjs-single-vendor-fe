import Image from "next/image";
import { getPhoto } from "@/lib/photos";

interface ProductPhotoProps {
  photoKey: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function ProductPhoto({
  photoKey,
  alt,
  sizes,
  priority = false,
  className = "",
}: ProductPhotoProps) {
  const photo = getPhoto(photoKey);

  return (
    <figure className={`fig ${className}`}>
      <Image
        src={photo.src}
        alt={alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="h-full w-full object-cover"
      />
    </figure>
  );
}
