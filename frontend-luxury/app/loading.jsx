export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center space-y-4">
        {/* Loading spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-chrome-600 border-t-accent-primary rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent-secondary rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="font-plus-jakarta text-xl font-semibold text-white">
            Loading Platform
          </h2>
          <p className="text-chrome-300 text-sm">
            Preparing your luxury experience...
          </p>
        </div>
      </div>
    </div>
  );
}