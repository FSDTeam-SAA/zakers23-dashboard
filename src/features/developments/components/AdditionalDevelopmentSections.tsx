"use client";

import Image from "next/image";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import type { DevelopmentPageContent } from "../types/development.types";

type MoreViewImage = { id: string; url: string; name: string };
type MarketPosition = { id: string; percentage: string; title: string; subtitle: string };
type InvestmentSignal = { id: string; brandName: string; title: string; subtitle: string };
type AmenityItem = { id: string; icon: MoreViewImage | null; title: string; subtitle: string };
const makeId = () => crypto.randomUUID();
const makeMarketPosition = (): MarketPosition => ({ id: makeId(), percentage: "", title: "", subtitle: "" });
const makeInvestmentSignal = (): InvestmentSignal => ({ id: makeId(), brandName: "", title: "", subtitle: "" });
const makeAmenityItem = (): AmenityItem => ({ id: makeId(), icon: null, title: "", subtitle: "" });
async function uploadFilesToCloudinary(files: File[]): Promise<MoreViewImage[]> {
  const data = new FormData();
  files.forEach((file) => data.append("images", file));
  const response = await fetch("/api/uploads/images", { method: "POST", body: data });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(payload.message || "Image upload failed");
  return payload.data.map((image: { url: string }, index: number) => ({ id: makeId(), url: image.url, name: files[index]?.name || `Image ${index + 1}` }));
}
const inputClass = "mt-2 h-12 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";
const areaClass = "mt-2 min-h-28 w-full resize-y rounded-lg border border-line bg-white p-4 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

export function AdditionalDevelopmentSections({ initialValue, onChange }: { initialValue?: DevelopmentPageContent; onChange: (content: DevelopmentPageContent) => void }) {
  const [team, setTeam] = useState({ developer: "", architect: "", interiorDesign: "", description: "" });
  const [moreViewImages, setMoreViewImages] = useState<MoreViewImage[]>([]);
  const [marketPositions, setMarketPositions] = useState<MarketPosition[]>([makeMarketPosition()]);
  const [investmentSignals, setInvestmentSignals] = useState<InvestmentSignal[]>([makeInvestmentSignal()]);
  const [ourTake, setOurTake] = useState({ description: "", hoa: "", rentalPolicy: "", delivery: "", height: "", developer: "", architect: "", interiors: "" });
  const [editorialImage, setEditorialImage] = useState<MoreViewImage | null>(null);
  const [mapEmbedUrl, setMapEmbedUrl] = useState("");
  const [neighborhoodImages, setNeighborhoodImages] = useState<MoreViewImage[]>([]);
  const [amenitiesContent, setAmenitiesContent] = useState({ title: "", subtitle: "" });
  const [amenityItems, setAmenityItems] = useState<AmenityItem[]>([makeAmenityItem()]);
  const [penthouse, setPenthouse] = useState({ title: "", subtitle: "" });
  const [penthouseImages, setPenthouseImages] = useState<MoreViewImage[]>([]);
  const [closingImage, setClosingImage] = useState<MoreViewImage | null>(null);
  useEffect(() => {
    if (!initialValue) return;
    const imageItem = (url: string): MoreViewImage => ({ id: makeId(), url, name: "Saved image" });
    setTeam({ developer: initialValue.team?.developer ?? "", architect: initialValue.team?.architect ?? "", interiorDesign: initialValue.team?.interiorDesign ?? "", description: initialValue.team?.description ?? "" });
    setMoreViewImages((initialValue.moreViewImages ?? []).map(imageItem));
    setMarketPositions(initialValue.marketPositions?.length ? initialValue.marketPositions.map((item) => ({ ...item, id: makeId() })) : [makeMarketPosition()]);
    setInvestmentSignals(initialValue.investmentSignals?.length ? initialValue.investmentSignals.map((item) => ({ ...item, id: makeId() })) : [makeInvestmentSignal()]);
    setOurTake({ description: initialValue.ourTake?.description ?? "", hoa: initialValue.ourTake?.hoa ?? "", rentalPolicy: initialValue.ourTake?.rentalPolicy ?? "", delivery: initialValue.ourTake?.delivery ?? "", height: initialValue.ourTake?.height ?? "", developer: initialValue.ourTake?.developer ?? "", architect: initialValue.ourTake?.architect ?? "", interiors: initialValue.ourTake?.interiors ?? "" });
    setEditorialImage(initialValue.ourTake?.image ? imageItem(initialValue.ourTake.image) : null);
    setMapEmbedUrl(initialValue.locationAndNeighborhood?.mapEmbedUrl ?? "");
    setNeighborhoodImages((initialValue.locationAndNeighborhood?.images ?? []).map(imageItem));
    setAmenitiesContent({ title: initialValue.amenitiesSection?.title ?? "", subtitle: initialValue.amenitiesSection?.subtitle ?? "" });
    setAmenityItems(initialValue.amenitiesSection?.items?.length ? initialValue.amenitiesSection.items.map((item) => ({ ...item, id: makeId(), icon: item.icon ? imageItem(item.icon) : null })) : [makeAmenityItem()]);
    setPenthouse({ title: initialValue.upperPenthouse?.title ?? "", subtitle: initialValue.upperPenthouse?.subtitle ?? "" });
    setPenthouseImages((initialValue.upperPenthouse?.images ?? []).map(imageItem));
    setClosingImage(initialValue.closingImage ? imageItem(initialValue.closingImage) : null);
  }, [initialValue]);
  useEffect(() => {
    onChange({
      team,
      moreViewImages: moreViewImages.map((image) => image.url),
      marketPositions: marketPositions.filter((item) => item.percentage || item.title || item.subtitle),
      investmentSignals: investmentSignals.filter((item) => item.brandName || item.title || item.subtitle),
      ourTake: { ...ourTake, image: editorialImage?.url },
      locationAndNeighborhood: { mapEmbedUrl, images: neighborhoodImages.map((image) => image.url) },
      amenitiesSection: { title: amenitiesContent.title, subtitle: amenitiesContent.subtitle, items: amenityItems.filter((item) => item.title || item.subtitle || item.icon).map((item) => ({ icon: item.icon?.url, title: item.title, subtitle: item.subtitle })) },
      upperPenthouse: { title: penthouse.title, subtitle: penthouse.subtitle, images: penthouseImages.map((image) => image.url) },
      closingImage: closingImage?.url,
    });
  }, [team, moreViewImages, marketPositions, investmentSignals, ourTake, editorialImage, mapEmbedUrl, neighborhoodImages, amenitiesContent, amenityItems, penthouse, penthouseImages, closingImage, onChange]);
  const updateMarketPosition = (itemId: string, patch: Partial<MarketPosition>) => setMarketPositions((current) => current.map((item) => item.id === itemId ? { ...item, ...patch } : item));
  const updateInvestmentSignal = (itemId: string, patch: Partial<InvestmentSignal>) => setInvestmentSignals((current) => current.map((item) => item.id === itemId ? { ...item, ...patch } : item));
  async function previewMoreViewImages(event: ChangeEvent<HTMLInputElement>) { if (!event.target.files?.length) return; const selected=[...event.target.files]; event.target.value=""; try { const uploaded=await uploadFilesToCloudinary(selected); setMoreViewImages((current)=>[...current,...uploaded]); } catch (error) { window.alert(error instanceof Error ? error.message : "Image upload failed"); } }
  function removeMoreViewImage(imageId: string) { setMoreViewImages((current) => current.filter((item)=>item.id!==imageId)); }
  async function replaceSingleImage(file: File|undefined,_current:MoreViewImage|null,setter:(image:MoreViewImage|null)=>void) { if(!file)return; try { const [uploaded]=await uploadFilesToCloudinary([file]); setter(uploaded); } catch(error) { window.alert(error instanceof Error ? error.message : "Image upload failed"); } }
  async function addLocalImages(event:ChangeEvent<HTMLInputElement>,setter:(value:MoreViewImage[]|((current:MoreViewImage[])=>MoreViewImage[]))=>void,limit?:number) { if(!event.target.files?.length)return; const selected=[...event.target.files];event.target.value="";try{const uploaded=await uploadFilesToCloudinary(selected);setter((current)=>{const available=limit?Math.max(0,limit-current.length):uploaded.length;return [...current,...uploaded.slice(0,available)];});}catch(error){window.alert(error instanceof Error?error.message:"Image upload failed");} }
  function removeLocalImage(imageId:string,setter:(value:MoreViewImage[]|((current:MoreViewImage[])=>MoreViewImage[]))=>void) { setter((current)=>current.filter((item)=>item.id!==imageId)); }
  function updateAmenityItem(itemId:string,patch:Partial<AmenityItem>){setAmenityItems((current)=>current.map((item)=>item.id===itemId?{...item,...patch}:item));}
  return (<>
<FormCard
              eyebrow="Project partners"
              title="Team"
              hint="Add the key companies behind the development and a supporting description."
            >
              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Developer">
                  <input
                    value={team.developer}
                    onChange={(e) =>
                      setTeam((current) => ({
                        ...current,
                        developer: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Mast Capital"
                  />
                </Field>
                <Field label="Architect">
                  <input
                    value={team.architect}
                    onChange={(e) =>
                      setTeam((current) => ({
                        ...current,
                        architect: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Arquitectonica"
                  />
                </Field>
                <Field label="Interior Design">
                  <input
                    value={team.interiorDesign}
                    onChange={(e) =>
                      setTeam((current) => ({
                        ...current,
                        interiorDesign: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="1508 London"
                  />
                </Field>
              </div>
              <Field label="Description" className="mt-5">
                <textarea
                  value={team.description}
                  onChange={(e) =>
                    setTeam((current) => ({
                      ...current,
                      description: e.target.value,
                    }))
                  }
                  className={`${areaClass} min-h-36`}
                  placeholder="Cipriani Residences carries the full weight of the brand's service tradition across every amenity levelâ€¦"
                />
              </Field>
            </FormCard>

            <FormCard
              eyebrow="Visual gallery"
              title="More View"
              hint="Select multiple images at once. Every selected image will appear below as an instant preview."
            >
              <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-[#fffdf8] px-6 text-center transition hover:border-gold">
                <span className="grid size-10 place-items-center rounded-full bg-[#0d1b34] text-xl text-white">
                  +
                </span>
                <span className="mt-3 text-sm font-semibold text-ink">
                  Add multiple images
                </span>
                <span className="mt-1 text-xs text-muted">
                  PNG, JPG or WebP
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  className="sr-only"
                  onChange={previewMoreViewImages}
                />
              </label>
              {moreViewImages.length > 0 && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {moreViewImages.map((image, index) => (
                    <article
                      key={image.id}
                      className="relative overflow-hidden rounded-xl border border-line bg-white"
                    >
                      <Image
                        unoptimized
                        src={image.url}
                        alt={`More view preview ${index + 1}`}
                        width={640}
                        height={480}
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <div className="truncate px-3 py-3 text-xs text-muted">
                        {image.name}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMoreViewImage(image.id)}
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
              eyebrow="Performance metrics"
              title="Market Position"
              hint="Add as many percentage, title and subtitle items as the project needs."
            >
              <div className="space-y-4">
                {marketPositions.map((item, index) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-line bg-[#fffdf8] p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-semibold uppercase tracking-[.14em] text-gold">
                        Market item {index + 1}
                      </p>
                      {marketPositions.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setMarketPositions((current) =>
                              current.filter((entry) => entry.id !== item.id),
                            )
                          }
                          className="min-h-10 px-3 text-sm font-semibold text-danger"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="mt-3 grid gap-4 md:grid-cols-[180px_1fr]">
                      <Field label="Percentage">
                        <input
                          value={item.percentage}
                          onChange={(e) =>
                            updateMarketPosition(item.id, {
                              percentage: e.target.value,
                            })
                          }
                          className={inputClass}
                          placeholder="+30%"
                        />
                      </Field>
                      <Field label="Title">
                        <input
                          value={item.title}
                          onChange={(e) =>
                            updateMarketPosition(item.id, {
                              title: e.target.value,
                            })
                          }
                          className={inputClass}
                          placeholder="Comp trajectory (5yr)"
                        />
                      </Field>
                      <Field label="Subtitle" className="md:col-span-2">
                        <textarea
                          value={item.subtitle}
                          onChange={(e) =>
                            updateMarketPosition(item.id, {
                              subtitle: e.target.value,
                            })
                          }
                          className={areaClass}
                          placeholder="Mast Capital with the Cipriani brand, at a competitive entry into South Brickell ultra-luxury"
                        />
                      </Field>
                    </div>
                  </article>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setMarketPositions((current) => [
                    ...current,
                    makeMarketPosition(),
                  ])
                }
                className="mt-4 min-h-11 rounded-lg border border-gold px-5 text-sm font-semibold text-gold"
              >
                + Add market position
              </button>
            </FormCard>

            <FormCard
              eyebrow="Investment story"
              title="Investment Signals"
              hint="Create one or more signals that explain the project's investment value."
            >
              <div className="space-y-4">
                {investmentSignals.map((item, index) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-line bg-[#fffdf8] p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-semibold uppercase tracking-[.14em] text-gold">
                        Signal {index + 1}
                      </p>
                      {investmentSignals.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setInvestmentSignals((current) =>
                              current.filter((entry) => entry.id !== item.id),
                            )
                          }
                          className="min-h-10 px-3 text-sm font-semibold text-danger"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <Field label="Brand name">
                        <input
                          value={item.brandName}
                          onChange={(e) =>
                            updateInvestmentSignal(item.id, {
                              brandName: e.target.value,
                            })
                          }
                          className={inputClass}
                          placeholder="Brand legacy"
                        />
                      </Field>
                      <Field label="Title">
                        <input
                          value={item.title}
                          onChange={(e) =>
                            updateInvestmentSignal(item.id, {
                              title: e.target.value,
                            })
                          }
                          className={inputClass}
                          placeholder="First ground-up Cipriani tower in the Americas"
                        />
                      </Field>
                      <Field label="Subtitle" className="md:col-span-2">
                        <textarea
                          value={item.subtitle}
                          onChange={(e) =>
                            updateInvestmentSignal(item.id, {
                              subtitle: e.target.value,
                            })
                          }
                          className={`${areaClass} min-h-32`}
                          placeholder="Since Harry's Bar opened in Venice in 1931, Cipriani has built a global hospitality empireâ€¦"
                        />
                      </Field>
                    </div>
                  </article>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setInvestmentSignals((current) => [
                    ...current,
                    makeInvestmentSignal(),
                  ])
                }
                className="mt-4 min-h-11 rounded-lg border border-gold px-5 text-sm font-semibold text-gold"
              >
                + Add investment signal
              </button>
            </FormCard>

            <FormCard
              eyebrow="Editorial summary"
              title="Our Take"
              hint="Add the final recommendation and a concise snapshot of the project's commercial details."
            >
              <Field label="Description">
                <textarea
                  value={ourTake.description}
                  onChange={(e) =>
                    setOurTake((current) => ({
                      ...current,
                      description: e.target.value,
                    }))
                  }
                  className={`${areaClass} min-h-36`}
                  placeholder="At roughly $1,575 per square foot, Cipriani Residences is among the most competitively priced hospitalityâ€¦"
                />
              </Field>
              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <Field label="HOA">
                  <input
                    value={ourTake.hoa}
                    onChange={(e) =>
                      setOurTake((current) => ({
                        ...current,
                        hoa: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="~$1.60/sq ft"
                  />
                </Field>
                <Field label="Rental policy">
                  <input
                    value={ourTake.rentalPolicy}
                    onChange={(e) =>
                      setOurTake((current) => ({
                        ...current,
                        rentalPolicy: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Min 30-day, 2x per year"
                  />
                </Field>
                <Field label="Delivery">
                  <input
                    value={ourTake.delivery}
                    onChange={(e) =>
                      setOurTake((current) => ({
                        ...current,
                        delivery: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="July 2027"
                  />
                </Field>
                <Field label="Height">
                  <input
                    value={ourTake.height}
                    onChange={(e) =>
                      setOurTake((current) => ({
                        ...current,
                        height: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="950 ft (topped off July 2026)"
                  />
                </Field>
                <Field label="Developer">
                  <input
                    value={ourTake.developer}
                    onChange={(e) =>
                      setOurTake((current) => ({
                        ...current,
                        developer: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Mast Capital"
                  />
                </Field>
                <Field label="Architect">
                  <input
                    value={ourTake.architect}
                    onChange={(e) =>
                      setOurTake((current) => ({
                        ...current,
                        architect: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Arquitectonica"
                  />
                </Field>
                <Field label="Interiors">
                  <input
                    value={ourTake.interiors}
                    onChange={(e) =>
                      setOurTake((current) => ({
                        ...current,
                        interiors: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="1508 London"
                  />
                </Field>
              </div>
              <div className="mt-6 border-t border-line pt-6">
                <SingleImageField
                  label="Editorial summary image"
                  image={editorialImage}
                  onSelect={(file) =>
                    replaceSingleImage(file, editorialImage, setEditorialImage)
                  }
                  onRemove={() => {
                    setEditorialImage(null);
                  }}
                />
              </div>
            </FormCard>

            <FormCard
              eyebrow="Map & surroundings"
              title="Location & Neighborhood"
              hint="Paste a Google Maps iframe or embed link for the project's location."
            >
              <Field label="Google Maps iframe / embed link">
                <textarea
                  value={mapEmbedUrl}
                  onChange={(e) => setMapEmbedUrl(e.target.value)}
                  className={`${areaClass} min-h-32 font-mono text-xs`}
                  placeholder={
                    '<iframe src="https://www.google.com/maps/embed?..." loading="lazy"></iframe>'
                  }
                />
              </Field>
              {mapEmbedUrl && (
                <div className="mt-4 rounded-lg border border-line bg-[#fffdf8] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                    Embed preview input
                  </p>
                  <p className="mt-2 break-all text-xs text-muted">
                    {mapEmbedUrl}
                  </p>
                </div>
              )}
            </FormCard>

            <FormCard
              eyebrow="Neighborhood gallery"
              title="Neighborhood Images"
              hint="Add exactly two images that represent the surrounding neighborhood."
            >
              {neighborhoodImages.length < 2 && (
                <label className="flex min-h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-line bg-[#fffdf8] text-center hover:border-gold">
                  <span>
                    <b className="block text-sm">+ Add neighborhood images</b>
                    <span className="mt-1 block text-xs text-muted">
                      {neighborhoodImages.length}/2 selected
                    </span>
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(e) =>
                      addLocalImages(e, setNeighborhoodImages, 2)
                    }
                  />
                </label>
              )}
              <ImagePreviewGrid
                images={neighborhoodImages}
                onRemove={(imageId) =>
                  removeLocalImage(imageId, setNeighborhoodImages)
                }
              />
            </FormCard>

            <FormCard
              eyebrow="Lifestyle"
              title="Amenities"
              hint="Add the section heading, subtitle and as many amenity icons as needed."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Title">
                  <input
                    value={amenitiesContent.title}
                    onChange={(e) =>
                      setAmenitiesContent((current) => ({
                        ...current,
                        title: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Cipriani Residences Brickell Amenities"
                  />
                </Field>
                <Field label="Subtitle">
                  <textarea
                    value={amenitiesContent.subtitle}
                    onChange={(e) =>
                      setAmenitiesContent((current) => ({
                        ...current,
                        subtitle: e.target.value,
                      }))
                    }
                    className={areaClass}
                    placeholder="Every aspect of life at Cipriani Residences Brickell has been considered."
                  />
                </Field>
              </div>
              <div className="mt-6 space-y-4">
                {amenityItems.map((item, index) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-line bg-[#fffdf8] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[.14em] text-gold">
                        Amenity {index + 1}
                      </p>
                      {amenityItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setAmenityItems((current) =>
                              current.filter((entry) => entry.id !== item.id),
                            )
                          }
                          className="min-h-10 px-3 text-sm font-semibold text-danger"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="mt-3 grid gap-5 md:grid-cols-[180px_1fr_1fr]">
                      <div>
                        <span className="text-sm font-semibold">Icon</span>
                        <label className="mt-2 grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-lg border-2 border-dashed border-line bg-white text-center text-xs text-muted hover:border-gold">
                          {item.icon ? (
                            <Image
                              unoptimized
                              src={item.icon.url}
                              alt=""
                              width={180}
                              height={180}
                              className="size-full object-cover"
                            />
                          ) : (
                            <span>+ Upload icon</span>
                          )}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            className="sr-only"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.target.value = "";
                              if (!file) return;
                              try { const [icon] = await uploadFilesToCloudinary([file]); updateAmenityItem(item.id, { icon }); }
                              catch (error) { window.alert(error instanceof Error ? error.message : "Icon upload failed"); }
                            }}
                          />
                        </label>
                      </div>
                      <Field label="Icon title">
                        <input
                          value={item.title}
                          onChange={(e) =>
                            updateAmenityItem(item.id, {
                              title: e.target.value,
                            })
                          }
                          className={inputClass}
                          placeholder="Private dining"
                        />
                      </Field>
                      <Field label="Icon subtitle">
                        <textarea
                          value={item.subtitle}
                          onChange={(e) =>
                            updateAmenityItem(item.id, {
                              subtitle: e.target.value,
                            })
                          }
                          className={areaClass}
                          placeholder="Reservable private dining rooms with Cipriani service."
                        />
                      </Field>
                    </div>
                  </article>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setAmenityItems((current) => [...current, makeAmenityItem()])
                }
                className="mt-4 min-h-11 rounded-lg border border-gold px-5 text-sm font-semibold text-gold"
              >
                + Add amenity
              </button>
            </FormCard>

            <FormCard
              eyebrow="Upper penthouse floors"
              title="Inside the Canaletto Floors"
              hint="Add the card title, subtitle and a full multi-image gallery."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Title">
                  <input
                    value={penthouse.title}
                    onChange={(e) =>
                      setPenthouse((current) => ({
                        ...current,
                        title: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Inside the Canaletto Floors"
                  />
                </Field>
                <Field label="Subtitle">
                  <textarea
                    value={penthouse.subtitle}
                    onChange={(e) =>
                      setPenthouse((current) => ({
                        ...current,
                        subtitle: e.target.value,
                      }))
                    }
                    className={areaClass}
                    placeholder="Unfinished Canaletto floors. The views as they stand today."
                  />
                </Field>
              </div>
              <label className="mt-5 flex min-h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-line bg-[#fffdf8] text-center hover:border-gold">
                <span>
                  <b className="block text-sm">+ Add multiple floor images</b>
                  <span className="mt-1 block text-xs text-muted">
                    Select as many images as needed
                  </span>
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(e) => addLocalImages(e, setPenthouseImages)}
                />
              </label>
              <ImagePreviewGrid
                images={penthouseImages}
                onRemove={(imageId) =>
                  removeLocalImage(imageId, setPenthouseImages)
                }
              />
            </FormCard>

            <FormCard
              eyebrow="Closing visual"
              title="Final Image"
              hint="Add one final full-width image for the end of the development page."
            >
              <SingleImageField
                label="Final section image"
                image={closingImage}
                onSelect={(file) =>
                  replaceSingleImage(file, closingImage, setClosingImage)
                }
                onRemove={() => {
                  setClosingImage(null);
                }}
              />
            </FormCard>
  </>);
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

function ImagePreviewGrid({
  images,
  onRemove,
}: {
  images: MoreViewImage[];
  onRemove: (imageId: string) => void;
}) {
  if (!images.length) return null;
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {images.map((image, index) => (
        <article
          key={image.id}
          className="relative overflow-hidden rounded-xl border border-line bg-white"
        >
          <Image
            unoptimized
            src={image.url}
            alt={`Selected preview ${index + 1}`}
            width={640}
            height={480}
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="truncate px-3 py-3 text-xs text-muted">
            {image.name}
          </div>
          <button
            type="button"
            onClick={() => onRemove(image.id)}
            className="absolute right-2 top-2 min-h-9 rounded-full bg-white px-3 text-xs font-semibold text-danger shadow"
          >
            Remove
          </button>
        </article>
      ))}
    </div>
  );
}
function SingleImageField({
  label,
  image,
  onSelect,
  onRemove,
}: {
  label: string;
  image: MoreViewImage | null;
  onSelect: (file?: File) => void;
  onRemove: () => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{label}</p>
      {image ? (
        <div className="relative mt-3 overflow-hidden rounded-xl border border-line">
          <Image
            unoptimized
            src={image.url}
            alt={label}
            width={1200}
            height={675}
            className="aspect-video w-full object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute right-3 top-3 min-h-10 rounded-full bg-white px-4 text-xs font-semibold text-danger shadow"
          >
            Remove
          </button>
        </div>
      ) : (
        <label className="mt-3 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-[#fffdf8] text-center hover:border-gold">
          <span className="grid size-10 place-items-center rounded-full bg-[#0d1b34] text-xl text-white">
            +
          </span>
          <span className="mt-3 text-sm font-semibold">Upload one image</span>
          <span className="mt-1 text-xs text-muted">PNG, JPG or WebP</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(e) => {
              onSelect(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
      )}
    </div>
  );
}
