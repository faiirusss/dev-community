import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { PageContainer } from "~/components/layout/PageContainer";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Cake,
  ExternalLink,
  MapPinned,
  MessageSquare,
  FileText,
  Hash,
} from "lucide-react";
import { useStorageUrl } from "~/hooks/use-storage-url";
import { ProfileSidebar } from "~/components/profile/ProfileSidebar";

const getProfileAndStats = createServerFn({ method: "GET" })
  .handler(async ({ data }: { data: any }) => {
    const { username } = data as { username: string };
    const { appRouter } = await import("~/server/root");
    const { db } = await import("~/db");
    const { TRPCError } = await import("@trpc/server");

    const caller = appRouter.createCaller({
      req: new Request("http://localhost"),
      db,
      session: null,
      user: null,
    });

    try {
      const [profileData, statsData] = await Promise.all([
        caller.profile.getByUsername({ username }),
        caller.profile.getStats({ username }),
      ]);

      const profile = profileData
        ? { ...profileData, createdAt: profileData.createdAt.toISOString() }
        : null;
      const stats = statsData ?? null;

      return { profile, stats };
    } catch (error) {
      if (error instanceof TRPCError && error.code === "NOT_FOUND") {
        return { profile: null, stats: null };
      }
      throw error;
    }
  });

export const Route = createFileRoute("/$username")({
  loader: async ({ params }) => {
    return getProfileAndStats({ data: { username: params.username } } as any);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useParams();
  const { profile, stats } = Route.useLoaderData();

  const { url: imageUrl, isLoading: imageLoading } = useStorageUrl(
    profile?.image,
  );

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

  const bannerColor = profile.brandColor || "#931b1f";

  return (
    <PageContainer noPadding>
      <div
        className="h-32 md:h-32 w-full absolute left-0 right-0 z-0"
        style={{ backgroundColor: bannerColor }}
      ></div>

      <div className="max-w-[1052px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 md:pt-18">
        <div className="bg-card border rounded-lg shadow-sm relative px-4 pb-8 pt-16 md:pt-20 flex flex-col items-center">
          <Avatar
            className="absolute -top-12 md:-top-16 left-1/2 -translate-x-1/2 border-4 md:border-8 size-24 md:size-32 z-10 bg-card"
            style={{ borderColor: bannerColor }}
          >
            {imageLoading ? (
              <AvatarFallback className="bg-muted" />
            ) : imageUrl ? (
              <AvatarImage
                src={imageUrl}
                alt={profile?.name ?? ""}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="text-2xl md:text-4xl bg-muted text-foreground">
                {profile?.name?.charAt(0).toUpperCase() ?? ""}
              </AvatarFallback>
            )}
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
          </div>

          <div className="mt-6 pt-6 border-t w-full">
            <div className="grid grid-cols-3 gap-4 text-center">
              {profile.education && (
                <div>
                  <p className="text-sm text-muted-foreground">Education</p>
                  <p className="font-medium text-foreground">
                    {profile.education}
                  </p>
                </div>
              )}
              {profile.pronouns && (
                <div>
                  <p className="text-sm text-muted-foreground">Pronouns</p>
                  <p className="font-medium text-foreground">
                    {profile.pronouns}
                  </p>
                </div>
              )}
              {profile.work && (
                <div>
                  <p className="text-sm text-muted-foreground">Work</p>
                  <p className="font-medium text-foreground">{profile.work}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pb-24 mb-12">
          <div className="col-span-1">
            <div className="mb-4">
              <ProfileSidebar
                skills={profile?.skills}
                currentlyLearning={profile?.currentlyLearning}
                currentlyHacking={profile?.currentlyHacking}
                availableFor={profile?.availableFor}
              />
            </div>
            <div className="bg-card border shadow-sm p-4 rounded-lg space-y-4 text-muted-foreground">
              <p className="flex items-center gap-3">
                <FileText size={18} />
                <span>{stats?.postsPublished ?? 0} posts published</span>
              </p>
              <p className="flex items-center gap-3">
                <MessageSquare size={18} />
                <span>{stats?.commentsWritten ?? 0} comments written</span>
              </p>
              <p className="flex items-center gap-3">
                <Hash size={18} />
                <span>{stats?.tagsFollowed ?? 0} tags followed</span>
              </p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="h-64 rounded-lg flex items-center justify-center text-muted-foreground"></div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
