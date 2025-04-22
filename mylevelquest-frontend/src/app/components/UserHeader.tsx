type Props = {
  username: string;
  level: number;
  xp: number;
  onLogout: () => void;  
};

export default function UserHeader({ username, level, xp, onLogout }: Props) {
  const xpForNextLevel = 10;
  const xpProgress = (xp % xpForNextLevel) / xpForNextLevel * 100;
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-green-950">Welcome! {username}</h1>

      <div className="flex-grow mx-10">
        <div className="h-4 bg-yellow-100 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-green-700 transition-all"
            style={{ width: `${xpProgress}%` }}
          />
          <span className="absolute inset-0 flex justify-center items-center text-green-950 text-sm font-semibold">
            EXP
          </span>
        </div>
      </div>

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