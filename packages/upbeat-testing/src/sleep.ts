/**
 * @packageDocumentation
 * @module @upbeat/testing
 */

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
