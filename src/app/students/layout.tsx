import Layout from '@/components/Layout';

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}