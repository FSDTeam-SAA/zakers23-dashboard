import { AddDevelopmentPage } from "@/features/developments/components/AddDevelopmentPage";

export default async function EditDevelopment({ params }: { params: Promise<{ id: string }> }) {
  return <AddDevelopmentPage developmentId={(await params).id} />;
}
