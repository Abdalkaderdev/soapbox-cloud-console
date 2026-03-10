interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-8 py-6">
      <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{description}</p>
      )}
    </header>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  )
}
