import { WaterfrontPropertyDetailsPage } from "@/features/waterfront-properties/components/WaterfrontPropertyDetailsPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <WaterfrontPropertyDetailsPage id={(await params).id} />;
}
