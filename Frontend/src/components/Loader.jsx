import React from "react";

export default function Loader({
  size = "md",
  text = "Loading...",
  variant = "spinner",
  fullScreen = false,
  overlay = false,
}) {
  // Size configurations for different variants
  const sizeConfig = {
    xs: {
      spinner: "w-4 h-4",
      dots: "w-1 h-1 mx-0.5",
      bar: "h-1",
      text: "text-xs",
    },
    sm: {
      spinner: "w-6 h-6",
      dots: "w-1.5 h-1.5 mx-0.5",
      bar: "h-1.5",
      text: "text-sm",
    },
    md: {
      spinner: "w-8 h-8",
      dots: "w-2 h-2 mx-1",
      bar: "h-2",
      text: "text-base",
    },
    lg: {
      spinner: "w-12 h-12",
      dots: "w-3 h-3 mx-1",
      bar: "h-3",
      text: "text-lg",
    },
    xl: {
      spinner: "w-16 h-16",
      dots: "w-4 h-4 mx-1.5",
      bar: "h-4",
      text: "text-xl",
    },
  };

  // Color variants
  const colorConfig = {
    primary: "border-indigo-500",
    white: "border-white",
    gray: "border-gray-400",
    success: "border-green-500",
    warning: "border-yellow-500",
    danger: "border-red-500",
  };

  // Spinner Loader - Classic rotating spinner
  const SpinnerLoader = () => (
    <div
      className={`
        animate-spin rounded-full border-4 border-t-transparent 
        ${colorConfig.primary} 
        ${sizeConfig[size].spinner}
      `}
      role="status"
      aria-label="loading"
    />
  );

  // Dots Loader - Bouncing dots animation
  const DotsLoader = () => (
    <div
      className="flex items-center justify-center"
      role="status"
      aria-label="loading"
    >
      {[0, 1, 2].map((dot) => (
        <div
          key={dot}
          className={`
            bg-indigo-500 rounded-full animate-bounce
            ${sizeConfig[size].dots}
          `}
          style={{
            animationDelay: `${dot * 0.15}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );

  // Pulse Loader - Pulsing circle
  const PulseLoader = () => (
    <div
      className={`
        rounded-full bg-indigo-500 animate-pulse
        ${sizeConfig[size].spinner}
      `}
      role="status"
      aria-label="loading"
    />
  );

  // Bar Loader - Progress bar style
  const BarLoader = () => (
    <div
      className={`
        w-32 bg-gray-200 rounded-full overflow-hidden
        ${sizeConfig[size].bar}
      `}
      role="status"
      aria-label="loading"
    >
      <div
        className="h-full bg-indigo-500 rounded-full animate-progress"
        style={{
          animation: "progress 1.5s ease-in-out infinite",
        }}
      />
    </div>
  );

  // Skeleton Loader - For content placeholders
  const SkeletonLoader = () => (
    <div
      className="flex items-center space-x-4 animate-pulse"
      role="status"
      aria-label="loading"
    >
      <div className={`rounded-full bg-gray-300 ${sizeConfig[size].spinner}`} />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  );

  // Modern Spinner - With gradient and glow
  const ModernSpinner = () => (
    <div className="relative" role="status" aria-label="loading">
      <div
        className={`
          animate-spin rounded-full border-4 border-t-transparent
          bg-gradient-to-r from-indigo-500 to-purple-600
          ${sizeConfig[size].spinner}
        `}
        style={{
          background:
            "conic-gradient(from 0deg, transparent, #4f46e5, #7c3aed, transparent)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 4px), white 0)",
        }}
      />
      <div
        className={`
          absolute inset-0 animate-pulse rounded-full
          bg-indigo-200 blur-sm opacity-50
          ${sizeConfig[size].spinner}
        `}
      />
    </div>
  );

  // Render the selected loader variant
  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return <DotsLoader />;
      case "pulse":
        return <PulseLoader />;
      case "bar":
        return <BarLoader />;
      case "skeleton":
        return <SkeletonLoader />;
      case "modern":
        return <ModernSpinner />;
      case "spinner":
      default:
        return <SpinnerLoader />;
    }
  };

  // Main loader container with different modes
  const LoaderContent = () => (
    <div
      className={`
      flex flex-col items-center justify-center 
      ${fullScreen ? "min-h-screen" : "py-8"}
      ${overlay ? "bg-white/80 backdrop-blur-sm rounded-lg" : ""}
      transition-all duration-300
    `}
    >
      <div className="transform hover:scale-105 transition-transform duration-300">
        {renderLoader()}
      </div>

      {text && (
        <div
          className={`
          mt-4 font-medium text-gray-600 animate-pulse
          ${sizeConfig[size].text}
        `}
        >
          {text}
        </div>
      )}
    </div>
  );

  // Full screen overlay mode
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          {renderLoader()}
          {text && (
            <div
              className={`
              mt-4 font-medium text-gray-600 animate-pulse
              ${sizeConfig[size].text}
            `}
            >
              {text}
            </div>
          )}

          {/* Optional loading tips */}
          <div className="mt-6 max-w-sm mx-auto">
            <p className="text-xs text-gray-400 animate-fade-in">
              Pro tip: While you wait, take a deep breath and stretch! 🚀
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <LoaderContent />;
}

// Custom progress bar animation
const styles = `
  @keyframes progress {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-progress {
    animation: progress 1.5s ease-in-out infinite;
  }

  .animate-fade-in {
    animation: fade-in 0.5s ease-in-out;
  }
`;

// Add styles to document head
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

// Usage Examples:
/*
// Basic spinner (default)
<Loader />

// Different sizes
<Loader size="sm" />
<Loader size="lg" />
<Loader size="xl" />

// Different variants
<Loader variant="dots" text="Processing..." />
<Loader variant="pulse" text="Almost there" />
<Loader variant="bar" text="Loading content" />
<Loader variant="skeleton" />
<Loader variant="modern" text="Preparing your experience" />

// Full screen loading
<Loader fullScreen text="Loading ByteLMS..." />

// Overlay loader for cards
<Loader overlay text="Loading data..." />

// Custom text and size
<Loader size="lg" text="Please wait while we set things up..." variant="modern" />
*/
