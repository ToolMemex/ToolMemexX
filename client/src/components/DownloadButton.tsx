"use client";

import { useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@/components/LoadingSpinner";
import { showErrorToast } from "@/components/ui/toast";
import { useMemeStore } from "@/stores/meme-store"; // Correct Zustand hook import

export function DownloadButton() {
  const [downloadState, setDownloadState] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const isDownloading = downloadState === 'processing';

  const uploadedImage = useMemeStore((state) => state.memes[0]?.url); // Example use – update if needed

  const handleDownload = async () => {
    setDownloadState('processing');
    const startTime = performance.now();

    try {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const timezoneOffset = -now.getTimezoneOffset() / 60;
      const tzSign = timezoneOffset >= 0 ? '+' : '';
      const filename = `meme-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}_UTC${tzSign}${timezoneOffset}.webp`;

      const getDownloadURL = async (): Promise<string> => {
        if (uploadedImage) {
          return uploadedImage;
        }
        const canvas = document.querySelector('canvas');
        if (!canvas) throw new Error('Canvas not found');
        if (canvas.width === 0 || canvas.height === 0) throw new Error('Canvas is empty');
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.9));
        if (!blob) throw new Error('Canvas rendering failed');
        return URL.createObjectURL(blob);
      };

      const url = await getDownloadURL();

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (!uploadedImage) URL.revokeObjectURL(url);

      const downloadDuration = performance.now() - startTime;

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'meme_download', {
          event_category: 'Meme Actions',
          event_label: filename,
          file_type: 'webp',
          source: uploadedImage ? 'upload' : 'canvas',
          download_duration_ms: Math.round(downloadDuration),
          success: true,
        });
      }

      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'meme_download',
          timestamp: new Date().toISOString(),
          downloadDurationMs: Math.round(downloadDuration),
          fileType: 'webp',
          source: uploadedImage ? 'upload' : 'canvas',
        }),
      });

      setDownloadState('success');
      setTimeout(() => setDownloadState('idle'), 2000);

    } catch (error) {
      console.error('Download error:', error);
      setDownloadState('error');
      showErrorToast(`Download failed: ${(error as Error)?.message || 'Unknown error'}`);

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'meme_download_error', {
          event_category: 'Errors',
          error_message: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!uploadedImage && !document.querySelector('canvas')}
      aria-label="Download Meme"
      data-analytics-event="meme-download"
      className={`
        group relative flex items-center justify-center gap-2 
        px-5 py-2 rounded-full
        text-white font-semibold
        bg-gradient-to-r from-blue-600 to-blue-500
        hover:from-blue-700 hover:to-blue-600
        active:scale-95
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        shadow-lg hover:shadow-blue-500/30
      `}
    >
      <ArrowDownTrayIcon 
        className={`w-5 h-5 transition-transform duration-200 ${isDownloading ? 'animate-bounce' : ''}`} 
      />
      <span className="text-base">{isDownloading ? 'Downloading...' : 'Download Meme'}</span>
      {isDownloading && (
        <div className="absolute right-4">
          <Spinner className="h-4 w-4 text-blue-200 animate-spin" />
        </div>
      )}
    </button>
  );
}