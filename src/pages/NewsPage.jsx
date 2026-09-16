import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchNews } from '../services/newsService';
import { Newspaper, Calendar, Clock, ArrowLeft, Search, Tag } from 'lucide-react';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchNews()
      .then((items) => setNews(items))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['همه', 'اطلاعیه مهم', 'افتخارات قرآنی', 'توسعه فناوری', 'رویداد و آموزش خانواده'];

  const filteredNews = news.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase()) || item.summary?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'همه' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-b from-navy-950 to-navy-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="inline-block px-4 py-1.5 bg-turquoise-500/20 text-turquoise-300 border border-turquoise-500/30 rounded-full text-xs font-semibold">
            پایگاه اطلاع‌رسانی رسمی
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            اخبار، اطلاعیه‌ها و رویدادهای هدی
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            تازه‌ترین گزارش‌های آموزشی، درخشش‌های قرآنی و اطلاعیه‌های رسمی مدارس زیرمجموعه مجتمع هدی
          </p>

          {/* Search & Filter Bar */}
          <div className="max-w-2xl mx-auto pt-6">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جست‌وجو در عناوین و متن اطلاعیه‌ها..."
                className="w-full bg-navy-850/90 border border-navy-700/80 rounded-2xl px-5 py-3.5 pr-12 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-turquoise-400 shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="bg-white border-b border-slate-200 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-turquoise-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* News Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-turquoise-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-500 text-sm">در حال بارگذاری اخبار...</p>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-turquoise-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={item.thumbnail || item.coverImageUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 px-3 py-1 bg-navy-950/80 backdrop-blur-md text-turquoise-300 text-xs font-semibold rounded-full border border-white/10">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date || new Date(item.publishedAt).toLocaleDateString('fa-IR')}</span>
                      </span>
                      {item.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.readTime}</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-navy-950 leading-snug group-hover:text-turquoise-700 transition-colors">
                      {item.title}
                    </h2>

                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                  <Link
                    to={`/news/${item.slug || item.id}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-turquoise-700 hover:text-navy-950 transition-colors group-hover:gap-3"
                  >
                    <span>مطالعه کامل خبر</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-navy-950 mb-1">خبری یافت نشد</h3>
            <p className="text-slate-500 text-xs">موردی متناسب با فیلتر جست‌وجوی شما پیدا نشد.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
