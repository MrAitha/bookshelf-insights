import React, { useCallback } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export default function CSVUploader({ onDataLoaded }) {
  const onFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const books = results.data.map((row, index) => ({
          id: row['Book Id'] || index,
          title: row['Title'],
          author: row['Author'],
          rating: row['My Rating'],
          avgRating: row['Average Rating'],
          cover: null,
          dateRead: row['Date Read'],
        })).filter(b => b.title && b.author);
        
        onDataLoaded(books);
      },
    });
  }, [onDataLoaded]);

  return (
    <div className="w-full max-w-xl mx-auto p-8 rounded-[2.5rem] border-2 border-dashed border-blue-200 bg-white hover:bg-blue-50/50 transition-all group flex flex-col items-center justify-center text-center shadow-sm">
      <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-blue-200 group-hover:scale-105 transition-transform">
        <Upload className="text-white w-10 h-10" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-2">Upload your Goodreads CSV</h3>
      <p className="text-slate-500 mb-8 max-w-xs font-medium">
        Select the export file from your Goodreads settings to begin the visualization process.
      </p>
      
      <label className="bg-slate-900 hover:bg-blue-600 text-white font-black py-4 px-10 rounded-2xl cursor-pointer transition-all active:scale-95 shadow-xl shadow-slate-200 flex items-center space-x-3 uppercase tracking-widest text-xs">
        <FileText className="w-5 h-5" />
        <span>Browse Files</span>
        <input type="file" className="hidden" accept=".csv" onChange={onFileChange} />
      </label>
      
      <div className="mt-10 flex items-center space-x-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        <span className="flex items-center"><CheckCircle className="w-3 h-3 mr-1.5 text-blue-500" /> Client-Side Only</span>
        <span className="flex items-center"><CheckCircle className="w-3 h-3 mr-1.5 text-blue-500" /> AI Ready</span>
      </div>
    </div>
  );
}
