export function SectionWrapper({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-6 text-xl font-bold tracking-tight">{title}</h2>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  )
}