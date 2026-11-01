import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { TransitionLink } from "@/components/page-transition";
import { profile } from "@/lib/content";

const STATS: [string, string][] = [
  ["1", "Full-stack project, solo"],
  ["2", "Internship + teaching roles"],
  ["3+", "Stacks: JS, PHP, Python"],
];

export function AboutPreview() {
  return (
    <section className="about site-section" id="about">
      <span className="site-eyebrow">About</span>
      <div className="about__grid">
        <div className="about__left">
          <h2>
            <Reveal as="div">Full-stack dev,</Reveal>
            <Reveal as="div" delay={0.05}>
              database-first thinker,
            </Reveal>
            <Reveal as="div" delay={0.1}>
              always learning the next layer.
            </Reveal>
          </h2>
          <div className="about__portraitWrap">
            <div className="about__portrait">
              <Image
                src="/images/portfolio-image.png"
                alt={`Portrait of ${profile.name}`}
                fill
                sizes="(max-width: 820px) 90vw, 40vw"
                style={{ objectFit: "cover", objectPosition: "center 42%" }}
              />
              <figcaption>{profile.name}</figcaption>
            </div>
            <div className="badge" aria-hidden="true">
              <svg viewBox="0 0 100 100">
                <circle className="bg" cx="50" cy="50" r="48" />
                <path
                  id="badgeCircle"
                  d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                  fill="none"
                />
                <text>
                  <textPath href="#badgeCircle" startOffset="0%">
                    Open for work • Open for work •
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>
        <div className="about__right">
          <p>
            <b>{profile.name}</b> is a {profile.role.toLowerCase()} based in{" "}
            {profile.location}, comfortable across the whole stack — React
            and Next.js on the front end, Laravel and Python on the back,
            MySQL, MongoDB or Oracle SQL underneath depending on the job.
          </p>
          <p>
            Trained through OFPPT&apos;s Full-Stack Development program and
            a Licence en Génie Informatique, with UML and Agile as the
            habits that keep a solo build from turning into spaghetti.
          </p>
          <div className="stats">
            {STATS.map(([n, label]) => (
              <div key={label}>
                <b>{n}</b>
                <small>{label}</small>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "clamp(28px, 4vh, 44px)" }}>
            <TransitionLink href="/about" className="pill-btn -ink" data-cursor="ring">
              More about me <b>→</b>
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
