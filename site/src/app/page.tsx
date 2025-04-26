import { Hero } from "$/components/hero";
import { VisionGrid } from "$/components/vision-grid";
import { Impact } from "$/components/impact";
import { Timeline } from "$/components/timeline";
import { OurApproach } from "$/components/our-approach";
import { FooterComponent } from "$/components/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <VisionGrid />
      <Timeline />
      <Impact />
      <OurApproach />
      <FooterComponent />
    </main>
  );
}
