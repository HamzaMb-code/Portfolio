import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { TransitionLink } from "@/components/page-transition";
import { PlaceholderArt } from "@/components/placeholder-art";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/content";
import { CoworkingCase, generateCoworkingMetadata } from "@/components/coworking-case";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projects.find((p) => p.id === slug);
  if (!project) return {};
  if (project.id === "coworking-saas") return generateCoworkingMetadata();
  return {
    title: project.name,
    description: project.intro,
  };
}

export default async function CasePage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const idx = projects.findIndex((p) => p.id === slug);
  if (idx === -1) notFound();

  const project = projects[idx];
  if (project.id === "coworking-saas") return <CoworkingCase />;
  const next = projects[(idx + 1) % projects.length];
  const blinds = Array.from({ length: 8 });

  return (
    <main>
      <TransitionLink href="/work" className="case__back" data-cursor="ring">
        ← All work
      </TransitionLink>

      <section className="case__hero">
        <PlaceholderArt hue={project.hue} className="case__hero__art" />
        <div className="blinds" aria-hidden="true">
          {blinds.map((_, i) => (
            <i key={i} style={{ animationDelay: `${i * 0.04}s` }} />
          ))}
        </div>
        <span className="case__idx">{String(idx + 1).padStart(2, "0")}</span>
        <h1 className="case__title">
          {project.title.map((line, i) => (
            <Reveal as="div" key={line} delay={0.15 + i * 0.06}>
              {line}
            </Reveal>
          ))}
        </h1>
      </section>

      <div className="case__meta">
        <div>
          <small>Client</small>
          <b>{project.client}</b>
        </div>
        <div>
          <small>Role</small>
          <b>{project.role}</b>
        </div>
        <div>
          <small>Services</small>
          <b>{project.services}</b>
        </div>
        <div>
          <small>Year</small>
          <b>{project.year}</b>
        </div>
      </div>

      <div className="case__intro">
        <span className="site-eyebrow">Overview</span>
        <div>
          <p>{project.intro}</p>
          {project.id === "bookswap" ? (
            <a
              className="case__github"
              href="https://github.com/HamzaMb-code/BookSwapProject"
              target="_blank"
              rel="noreferrer"
            >
              View source on GitHub <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </div>

      <div className="case__img">
        {project.id === "bookswap" ? (
          <Image
            src="/images/projects/book-swap/bookswap_heroSection.png"
            alt="BookSwap homepage introducing the student book exchange marketplace."
            width={1920}
            height={1080}
            sizes="(max-width: 760px) 100vw, 92vw"
            loading="lazy"
            className="case__img__shot"
          />
        ) : (
          <PlaceholderArt hue={project.hue} label="Cover" />
        )}
      </div>

      <div className="case__block">
        <h3>The challenge</h3>
        <p>{project.challenge}</p>
      </div>

      <div className="case__duo">
        <div className="case__img">
          <PlaceholderArt hue={(project.hue + 20) % 360} />
        </div>
        <div className="case__img">
          <PlaceholderArt hue={(project.hue + 340) % 360} />
        </div>
      </div>

      <div className="case__block">
        <h3>The approach</h3>
        <p>{project.approach}</p>
      </div>

      <div className="case__stats">
        {project.stats.map(([value, label]) => (
          <div key={label}>
            <b>{value}</b>
            <small>{label}</small>
          </div>
        ))}
      </div>

      <TransitionLink href={`/work/${next.id}`} className="case__next" data-cursor="case" data-cursor-label="Next">
        <small>Next project</small>
        <span className="nxt">{next.name}</span>
      </TransitionLink>
    </main>
  );
}
