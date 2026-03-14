 import FeaturedProperties from "./components/FeaturedProperties";
import GrowAgency from "./components/Growagency";
import HeroSection from "./components/HeroSection";
import PopularLocations from "./components/Popularlocations";
import Testimonials from "./components/Testimonialssection";
  import WhatWeDo from "./components/Whatwedo";

 
export default function Home() {
  return ( 
    <>
 <HeroSection />
<PopularLocations />
<FeaturedProperties />
<WhatWeDo />
<GrowAgency />
<Testimonials />
      </>
   );
}
