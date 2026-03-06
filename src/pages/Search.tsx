import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, Tag, Heart, Info, Frown, ChevronRight, Edit2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn, TAG_COLORS, TAG_GRADIENTS } from '../utils';
import { DiaryEntry } from '../types';

const TAGS = ['Special Moment', 'Important Information', 'Bad News'] as const;

export default function SearchPage() {
  const [searchType, setSearchType] = useState<'date' | 'month' | 'tag'>('date');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [month, setMonth] = useState(format(new Date(), 'MM'));
  const [year, setYear] = useState(format(new Date(), 'yyyy'));
  const [tag, setTag] = useState<typeof TAGS[number]>('Special Moment');
  const [results, setResults] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setResults([]);

    let url = '';
    if (searchType === 'date') url = `/api/diary/date/${date}`;
    else if (searchType === 'month') url = `/api/diary/month/${month}/${year}`;
    else if (searchType === 'tag') url = `/api/diary/tag/${tag}`;

    try {
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (searchType === 'date') {
        setResults(data ? [data] : []);
      } else {
        setResults(data || []);
      }
      if (!data || (Array.isArray(data) && data.length === 0)) {
        setError("No entries found for this search.");
      }
    } catch (err) {
      setError("Failed to fetch entries.");
    } finally {
      setLoading(false);
    }
  };

  const getTagIcon = (t: string) => {
    switch (t) {
      case 'Special Moment': return <Heart size={14} />;
      case 'Important Information': return <Info size={14} />;
      case 'Bad News': return <Frown size={14} />;
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
        <h1 className="text-2xl font-black text-slate-900">Search Diary</h1>
        <p className="text-slate-500 font-medium">Find your past memories</p>
      </header>

      <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200 border border-slate-100">
        <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl mb-6">
          {(['date', 'month', 'tag'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSearchType(type)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                searchType === type ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {searchType === 'date' && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Date</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
              />
            </div>
          )}

          {searchType === 'month' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                      {format(new Date(2024, i, 1), 'MMMM')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Year</label>
                <input 
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                />
              </div>
            </div>
          )}

          {searchType === 'tag' && (
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
          )}

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search Entries"}
            {!loading && <Search size={18} />}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {error && !loading && (
          <div className="text-center py-10">
            <p className="text-slate-400 font-medium">{error}</p>
          </div>
        )}

        <AnimatePresence>
          {results.map((entry, idx) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-3xl p-6 shadow-md border border-slate-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                    {format(parseISO(entry.date), 'EEEE, MMM do yyyy')}
                  </div>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border",
                    TAG_COLORS[entry.tag]
                  )}>
                    {getTagIcon(entry.tag)}
                    {entry.tag}
                  </div>
                </div>
                {searchType === 'date' && (
                   <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                     <Edit2 size={16} />
                   </div>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                {entry.content}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
