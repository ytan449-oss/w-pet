import { HomePage } from "@/components/home-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("en", "An original New Zealand pet brand");
export default function EntryPage() { return <HomePage locale="en" />; }
