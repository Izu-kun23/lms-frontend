import { Button } from "@/components/ui/button";

export default function SelectOrganizationPage() {
  // Placeholder static items; replace with data from backend
  const orgs = [
    { id: "1", name: "Acme University", role: "Student" },
    { id: "2", name: "Glacq Institute", role: "Instructor" },
  ];

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
            <div className="flex flex-col items-center gap-1 text-center mb-6">
              <h1 className="text-2xl font-bold">Select organization</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Choose where to continue. Your role is shown below each org.
              </p>
            </div>
            <div className="space-y-3">
              {orgs.map((o) => (
                <button key={o.id} className="w-full border rounded-md p-3 text-left hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{o.name}</span>
                    <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">{o.role}</span>
                  </div>
                </button>
              ))}
            </div>
            <Button className="bg-black text-white hover:bg-black/90 w-full mt-6">Continue</Button>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/assets/glacq_image.jpeg"
          alt="Organization selection background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}


