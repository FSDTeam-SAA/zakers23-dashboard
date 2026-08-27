"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { OverviewHeader } from "@/features/overview/components/OverviewHeader";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";
import { useNeighborhoods } from "@/features/neighborhoods/hooks/use-neighborhoods";
import { useCreateDevelopment, useDevelopment, useUpdateDevelopment } from "../hooks/use-developments";
import { AdditionalDevelopmentSections } from "./AdditionalDevelopmentSections";
import type {
  ConstructionStage,
  DevelopmentPageContent,
  DevelopmentPayload,
} from "../types/development.types";

type UploadedImage = { id: string; url: string };
type ProgressStep = "Planning" | "Construction" | "Completing" | "Delivered";
type FeatureCard = {
  id: string;
  title: string;
  description: string;
  image: string;
};
const makeId = () => crypto.randomUUID();
const makeFeature = (): FeatureCard => ({
  id: makeId(),
  title: "",
  description: "",
  image: "",
});
const progressSteps: ProgressStep[] = [
  "Planning",
  "Construction",
  "Completing",
  "Delivered",
];
const inputClass =
  "mt-2 h-12 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";
const areaClass =
  "mt-2 min-h-28 w-full resize-y rounded-lg border border-line bg-white p-4 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";
const stageMap: Record<ProgressStep, ConstructionStage> = {
  Planning: "pre-construction",
  Construction: "under construction",
  Completing: "under construction",
  Delivered: "move in ready",
};

export function AddDevelopmentPage({ developmentId }: { developmentId?: string }) {
  const router = useRouter();
  const createDevelopment = useCreateDevelopment();
  const updateDevelopment = useUpdateDevelopment();
  const { data: existingDevelopment } = useDevelopment(developmentId ?? null);
  const {
    data: neighborhoods = [],
    isLoading: neighborhoodsLoading,
    error: neighborhoodsError,
  } = useNeighborhoods();
  const fileInput = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [features, setFeatures] = useState<FeatureCard[]>([
    makeFeature(),
    makeFeature(),
  ]);
  const [progressStep, setProgressStep] = useState<ProgressStep>("Planning");
  const [progress, setProgress] = useState("0");
  const [uploading, setUploading] = useState(false);
  const [uploadingFeatureId, setUploadingFeatureId] = useState<string | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [additionalContent, setAdditionalContent] = useState<DevelopmentPageContent>({});
  const [form, setForm] = useState({
    developmentName: "",
    selectedNeighbourhood: "",
    address: "",
    city: "Miami",
    startingPrice: "",
    deliveryYear: "",
    totalResidencies: "",
    stories: "",
    height: "",
    developer: "",
    bedrooms: "",
    sizeRange: "",
    hoa: "",
    shortIntroduction: "",
    projectOverview: "",
  });
  useEffect(() => {
    if (!existingDevelopment) return;
    setForm({
      developmentName: existingDevelopment.developmentName,
      selectedNeighbourhood: typeof existingDevelopment.selectedNeighbourhood === "string" ? existingDevelopment.selectedNeighbourhood : existingDevelopment.selectedNeighbourhood._id,
      address: existingDevelopment.address,
      city: existingDevelopment.city,
      startingPrice: String(existingDevelopment.startingPrice),
      deliveryYear: existingDevelopment.deliveryYear,
      totalResidencies: String(existingDevelopment.totalResidencies),
      stories: String(existingDevelopment.stories),
      height: existingDevelopment.pageContent?.ourTake?.height ?? "",
      developer: existingDevelopment.developer,
      bedrooms: existingDevelopment.bedrooms,
      sizeRange: existingDevelopment.sizeRange,
      hoa: existingDevelopment.pageContent?.hoa ?? "",
      shortIntroduction: existingDevelopment.shortIntroduction,
      projectOverview: existingDevelopment.projectOverview,
    });
    setImages(existingDevelopment.galleryImages.map((image) => ({ id: makeId(), url: image.url })));
    const savedFeatures = existingDevelopment.pageContent?.projectFeatures;
    if (savedFeatures?.length) setFeatures(savedFeatures.map((feature) => ({ id: makeId(), title: feature.title, description: feature.description, image: feature.image })));
    const savedProgress = existingDevelopment.pageContent?.constructionProgress;
    if (savedProgress) { setProgressStep(savedProgress.stage as ProgressStep); setProgress(String(savedProgress.percentage)); }
    setAdditionalContent(existingDevelopment.pageContent ?? {});
  }, [existingDevelopment]);
  const setField = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const updateFeature = (featureId: string, patch: Partial<FeatureCard>) =>
    setFeatures((current) =>
      current.map((feature) =>
        feature.id === featureId ? { ...feature, ...patch } : feature,
      ),
    );
  async function uploadImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.length) return;
    setUploading(true);
    setMessage("");
    try {
      const data = new FormData();
      [...event.target.files].forEach((file) => data.append("images", file));
      const response = await fetch("/api/uploads/images", {
        method: "POST",
        body: data,
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.message || "Image upload failed");
      setImages((current) => [
        ...current,
        ...payload.data.map((item: { url: string }) => ({
          id: makeId(),
          url: item.url,
        })),
      ]);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Image upload failed",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function uploadFeatureImage(featureId: string, file?: File) {
    if (!file) return;
    setUploadingFeatureId(featureId);
    setMessage("");
    try {
      const data = new FormData();
      data.append("images", file);
      const response = await fetch("/api/uploads/images", {
        method: "POST",
        body: data,
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.message || "Feature image upload failed");
      updateFeature(featureId, { image: payload.data[0].url });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Feature image upload failed",
      );
    } finally {
      setUploadingFeatureId(null);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    if (!images.length)
      return setMessage("Please upload at least one project image.");
    if (
      features.some(
        (feature) => !feature.title || !feature.description || !feature.image,
      )
    )
      return setMessage(
        "Complete both Project Feature cards and select an image for each one.",
      );
    const payload: DevelopmentPayload = {
      developmentName: form.developmentName,
      propertySlug: existingDevelopment?.propertySlug ?? `${form.developmentName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}-${Date.now()}`,
      selectedNeighbourhood: form.selectedNeighbourhood,
      address: form.address,
      city: form.city,
      startingPrice: Number(form.startingPrice),
      constructionStage: stageMap[progressStep],
      deliveryYear: form.deliveryYear,
      developer: form.developer,
      pricePerSqft: 0,
      bedrooms: form.bedrooms,
      stories: Number(form.stories),
      totalResidencies: Number(form.totalResidencies),
      sizeRange: form.sizeRange,
      heroImage: images[0].url,
      galleryImages: images.map((image, index) => ({ url: image.url, index })),
      projectOverview: form.projectOverview,
      shortIntroduction: form.shortIntroduction,
      amenities: [],
      category: ["luxury"],
      features: features.map((feature) => feature.title),
      depositStructure: "Contact for details",
      salesProgress: `${progressStep} - ${progress}%`,
      rentalPolicy: "Contact for details",
      residences: [],
      currentStage: progressStep === "Planning" ? "planning" : progressStep === "Construction" ? "structure exterior" : progressStep === "Completing" ? "interior finishing" : "completed",
      expectedDelivery: form.deliveryYear,
      detailPage: {
        keyFacts: [
          { label: "FROM", value: `$${form.startingPrice}` },
          { label: "DELIVERY", value: form.deliveryYear },
          { label: "Units", value: form.totalResidencies },
          { label: "Height", value: form.height },
          { label: "Developer", value: form.developer },
          { label: "Bedrooms", value: form.bedrooms },
          { label: "Size range (SF)", value: form.sizeRange },
          { label: "HOA", value: form.hoa },
        ],
        gallery: images
          .slice(1)
          .map((image, index) => ({ url: image.url, index })),
        editorialSections: features.map((feature, index) => ({
          eyebrow: "Project Features",
          title: feature.title,
          body: feature.description,
          image: feature.image,
          imagePosition: index % 2 === 0 ? "right" : "left",
        })),
      },
      pageContent: {
        ...additionalContent,
        hoa: form.hoa,
        constructionProgress: { stage: progressStep, percentage: Number(progress) },
        projectFeatures: features.map((feature, index) => ({
          title: feature.title,
          description: feature.description,
          image: feature.image,
          imagePosition: index % 2 === 0 ? "right" : "left",
        })),
      },
    };
    try {
      if (developmentId) await updateDevelopment.mutateAsync({ id: developmentId, payload });
      else await createDevelopment.mutateAsync(payload);
      setMessage(developmentId ? "Development updated successfully." : "Development published successfully.");
      router.push("/developments");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not publish development",
      );
    }
  }

  return (
    <div className="min-h-dvh bg-canvas text-ink lg:flex">
      <OverviewSidebar active="Developments" />
      <div className="min-w-0 flex-1">
        <OverviewHeader
          title={developmentId ? "Edit Development" : "Add Development"}
          description={developmentId ? "Update this development and its page content." : "Create a new construction project for the website."}
        />
        <main className="mx-auto max-w-[1320px] px-5 py-7 sm:px-8">
          <form onSubmit={submit} className="space-y-6">
            <FormCard
              eyebrow="Project media"
              title="Development Images"
              hint="Upload multiple images to Cloudinary. The first image will be used as the main cover image."
            >
              <input
                ref={fileInput}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                className="sr-only"
                onChange={uploadImages}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInput.current?.click()}
                className="min-h-12 rounded-lg bg-[#0d1b34] px-5 text-sm font-semibold text-white transition hover:bg-[#172b4d] disabled:opacity-60"
              >
                {uploading ? "Uploadingâ€¦" : "+ Add multiple images"}
              </button>
              {images.length === 0 ? (
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className="mt-5 grid min-h-44 w-full place-items-center rounded-xl border-2 border-dashed border-line bg-[#fffdf8] px-6 text-center text-sm text-muted hover:border-gold"
                >
                  <span>
                    <b className="block text-base text-ink">
                      Drop or select project images
                    </b>
                    <span className="mt-1 block">PNG, JPG or WebP</span>
                  </span>
                </button>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {images.map((image, index) => (
                    <article
                      key={image.id}
                      className="relative overflow-hidden rounded-xl border border-line bg-white"
                    >
                      <Image
                        src={image.url}
                        alt={`Project image ${index + 1}`}
                        width={640}
                        height={480}
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-[#0d1b34] px-3 py-1 text-xs font-semibold text-white">
                        {index === 0 ? "Cover" : `Image ${index + 1}`}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove image ${index + 1}`}
                        onClick={() =>
                          setImages((current) =>
                            current.filter((item) => item.id !== image.id),
                          )
                        }
                        className="absolute right-2 top-2 min-h-9 rounded-full bg-white px-3 text-xs font-semibold text-danger shadow"
                      >
                        Remove
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </FormCard>

            <FormCard
              eyebrow="Card name"
              title="New Construction"
              hint="Add the key information visitors will see at the top of the development page."
            >
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Title">
                  <input
                    required
                    value={form.developmentName}
                    onChange={(e) =>
                      setField("developmentName", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Cipriani Residences Brickell"
                  />
                </Field>
                <Field label="Neighbourhood">
                  <select
                    required
                    value={form.selectedNeighbourhood}
                    onChange={(e) =>
                      setField("selectedNeighbourhood", e.target.value)
                    }
                    className={inputClass}
                    disabled={neighborhoodsLoading}
                  >
                    <option value="">
                      {neighborhoodsLoading
                        ? "Loading neighbourhoodsâ€¦"
                        : "Select a neighbourhood"}
                    </option>
                    {neighborhoods.map((neighborhood) => (
                      <option key={neighborhood._id} value={neighborhood._id}>
                        {neighborhood.title || neighborhood.name}
                      </option>
                    ))}
                  </select>
                  {neighborhoodsError && (
                    <span className="mt-2 block text-xs font-normal text-danger">
                      Could not load neighbourhoods.
                    </span>
                  )}
                </Field>
                <Field label="Address" className="md:col-span-2">
                  <input
                    required
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    className={inputClass}
                    placeholder="1420 South Miami Avenue, Miami, FL 33131"
                  />
                </Field>
                <Field label="City">
                  <input
                    required
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="From">
                  <div className="relative">
                    <span className="absolute left-4 top-[25px] -translate-y-1/2 text-muted">
                      $
                    </span>
                    <input
                      required
                      type="number"
                      min="0"
                      step="1000"
                      value={form.startingPrice}
                      onChange={(e) =>
                        setField("startingPrice", e.target.value)
                      }
                      className={`${inputClass} pl-8`}
                      placeholder="2150000"
                    />
                  </div>
                </Field>
                <Field label="Delivery">
                  <input
                    required
                    value={form.deliveryYear}
                    onChange={(e) => setField("deliveryYear", e.target.value)}
                    className={inputClass}
                    placeholder="July 2027"
                  />
                </Field>
                <Field label="Units">
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.totalResidencies}
                    onChange={(e) =>
                      setField("totalResidencies", e.target.value)
                    }
                    className={inputClass}
                    placeholder="397"
                  />
                </Field>
                <Field label="Height">
                  <input
                    required
                    value={form.height}
                    onChange={(e) => setField("height", e.target.value)}
                    className={inputClass}
                    placeholder="80 Stories (950 ft)"
                  />
                </Field>
                <Field label="Stories">
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stories}
                    onChange={(e) => setField("stories", e.target.value)}
                    className={inputClass}
                    placeholder="80"
                  />
                </Field>
                <Field label="Developer">
                  <input
                    required
                    value={form.developer}
                    onChange={(e) => setField("developer", e.target.value)}
                    className={inputClass}
                    placeholder="Mast Capital"
                  />
                </Field>
                <Field label="Bedrooms">
                  <input
                    required
                    value={form.bedrooms}
                    onChange={(e) => setField("bedrooms", e.target.value)}
                    className={inputClass}
                    placeholder="1 â€“ 5"
                  />
                </Field>
                <Field label="Size range (SF)">
                  <input
                    required
                    value={form.sizeRange}
                    onChange={(e) => setField("sizeRange", e.target.value)}
                    className={inputClass}
                    placeholder="1,070 â€“ 6,093"
                  />
                </Field>
                <Field label="HOA">
                  <input
                    required
                    value={form.hoa}
                    onChange={(e) => setField("hoa", e.target.value)}
                    className={inputClass}
                    placeholder="$1.60/sf"
                  />
                </Field>
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field label="Short introduction">
                  <textarea
                    required
                    value={form.shortIntroduction}
                    onChange={(e) =>
                      setField("shortIntroduction", e.target.value)
                    }
                    className={areaClass}
                  />
                </Field>
                <Field label="Project overview">
                  <textarea
                    required
                    value={form.projectOverview}
                    onChange={(e) =>
                      setField("projectOverview", e.target.value)
                    }
                    className={areaClass}
                  />
                </Field>
              </div>
            </FormCard>

            <FormCard
              eyebrow="Project status"
              title="Construction Progress"
              hint="Choose the current milestone and set the exact completion percentage."
            >
              <div className="grid gap-3 md:grid-cols-4">
                {progressSteps.map((step, index) => {
                  const complete = index <= progressSteps.indexOf(progressStep);
                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => setProgressStep(step)}
                      className={`min-h-24 rounded-xl border p-4 text-left transition ${complete ? "border-gold bg-gold/10" : "border-line bg-white hover:border-gold/50"}`}
                    >
                      <span
                        className={`grid size-8 place-items-center rounded-full text-sm font-bold ${complete ? "bg-gold text-white" : "bg-[#edf0f2] text-muted"}`}
                      >
                        {index + 1}
                      </span>
                      <span className="mt-3 block text-sm font-semibold">
                        {step}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 rounded-xl bg-[#fffdf8] p-5">
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="construction-progress"
                    className="text-sm font-semibold"
                  >
                    Completion percentage
                  </label>
                  <output className="text-2xl font-bold text-gold">
                    {progress}%
                  </output>
                </div>
                <input
                  id="construction-progress"
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  className="mt-4 h-2 w-full cursor-pointer accent-gold"
                />
                <div className="mt-2 flex justify-between text-xs text-muted">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </FormCard>

            <FormCard
              eyebrow="Content section"
              title="Project Features"
              hint="The first card shows description left and image right; the second automatically reverses that layout."
            >
              <div className="space-y-5">
                {features.map((feature, index) => (
                  <article
                    key={feature.id}
                    className="overflow-hidden rounded-xl border border-line bg-[#fffdf8]"
                  >
                    <div className="border-b border-line px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[.14em] text-gold">
                        Feature card {index + 1}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {index === 0
                          ? "Description left · Image right"
                          : "Image left · Description right"}
                      </p>
                    </div>
                    <div
                      className={`grid gap-5 p-5 md:grid-cols-2 md:p-6 ${index === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
                    >
                      <div>
                        <Field label="Feature title">
                          <input
                            required
                            value={feature.title}
                            onChange={(e) =>
                              updateFeature(feature.id, {
                                title: e.target.value,
                              })
                            }
                            className={inputClass}
                            placeholder={
                              index === 0
                                ? "Signature residences"
                                : "Elevated amenities"
                            }
                          />
                        </Field>
                        <Field label="Description" className="mt-4">
                          <textarea
                            required
                            value={feature.description}
                            onChange={(e) =>
                              updateFeature(feature.id, {
                                description: e.target.value,
                              })
                            }
                            className={`${areaClass} min-h-40`}
                          />
                        </Field>
                      </div>
                      <div>
                        <Field label="Feature image">
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            required={!feature.image}
                            onChange={(e) => {
                              void uploadFeatureImage(
                                feature.id,
                                e.target.files?.[0],
                              );
                              e.target.value = "";
                            }}
                            className="mt-2 block min-h-12 w-full cursor-pointer rounded-lg border border-line bg-white text-sm text-muted file:mr-4 file:min-h-12 file:border-0 file:bg-[#0d1b34] file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-[#172b4d]"
                          />
                        </Field>
                        {uploadingFeatureId === feature.id ? (
                          <div className="mt-4 grid aspect-[4/3] place-items-center rounded-lg border border-line bg-white text-sm text-muted">
                            Uploading imageâ€¦
                          </div>
                        ) : feature.image ? (
                          <div className="relative mt-4">
                            <Image
                              src={feature.image}
                              alt={feature.title || `Feature ${index + 1}`}
                              width={800}
                              height={560}
                              className="aspect-[4/3] w-full rounded-lg object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateFeature(feature.id, { image: "" })
                              }
                              className="absolute right-3 top-3 min-h-9 rounded-full bg-white px-3 text-xs font-semibold text-danger shadow"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="mt-4 grid aspect-[4/3] place-items-center rounded-lg border-2 border-dashed border-line bg-white text-sm text-muted">
                            Upload a feature image
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </FormCard>

            <AdditionalDevelopmentSections initialValue={existingDevelopment?.pageContent} onChange={setAdditionalContent} />

          <footer className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-white/95 px-6 py-5 shadow-lg backdrop-blur">
              <p
                role="status"
                className={
                  message.includes("successfully")
                    ? "text-sm font-medium text-green-700"
                    : "text-sm font-medium text-danger"
                }
              >
                {message || `${images.length} images · ${progress}% complete`}
              </p>
              <div className="ml-auto flex gap-3">
                <Link
                  href="/developments"
                  className="min-h-11 rounded-lg border border-gold px-5 py-3 text-sm font-semibold text-gold"
                >
                  Cancel
                </Link>
                <button
                  disabled={
                    createDevelopment.isPending || updateDevelopment.isPending ||
                    uploading ||
                    Boolean(uploadingFeatureId)
                  }
                  className="min-h-11 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {createDevelopment.isPending
                    ? "Publishingâ€¦"
                    : "Publish development"}
                </button>
              </div>
            </footer>
          </form>
        </main>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm font-semibold ${className}`}>
      {label}
      {children}
    </label>
  );
}
function FormCard({
  eyebrow,
  title,
  hint,
  children,
}: {
  eyebrow: string;
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[.16em] text-gold">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
        {title}
      </h2>
      <p className="mt-1 max-w-3xl text-sm text-muted">{hint}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
