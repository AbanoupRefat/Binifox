export function ErrorFallback({ message }: { message: string }) {
  return (
    <div className="py-20 text-center">
      <p className="text-muted-foreground mb-4">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
      >
        Retry
      </button>
    </div>
  )
}
