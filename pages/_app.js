// pages/_app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router'
import { auth } from '../src/firebase';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      }else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, []);

  return <Component {...pageProps} />
}

export default MyApp
