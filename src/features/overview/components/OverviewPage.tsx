"use client";

import { useCallback, useEffect, useState } from "react";
import { OverviewHeader } from "./OverviewHeader";
import { OverviewSidebar } from "./OverviewSidebar";
import { MetricCard } from "./MetricCard";
import { QuickActions } from "./QuickActions";
import { RecentInquiries } from "./RecentInquiries";
import type { OverviewMetric } from "../types";

type Analytics={totalDevelopments:number;totalWaterfrontProperties:number;totalPublishedArticles:number;totalNeighbourhoods:number;totalPendingContactRequests:number;totalCompletedContactRequests:number};

export function OverviewPage(){
  const[data,setData]=useState<Analytics|null>(null),[error,setError]=useState("");
  const load=useCallback(async()=>{try{const response=await fetch("/api/analytics",{cache:"no-store"}),payload=await response.json();if(!response.ok||!payload.success)throw new Error(payload.message||"Could not load analytics");setData(payload.data);setError("")}catch(e){setError(e instanceof Error?e.message:"Could not load analytics")}},[]);
  useEffect(()=>{void load();const timer=window.setInterval(load,5000);const focus=()=>void load();window.addEventListener("focus",focus);return()=>{window.clearInterval(timer);window.removeEventListener("focus",focus)}},[load]);
  const metrics:OverviewMetric[]=[
    {value:data?String(data.totalDevelopments):"—",label:"Total Developments",icon:"document",trend:"up"},
    {value:data?String(data.totalNeighbourhoods):"—",label:"Total Neighborhoods",icon:"users",trend:"up"},
    {value:data?String(data.totalWaterfrontProperties):"—",label:"Waterfront Properties",icon:"settings",trend:"up"},
    {value:data?String(data.totalPublishedArticles):"—",label:"Published Articles",icon:"document",trend:"up"},
    {value:data?String(data.totalPendingContactRequests+data.totalCompletedContactRequests):"—",label:"Total Inquiries",icon:"activity",trend:"up"},
    {value:data?String(data.totalPendingContactRequests):"—",label:"Pending Inquiries",icon:"activity",trend:"down"},
  ];
  return <div className="min-h-dvh bg-canvas text-ink lg:flex"><OverviewSidebar/><div className="min-w-0 flex-1"><OverviewHeader/><main id="main-content" className="mx-auto max-w-[1620px] space-y-6 px-5 py-6 sm:px-8">{error&&<div role="alert" className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">Live dashboard data is temporarily unavailable: {error}</div>}<section aria-label="Live portfolio overview" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{metrics.map(metric=><MetricCard key={metric.label}{...metric}/>)}</section><QuickActions/><RecentInquiries/></main></div></div>;
}
