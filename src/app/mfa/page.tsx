import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function MfaPage() {
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
                  <h1 className="text-2xl font-bold">Two-step verification</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Enter the 6-digit code from your authenticator app.
                  </p>
                </div>
                <Field>
                  <FieldLabel htmlFor="code">Verification code</FieldLabel>
                  <Input id="code" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} placeholder="••••••" required />
                  <FieldDescription>
                    <a href="#" className="underline underline-offset-4">Use a backup code</a>
                  </FieldDescription>
                </Field>
                <Field>
                  <Button type="submit" className="bg-black text-white hover:bg-black/90 w-full">
                    Verify
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/assets/glacq_image.jpeg"
          alt="MFA background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}


