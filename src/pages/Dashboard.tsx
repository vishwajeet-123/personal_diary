import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Tag, Save, CheckCircle2, AlertCircle, Heart, Info, Frown } from 'lucide-react';
import { format } from 'date-fns';
import { cn, TAG_COLORS, TAG_GRADIENTS } from '../utils';

const TAGS = ['Special Moment', 'Important Information', 'Bad News'] as const;

export default function Dashboard({ user }: { user: any }) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<typeof TAGS[number]>('Special Moment');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);

  useEffect(() => {
    fetchEntry();
  }, [date]);

  const fetchEntry = async () => {
    setFetching(true);
    setEntryId(null);
    setContent('');
    try {
      const res = await fetch(`/api/diary/date/${date}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data) {
        setContent(data.content);
        setTag(data.tag);
        setEntryId(data._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const url = entryId ? `/api/diary/${entryId}` : '/api/diary';
      const method = entryId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ date, content, tag }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (!entryId) setEntryId(data._id);
      setMessage({ type: 'success', text: entryId ? "Entry updated successfully!" : "Entry saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const getTagIcon = (t: string) => {
    switch (t) {
      case 'Special Moment': return <Heart size={16} />;
      case 'Important Information': return <Info size={16} />;
      case 'Bad News': return <Frown size={16} />;
      default: return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <header className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Hello, {user.name.split(' ')[0]}!</h1>
        <p className="text-slate-500 font-medium">How was your day?</p>
      </header>

      <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200 border border-slate-100">
        <div className="flex flex-col gap-6">
          {/* Date Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
              />
            </div>
          </div>

          {/* Tag Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                    tag === t 
                      ? `${TAG_COLORS[t]} border-current` 
                      : "bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100"
                  )}
                >
                  {getTagIcon(t)}
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Your Entry</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-6 min-h-[300px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-slate-700 leading-relaxed font-medium"
            />
            {fetching && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-[1.5rem]">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold",
                message.type === 'success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
              )}
            >
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </motion.div>
          )}

          <button
            onClick={handleSave}
            disabled={loading || !content.trim() || fetching}
            className={cn(
              "w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50",
              entryId && "bg-indigo-500"
            )}
          >
            {loading ? "Saving..." : (entryId ? "Update Entry" : "Save Entry")}
            {!loading && <Save size={18} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
