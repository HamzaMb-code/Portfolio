import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { WorkShowcase } from "@/components/sections/work-showcase";
import { AboutPreview } from "@/components/sections/about-preview";
import { Services } from "@/components/sections/services";
import { Recognition } from "@/components/sections/recognition";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <WorkShowcase />
      <AboutPreview />
      <Services />
      <Recognition />
    </main>
  );
}
