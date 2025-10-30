type Props = { params: { provider: string } }

export default function SsoCallbackPage({ params }: Props) {
  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">SSO Callback</h1>
      <p className="text-muted-foreground mt-2">Provider: {params.provider}</p>
      <p className="text-sm mt-4">This is a placeholder. Exchange code → tokens → route to org select/MFA as needed.</p>
    </main>
  )
}


