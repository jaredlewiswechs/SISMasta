"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error(
      "Dropdown compound components must be used within <Dropdown>"
    );
  }
  return context;
}

export interface DropdownProps {
  children: ReactNode;
  className?: string;
}

function Dropdown({ children, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, toggle }}>
      <div ref={ref} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export interface DropdownTriggerProps {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
}

function DropdownTrigger({ children, className }: DropdownTriggerProps) {
  const { toggle } = useDropdownContext();

  return (
    <button
      type="button"
      className={cn("inline-flex items-center", className)}
      onClick={toggle}
      aria-haspopup="true"
    >
      {children}
    </button>
  );
}

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right";
}

function DropdownMenu({
  align = "right",
  className,
  children,
  ...props
}: DropdownMenuProps) {
  const { open } = useDropdownContext();

  if (!open) return null;

  return (
    <div
      role="menu"
      className={cn(
        "absolute z-50 mt-2 min-w-[180px] rounded-md border border-gray-200 bg-white py-1 shadow-lg",
        align === "right" ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DropdownItemProps
  extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  destructive?: boolean;
}

function DropdownItem({
  className,
  disabled,
  destructive,
  children,
  onClick,
  ...props
}: DropdownItemProps) {
  const { setOpen } = useDropdownContext();

  return (
    <button
      role="menuitem"
      type="button"
      disabled={disabled}
      className={cn(
        "flex w-full items-center px-4 py-2 text-left text-sm transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        destructive
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function DropdownSeparator({ className }: { className?: string }) {
  return (
    <div
      className={cn("my-1 h-px bg-gray-200", className)}
      role="separator"
    />
  );
}

export {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
};
