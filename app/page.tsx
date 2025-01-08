import GoalTracker from '../components/GoalTracker'

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Quarterly Goal Tracker</h1>
      <GoalTracker />
    </main>
  )
}

