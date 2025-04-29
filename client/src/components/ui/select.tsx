import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Only import Select, because others don't exist
export const Select = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const toggle = () => {
    if (!disabled) setOpen((prev) => !prev);
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-lg border bg-background transition ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent cursor-pointer"
        }`}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-2 w-full rounded-lg bg-popover border shadow-md overflow-hidden"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`px-4 py-2 text-sm hover:bg-accent cursor-pointer ${
                  opt.value === value ? "bg-muted-foreground/10 font-semibold" : ""
                }`}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};