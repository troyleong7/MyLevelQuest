'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TaskCard from '../components/TaskCard'
import UserHeader from '../components/UserHeader'

type Task = {
    id: number;
    title: string;
    description: string;
    type: 'side' | 'daily' | 'weekly' | 'monthly' | 'yearly'
    completed: boolean;
};
  
export default function DashboardPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/login');
        } else {
          setIsAuthenticated(true);
          // TODO: Replace with real API call
          const mockTasks: Task[] = [
            { id: 1, title: 'Slay 3 goblins', description: 'Go to the goblin camp...', type: 'daily', completed: false },
            { id: 2, title: 'Collect herbs', description: 'Needed for potion crafting', type: 'weekly', completed: true },
            { id: 3, title: 'Rescue the cat', description: 'It’s stuck in a tree again!', type: 'side', completed: false },
          ];
          setTasks(mockTasks);
        }
      }, []);
    
      if (!isAuthenticated) return null;
    
      // Group tasks by type
      const grouped: Record<'side' | 'daily' | 'weekly' | 'monthly' | 'yearly', Task[]> = {
          daily: [],
          weekly: [],
          side: [],
          monthly: [],
          yearly: []
      };
    
      tasks.forEach(task => {
        grouped[task.type].push(task);
      });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-grey to-purple-200 p-6">
    <UserHeader username="PlanetSavior123" level={3} />

    <div className="grid md:grid-cols-5 gap-6 mt-6">
        {(['side', 'daily', 'weekly', 'monthly', 'yearly'] as const).map(type => (
        <div key={type} className="bg-white rounded-2xl shadow-md p-4 border border-purple-100">
            <h2 className="text-xl font-bold mb-4 capitalize text-purple-700">{type} Tasks</h2>
            <div className="space-y-4">
            {grouped[type].length === 0 ? (
                <p className="text-gray-400 italic">No {type} quests yet</p>
            ) : (
                grouped[type].map(task => (
                <TaskCard key={task.id} task={task} />
                ))
            )}
            </div>
        </div>
        ))}
    </div>
    </div>
  );
}