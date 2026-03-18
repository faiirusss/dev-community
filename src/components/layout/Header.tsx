import { Link } from "@tanstack/react-router";
import { Bell, Menu, Search } from "lucide-react";
import { useAppSession } from "~/components/layout/PageContainer";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

export function Header() {
  const { session, isPending, signOut } = useAppSession();
  const profile = session?.user;

  return (
    <header className="border-b border-border bg-card fixed z-50 w-full top-0 px-2">
      <div className="flex h-14 items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden mr-1">
            <Menu className="size-5" />
          </Button>
          <Link
            to="/"
            className="text-xl mr-4 font-bold text-primary-foreground bg-primary h-9 px-2 rounded-sm flex items-center"
          >
            DEV
          </Link>
          <div className="relative hidden md:block">
            <Button
              className="absolute top-1/2 -translate-y-1/2 left-[2px] cursor-pointer"
              variant="ghost"
              size="icon"
            >
              <Search className="size-4" />
            </Button>
            <Input className="pl-9 w-96 rounded-sm" placeholder="Search..." />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : session ? (
            <>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="size-4" />
              </Button>
              <Link to="/">
                <Button className="hidden md:block cursor-pointer">
                  Create Post
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Bell className="size-5" />
              </Button>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size={"icon"}
                    className="rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      {profile?.image && (
                        <AvatarImage
                          src={profile.image}
                          alt={profile?.name ?? ""}
                        />
                      )}
                      <AvatarFallback>
                        {profile?.name?.charAt(0).toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32" align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/$username"
                      params={{
                        username: profile?.username ?? profile?.email ?? "",
                      }}
                      className="flex flex-col items-start gap-0 cursor-pointer"
                    >
                      <span>{profile?.name}</span>
                      <span className="leading-none">@{profile?.username}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup className="cursor-pointer">
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                    <DropdownMenuItem>Create Post</DropdownMenuItem>
                    <DropdownMenuItem>Reading List</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={signOut}
                      className="cursor-pointer"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="cursor-pointer">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="cursor-pointer">
                  Create Account
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
