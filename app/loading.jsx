// app/loading.tsx  (ou app/dashboard/loading.tsx, etc.)
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-500">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Chargement en cours...</p>
      </div>
    </div>
  );
}