import { Attributes } from "@opentelemetry/api";

export function shuffle(_array: Array<number>): Array<number> {
  const array = [..._array];
  let m = array.length,
    t,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

export function randomRange(min: number, max: number): Array<number> {
  if (min > max) {
    return [];
  }
  const range = Array.from(Array(1 + max - min).keys());
  const rangeShifted = range.map((n) => min + n);
  const rangeRandom = shuffle(rangeShifted);
  return rangeRandom;
}

export function parseAttributes(attributes: Attributes): Attributes {
  return Object.fromEntries(
    Object.entries(attributes).map(([key, value]) => {
      try {
        return [key, JSON.parse(value as string)];
      } catch {
        return [key, value];
      }
    })
  );
}
