import React, { useState, useMemo } from 'react';
import { AppShell, ProgressBar } from '@/components/app-shell';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  X, 
  CheckCircle2, 
  Layers, 
  BookMarked,
  Filter,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const UPSC_PAPERS = [
  'UPSC GS Paper I',
  'UPSC GS Paper II',
  'UPSC GS Paper III',
  'UPSC GS Paper IV',
  'UPSC CSAT',
  'UPSC Optional'
];

const MPSC_PAPERS = [
  'MPSC GS Paper I',
  'MPSC GS Paper II',
  'MPSC GS Paper III',
  'MPSC GS Paper IV',
  'MPSC Language Paper'
];

export default function Syllabus({ subjects = [], onAddSubject, onEditSubject, onDeleteSubject, onSignOut }) {
  const [search, setSearch] = useState('');
  const [examFilter, setExamFilter] = useState('ALL'); // 'ALL' | 'UPSC' | 'MPSC'
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    exam: 'UPSC',
    paper: 'UPSC GS Paper II',
    topics: 6,
    imageUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Filtered Subjects
  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const sExam = s.exam || (s.id?.startsWith('mpsc') || s.name?.toLowerCase().includes('maharashtra') ? 'MPSC' : 'UPSC');
      const matchExam = examFilter === 'ALL' || sExam === examFilter;
      const matchSearch = (s.name || '').toLowerCase().includes(search.toLowerCase());
      return matchExam && matchSearch;
    });
  }, [subjects, search, examFilter]);

  const upscCount = subjects.filter(s => (s.exam || (s.id?.startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'UPSC').length;
  const mpscCount = subjects.filter(s => (s.exam || (s.id?.startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'MPSC').length;
  const totalTopics = subjects.reduce((sum, s) => sum + (Number(s.topics) || 0), 0);
  const totalCompleted = subjects.reduce((sum, s) => sum + (Number(s.completed) || 0), 0);
  const avgCompletion = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

  async function handleAddSubject(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Subject name is required');
      return;
    }
    setSubmitting(true);
    try {
      await onAddSubject({
        name: form.name.trim(),
        exam: form.exam,
        paper: form.paper,
        topics: Number(form.topics) || 0,
        imageUrl: form.imageUrl?.trim() || null
      });
      toast.success(`Subject "${form.name}" added to ${form.exam} syllabus`);
      setForm({ name: '', exam: 'UPSC', paper: 'UPSC GS Paper II', topics: 6, imageUrl: '' });
      setShowAddModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to add subject');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateSubject(e) {
    e.preventDefault();
    if (!editTarget || !editTarget.name.trim()) return;
    setSubmitting(true);
    try {
      await onEditSubject(editTarget.id, {
        name: editTarget.name.trim(),
        exam: editTarget.exam || 'UPSC',
        paper: editTarget.paper,
        topics: Number(editTarget.topics) || 0,
        imageUrl: editTarget.imageUrl?.trim() || null
      });
      toast.success(`Subject "${editTarget.name}" updated`);
      setEditTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to update subject');
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await onDeleteSubject(deleteTarget.id);
      toast.success(`Subject "${deleteTarget.name}" removed`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete subject');
    }
  }

  return (
    <AppShell title="Syllabus" onSignOut={onSignOut}>
      <div className="flex flex-col gap-6">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="card-surface p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Modules
              </p>
              <p className="mt-1 text-3xl font-extrabold">{subjects.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Both Exam Curricula</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>

          <div className="card-surface p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                🏛️ UPSC Modules
              </p>
              <p className="mt-1 text-3xl font-extrabold text-blue-500">{upscCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Civil Services subjects</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 grid place-items-center">
              <Layers className="h-6 w-6" />
            </div>
          </div>

          <div className="card-surface p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                🚩 MPSC Modules
              </p>
              <p className="mt-1 text-3xl font-extrabold text-amber-500">{mpscCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Maharashtra State subjects</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 grid place-items-center">
              <BookMarked className="h-6 w-6" />
            </div>
          </div>

          <div className="card-surface p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mastery Rate
              </p>
              <p className="mt-1 text-3xl font-extrabold text-emerald-500">
                {avgCompletion}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">{totalCompleted}/{totalTopics} topics</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 grid place-items-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Action Bar & Exam Switcher */}
        <div className="card-surface p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subject title..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Exam Segment Filter */}
            <div className="flex items-center rounded-lg border bg-muted/40 p-1 text-xs font-semibold w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setExamFilter('ALL')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  examFilter === 'ALL'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Curricula ({subjects.length})
              </button>
              <button
                type="button"
                onClick={() => setExamFilter('UPSC')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  examFilter === 'UPSC'
                    ? 'bg-background shadow-sm text-blue-500 font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🏛️ UPSC ({upscCount})
              </button>
              <button
                type="button"
                onClick={() => setExamFilter('MPSC')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  examFilter === 'MPSC'
                    ? 'bg-background shadow-sm text-amber-500 font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🚩 MPSC ({mpscCount})
              </button>
            </div>
          </div>

          {/* Add Subject Button */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Subject</span>
          </button>
        </div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSubjects.length === 0 ? (
            <div className="col-span-full card-surface py-14 text-center text-muted-foreground">
              <BookMarked className="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
              <p className="font-semibold text-foreground">No syllabus subjects found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {search || examFilter !== 'ALL'
                  ? 'Try adjusting your search query or exam filter.'
                  : 'Click "+ Add New Subject" to configure the syllabus.'}
              </p>
            </div>
          ) : (
            filteredSubjects.map((s) => {
              const sExam = s.exam || (s.id?.startsWith('mpsc') || s.name?.toLowerCase().includes('maharashtra') ? 'MPSC' : 'UPSC');
              const isMp = sExam === 'MPSC';
              const completed = Number(s.completed) || 0;
              const topics = Number(s.topics) || 1;
              const percent = Math.min(100, Math.round((completed / topics) * 100));

              return (
                <div
                  key={s.id}
                  className="card-surface p-5 flex flex-col justify-between gap-4 hover:border-primary/50 transition-all border"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                            isMp
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          }`}
                        >
                          {isMp ? '🚩 MPSC' : '🏛️ UPSC'}
                        </span>
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-accent text-accent-foreground border border-border">
                          {s.paper}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditTarget(s)}
                          className="h-8 w-8 grid place-items-center rounded-lg border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Edit Subject"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(s)}
                          className="h-8 w-8 grid place-items-center rounded-lg border text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {s.imageUrl ? (
                        <img
                          src={s.imageUrl}
                          alt={s.name}
                          className="h-10 w-10 rounded-lg object-cover border border-border shadow-xs shrink-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border ${isMp ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                          <BookOpen className="h-5 w-5" />
                        </div>
                      )}
                      <h3 className="font-bold text-base text-foreground tracking-tight leading-snug">{s.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Completion Progress</span>
                      <span className="font-semibold text-foreground">
                        {completed} / {topics} topics ({percent}%)
                      </span>
                    </div>
                    <ProgressBar value={percent} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-xs">
          <div className="card-surface p-6 w-full max-w-md shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Add Syllabus Subject</h3>
                <p className="text-xs text-muted-foreground">Configure curriculum module for aspirants</p>
              </div>
            </div>

            <form onSubmit={handleAddSubject} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Exam Target
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, exam: 'UPSC', paper: 'UPSC GS Paper II' })}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                      form.exam === 'UPSC'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-border bg-background text-muted-foreground'
                    }`}
                  >
                    🏛️ UPSC Civil Services
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, exam: 'MPSC', paper: 'MPSC GS Paper I' })}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                      form.exam === 'MPSC'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'border-border bg-background text-muted-foreground'
                    }`}
                  >
                    🚩 MPSC Maharashtra
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Subject Title
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={form.exam === 'MPSC' ? 'e.g. Geography of Maharashtra' : 'e.g. Indian Polity & Governance'}
                  className="px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Exam Paper
                </label>
                <select
                  value={form.paper}
                  onChange={(e) => setForm({ ...form, paper: e.target.value })}
                  className="px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {(form.exam === 'MPSC' ? MPSC_PAPERS : UPSC_PAPERS).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Total Chapters / Topics
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={form.topics}
                  onChange={(e) => setForm({ ...form, topics: e.target.value })}
                  className="px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Subject Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={form.imageUrl || ''}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-xs">
          <div className="card-surface p-6 w-full max-w-md shadow-2xl relative">
            <button
              type="button"
              onClick={() => setEditTarget(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                <Edit3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Edit Subject</h3>
                <p className="text-xs text-muted-foreground">Modify syllabus settings</p>
              </div>
            </div>

            <form onSubmit={handleUpdateSubject} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Exam Target
                </label>
                <select
                  value={editTarget.exam || 'UPSC'}
                  onChange={(e) => setEditTarget({ ...editTarget, exam: e.target.value })}
                  className="px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="UPSC">🏛️ UPSC Civil Services</option>
                  <option value="MPSC">🚩 MPSC Maharashtra</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Subject Title
                </label>
                <input
                  type="text"
                  required
                  value={editTarget.name}
                  onChange={(e) => setEditTarget({ ...editTarget, name: e.target.value })}
                  className="px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Exam Paper
                </label>
                <input
                  type="text"
                  required
                  value={editTarget.paper}
                  onChange={(e) => setEditTarget({ ...editTarget, paper: e.target.value })}
                  className="px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Total Chapters / Topics
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={editTarget.topics}
                  onChange={(e) => setEditTarget({ ...editTarget, topics: e.target.value })}
                  className="px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Subject Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={editTarget.imageUrl || ''}
                  onChange={(e) => setEditTarget({ ...editTarget, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Subject Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-xs">
          <div className="card-surface p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <div className="h-10 w-10 rounded-xl bg-destructive/10 grid place-items-center">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Delete Subject?</h3>
                <p className="text-xs text-muted-foreground">This removes it from student syllabus.</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove <span className="font-semibold text-foreground">{deleteTarget.name}</span> ({deleteTarget.paper})?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90"
              >
                Delete Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
