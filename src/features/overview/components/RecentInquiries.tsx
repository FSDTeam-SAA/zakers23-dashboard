import type { Inquiry } from "../types";

const inquiries: Inquiry[] = [
  {
    client: "Alexandra Mercer",
    type: "Floor Plan Request",
    development: "Aurelia Residences",
    date: "Jun 24, 2026",
    status: "New",
  },
  {
    client: "Benjamin Clarke",
    type: "Interior Design Consultation",
    development: "Maplewood Heights",
    date: "Jul 2, 2026",
    status: "Pending",
  },
  {
    client: "Cynthia Lee",
    type: "Renovation Estimate",
    development: "Lakeside Villas",
    date: "Jul 5, 2026",
    status: "Approved",
  },
  {
    client: "Marcus Grant",
    type: "Landscape Design Proposal",
    development: "Maplewood Estates",
    date: "Jul 12, 2026",
    status: "Pending",
  },
  {
    client: "Elena Petrova",
    type: "Electrical Inspection Report",
    development: "Sunrise Condos",
    date: "Jul 7, 2026",
    status: "Completed",
  },
  {
    client: "Jamal Thompson",
    type: "Plumbing Maintenance",
    development: "Greenfield Apartments",
    date: "Jul 9, 2026",
    status: "In review",
  },
  {
    client: "Sophia Martinez",
    type: "Interior Painting Quote",
    development: "Harborview Residences",
    date: "Jul 11, 2026",
    status: "Approved",
  },
  {
    client: "David Ortiz",
    type: "Site Inspection",
    development: "Cedar Creek Estates",
    date: "Jul 10, 2026",
    status: "Scheduled",
  },
];

export function RecentInquiries() {
  return (
    <section className="overflow-hidden rounded border border-line bg-white px-4 py-6 sm:px-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-base text-gold">Client Activity</p>
          <h2 className="mt-1 font-inter text-2xl font-normal">
            Recent Inquiries
          </h2>
        </div>
        <button className="font-inter font-semibold text-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[880px] w-full border-collapse text-left">
          <thead className="text-muted">
            <tr className="border-b border-line">
              <th className="px-4 py-4 text-center font-normal">Client</th>
              <th className="px-4 py-4 text-center font-normal">
                Inquiry Type
              </th>
              <th className="px-4 py-4 text-center font-normal">Development</th>
              <th className="px-4 py-4 text-center font-normal">Date</th>
              <th className="px-4 py-4 text-center font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr
                key={`${inquiry.client}-${inquiry.date}`}
                className="border-b border-line last:border-0"
              >
                <td className="px-4 py-[18px] text-center font-inter font-semibold">
                  {inquiry.client}
                </td>
                <td className="px-4 py-[18px] text-center">{inquiry.type}</td>
                <td className="px-4 py-[18px] text-center">
                  {inquiry.development}
                </td>
                <td className="px-4 py-[18px] text-center">{inquiry.date}</td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex rounded-full bg-[#F8F1DF] px-3 py-1.5 text-sm uppercase text-[#8A7118]">
                    {inquiry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
