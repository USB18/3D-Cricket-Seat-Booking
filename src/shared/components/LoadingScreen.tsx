import './LoadingScreen.css'

export default function LoadingScreen({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="loading-screen" role="status">
      {message}
    </div>
  )
}
