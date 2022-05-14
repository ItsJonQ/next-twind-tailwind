import Head from 'next/head';
import Image from 'next/image';
import { tw } from 'twind';

export default function Home() {
  return (
    <main
      className={tw`h-screen bg-purple-400 flex items-center justify-center`}
    >
      <h1
        className={tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}
      >
        This is Twind!
      </h1>
    </main>
  );
}
