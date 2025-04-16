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
          task.isCompleted ? 'bg-gray-400 opacity-40' : 'bg-yellow-50'
        } hover:shadow-md`}
      >
        <h3 className="text-lg font-semibold text-green-950">{task.title}</h3>
        <p className="text-sm text-green-950">{task.description}</p>
      </div>
    )
  }