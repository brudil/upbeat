import React from 'react';
import Logotype from '../vectors/logotype.svg';

export const Stonewall: React.FC = (props) => {
  return (
    <div
      css={{
        margin: '0 auto',
        maxWidth: 400,
        padding: '1rem',
      }}
    >
      <div css={{ margin: '0 auto', maxWidth: 200 }}>
        <Logotype />
      </div>
      {props.children}
    </div>
  );
};
