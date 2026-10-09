import { PagePlaceholder } from "@/components/page-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("en", "An original New Zealand pet brand");
export default function EntryPage() { return <PagePlaceholder locale="en" title="W Pet" />; }
