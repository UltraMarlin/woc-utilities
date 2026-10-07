import confetti from "canvas-confetti";

const wait = (miliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, miliseconds));

const commonConfettiProps: confetti.Options = {
  decay: 0.9,
  scalar: 1.5,
  colors: [
    "#d8adf8",
    "#74fee4",
    "#f0dd90",
    "#68438c",
    "#4f1f66",
    "#ffdc50",
    "#7ea1eb",
    "#573371",
  ],
};

const spawnSimpleConfetti = (
  x: number,
  y: number,
  options?: confetti.Options
) => {
  void confetti({
    ...commonConfettiProps,
    particleCount: 20,
    startVelocity: 30,
    spread: 45,
    origin: { x, y },
    ...options,
  });
};

const spawnBigConfetti = (x: number, y: number, options?: confetti.Options) => {
  void confetti({
    ...commonConfettiProps,
    particleCount: 30,
    startVelocity: 45,
    spread: 90,
    origin: { x, y },
    gravity: 0.7,
    ticks: 320,
    ...options,
  });
};

export const customConfetti = async () => {
  await wait(500);
  spawnSimpleConfetti(0.23, 0.88, { drift: 0, angle: 120 });
  await wait(200);
  spawnSimpleConfetti(0.5, 0.88, { drift: 0, angle: 60 });
  await wait(1000);
  spawnBigConfetti(0.35, 0.93);
  await wait(700);
  spawnBigConfetti(0.4, 0.88, { angle: 60 });
  await wait(700);
  spawnBigConfetti(0.3, 0.88, { angle: 120 });
};
