import React, { useState, useEffect, useCallback, useRef } from 'react';
import Papa from 'papaparse';
import BookGallery from './components/BookGallery';
import BookInfographic from './components/BookInfographic';
import { BookOpen, Sparkles, X, AlertTriangle, RefreshCw, Eye, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeBook } from './services/geminiService';

const SAMPLE = {
  id: 'sample',
  title: 'The Intelligent Investor',
  author: 'Benjamin Graham',
  quote: "The investor's chief problem — and even his worst enemy — is likely to be himself.",
  formula: 'Return = Intrinsic Value − Market Price + Margin of Safety',
  bannerColor: '#1E3A5F',
  framework: {
    title: 'The Value Investing Framework',
    columns: ['Principle', 'What It Means', 'How to Apply', 'Common Trap'],
    rows: [
      { icon: '🔍', cells: ['Intrinsic Value', 'Real worth of a business', 'Analyze earnings, assets & dividends', 'Confusing price with value'] },
      { icon: '🛡️', cells: ['Margin of Safety', 'Buy well below intrinsic value', 'Only buy at a significant discount', 'Overpaying for "growth"'] },
      { icon: '🎭', cells: ['Mr. Market', 'Market is your servant, not guide', 'Exploit irrationality to buy/sell', 'Reacting to daily price swings'] },
      { icon: '📊', cells: ['Investor Type', 'Know defensive vs enterprising', 'Match strategy to your time & effort', 'Overconfidence in stock picking'] },
    ],
  },
  takeaways: [
    { headline: 'Price ≠ Value', explanation: 'The market is a voting machine short-term and a weighing machine long-term. Focus on intrinsic value, never the ticker.', icon: '⚖️' },
    { headline: 'Margin of Safety', explanation: 'Never buy without a buffer against errors. The wider the discount to intrinsic value, the safer the bet.', icon: '🛡️' },
    { headline: 'Tame Mr. Market', explanation: 'The market offers prices daily. You can ignore, accept, or exploit it. Never let it dictate your emotions.', icon: '🎭' },
    { headline: 'Know Yourself', explanation: 'Be honest about your investor type. Most people should index — and simply be done with it.', icon: '🪞' },
    { headline: 'Discipline Beats IQ', explanation: 'Temperament and emotional control matter far more than raw intelligence when it comes to investing success.', icon: '🧘' },
  ],
  mistakes: [
    { wrong: 'Treating stocks like lottery tickets', right: 'Treating each share as part-ownership of a real business' },
    { wrong: 'Buying high because the market is rising', right: 'Buying low when Mr. Market is overly pessimistic' },
    { wrong: 'Speculating with your core savings', right: 'Keeping speculative money separate from investment capital' },
    { wrong: 'Checking your portfolio daily', right: 'Reviewing holdings quarterly with a long-term mindset' },
    { wrong: "Chasing last year's hot stocks", right: 'Seeking undervalued companies with strong fundamentals' },
  ],
};

function parseCSVRows(rows) {
  return rows
    .map((row, i) => ({
      id: row['Book Id'] || String(i),
      title: row['Title'],
      author: row['Author'] || row['Author l-f'],
      rating: row['My Rating'],
      avgRating: row['Average Rating'],
      dateRead: row['Date Read'],
    }))
    .filter(b => b.title && b.author);
}

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Auto-load the default CSV on mount
  useEffect(() => {
    fetch('/goodreads_export.csv')
      .then(res => {
        if (!res.ok) throw new Error('CSV not found');
        return res.text();
      })
      .then(text => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: results => {
            setBooks(parseCSVRows(results.data));
            setLoading(false);
          },
        });
      })
      .catch(() => setLoading(false)); // If not found, just show empty state
  }, []);

  // Handle user uploading a different CSV
  const handleFileUpload = useCallback(e => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => setBooks(parseCSVRows(results.data)),
    });
    // Reset input so same file can be re-selected
    e.target.value = '';
  }, []);

  const showSample = () => {
    setSelectedBook(SAMPLE);
    setAnalysis(SAMPLE);
    setAnalyzing(false);
    setError(null);
  };

  const handleBookSelect = async book => {
    setSelectedBook(book);
    setAnalysis(null);
    setError(null);
    setAnalyzing(true);
    try {
      const result = await analyzeBook(book.title, book.author, book.id);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to analyze. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClose = () => {
    setSelectedBook(null);
    setAnalysis(null);
    setError(null);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <BookOpen className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tight">BookShelf Insights</h1>
          </div>

          <div className="flex items-center gap-3">
            {books.length > 0 && (
              <span className="text-sm font-medium text-slate-400">{books.length} books</span>
            )}
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
              <Sparkles size={13} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">AI Engine Active</span>
            </div>
            {/* Upload different CSV */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-300 px-3 py-2 rounded-xl transition-all"
              title="Upload a different Goodreads CSV"
            >
              <Upload size={14} />
              {books.length > 0 ? 'Change CSV' : 'Upload CSV'}
            </button>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-6xl mx-auto py-12 px-6">
        {loading ? (
          /* Loading spinner while fetching default CSV */
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 font-medium">Loading your bookshelf...</p>
          </div>
        ) : books.length > 0 ? (
          <BookGallery books={books} onBookSelect={handleBookSelect} />
        ) : (
          /* Fallback empty state if CSV failed to load */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
              <BookOpen className="text-blue-400" size={36} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">No Books Found</h2>
            <p className="text-slate-500 mb-8 max-w-sm">Upload your Goodreads export CSV to get started, or preview a sample.</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl transition-colors"
              >
                <Upload size={18} /> Upload CSV
              </button>
              <button
                onClick={showSample}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 bg-blue-50 px-5 py-3 rounded-2xl transition-all"
              >
                <Eye size={16} /> Preview Sample
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Analysis Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />

            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-[2rem] p-8 w-[980px] max-w-[98vw] max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col items-center"
            >
              <button onClick={handleClose} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-10">
                <X size={20} />
              </button>

              {/* Loading */}
              {analyzing && (
                <div className="flex flex-col items-center py-16 space-y-6 w-full">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto text-blue-600" size={22} />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-slate-900 text-xl mb-1">Analyzing with Gemini AI...</p>
                    <p className="text-slate-400 text-sm">
                      Extracting insights from <span className="font-semibold text-slate-600">"{selectedBook.title}"</span>
                      <br /><span className="text-xs mt-1 block">If rate-limited, will auto-retry in ~20s</span>
                    </p>
                  </div>
                  <div className="flex space-x-1.5">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-2 h-2 bg-blue-400 rounded-full"
                        animate={{ y: [0, -8, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {!analyzing && error && (
                <div className="flex flex-col items-center py-16 space-y-4 text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="text-red-500" size={28} />
                  </div>
                  <p className="font-black text-slate-900 text-lg">Analysis Failed</p>
                  <p className="text-slate-500 text-sm max-w-xs">{error}</p>
                  <button onClick={() => handleBookSelect(selectedBook)}
                    className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors">
                    <RefreshCw size={15} /> Try Again
                  </button>
                </div>
              )}

              {/* Infographic */}
              {!analyzing && !error && analysis && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <BookInfographic book={{ ...selectedBook, ...analysis }} />
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="max-w-6xl mx-auto py-10 px-6 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Powered by Gemini AI &bull; Free Tier &bull; No Data Leaves Your Browser
        </p>
      </footer>
    </div>
  );
}

export default App;
