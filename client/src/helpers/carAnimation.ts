export class CarAnimation {
  element: HTMLDivElement;
  duration = 0;
  startTime = 0;
  frameId: null | number = null;

  constructor(element: HTMLDivElement) {
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

    if (progress === 1) {
      this.stop();
      return;
    }

    this.frameId = requestAnimationFrame(() => this.onFrame());
  }

  onProgress(progress: number) {
    const width = this.element.clientWidth * progress;
    this.element.style.left = `Calc(${progress * 100}% - ${width}px)`;
  }

  stop() {
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }

  reset() {
    this.stop();

    this.frameId = null;
    this.startTime = 0;
    this.duration = 0;

    if (this.element) {
      this.element.style.left = '0';
    }
  }
}
