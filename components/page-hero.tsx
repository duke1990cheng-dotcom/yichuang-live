type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="border-b border-line/70 bg-white">
      <div className="container-page py-14 md:py-20">
        {eyebrow ? (
          <p className="mb-4 text-sm font-medium tracking-[0.22em] text-blue">{eyebrow}</p>
        ) : null}
        <h1 className="max-w-3xl text-3xl font-medium leading-tight text-ink md:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-ink/68 md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
