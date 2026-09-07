import { Reveal } from "@/components/reveal";
import { profile } from "@/lib/content";

export function Hero() {
  return (
    <section className="hero site-section">
      <div className="hero__meta">
        <span>{profile.location}</span>
        <span>{profile.availability}</span>
      </div>

      <h1 className="hero__h1">
        <Reveal as="div">{profile.role.split(" ")[0]}</Reveal>
        <Reveal as="div" className="ln2" delay={0.06}>
          {profile.role.split(" ").slice(1).join(" ")}
        </Reveal>
      </h1>

      <div className="hero__row">
        <p className="hero__blurb">
          <b>{profile.name}</b> — building web apps end to end, from the
          database up through the interface, in React, Next.js and Laravel.
        </p>
        <div className="hero__scroll">
          <span className="sq" />
          Scroll
        </div>
      </div>
    </section>
  );
}
