import { AddWaterfrontPropertyPage } from "@/features/waterfront-properties/components/AddWaterfrontPropertyPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <AddWaterfrontPropertyPage propertyId={(await params).id} />;
}
