import { createFileRoute, Link } from "@tanstack/react-router";
import { trpc } from "~/lib/trpc";
import { PageContainer } from "~/components/layout/PageContainer";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Cake,
  ExternalLink,
  Github,
  Hash,
  MapPinned,
  MessageSquare,
  FileText,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/$username")({
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useParams();

  const { data: profile, isLoading } =
    trpc.profile.getByUsername.useQuery({
      username,
    });

  const [moreInfo, setMoreInfo] = useState(false);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-muted-foreground text-lg">
            Loading profile...
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!profile) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <h1 className="text-3xl font-bold">User Not Found</h1>
          <p className="text-muted-foreground">
            The user @{username} does not exist.
          </p>
        </div>
      </PageContainer>
    );
  }

  const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <PageContainer noPadding>
      <div className="bg-[#931b1f] h-32 md:h-32 w-full absolute left-0 right-0 z-0"></div>

      <div className="max-w-[1052px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 md:pt-18">
        <div className="bg-card border rounded-lg shadow-sm relative px-4 pb-8 pt-16 md:pt-20 flex flex-col items-center">
          <Avatar className="absolute -top-12 md:-top-16 left-1/2 -translate-x-1/2 border-[#931b1f] border-4 md:border-8 size-24 md:size-32 z-10">
            {profile?.image && (
              <AvatarImage src={profile.image} alt={profile?.name ?? ""} className="object-cover" />
            )}
            <AvatarFallback className="text-2xl md:text-4xl bg-muted text-foreground">
              {profile?.name?.charAt(0).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>

          <div className="absolute top-4 right-4">
            <Link to="/settings">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Edit profile
              </Button>
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
            {profile.name}
          </h1>
          <p className="max-w-prose mt-2 text-foreground/80">
            {profile.bio || "404 bio not found"}
          </p>

          <div className="flex flex-wrap text-muted-foreground text-sm gap-4 mt-4 justify-center w-full">
            {profile.location && (
              <p className="flex gap-2 items-center">
                <MapPinned size={18} />
                {profile.location}
              </p>
            )}
            <p className="flex items-center gap-2" suppressHydrationWarning>
              <Cake size={18} /> Joined on {joinedDate}
            </p>
            {profile.websiteUrl && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <ExternalLink size={18} />
                {profile.websiteUrl}
              </a>
            )}
            <Github
              size={18}
              className="cursor-pointer hover:text-primary transition-colors"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pb-12">
          
          <div className="col-span-1">
            <div className="bg-card border shadow-sm p-4 rounded-lg space-y-4 text-muted-foreground">
              <p className="flex items-center gap-3">
                <FileText size={18} />
                <span>0 posts published</span>
              </p>
              <p className="flex items-center gap-3">
                <MessageSquare size={18} />
                <span>0 comments written</span>
              </p>
              <p className="flex items-center gap-3">
                <Hash size={18} />
                <span>0 tags followed</span>
              </p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="h-64 rounded-lg flex items-center justify-center text-muted-foreground">
            </div>
          </div>
          
        </div>
      </div>
    </PageContainer>
  );
}
