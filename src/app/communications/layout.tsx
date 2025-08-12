import Layout from '@/components/Layout';

export default function CommunicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}