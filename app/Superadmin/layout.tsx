import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Super Admin',
};

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}


