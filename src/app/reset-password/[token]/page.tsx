import Image from "next/image"
import Link from "next/link"
import { ResetPasswordForm } from "@/components/shared/reset-password-form"
import { redirect } from "next/navigation"

interface ResetPasswordTokenPageProps {
  params: Promise<{
    token: string
  }>
}

export default async function ResetPasswordTokenPage({ params }: ResetPasswordTokenPageProps) {
  const { token } = await params

  if (!token) {
    redirect("/forgot-password")
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium pt-10">
            <div className="relative w-40 h-12">
              <Image
                src="/logos/pc_logo.png"
                alt="ProjectCareer Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ResetPasswordForm token={token} />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/sideimage.jpeg"
          alt="Reset password background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
