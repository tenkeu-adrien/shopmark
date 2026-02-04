// components/BackButton.jsx
"use client";

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
export default function BackButton({
  className = "",
  iconClassName = "",
  text = "Retour",
  showText = true,
  onClick
}) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <Link
      // onClick={handleClick}
        href="/"
      className={`
        flex items-center gap-2 
        text-gray-600 hover:text-gray-900 
        transition-colors duration-200
        ${className}
      `}
      aria-label="Retour"
    >
      <ArrowLeft className={`w-5 h-5 ${iconClassName}`} />
      {showText && <span className="text-sm sm:text-base">{text}</span>}
    </Link>
  );
}