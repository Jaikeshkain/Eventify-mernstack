export default function LoadingSpinner() {
  return (
    <div className="flex items-center bg-gradient-to-b from-[#050b2c] to-[#0a1854] justify-center min-h-[93vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffa509]"></div>
    </div>
  );
} 