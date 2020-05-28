/**
 * @packageDocumentation
 * @module @upbeat/playground
 */

import React from 'react';

export const Heading: React.FC = ({ children }) => {
  return <h2 className="uppercase font-bold text-xs">{children}</h2>;
};
