import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "~/lib/auth-client"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { useToast } from "~/hooks/use-toast"
import { Github, Loader2 } from "lucide-react"
import { loginFormSchema, type LoginFormSchema } from "../forms/login"

export function LoginPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [isGithubLoading, setIsGithubLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormSchema) {
    setIsEmailLoading(true)
    try {
      const res = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/",       
      })

      if ((res as any)?.error) {
        throw new Error((res as any).error?.message || "Login failed")
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })

      navigate({ to: "/" })    
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err instanceof Error ? err.message : "An error occurred",
      })
    } finally {
      setIsEmailLoading(false)
    }
  }

  async function handleGithubSignIn() {
    setIsGithubLoading(true)
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",       
      })
    } catch {
      toast({
        variant: "destructive",
        title: "GitHub login failed",
        description: "Could not sign in with GitHub. Please try again.",
      })
      setIsGithubLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true)
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",       
      })
    } catch {
      toast({
        variant: "destructive",
        title: "Google login failed",
        description: "Could not sign in with Google. Please try again.",
      })
      setIsGoogleLoading(false)
    }
  }

  const anySocialLoading = isGithubLoading || isGoogleLoading

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-[480px] border-none shadow-none">
        <CardHeader className="flex flex-col items-center justify-center">
          <Link to="/">
            <h1 className="text-3xl font-bold text-primary-foreground bg-primary px-3 py-1 rounded-md mb-10">
              DEV
            </h1>
          </Link>
          <h1 className="text-2xl font-bold text-primary">
            Welcome back 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to your DEV Community account
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
          >
            <div className="space-y-1">
              <Input
                type="email"
                placeholder="email@domain.com"
                {...register("email")}         
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}         // ← .message was missing
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="mt-2 w-full"
              size="lg"
              disabled={isEmailLoading || anySocialLoading}
            >
              {isEmailLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Sign in with email"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="flex w-full items-center justify-between gap-x-4">
            <div className="h-[2px] w-full border-t-2" />
            <p className="flex-1 text-nowrap text-sm text-muted-foreground">
              or continue with
            </p>
            <div className="h-[2px] w-full border-t-2" />
          </div>

          <Button
            variant="secondary"
            className="w-full gap-2"
            size="lg"
            onClick={handleGoogleSignIn}
            disabled={anySocialLoading || isEmailLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <svg className="size-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Sign in with Google
          </Button>

          <Button
            variant="secondary"
            className="w-full gap-2"
            size="lg"
            onClick={handleGithubSignIn}
            disabled={anySocialLoading || isEmailLoading}
          >
            {isGithubLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Github className="size-4" />
            )}
            Sign in with GitHub
          </Button>

          <p className="text-center px-6 text-sm italic text-foreground/60">
            By signing in, you are agreeing to our{" "}
            <Link to="/" className="font-semibold text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/" className="font-semibold text-foreground">
              Privacy Policy
            </Link>
          </p>

          <div className="w-full items-center h-[2px] border-t-2 mt-5" />
          <p className="text-[15px]">
            New to DEV Community?{" "}
            <Link to="/register" className="font-bold text-primary">
              Create account.
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}