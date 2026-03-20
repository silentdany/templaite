import { Syne } from "next/font/google";
import { MarketingHeader } from "@/components/marketing/marketing-header";

const marketingHeading = Syne({
  subsets: ["latin"],
  variable: "--font-marketing-heading",
});

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${marketingHeading.variable} flex min-h-full flex-col [font-synthesis:none]`}
    >
      <MarketingHeader />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
