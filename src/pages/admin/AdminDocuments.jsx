import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/apiClient';
import { FileText, Plus, Trash2, ShieldCheck } from 'lucide-react';

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    const data = await apiRequest('/documents');
    setDocuments(data || []);
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این سند اطمینان دارید؟')) return;
    try {
      await apiRequest(`/documents/${id}`, { method: 'DELETE' });
      loadDocs();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-950">مجوزها و اسناد اعتبار</h2>
        <p className="text-xs text-slate-500 mt-1">مدیریت تاییدیه‌ها، کدهای سازمانی و استانداردهای ایزو</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <ShieldCheck className="w-6 h-6 text-turquoise-600" />
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{doc.documentNumber}</span>
              </div>
              <h3 className="text-sm font-bold text-navy-950">{doc.title}</h3>
              <p className="text-xs text-slate-500">{doc.issuer}</p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
              <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
