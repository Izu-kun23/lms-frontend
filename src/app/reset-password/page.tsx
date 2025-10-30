import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium pt-10">
            <span className="font-bebas text-4xl leading-none tracking-wide">GLACQ</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form className="flex flex-col gap-6">
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Reset password</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Choose a new password for your account.
                  </p>
                </div>
                <Field>
                  <FieldLabel htmlFor="new-password">New password</FieldLabel>
                  <Input id="new-password" type="password" required />
                  <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
                  <Input id="confirm-password" type="password" required />
                </Field>
                <Field>
                  <Button type="submit" className="bg-black text-white hover:bg-black/90 w-full">
                    Reset password
                  </Button>
                </Field>
                <FieldDescription className="text-center">
                  Return to <a href="/login" className="underline underline-offset-4">Login</a>
                </FieldDescription>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/assets/glacq_image.jpeg"
          alt="Reset Password background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}


