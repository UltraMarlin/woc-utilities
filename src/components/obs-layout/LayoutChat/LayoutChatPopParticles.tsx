import { CSSProperties, useState } from "react";

import type { Pop } from "./useMessageStack";

import bubble from "../../../assets/layout/chat/bub.png";

const PARTICLE_COUNT = 7;

const random = (min: number, max: number) => min + Math.random() * (max - min);

const createParticles = () =>
  Array.from({ length: PARTICLE_COUNT }, () => {
    const size = random(15, 39);
    return {
      left: `${random(-8, 95)}%`,
      top: `${random(-15, 30)}%`,
      width: size,
      height: size,
      animationDelay: `${random(120, 250)}ms`,
      animationDuration: `${random(600, 900)}ms`,
      "--rotate": `${random(0, 360)}deg`,
      "--rise": `${random(10, 30)}px`,
      "--drift": `${random(-45, 45)}px`,
    } as CSSProperties;
  });

export type LayoutChatPopParticlesProps = {
  pop: Pop;
};

export const LayoutChatPopParticles = ({
  pop: { top, left, width, height },
}: LayoutChatPopParticlesProps) => {
  const [particles] = useState(createParticles);

  return (
    <div
      className="pointer-events-none absolute"
      style={{ top, left, width, height }}
    >
      {particles.map((style, index) => (
        <img
          key={index}
          className="absolute animate-chatBubbleParticle"
          src={bubble}
          alt=""
          style={style}
        />
      ))}
    </div>
  );
};
