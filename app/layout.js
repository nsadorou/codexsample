import './globals.css';

export const metadata = {
  title: 'Next.js ToDo',
  description: 'A simple ToDo app built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

