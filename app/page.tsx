import { Main } from '@/component/main';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Main />
    </main>
  );
}
