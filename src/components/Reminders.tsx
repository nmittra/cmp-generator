import { useState } from 'react';
import { Bell, Calendar, CheckCircle, Clock, AlertTriangle, Plus, Crown, Filter } from 'lucide-react';
import { ContractManagementPlan, UserProfile, Reminder } from '../types';

interface RemindersProps {
  cmp: ContractManagementPlan | null;
  user: UserProfile;
  onUpgrade: () => void;
}

export function Reminders({ cmp, user, onUpgrade }: RemindersProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('all');
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', dueDate: '', type: 'review' as Reminder['type'] });

  const reminders = cmp?.reminders || [];

  const getDaysUntil = (date: Date) => {
    return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const filteredReminders = reminders.filter(r => {
    const daysUntil = getDaysUntil(r.dueDate);
    switch (filter) {
      case 'upcoming': return !r.completed && daysUntil > 0 && daysUntil <= 30;
      case 'overdue': return !r.completed && daysUntil < 0;
      case 'completed': return r.completed;
      default: return true;
    }
  });

  const typeIcons: Record<string, any> = {
    review: Clock,
    milestone: Calendar,
    kpi: AlertTriangle,
    report: Bell,
    custom: Bell,
  };

  const typeColors: Record<string, string> = {
    review: 'bg-blue-100 text-blue-600',
    milestone: 'bg-purple-100 text-purple-600',
    kpi: 'bg-amber-100 text-amber-600',
    report: 'bg-emerald-100 text-emerald-600',
    custom: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reminders & Notifications</h1>
          <p className="text-slate-500 text-sm">Never miss a contract review, KPI assessment, or milestone</p>
        </div>
        <button
          onClick={() => setShowAddReminder(!showAddReminder)}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Reminder
        </button>
      </div>

      {/* Premium notice for advanced reminders */}
      {user.tier === 'free' && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Crown className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Unlock Advanced Reminders</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Premium includes: email notifications, SMS alerts, calendar integration, and automated reminder scheduling based on contract terms.
            </p>
            <button onClick={onUpgrade} className="mt-2 text-xs bg-amber-500 text-white px-3 py-1.5 rounded font-medium hover:bg-amber-600 transition-colors">
              Upgrade to Premium
            </button>
          </div>
        </div>
      )}

      {/* Add Reminder Form */}
      {showAddReminder && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Add New Reminder</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                value={newReminder.title}
                onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Quarterly Review"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                value={newReminder.dueDate}
                onChange={(e) => setNewReminder(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                value={newReminder.type}
                onChange={(e) => setNewReminder(prev => ({ ...prev, type: e.target.value as Reminder['type'] }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="review">Review</option>
                <option value="milestone">Milestone</option>
                <option value="kpi">KPI Assessment</option>
                <option value="report">Report Due</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Create Reminder
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        {(['all', 'upcoming', 'overdue', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'all' && ` (${reminders.length})`}
          </button>
        ))}
      </div>

      {/* Reminder list */}
      <div className="space-y-3">
        {filteredReminders.length > 0 ? (
          filteredReminders.map(reminder => {
            const daysUntil = getDaysUntil(reminder.dueDate);
            const Icon = typeIcons[reminder.type] || Bell;
            const isOverdue = daysUntil < 0 && !reminder.completed;
            const isUrgent = daysUntil >= 0 && daysUntil <= 7 && !reminder.completed;

            return (
              <div
                key={reminder.id}
                className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-all ${
                  reminder.completed ? 'border-slate-200 opacity-60' :
                  isOverdue ? 'border-red-200 bg-red-50' :
                  isUrgent ? 'border-amber-200 bg-amber-50' :
                  'border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[reminder.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${reminder.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {reminder.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">
                      Due: {new Date(reminder.dueDate).toLocaleDateString('en-GB')}
                    </span>
                    {!reminder.completed && (
                      <span className={`text-xs font-medium ${
                        isOverdue ? 'text-red-600' :
                        isUrgent ? 'text-amber-600' :
                        'text-slate-500'
                      }`}>
                        {isOverdue ? `${Math.abs(daysUntil)} days overdue` :
                         daysUntil === 0 ? 'Today' :
                         daysUntil === 1 ? 'Tomorrow' :
                         `In ${daysUntil} days`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[reminder.type]}`}>
                    {reminder.type}
                  </span>
                  {!reminder.completed && (
                    <button className="text-emerald-500 hover:text-emerald-600 transition-colors" title="Mark complete">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No reminders found</p>
            <p className="text-sm text-slate-400 mt-1">
              {filter === 'all' ? 'Upload a contract to generate automatic reminders' : 'Try a different filter'}
            </p>
          </div>
        )}
      </div>

      {/* Auto-generated reminders info */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <h3 className="font-medium text-slate-700 text-sm mb-2">Auto-generated reminders include:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
          <span>• Quarterly performance reviews</span>
          <span>• Monthly risk register reviews</span>
          <span>• KPI assessment deadlines</span>
          <span>• Financial reporting dates</span>
          <span>• Contract anniversary reviews</span>
          <span>• Exit strategy planning triggers</span>
          <span>• Social value reporting</span>
          <span>• Compliance audit dates</span>
        </div>
      </div>
    </div>
  );
}
