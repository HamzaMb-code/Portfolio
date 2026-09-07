"use client";

import { useRef, useState } from "react";
import { services, type ServiceEntry } from "@/lib/content";

function ServiceRow({
  entry,
  index,
  open,
  onToggle,
}: {
  entry: ServiceEntry;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`srv ${open ? "-open" : ""}`}>
      <button
        className="srv__head"
        data-cursor="ring"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="srv__idx">{entry.count}</span>
        <span className="srv__name">{entry.name}</span>
        <span className="srv__count">
          {String(index + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
        </span>
        <span className="srv__plus" />
      </button>
      <div
        ref={bodyRef}
        className="srv__body"
        style={{ height: open ? bodyRef.current?.scrollHeight : 0 }}
      >
        <div className="srv__inner">
          <p>{entry.desc}</p>
          <div className="srv__chips">
            {entry.chips.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Services() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="services site-section" id="services">
      <span className="site-eyebrow">Services</span>
      <p className="services__intro">
        What I actually do, once the deck stops talking.
      </p>
      <div>
        {services.map((s, i) => (
          <ServiceRow
            key={s.name}
            entry={s}
            index={i}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  );
}
