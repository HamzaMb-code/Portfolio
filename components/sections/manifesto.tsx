import { Reveal } from "@/components/reveal";

export function Manifesto() {
  return (
    <section className="mani site-section">
      <span className="site-eyebrow">Approach</span>
      <Reveal as="p">
        Good design is <span className="w">quiet</span> until the moment it{" "}
        <span className="site-o">isn&apos;t</span> — then it says exactly one
        thing, clearly.
      </Reveal>
    </section>
  );
}
