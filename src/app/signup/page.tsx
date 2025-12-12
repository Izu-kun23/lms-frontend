import Image from "next/image"
import Link from "next/link"
import { SignupForm } from "@/components/shared/signup-form"

export default function SignupPage() {
  return (
    <div className="grid h-svh overflow-hidden lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 overflow-y-auto no-scrollbar">
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
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/assets/glacq_image.jpeg"
          alt="Signup background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
