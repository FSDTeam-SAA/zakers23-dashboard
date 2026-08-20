export type OverviewMetric = { label: string; value: string; icon: "document" | "users" | "settings" | "activity"; trend: "up" | "down" };
export type Inquiry = { client: string; type: string; development: string; date: string; status: "New" | "Pending" | "Approved" | "Completed" | "In review" | "Scheduled" };
