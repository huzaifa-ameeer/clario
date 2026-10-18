import { ArrowRight, FileText, Sparkles, Upload } from 'lucide-react'

const steps = [
  {
    step: '01',
    title: 'Upload your document',
    text: 'Drop in a PDF or Word file up to 5MB. Your file is handled securely and never stored.',
    icon: Upload,
  },
  {
    step: '02',
    title: 'AI breaks it down',
    text: 'Text is extracted and Gemini digs through every page to find the ideas that actually matter.',
    icon: Sparkles,
  },
  {
    step: '03',
    title: 'Read clean bullet points',
    text: 'Get a catchy title and sharp, scannable bullets — no fluff, no walls of text, ready in seconds.',
    icon: FileText,
  },
]

const cardClass =
  'group w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-200 ease-out hover:-translate-y-1.5 hover:border-blue-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:hover:border-blue-400'

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="flex min-h-[calc(100vh_-_4rem)] scroll-mt-16 flex-col justify-center px-6 pt-4 pb-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            How it works
          </h2>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
            Three steps between a messy document and notes you actually want
            to read.
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center gap-6 lg:flex-row lg:items-stretch lg:gap-4">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="flex flex-col items-center gap-6 lg:flex-row lg:gap-4"
            >
              <div className={cardClass}>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 transition-colors duration-200 group-hover:text-blue-500 dark:text-blue-400 dark:group-hover:text-blue-300">
                    <step.icon size={24} strokeWidth={2} />
                  </span>
                  <span className="text-sm font-semibold tracking-widest text-gray-300 dark:text-gray-700">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {step.text}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="flex items-center justify-center text-gray-300 dark:text-gray-600">
                  <ArrowRight
                    className="rotate-90 lg:rotate-0"
                    size={24}
                    strokeWidth={2}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
