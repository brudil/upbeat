import React from 'react';
import styled from 'react-emotion';
import Logo from '../images/logo.svg';

const Container = styled.div`
  margin: 2rem auto 0;
  max-width: 380px;
`

interface IProps {

}

export const Stonewall: React.SFC<IProps> = (props) => {
  return (
    <Container>
      <Logo />
      {props.children}
    </Container>
  )
}
