import { requireParentPage } from "../../lib/auth/pageGuards";
import HouseholdHome from "../../components/household/HouseholdHome";

export default async function HouseholdPage() {
  await requireParentPage();
  return <HouseholdHome />;
}
