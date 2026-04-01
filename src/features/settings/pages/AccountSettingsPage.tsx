import { useState } from "react";
import { useForm, FormProvider, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "~/lib/trpc";
import { useSession } from "~/lib/auth-client";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "~/schemas/account";
import { useToast } from "~/hooks/use-toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { SectionWrapper } from "../components/layout/SectionWrapper";
import { Route } from "~/routes/_authenticated/settings/account";

export function AccountSettingsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const loaderData = Route.useLoaderData();

  const passwordMethods = useForm<ChangePasswordSchema>({
    resolver: zodResolver(
      changePasswordSchema,
    ) as Resolver<ChangePasswordSchema>,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const {
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { isDirty: isPasswordDirty },
  } = passwordMethods;

  const passwordMutation = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      resetPasswordForm();
    },
    onError: (err) => {
      toast({
        title: "Failed to change password",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const onPasswordSubmit = (data: ChangePasswordSchema) => {
    passwordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const [deleteUsername, setDeleteUsername] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const deleteAccountMutation = trpc.auth.deleteAccount.useMutation({
    onSuccess: () => {
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
      window.location.href = "/";
    },
    onError: (err) => {
      toast({
        title: "Failed to delete account",
        description: err.message,
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
    },
  });

  const handleDeleteAccount = () => {
    if (deleteUsername !== session?.user?.username) {
      toast({
        title: "Username mismatch",
        description:
          "Please enter your username correctly to confirm deletion.",
        variant: "destructive",
      });
      return;
    }
    deleteAccountMutation.mutate({ username: deleteUsername });
  };

  const hasGoogleAccount = loaderData?.connectedAccounts?.some(
    (account) => account.providerId === "google",
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-primary text-2xl">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account security and preferences.
        </p>
      </div>

      <SectionWrapper title="Set new password">
        <FormProvider {...passwordMethods}>
          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="flex flex-col gap-5"
          >
            <p className="text-sm text-muted-foreground">
              If you signed up using a social login provider (like Google), you
              may not have a password set. Setting a password allows you to sign
              in with your email address as well.
            </p>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="currentPassword"
                className="text-sm font-semibold"
              >
                Current password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter your current password"
                {...passwordMethods.register("currentPassword")}
                aria-invalid={
                  !!passwordMethods.formState.errors.currentPassword
                }
              />
              {passwordMethods.formState.errors.currentPassword && (
                <p className="text-xs text-destructive">
                  {passwordMethods.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword" className="text-sm font-semibold">
                New password
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter your new password (min. 8 characters)"
                {...passwordMethods.register("newPassword")}
                aria-invalid={!!passwordMethods.formState.errors.newPassword}
              />
              {passwordMethods.formState.errors.newPassword && (
                <p className="text-xs text-destructive">
                  {passwordMethods.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="confirmNewPassword"
                className="text-sm font-semibold"
              >
                Confirm new password
              </Label>
              <Input
                id="confirmNewPassword"
                type="password"
                placeholder="Confirm your new password"
                {...passwordMethods.register("confirmNewPassword")}
                aria-invalid={
                  !!passwordMethods.formState.errors.confirmNewPassword
                }
              />
              {passwordMethods.formState.errors.confirmNewPassword && (
                <p className="text-xs text-destructive">
                  {passwordMethods.formState.errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-fit"
              disabled={!isPasswordDirty || passwordMutation.isPending}
            >
              {passwordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Set New Password"
              )}
            </Button>
          </form>
        </FormProvider>
      </SectionWrapper>

      <SectionWrapper title="Account emails">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">Primary email</Label>
            <Input
              value={session?.user?.email ?? ""}
              disabled
              className="bg-muted/50"
            />
            <p className="text-xs text-muted-foreground">
              This is the email address associated with your account.
            </p>
          </div>

          {hasGoogleAccount && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold">Google account</Label>
              <Input
                value={session?.user?.email ?? ""}
                disabled
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                Your account is connected to Google for sign-in.
              </p>
            </div>
          )}
        </div>
      </SectionWrapper>

      <div className="rounded-lg border border-destructive/50 bg-card p-6">
        <h2 className="mb-6 text-xl font-bold tracking-tight text-destructive">
          Danger Zone
        </h2>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Delete account</h3>
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. Please be
              certain. This will permanently delete your account, remove all
              your posts, comments, and reactions from our servers.
            </p>
          </div>

          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-fit">
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="flex flex-col gap-2 py-4">
                <Label htmlFor="delete-confirmation" className="text-sm">
                  Type your username{" "}
                  <span className="font-mono font-bold">
                    {session?.user?.username}
                  </span>{" "}
                  to confirm:
                </Label>
                <Input
                  id="delete-confirmation"
                  value={deleteUsername}
                  onChange={(e) => setDeleteUsername(e.target.value)}
                  placeholder={session?.user?.username ?? ""}
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setDeleteUsername("")}
                  disabled={deleteAccountMutation.isPending}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={
                    deleteUsername !== session?.user?.username ||
                    deleteAccountMutation.isPending
                  }
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  {deleteAccountMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
