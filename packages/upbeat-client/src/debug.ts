/**
 * @packageDocumentation
 * @module @upbeat/client/debug
 */
import { createNanoEvents } from 'nanoevents';

/**
 * Hashes a string to a int.
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

/**
 * Casts an int to a hex color code.
 */
function intToRGB(i: number): string {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();

  return '00000'.substring(0, 6 - c.length) + c;
}

/**
 * Deterministically converts a string to a hex color code.
 */
function color(str: string): string {
  return intToRGB(hashCode(str));
}

export const devToolEmitter = createNanoEvents<{
  log(name: string, subKey: string, content: any): void;
}>();

export enum UpbeatModule {
  ResourceCache = 'ResourceCache',
  Intermediate = 'Intermediate',
  Persistence = 'Persistence',
  Worker = 'Worker',
  Changeset = 'Changeset',
  LiveQuery = 'LiveQuery',
  Sync = 'Sync',
  Transport = 'Transport',
}

/**
 * Client Logging method for Upbeat with custom styling for readability.
 */
export const log = (
  name: UpbeatModule,
  subKeyOrContent: string,
  content?: string,
): void => {
  devToolEmitter.emit('log', name, subKeyOrContent, content);
  // console.log(
  //   `%c${name}${content ? '%c' + subKeyOrContent.toUpperCase() : ''}%c${
  //     content || subKeyOrContent
  //   }`,
  //   `border-top-left-radius: 4px;border-bottom-left-radius: 4px;padding: 1px 2px;font-weight: bold; color: white;background: #${color(
  //     name,
  //   )};margin-right: 8px;z-index:3;position:relative;`,
  //   ...(content
  //     ? [
  //         `border-top-right-radius: 4px;border-bottom-right-radius: 4px;padding: 1px 2px;font-weight: bold; color: #fff;position:relative;background: #${color(
  //           name,
  //         )}aa; margin-left: -8px; margin-right: 8px;z-index: 2;`,
  //       ]
  //     : []),
  //   'font-weight: normal;',
  // );
};
