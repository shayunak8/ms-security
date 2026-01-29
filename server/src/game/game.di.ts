import type { RandomFn } from './game.types';

export const RANDOM_FN = 'RANDOM_FN';

export const defaultRandomFn: RandomFn = () => Math.random();

