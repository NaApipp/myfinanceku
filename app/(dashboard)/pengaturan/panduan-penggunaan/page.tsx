import ToolsPage from "./ClientView";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  return <ToolsPage searchParams={searchParams} />;
}
