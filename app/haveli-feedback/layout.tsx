import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haveli feedback",
  description: "Share your stay experience.",
  robots: { index: false, follow: false },
};

export default function HaveliFeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
