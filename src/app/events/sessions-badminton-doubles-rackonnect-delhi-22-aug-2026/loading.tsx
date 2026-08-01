/** Instant transition UI while the session page RSC payload streams in. */
export default function EventLoading() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#1c1c1c]">
      <div className="mx-auto max-w-7xl px-3 pb-28 pt-4 sm:px-4 sm:pb-16 sm:pt-8 lg:px-6">
        <div className="relative w-full overflow-hidden rounded-2xl bg-[#0b0b0d] sm:rounded-3xl">
          <div className="relative flex aspect-[702/524] w-full animate-pulse flex-col sm:aspect-[1232/530] 2xl:aspect-auto 2xl:h-[520px]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#141418_0%,#0b0b0d_45%,#1a1a22_100%)]" />
            <div className="relative z-10 flex flex-col gap-3 p-3 sm:p-7">
              <div className="h-7 w-36 rounded-md bg-white/10" />
              <div className="mt-auto space-y-3 pb-2 sm:pb-0">
                <div className="h-3 w-28 rounded bg-[#FFF201]/40" />
                <div className="h-8 w-[70%] max-w-md rounded-lg bg-white/15 sm:h-12" />
                <div className="h-4 w-48 rounded bg-white/10" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:mt-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-8">
          <div className="space-y-6">
            <div className="h-6 w-24 animate-pulse rounded bg-[#e5e5e5]" />
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-[#ebebeb]" />
              <div className="h-4 w-[92%] animate-pulse rounded bg-[#ebebeb]" />
              <div className="h-4 w-[80%] animate-pulse rounded bg-[#ebebeb]" />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="h-[420px] animate-pulse rounded-2xl border border-[#e8e8e8] bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]" />
          </div>
        </div>
      </div>
    </main>
  );
}
