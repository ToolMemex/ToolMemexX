// src/components/ui/Switch.tsx

import { useState } from "react";
import { motion } from "framer-motion";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export const Switch = ({ checked = false, onChange, disabled = false, label }: SwitchProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const toggle = () => {
    if (disabled) return;
    setIsChecked((prev) => {
      const next = !prev;
      onChange?.(next);
      return next;
    });
  };

  return (
    <button
      onClick={toggle}
      className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors ${
        isChecked ? "bg-primary" : "bg-muted-foreground"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      aria-pressed={isChecked}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        className="inline-block h-5 w-5 bg-white rounded-full shadow-md"
        style={{
          marginLeft: isChecked ? "1.75rem" : "0.25rem",
        }}
      />
      {label && (
        <span className="ml-3 text-sm font-medium text-muted-foreground">{label}</span>
      )}
    </button>
  );
};