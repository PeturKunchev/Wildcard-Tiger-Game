export const animationConfig = {
  tigerScaleMultiplier: 2,
  tigerMovementX: 300,
  tigerMovementY: 500,
  tigerDuration: 0.7,
  tigerEase: "power2.out",

  resetDuration: 0.7,
  resetEase: "power2.inOut",

  winTextFadeDuration: 0.3,
  winTextScaleDuration: 0.5,
  winTextInitialScaleMultiplier: 0.7,
  winTextEase: "back.out(1.7)",
} as const;
