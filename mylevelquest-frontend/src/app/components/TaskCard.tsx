// components/TaskCard.tsx
type Task = {
    id: number
    title: string
    description: string
    completed: boolean
    type: 'side' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  }
  
  export default function TaskCard({ task }: { task: Task }) {
    return (
      <div
        className={`rounded-xl border p-4 shadow-sm cursor-pointer transition ${
          task.completed ? 'bg-gray-200 opacity-50' : 'bg-white'
        } hover:shadow-md`}
      >
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <p className="text-sm text-gray-600">{task.description}</p>
      </div>
    )
  }