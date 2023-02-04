import App from 'next/app';
import '../styles/app.scss';
import React, { useEffect } from 'react';

require('../styles/salesforce-lighting-design-system.css');

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
}, []);

  return (
    <>
      <script type="text/javascript" src={`/js/fluidplayer.min.js`} />

      <Component {...pageProps} />
    </>
  );
}

export default MyApp
