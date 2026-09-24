/** Page title block: small eyebrow, display-serif title, supporting line. */
export default function PageHeader({ id, eyebrow, title, subtitle }) {
  return (
    <header className="mb-6 sm:mb-8">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h1
        id={id}
        className="font-display text-[2rem] leading-[1.1] font-semibold tracking-[-0.02em] text-ink sm:text-[2.5rem]"
      >
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-[15px] text-muted">{subtitle}</p>}
    </header>
  )
}
