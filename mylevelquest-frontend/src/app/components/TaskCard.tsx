type Task = {
    id: number
    title: string
    description: string
    isCompleted: boolean
    type: 'side' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  }
  
  type Props = {
    task: Task
    onClick?: (task: Task) => void
}
  
  export default function TaskCard({ task, onClick }: Props) {
    return (
      <div
        onClick={() => onClick?.(task)}
        className={`rounded-xl border p-4 shadow-sm cursor-pointer transition ${
          task.isCompleted ? 'bg-gray-200 opacity-50' : 'bg-white'
        } hover:shadow-md`}
      >
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <p className="text-sm text-gray-600">{task.description}</p>
      </div>
    )
  }