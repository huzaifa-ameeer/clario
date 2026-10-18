import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-6 px-6 pt-24 pb-16 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
          Upload a PDF, get{' '}
          <span className="relative inline-block">
            <span
              aria-hidden="true"
              className="absolute -inset-x-1 -inset-y-0.5 -rotate-2 rounded-md bg-gradient-to-r from-orange-400 to-amber-400 opacity-60 sm:-inset-x-2 sm:-inset-y-1 sm:-rotate-2"
            />
            <span className="relative">beautiful bullet points</span>
          </span>{' '}
          in seconds
        </h1>

        <p className="mx-auto max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          Drop in any PDF or Word document and Clario turns it into a clean,
          scannable summary — sharp bullets, key takeaways, and nothing you
          don't need. No reading through pages. Just the points that matter.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/login"
            className="rounded-full bg-gray-900 px-7 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:text-white dark:hover:bg-purple-600"
          >
            Get Started — it's free
          </Link>
          <a
            href="#how-it-works"
            className="rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-gray-900 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-white dark:hover:text-white"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
