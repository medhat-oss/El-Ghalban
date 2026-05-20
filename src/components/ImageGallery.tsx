"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
}

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  // If no images are available, show a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full aspect-square bg-silver-50 dark:bg-silver-800 rounded-2xl overflow-hidden flex items-center justify-center">
        <Image src="/placeholder.png" alt={productName} fill className="object-cover opacity-50" />
      </div>
    );
  }

  const mainImage = images[currentIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div className="relative w-full aspect-[4/5] sm:aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group cursor-zoom-in">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <Image
              src={brokenImages[currentIndex] ? "/placeholder.png" : mainImage.url}
              alt={`${productName} - Image ${currentIndex + 1}`}
              fill
              className="object-contain p-2 md:p-6 transition-transform duration-500 group-hover:scale-125"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              onError={() => setBrokenImages(prev => ({ ...prev, [currentIndex]: true }))}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 snap-center
                ${currentIndex === idx 
                  ? "border-sky-500 shadow-md ring-2 ring-sky-500/20 scale-100 opacity-100 bg-white dark:bg-slate-800" 
                  : "border-transparent opacity-50 hover:opacity-100 hover:scale-95 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-100 dark:bg-slate-800/50"
                }`}
            >
              <Image
                src={brokenImages[idx] ? "/placeholder.png" : img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                onError={() => setBrokenImages(prev => ({ ...prev, [idx]: true }))}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
