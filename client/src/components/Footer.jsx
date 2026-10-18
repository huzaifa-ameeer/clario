import { Heart } from 'lucide-react'

function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-center px-6 py-8">
        <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          Built by
          <a
            href="https://huzaifa-lake.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-gray-900 underline underline-offset-4 transition-colors duration-200 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
          >
            Huzaifa
            <Heart size={14} className="fill-red-500 text-red-500" />
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer

