type Props = {
    username: string
    level: number
  }
  
  export default function UserHeader({ username, level }: Props) {
    return (
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-900">Welcome! {username}</h1>
        <div className="text-xl text-purple-600 font-medium">Level {level}</div>
      </div>
    )
  }