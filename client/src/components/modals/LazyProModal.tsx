// components/modals/LazyProModal.tsx
import React, { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

const ProUpgradeModal = lazy(() => import("./ProUpgradeModal"));

interface LazyProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LazyProModal({ isOpen, onClose }: LazyProModalProps) {
  if (!isOpen) return null;

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      }
    >
      <ProUpgradeModal isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
}