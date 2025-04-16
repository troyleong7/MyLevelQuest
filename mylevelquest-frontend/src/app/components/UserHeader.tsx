type Props = {
  username: string;
  level: number;
  onLogout: () => void;  
};

export default function UserHeader({ username, level, onLogout }: Props) {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-green-950">Welcome! {username}</h1>
      <div className="flex items-center space-x-4">
        <div className="text-xl text-yellow-600 font-medium">Level {level}</div>
        <button
          className="bg-red-100 hover:bg-red-300 text-red-600 font-semibold px-4 py-2 rounded shadow"
          onClick={onLogout}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}