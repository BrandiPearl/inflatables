import Link from "next/link";

interface InfoPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}

export function InfoPage({ eyebrow, title, intro, children }: InfoPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-slate-50">
        <div className="container-wide py-16 lg:py-20">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-lg max-w-3xl text-slate-900">{title}</h1>
          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-slate-600">
            {intro}
          </p>
        </div>
      </header>

      <div className="container-wide py-14 lg:py-20">
        <div className="prose-info max-w-[68ch]">{children}</div>
      </div>
    </div>
  );
}

export function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14 scroll-mt-28">
      <h2 className="mb-4 border-b border-slate-200 pb-3 font-display text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      <div className="space-y-4 text-[0.9375rem] leading-[1.75] text-slate-600">
        {children}
      </div>
    </section>
  );
}

export function InfoCta({
  title,
  body,
  href = "/contact",
  label = "Contact Us",
}: {
  title: string;
  body: string;
  href?: string;
  label?: string;
}) {
  const inner = (
    <>
      {label}
      <span aria-hidden>&rarr;</span>
    </>
  );

  return (
    <aside className="mt-14 border-t-2 border-slate-900 bg-slate-50 p-7">
      <h3 className="font-display text-lg font-bold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-slate-600">
        {body}
      </p>
      {href.startsWith("mailto:") ? (
        <a href={href} className="btn-primary mt-6">
          {inner}
        </a>
      ) : (
        <Link href={href} className="btn-primary mt-6">
          {inner}
        </Link>
      )}
    </aside>
  );
}
