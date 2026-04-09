import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Audit gratuit RobinAI Consulting — Découvrez combien votre business premium perd de leads chaque mois et comment les récupérer." />
        <meta name="theme-color" content="#050f1c" />
        <meta property="og:title" content="RobinAI Consulting — Audit Stratégique Gratuit" />
        <meta property="og:description" content="Diagnostic personnalisé pour entrepreneurs premium. Score de maturité digitale, leads perdus, leviers d'action concrets." />
        <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
