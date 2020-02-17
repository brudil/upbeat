import React, { useState, useCallback } from 'react';
import { Stonewall } from '../components/Stonewall';

export const AuthLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      console.log('loigging in with ', [email, password]);
    },
    [email, password],
  );

  return (
    <Stonewall>
      <h1>Log in</h1>
      <form onSubmit={handleLogin}>
        <label>
          <div>Email</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <div>Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <input type="submit" />
      </form>
    </Stonewall>
  );
};
