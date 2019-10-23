import React from 'react';
import Logo from '../images/logo.svg';

interface StonewallProps {

}

export const Stonewall: React.FC<StonewallProps> = (props) => {
  return (
    <div>
      <Logo />
      {props.children}
    </div>
  )
}
