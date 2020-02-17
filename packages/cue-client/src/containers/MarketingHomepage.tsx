import React from 'react';
import { Link } from 'react-router-dom';

export const MarketingHomepage: React.FC = () => {
  return (
    <div>
      <div css={{ margin: '0 auto', padding: '0 2rem', maxWidth: 1280 }}>
        <header>
          <h1>CUE</h1>

          <nav>
            <ul>
              <li>
                <Link to="/">Features</Link>
              </li>
              <li>
                <Link to="/login">Open app/Login/Signup</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <div>
            <h2>Plan, devise, edit, produce</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mihi enim
              satis est, ipsis non satis. Ita enim vivunt quidam, ut eorum vita
              refellatur oratio. Sed eum qui audiebant.
            </p>
          </div>
          <div>
            <h2>Colaborate, anywhere</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mihi enim
              satis est, ipsis non satis. Ita enim vivunt quidam, ut eorum vita
              refellatur oratio. Sed eum qui audiebant.
            </p>
          </div>
          <div>
            <h2>Scripts, Jingles and Music</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mihi enim
              satis est, ipsis non satis. Ita enim vivunt quidam, ut eorum vita
              refellatur oratio. Sed eum qui audiebant.
            </p>
          </div>
        </main>

        <footer>withcue.com CUE - James Canning</footer>
      </div>
    </div>
  );
};
