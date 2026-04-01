import { useForm, FormProvider, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "~/lib/trpc";
import {
  updateProfileSchema,
  type UpdateProfileSchema,
} from "~/schemas/profile";
import { useToast } from "~/hooks/use-toast";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSession } from "~/lib/auth-client";
import { Route } from "~/routes/_authenticated/settings/index";

import { UserSection } from "../components/UserSection";
import { BasicSection } from "../components/BasicSection";
import { CodingSection } from "../components/CodingSection";
import { PersonalSection } from "../components/PersonalSection";
import { WorkSection } from "../components/WorkSection";
import { BrandingSection } from "../components/BrandingSection";

export function ProfileSettingsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const loaderData = Route.useLoaderData();
  const { data: clientProfile } = trpc.user.getCurrentProfile.useQuery(
    undefined,
    { enabled: !loaderData },
  );
  const profile = loaderData || clientProfile;

  const methods = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema) as Resolver<UpdateProfileSchema>,
    values: profile
      ? {
          name: profile.name ?? "",
          username: profile.username ?? "",
          image: profile.image ?? undefined,
          websiteUrl: profile.websiteUrl ?? "",
          location: profile.location ?? "",
          bio: profile.bio ?? "",
          currentlyLearning: profile.currentlyLearning ?? "",
          availableFor: profile.availableFor ?? "",
          skills: profile.skills ?? "",
          currentlyHacking: profile.currentlyHacking ?? "",
          pronouns: profile.pronouns ?? "",
          work: profile.work ?? "",
          education: profile.education ?? "",
          brandColor: profile.brandColor ?? "#000000",
        }
      : undefined,
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = methods;

  const mutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully.",
      });
      utils.user.getCurrentProfile.invalidate();
      utils.profile.getByUsername.invalidate();
      reset(methods.getValues());
    },
    onError: (err) => {
      toast({
        title: "Failed to save",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UpdateProfileSchema) => mutation.mutate(data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div>
          <h1 className="font-bold text-primary text-2xl">
            @{profile?.username ?? session?.user?.name}
          </h1>
        </div>

        <UserSection />
        <BasicSection />
        <CodingSection />
        <PersonalSection />
        <WorkSection />
        <BrandingSection />

        <div
          className={`transition-all duration-300 rounded-lg border bg-card p-6 mb-20 ${
            isDirty ? "sticky bottom-0 z-50 rounded-none" : ""
          }`}
        >
          <Button
            type="submit"
            size="lg"
            className="w-full text-md font-semibold"
            disabled={!isDirty || mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Saving…
              </>
            ) : (
              "Save Profile Information"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
