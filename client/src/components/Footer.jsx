import { Heart } from 'lucide-react'

const socialLinkClass =
  'text-gray-500 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <span className="w-16" aria-hidden="true" />
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
        <div className="flex w-16 items-center justify-end gap-4">
          <a
            href="https://github.com/huzaifa-ameeer"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={socialLinkClass}
          >
            <GithubIcon width={18} height={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/muhammad-huzaifa-ameer-2107aa342/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className={socialLinkClass}
          >
            <LinkedinIcon width={18} height={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
