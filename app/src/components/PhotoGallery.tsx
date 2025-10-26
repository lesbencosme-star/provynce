import { useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
  url: string;
  caption: string;
  uploadedBy: string;
  date: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-12 border border-white/10 text-center">
        <svg
          className="w-16 h-16 text-gray-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-400">No photos uploaded yet</p>
        <p className="text-gray-500 text-sm mt-2">
          Site photos will appear here as they are uploaded by the team
        </p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === 0 ? images.length - 1 : selectedImage - 1
      );
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === images.length - 1 ? 0 : selectedImage + 1
      );
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-800"
            onClick={() => openLightbox(index)}
          >
            {/* Image */}
            <img
              src={image.url}
              alt={image.caption}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm font-semibold line-clamp-2">
                  {image.caption}
                </p>
                <p className="text-gray-300 text-xs mt-1">
                  {image.uploadedBy}
                </p>
              </div>
            </div>

            {/* Zoom Icon */}
            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            onClick={closeLightbox}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Previous Button */}
          <button
            className="absolute left-4 text-white hover:text-gray-300 transition"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next Button */}
          <button
            className="absolute right-4 text-white hover:text-gray-300 transition"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Image Container */}
          <div
            className="max-w-6xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].caption}
              className="max-h-[75vh] w-auto mx-auto object-contain rounded-lg"
            />

            {/* Image Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mt-4">
              <p className="text-white font-semibold text-lg mb-2">
                {images[selectedImage].caption}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-stellar-blue"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Uploaded by {images[selectedImage].uploadedBy}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-stellar-blue"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-300">
                    {new Date(images[selectedImage].date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-gray-400 text-xs mt-2">
                Image {selectedImage + 1} of {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
