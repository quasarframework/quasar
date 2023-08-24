export interface TouchSwipeParams {
  evt: TouchEvent | MouseEvent;
  touch: boolean;
  mouse: boolean;
  direction: "up" | "down" | "left" | "right";
  duration: number;
  distance: {
    x: number;
    y: number;
  };
}
