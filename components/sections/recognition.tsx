import { education } from "@/lib/content";

export function Recognition() {
  return (
    <section className="recog site-section" id="recog">
      <div className="recog__head">
        <span className="site-eyebrow">Education</span>
        <span className="site-eyebrow -plain" style={{ color: "var(--site-mut)" }}>
          {education.length} entries
        </span>
      </div>
      <div>
        {education.map((e) => (
          <div className="rrow" key={e.name}>
            <span className="rrow__name">{e.name}</span>
            <span className="rrow__for">{e.detail}</span>
            <span className="rrow__dot" />
          </div>
        ))}
      </div>
    </section>
  );
}
