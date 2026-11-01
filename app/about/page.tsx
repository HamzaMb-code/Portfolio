import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { TransitionLink } from "@/components/page-transition";
import { profile, dossier, principles } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: `About ${profile.name}, ${profile.role.toLowerCase()}.`,
};

const MARQUEE_ROWS = [
  { words: ["React", "Next.js", "Laravel", "Tailwind CSS"], rev: false },
  { words: ["MySQL", "MongoDB", "Python", "Agile"], rev: true },
];

export default function AboutPage() {
  return (
    <main>
      <section className="ahero">
        <div>
          <span className="site-eyebrow">About</span>
          <h1>
            <Reveal as="div">Hi, I&apos;m</Reveal>
            <Reveal as="div" delay={0.06} className="site-o">
              {profile.name}.
            </Reveal>
          </h1>
          <p className="ahero__intro">
            A <b>{profile.role.toLowerCase()}</b> based in {profile.location},
            spending most days on interfaces and the systems that hold them
            together — currently {profile.availability.toLowerCase()}.
          </p>
        </div>
        <div className="ahero__right">
          <div className="about__portraitWrap">
            <div className="about__portrait">
              <Image
                src="/images/portfolio-image.png"
                alt={`Portrait of ${profile.name}`}
                fill
                priority
                sizes="(max-width: 820px) 90vw, 40vw"
                style={{ objectFit: "cover", objectPosition: "center 42%" }}
              />
              <figcaption>{profile.name}</figcaption>
            </div>
          </div>
        </div>
      </section>

      {MARQUEE_ROWS.map((row, i) => (
        <div className={`mq ${row.rev ? "-rev" : ""}`} key={i}>
          <div className="mq__in">
            {[...row.words, ...row.words, ...row.words].map((w, j) => (
              <b key={j} className={j % 2 === 0 ? "" : "-ghost"}>
                {w}
              </b>
            ))}
          </div>
        </div>
      ))}

      <section className="abio site-section">
        <span className="site-eyebrow">The short version</span>
        <div className="abio__grid">
          <h2>Trained on the whole stack, one layer at a time.</h2>
          <div className="abio__copy">
            <p>
              I came up through a Technicien Spécialisé in Full-Stack
              Development at OFPPT, then kept going with a Licence en Génie
              Informatique. <b>BookSwap</b> — a book marketplace for
              students, built solo with React, Laravel and MySQL — is where
              the front-end and back-end pieces actually clicked together.
            </p>
            <p>
              Alongside that I spent a term teaching computer science
              fundamentals to primary and secondary students, and a month in
              Foundever&apos;s IT department doing hands-on technical
              support. Right now I&apos;m deepening Next.js, MongoDB and
              AI-assisted development workflows.
            </p>
          </div>
        </div>
        <div className="dossier">
          {dossier.map((d) => (
            <div key={d.label}>
              <small>{d.label}</small>
              <b>{d.value}</b>
            </div>
          ))}
        </div>
      </section>

      <section className="services site-section">
        <span className="site-eyebrow">Principles</span>
        <p className="services__intro">How I actually work.</p>
        <div>
          {principles.map((p) => (
            <div className="srv" key={p.name}>
              <div className="srv__head" style={{ cursor: "default" }}>
                <span className="srv__idx">{p.count}</span>
                <span className="srv__name">{p.name}</span>
                <span />
                <span />
              </div>
              <div className="srv__body" style={{ height: "auto" }}>
                <div className="srv__inner">
                  <p>{p.desc}</p>
                  <div className="srv__chips">
                    {p.chips.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="acta">
        <span className="site-eyebrow -plain">Got a brief worth building?</span>
        <a
          href={`mailto:${profile.email}`}
          className="acta__roll"
          data-cursor="ring"
        >
          Let&apos;s talk
        </a>
        <div className="acta__links">
          <a href={profile.socials.github} target="_blank" rel="noreferrer" className="pill-btn -ink" data-cursor="ring">
            GitHub
          </a>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="pill-btn -ink" data-cursor="ring">
            LinkedIn
          </a>
        </div>
      </section>
    </main>
  );
}
