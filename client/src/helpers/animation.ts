import { RefObject } from 'react';

export class Animate {
  element: RefObject<HTMLDivElement>;
  duration = 0;
  startTime = 0;
  frameId: null | number = null;

  constructor(element: RefObject<HTMLDivElement>) {
    this.element = element;
  }

  start(duration: number) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }

  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);

    if (progress === 1) this.stop();
    else {
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }

  onProgress(progress: number) {
    if (!this.element.current) return;

    const width = this.element.current.clientWidth * progress;
    this.element.current.style.left = `Calc(${progress * 100}% - ${width}px)`;
  }

  stop() {
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = null;
    this.startTime = 0;
    this.duration = 0;
  }
}
