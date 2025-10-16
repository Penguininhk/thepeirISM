import AppLogo from '@/components/app-logo';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative flex w-full max-w-4xl flex-col items-center text-center">
        <AppLogo className="mb-8 h-40 w-40" />
        <h1 className="text-2xl font-semibold tracking-tight text-primary md:text-4xl font-headline animate-pulse">
          Loading...
        </h1>
        <p className="mt-4 max-w-xl text-lg text-foreground/80">
          Please wait while we get things ready for you.
        </p>
        <div className="mt-4 text-sm text-muted-foreground p-4 bg-card/50 rounded-lg">
            <p className="font-semibold">Tip:</p>
            <p>You can use the AI Study Buddy on any page to get help with your courses!</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
        <svg
          className="waves-svg absolute bottom-0 left-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="waves">
            <use href="#gentle-wave" x="48" y="0" fill="hsl(var(--primary) / 0.1)" />
            <use href="#gentle-wave" x="48" y="3" fill="hsl(var(--primary) / 0.15)" />
            <use href="#gentle-wave" x="48" y="5" fill="hsl(var(--primary) / 0.05)" />
            <use href="#gentle-wave" x="48" y="7" fill="hsl(var(--primary) / 0.2)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
