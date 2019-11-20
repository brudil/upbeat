import React from 'react';
import { Stonewall } from '../components/Stonewall';

export const AuthLogin = () => {
  return (
    <Stonewall>
      <h1>Log in</h1>
      <form>
        <label>
          <div>Email</div>
          <input type="email" />
        </label>
        <label>
          <div>Password</div>
          <input type="password" />
        </label>
        <input type="submit" />
      </form>
    </Stonewall>
  );
};
