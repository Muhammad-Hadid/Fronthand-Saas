"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperadminRedirect() {
  const r = useRouter();
  useEffect(()=>{ r.replace('/Superadmin/Overview'); }, [r]);
  return null;
}


