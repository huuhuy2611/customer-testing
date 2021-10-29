import * as React from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home(): JSX.Element {
  const router = useRouter();
  useEffect(() => { router.push('/oops') }, [])
  return (
    <div />
  )
}
