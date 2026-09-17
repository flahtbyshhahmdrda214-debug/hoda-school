import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchNewsBySlug } from '../services/newsService';
import { Calendar, ArrowRight, Eye } from 'lucide-react';
import { onDataChanged } from '../services/dataEvents';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = () => {
      fetchNewsBySlug(slug)
        .then((data) => {
          setArticle(data);
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => setLoading(false));
    };

    load();
    const unsub = onDataChanged(load);
    return () => unsub();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-turquoise-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-navy-950 mb-2">خبر مورد نظر یافت نشد</h2>
            <Link to="/news" className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white rounded-xl text-sm mt-4">
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به آرشیو اخبار</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumb */}
        <Link to="/news" className="inline-flex items-center gap-2 text-sm text-turquoise-700 hover:text-navy-950 mb-8 font-semibold transition-colors">
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به همه اخبار و اطلاعیه‌ها</span>
        </Link>

        <article className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
          {/* Cover Photo */}
          {(article.thumbnail || article.coverImageUrl) && (
            <div className="aspect-video w-full overflow-hidden bg-slate-100">
              <img
                src={article.thumbnail || article.coverImageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-12 space-y-6">
            {/* Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-turquoise-50 text-turquoise-700 rounded-full font-semibold border border-turquoise-200">
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{article.date || (article.publishedAt && new Date(article.publishedAt).toLocaleDateString('fa-IR'))}</span>
                </span>
              </div>
              {article.viewsCount !== undefined && (
                <div className="flex items-center gap-1 text-slate-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{article.viewsCount} بازدید</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 leading-tight">
              {article.title}
            </h1>

            {/* Summary Lead */}
            {article.summary && (
              <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
                {article.summary}
              </p>
            )}

            {/* Full Body / HTML */}
            <div className="prose prose-slate max-w-none text-slate-800 text-base leading-loose pt-4">
              {article.contentHtml ? (
                <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
              ) : (
                <p className="whitespace-pre-line">{article.content}</p>
              )}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
