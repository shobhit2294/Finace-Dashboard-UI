import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Pencil, Trash2, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Transaction, TransactionType, Category } from '@/types/finance';

const CATEGORIES: Category[] = [
  'Salary', 'Freelance', 'Investments', 'Food & Dining', 'Transportation',
  'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Rent', 'Travel', 'Education', 'Other',
];

export default function TransactionsList() {
  const {
    filteredTransactions, role, searchQuery, setSearchQuery,
    filterType, setFilterType, filterCategory, setFilterCategory,
    addTransaction, editTransaction, deleteTransaction,
  } = useApp();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const isAdmin = role === 'admin';

  const openAdd = () => { setEditingTx(null); setDialogOpen(true); };
  const openEdit = (tx: Transaction) => { setEditingTx(tx); setDialogOpen(true); };

  const handleExport = () => {
    const headers = ['Date', 'Description', 'Amount', 'Type', 'Category'];
    const rows = filteredTransactions.map(t => [t.date, t.description, t.amount, t.type, t.category]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'transactions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="font-heading font-semibold text-lg">Transactions</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
          {isAdmin && (
            <Button size="sm" onClick={openAdd}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={v => setFilterType(v as TransactionType | 'all')}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={v => setFilterCategory(v as Category | 'all')}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {filteredTransactions.length === 0 ? (
        <div className="glass-card rounded-lg p-10 text-center text-muted-foreground">
          No transactions found. {isAdmin && 'Click "Add" to create one.'}
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.map(tx => (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="glass-card rounded-lg p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${tx.type === 'income' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.category} · {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </span>
                  {isAdmin && (
                    <div className="flex gap-1 ml-2">
                      <button onClick={() => openEdit(tx)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteTransaction(tx.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <TransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editing={editingTx}
        onSave={(data) => {
          if (editingTx) editTransaction(editingTx.id, data);
          else addTransaction(data as Omit<Transaction, 'id'>);
          setDialogOpen(false);
        }}
      />
    </div>
  );
}

function TransactionDialog({
  open, onClose, editing, onSave,
}: {
  open: boolean;
  onClose: () => void;
  editing: Transaction | null;
  onSave: (data: Partial<Transaction>) => void;
}) {
  const [form, setForm] = useState({
    description: '', amount: '', type: 'expense' as TransactionType,
    category: 'Other' as Category, date: new Date().toISOString().slice(0, 10),
  });

  const resetForm = () => {
    if (editing) {
      setForm({
        description: editing.description,
        amount: String(editing.amount),
        type: editing.type,
        category: editing.category,
        date: editing.date,
      });
    } else {
      setForm({ description: '', amount: '', type: 'expense', category: 'Other', date: new Date().toISOString().slice(0, 10) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); else resetForm(); }}>
      <DialogContent className="sm:max-w-md" onOpenAutoFocus={() => resetForm()}>
        <DialogHeader>
          <DialogTitle className="font-heading">{editing ? 'Edit' : 'Add'} Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Description</Label>
            <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Amount</Label>
              <Input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as TransactionType }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as Category }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="w-full"
            disabled={!form.description || !form.amount}
            onClick={() => onSave({
              description: form.description,
              amount: parseFloat(form.amount),
              type: form.type,
              category: form.category,
              date: form.date,
            })}
          >
            {editing ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
