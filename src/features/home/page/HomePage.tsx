import { LeftSidebar } from "../components/LeftSidebar";
import { MainFeed } from "../components/MainFeed";
import { RightSidebar } from "../components/RightSidebar";
import { useAppSession } from "~/components/layout/PageContainer";

export function HomePage() {
  const { username } = useAppSession();

  return (
    <main className="md:py-4">
      <div className="grid grid-cols-1 md:grid-cols-[1.7fr_4.3fr] lg:grid-cols-[1.5fr_3fr_1.5fr] xl:grid-cols-[1.2fr_3.2fr_1.6fr] gap-4 max-w-7xl mx-auto md:px-2">
        <LeftSidebar />
        <MainFeed username={username} />
        <RightSidebar />
      </div>
    </main>
  );
}