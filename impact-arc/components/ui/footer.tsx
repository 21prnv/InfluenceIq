import Link from "next/link"
import { cn } from "@/lib/utils"

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t bg-black text-white", className)}>
      <div className="container flex items-center justify-between py-4 gap-2">
        <p className="text-sm text-gray-300 flex-1 text-center">
          Built with ❤️ by Impact Arc. All rights reserved.
        </p>
        <div className="p-5">
          <Link
            href="https://github.com/21prnv/impact-arc"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}