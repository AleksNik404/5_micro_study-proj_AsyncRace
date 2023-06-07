import { CARS_NAMES } from '@/data/CarsNames';

export const randomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export const getRandomNameCar = () => {
  const indexCarName = Math.trunc(CARS_NAMES.length * Math.random());
  return CARS_NAMES[indexCarName];
};

// /// 2 функции АНИМАЦИИ ДВИЖЕНИЯ через requestAnimationFrame. Сложно читаются.
// // eslint-disable-next-line no-unused-vars
// export function startAnimation(duration: number, changePosition: (progress: number) => void) {
//   let startAnim: number | null = null;

//   requestIDRef.current = requestAnimationFrame(function measure(time) {
//     if (!startAnim) startAnim = time;

//     const progress = (time - startAnim) / duration;
//     changePosition(progress);
//     if (progress < 1) requestIDRef.current = requestAnimationFrame(measure);
//   });
// }
// // callback в startAnimation на смену позиции
// export const changePositionCar = (progress: number, carHTML: React.RefObject<HTMLDivElement>) => {
//   if (!carRef.current) return;
//   carRef.current.style.left = `Calc(${progress * 100}% - ${
//     carRef.current.clientWidth * progress
//   }px)`;
// };
