"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // If no images are available, show a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Image src="/placeholder.png" alt={productName} fill className="object-contain p-4 opacity-50" />
        </div>
      </div>
    );
  }

  const mainImage = images[currentIndex];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image View */}
      <div 
        className="relative w-full aspect-square overflow-hidden rounded-xl bg-transparent cursor-pointer"
        onClick={() => {
          setIsLightboxOpen(true);
          setIsZoomed(false);
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={brokenImages[currentIndex] || !mainImage?.url ? "/placeholder.png" : mainImage.url}
              alt={`${productName} - Image ${currentIndex + 1}`}
              fill
              className="w-full h-full object-cover"
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
                src={brokenImages[idx] || !img?.url ? "/placeholder.png" : img.url}
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

      {/* ── Lightbox Overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 0, y: 0 }}
              animate={isZoomed ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag={isZoomed}
              dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
              dragElastic={0.1}
              className="relative w-full max-w-5xl aspect-square sm:aspect-video flex items-center justify-center pointer-events-none"
            >
              <Image
                src={brokenImages[currentIndex] || !mainImage?.url ? "/placeholder.png" : mainImage.url}
                alt={`${productName} - Expanded`}
                fill
                draggable={false}
                className={`object-contain pointer-events-auto transition-transform duration-300 ${isZoomed ? "scale-[2] sm:scale-150 cursor-grab active:cursor-grabbing" : "scale-100 cursor-zoom-in"}`}
                sizes="100vw"
                quality={100}
                priority
                onDoubleClick={() => setIsZoomed(!isZoomed)}
              />
            </motion.div>

            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 end-6 z-[310] w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
