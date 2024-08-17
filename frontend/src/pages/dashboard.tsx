import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Trophy, List, Star, Target } from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
}

interface Challenge {
  id: string;
  title: string;
  progress: number;
  reward: number;
}

interface DashboardProps {
  username: string;
}

const Dashboard: React.FC<DashboardProps> = ({ username }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    // TODO: Fetch data from API
    const mockExpenses: Expense[] = [
      { id: '1', amount: 50, category: 'Food', date: '2024-08-10' },
      { id: '2', amount: 100, category: 'Transportation', date: '2024-08-12' },
      { id: '3', amount: 75, category: 'Entertainment', date: '2024-08-15' },
    ];
    setExpenses(mockExpenses);
    setTotalSpent(mockExpenses.reduce((sum, expense) => sum + expense.amount, 0));
    setPoints(1250);
    setLevel(3);
    setChallenges([
      { id: '1', title: 'Log expenses daily for a week', progress: 70, reward: 100 },
      { id: '2', title: 'Stay under budget this month', progress: 40, reward: 200 },
    ]);
  }, []);

  const chartData = expenses.map(expense => ({
    date: expense.date,
    amount: expense.amount
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {username}!</h1>
        <div className="text-right">
          <p className="text-xl font-semibold">Level {level}</p>
          <p className="text-sm text-gray-500">{points} points</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${totalSpent.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expenses This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{expenses.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Next Reward</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">50 points away</p>
            <Progress value={80} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Expense Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Active Challenges</h2>
        {challenges.map(challenge => (
          <Card key={challenge.id} className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={challenge.progress} className="mb-2" />
              <p className="text-sm text-gray-500">Reward: {challenge.reward} points</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex space-x-4">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
        <Button variant="outline">
          <List className="mr-2 h-4 w-4" /> View All Expenses
        </Button>
        <Button variant="outline">
          <Trophy className="mr-2 h-4 w-4" /> View Achievements
        </Button>
        <Button variant="outline">
          <Target className="mr-2 h-4 w-4" /> Set Budget
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;