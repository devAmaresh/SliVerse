import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import useTheme from "@/store/theme";

import { useState } from "react";
import { HashLink } from "react-router-hash-link";

const Cta = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const theme = useTheme((state: any) => state.theme);
  return (
    <div className="relative h-[260px] md:h-[360px] lg:h-[610px] xl:h-[720px] 2xl:h-[800px] w-full overflow-hidden rounded-lg border bg-background">
      <div className="relative z-[48] mt-5 lg:mt-10 mb-2 lg:mb-5 flex flex-col items-center justify-center">
        <div className="text-2xl md:text-4xl lg:text-5xl font-semibold text-zinc-800 dark:text-zinc-100">
          How good ideas get into the universe
        </div>
        <div className="pt-4 lg:pt-12">
          <HashLink to="/login">
            <ShimmerButton
              shimmerDuration="3s"
              background={theme === "dark" ? "#ffffff" : "black"}
              className="shadow-2xl"
            >
              <span className="whitespace-pre-wrap px-10 font-semibold lg:text-[1.125rem] text-center text-sm leading-none tracking-tight dark:text-zinc-800 dark:from-white dark:to-slate-900/10 lg:text-lg">
                Start for free
              </span>
            </ShimmerButton>
          </HashLink>
        </div>
      </div>
      <FlickeringGrid
        className="absolute inset-0 z-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#4281f5"
        maxOpacity={0.5}
        flickerChance={0.1}
        width={2000}
        height={2000}
      />
      <img
        src="https://sliverse-asset.netlify.app/image.png"
        loading="lazy"
        alt="Sliverse Logo"
        onLoad={() => setIsLoaded(true)}
        className={`object-contain mx-auto transition-all duration-700 
        ${
          isLoaded
            ? "blur-0 scale-100 opacity-100"
            : "blur-md scale-100 opacity-60"
        }`}
      />
    </div>
  );
};

export default Cta;
