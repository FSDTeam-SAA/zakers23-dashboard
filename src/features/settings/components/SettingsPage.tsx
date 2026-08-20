import { OverviewHeader } from "@/features/overview/components/OverviewHeader";
import { OverviewSidebar } from "@/features/overview/components/OverviewSidebar";
import { ChangePassword } from "./ChangePassword";
import { PersonalInformation } from "./PersonalInformation";
import { SettingsProfile } from "./SettingsProfile";
export function SettingsPage(){return <div className="min-h-dvh bg-white lg:flex"><OverviewSidebar active="Settings"/><div className="min-w-0 flex-1"><OverviewHeader title="Settings" description="Manage website preferences and administrator information."/><main className="mx-auto max-w-[1620px] space-y-3 p-5 sm:p-8"><SettingsProfile/><PersonalInformation/><ChangePassword/></main></div></div>}
