import React, { useState } from 'react';
import { Search, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookGallery({ books, onBookSelect }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-1">My Bookshelf</h2>
          <p className="text-slate-500 font-medium">
            Click any book to instantly generate an AI infographic.
          </p>
        </div>

        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search titles or authors..."
            className="bg-white border-2 border-slate-100 focus:border-blue-500 rounded-2xl py-3 pl-11 pr-6 w-full md:w-72 outline-none shadow-sm transition-all font-medium text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-8 flex items-center space-x-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {filteredBooks.length} of {books.length} books
        </span>
        <div className="flex items-center space-x-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
          <Sparkles size={11} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">AI Ready</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredBooks.map((book, i) => (
          <motion.button
            key={book.id ?? i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.4) }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px -12px rgba(59,130,246,0.2)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onBookSelect(book)}
            className="bg-white rounded-3xl p-6 border-2 border-slate-50 shadow-sm hover:border-blue-100 transition-all cursor-pointer group flex flex-col h-full text-left w-full"
          >
            {/* Icon */}
            <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors flex-shrink-0">
              <BookOpen
                className="text-slate-400 group-hover:text-white transition-colors"
                size={20}
              />
            </div>

            {/* Title & Author */}
            <h3 className="font-bold text-slate-900 leading-snug mb-1 line-clamp-2 flex-grow text-sm">
              {book.title}
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-4 truncate">{book.author}</p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest group-hover:text-blue-700 transition-colors">
                Generate Insight
              </span>
              <Sparkles size={13} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.button>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p className="font-bold text-lg">No books match your search.</p>
        </div>
      )}
    </div>
  );
}
