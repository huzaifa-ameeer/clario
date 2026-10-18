import { History, ShieldCheck, Zap } from 'lucide-react'

const features = [
  {
    title: 'Files never stored',
    text: 'Documents are processed in memory and deleted the moment analysis finishes. Only your notes stay behind.',
    icon: ShieldCheck,
    card: 'bg-blue-600 border-blue-600',
    iconColor: 'text-white',
    titleColor: 'text-white',
    textColor: 'text-blue-100',
  },
  {
    title: 'Every summary saved',
    text: 'All your bullet points are kept in your history, ready whenever you need to revisit them.',
    icon: History,
    card: 'bg-gray-900 border-gray-900 dark:bg-gray-800 dark:border-gray-800',
    iconColor: 'text-white',
    titleColor: 'text-white',
    textColor: 'text-gray-400',
  },
  {
    title: 'Seconds, not minutes',
    text: 'Upload, analyze, read. The whole flow takes seconds, so you get the points while they still matter.',
    icon: Zap,
    card: 'bg-blue-600 border-blue-600',
    iconColor: 'text-white',
    titleColor: 'text-white',
    textColor: 'text-blue-100',
  },
]

const cardClass =
  'group w-full rounded-2xl border p-8 transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-lg'

function Features() {
  return (
    <section
      id="features"
      className="flex min-h-[calc(100vh_-_4rem)] scroll-mt-16 flex-col justify-center px-6 py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Built to respect your time
          </h2>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
            Everything you need to skim less and know more.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className={`${cardClass} ${feature.card}`}>
              <span className={feature.iconColor}>
                <feature.icon size={24} strokeWidth={2} />
              </span>
              <h3
                className={`mt-6 text-lg font-bold ${feature.titleColor}`}
              >
                {feature.title}
              </h3>
              <p
                className={`mt-3 text-sm leading-relaxed ${feature.textColor}`}
              >
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
