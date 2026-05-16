export function Scanlines() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-20 bg-grid bg-[size:44px_44px] opacity-60 animate-pulse-grid" />
      <div className="scanlines pointer-events-none fixed inset-0 z-30 opacity-80" />
      <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(circle_at_top,rgba(0,255,136,0.08),transparent_35%),radial-gradient(circle_at_bottom,rgba(0,212,255,0.07),transparent_45%)]" />
      <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
        <div className="absolute inset-x-0 top-[-30%] h-[30%] bg-[linear-gradient(180deg,transparent,rgba(0,255,136,0.08),transparent)] opacity-50 animate-sweep" />
      </div>
    </>
  )
}
