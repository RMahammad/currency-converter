import { CurrencyConverter } from "@/components/widgets/CurrencyConverter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TransferGo - Send Money Abroad Securely With Low Fees",
  description:
    "TransferGo is a digital money service that aims to improve the lives of hard-working people through simpler, better financial services. It began with developing ...",
};

export default function Home() {
  return (
    <div className="flex items-center justify-center h-dvh">
      <CurrencyConverter />
    </div>
  );
}
