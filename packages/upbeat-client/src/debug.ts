/**
 * Client Logging method for Upbeat with custom styling for readability.
 */
export const log = (name: string, content: string): void =>
  console.log(
    `%c${name}%c ${content}`,
    'border-radius: 4px;padding: 1px 2px;font-weight: bold; color: white;background: black;',
    'font-weight: normal;',
  );
