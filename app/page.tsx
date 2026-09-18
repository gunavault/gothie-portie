import Portfolio from "@/components/Portfolio";
import { getSections } from "@/lib/portfolio";

export default async function Page() {
  const sections = await getSections();
  return <Portfolio sections={sections} />;
}
