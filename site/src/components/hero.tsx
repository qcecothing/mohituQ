import React from "react";
import { BackgroundBeamsWithCollision } from "$/components/ui/background-beams-with-collision";

export function Hero() {
  return (
    <div className="relative pb-16 md:pb-32 min-h-[50vh] md:min-h-[70vh] flex items-center justify-center">
      <BackgroundBeamsWithCollision>
        <div className="px-4 md:px-8 w-full max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-center text-white font-sans tracking-tight">
            <span className="block">Insert catchy title</span>
            <div className="relative mx-auto inline-block w-max mt-4 md:mt-0 [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
              <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                <span className="">محيطك</span>
              </div>
              <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                <span className="">محيطك</span>
              </div>
            </div>
          </h2>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
