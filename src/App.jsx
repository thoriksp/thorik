import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Target, Edit2, Check, X, Zap, Calendar, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BudgetTracker() {
  const [transactions, setTransactions] = useState([]);
  const [bulkInput, setBulkInput] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [type, setType] = useState('pengeluaran');
  const [targets, setTargets] = useState([
    { id: 1, name: 'Ortu', target: 2000000, spent: 0, keywords: ['ortu', 'orang tua', 'orangtua'] },
    { id: 2, name: 'Tabungan', target: 1000000, spent: 0, keywords: ['tabungan', 'nabung', 'saving'] },
    { id: 3, name: 'Cicilan', target: 500000, spent: 0, keywords: ['cicilan', 'bayar cicilan'] }
  ]);
  const [editingTarget, setEditingTarget] = useState(null);
  const [newTargetName, setNewTargetName] = useState('');
  const [newTargetAmount, setNewTargetAmount] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(true);
  
  // Filter states
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [chartWeekOffset, setChartWeekOffset] = useState(0);

  const categories = {
    pengeluaran: ['Makanan', 'Transport', 'Belanja', 'Tagihan', 'Hiburan', 'Kesehatan', 'Ortu', 'Tabungan', 'Cicilan', 'Lainnya'],
    pemasukan: ['Gaji', 'Bonus', 'Hadiah', 'Lainnya']
  };

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  };

  const filteredTransactions = transactions.filter(t => {
    if (!filterStartDate && !filterEndDate) return true;
    
    const transDate = parseDate(t.date);
    const startDate = filterStartDate ? new Date(filterStartDate) : null;
    const endDate = filterEndDate ? new Date(filterEndDate) : null;
    
    if (startDate && endDate) {
      return transDate >= startDate && transDate <= endDate;
    } else if (startDate) {
      return transDate >= startDate;
    } else if (endDate) {
      return transDate <= endDate;
    }
    return true;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'pemasukan')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'pengeluaran')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Update target spent amounts based on transactions
  useEffect(() => {
    const updatedTargets = targets.map(target => {
      const spent = transactions
        .filter(t => t.type === 'pengeluaran' && t.category === target.name)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...target, spent };
    });
    setTargets(updatedTargets);
  }, [transactions]);

  // Get weekly data for chart
  const getWeeklyData = () => {
    const weekDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const today = new Date();
    const data = [];
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (chartWeekOffset * 7) - 6);
    
    let startDateStr = '';
    let endDateStr = '';

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = date.toLocaleDateString('id-ID');
      const dayName = weekDays[date.getDay()];

      if (i === 0) startDateStr = dateStr;
      if (i === 6) endDateStr = dateStr;

      const dayIncome = transactions
        .filter(t => t.type === 'pemasukan' && t.date === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);

      const dayExpense = transactions
        .filter(t => t.type === 'pengeluaran' && t.date === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        day: `${dayName}\n${date.getDate()}/${date.getMonth() + 1}`,
        Pemasukan: dayIncome,
        Pengeluaran: dayExpense
      });
    }

    return { data, startDateStr, endDateStr };
  };

  const parseAmount = (amountStr) => {
    const cleaned = amountStr.toLowerCase().replace(/\s/g, '');
    
    if (cleaned.includes('k')) {
      return parseFloat(cleaned.replace('k', '')) * 1000;
    }
    if (cleaned.includes('jt') || cleaned.includes('juta')) {
      return parseFloat(cleaned.replace(/jt|juta/g, '')) * 1000000;
    }
    return parseFloat(cleaned);
  };

  const detectCategory = (description) => {
    const lowerDesc = description.toLowerCase();
    
    for (const target of targets) {
      for (const keyword of target.keywords) {
        if (lowerDesc.includes(keyword)) {
          return target.name;
        }
      }
    }
    
    const keywords = {
      'Makanan': ['makan', 'sarapan', 'lunch', 'dinner', 'nasi', 'ayam', 'snack', 'cemilan', 'kopi', 'minum', 'food', 'resto', 'warteg', 'mie', 'bakso'],
      'Transport': ['bensin', 'grab', 'gojek', 'ojol', 'parkir', 'tol', 'transport', 'angkot', 'bus', 'kereta', 'travel'],
      'Belanja': ['belanja', 'indomaret', 'alfamart', 'supermarket', 'grocery', 'shopee', 'tokopedia', 'lazada', 'beli'],
      'Hiburan': ['nonton', 'bioskop', 'game', 'streaming', 'spotify', 'netflix', 'jalan', 'wisata', 'karaoke', 'fm', 'mall'],
      'Tagihan': ['listrik', 'air', 'pdam', 'internet', 'wifi', 'pulsa', 'token', 'tagihan', 'bayar'],
      'Kesehatan': ['obat', 'dokter', 'rumah sakit', 'klinik', 'vitamin', 'apotek', 'medical']
    };
    
    for (const [cat, words] of Object.entries(keywords)) {
      if (words.some(word => lowerDesc.includes(word))) {
        return cat;
      }
    }
    
    return 'Lainnya';
  };

  const handleBulkInput = () => {
    if (!bulkInput.trim()) return;

    const lines = bulkInput.split('\n').filter(line => line.trim());
    const newTransactions = [];
    const currentDate = new Date().toLocaleDateString('id-ID');

    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const desc = parts[0];
        const amountStr = parts[1];
        const amount = parseAmount(amountStr);
        const category = detectCategory(desc);

        if (desc && !isNaN(amount) && amount > 0) {
          newTransactions.push({
            id: Date.now() + Math.random(),
            description: desc,
            amount: amount,
            category: category,
            type: 'pengeluaran',
            date: currentDate
          });
        }
      }
    });

    if (newTransactions.length > 0) {
      setTransactions([...newTransactions, ...transactions]);
      setBulkInput('');
    }
  };

  const handleAddTransaction = () => {
    if (!description || !amount) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      type,
      date: new Date().toLocaleDateString('id-ID')
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setAmount('');
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleAddTarget = () => {
    if (!newTargetName || !newTargetAmount) return;
    
    const keywords = newTargetName.toLowerCase().split(' ');
    const newTarget = {
      id: Date.now(),
      name: newTargetName,
      target: parseFloat(newTargetAmount),
      spent: 0,
      keywords: keywords
    };
    
    setTargets([...targets, newTarget]);
    
    if (!categories.pengeluaran.includes(newTargetName)) {
      categories.pengeluaran.push(newTargetName);
    }
    
    setNewTargetName('');
    setNewTargetAmount('');
  };

  const handleEditTarget = (target) => {
    setEditingTarget(target.id);
  };

  const handleUpdateTarget = (id, newAmount) => {
    setTargets(targets.map(t => 
      t.id === id ? { ...t, target: parseFloat(newAmount) } : t
    ));
    setEditingTarget(null);
  };

  const handleDeleteTarget = (id) => {
    setTargets(targets.filter(t => t.id !== id));
  };

  const clearFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const { data: weeklyData, startDateStr, endDateStr } = getWeeklyData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          💰 Budget Tracker Harian
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pemasukan</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pengeluaran</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
              </div>
              <TrendingDown className="text-red-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(balance)}
                </p>
              </div>
              <DollarSign className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        {/* Quick Bulk Input */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Zap size={28} />
              Input Cepat - Langsung Banyak!
            </h2>
            <button
              onClick={() => setShowBulkInput(!showBulkInput)}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              {showBulkInput ? 'Sembunyikan' : 'Tampilkan'}
            </button>
          </div>
          
          {showBulkInput && (
            <>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">📝 <strong>Format:</strong> Deskripsi, Jumlah (bisa pakai k untuk ribu)</p>
                <p className="text-xs opacity-90">Contoh:</p>
                <p className="text-xs opacity-90 font-mono">makan siang, 15k</p>
                <p className="text-xs opacity-90 font-mono">jajan di fm, 20k</p>
                <p className="text-xs opacity-90 font-mono">ortu, 1000k</p>
              </div>
              
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="makan siang, 15k&#10;grab ke kantor, 25k&#10;ortu, 1000k&#10;kopi, 10k"
                className="w-full px-4 py-3 rounded-lg text-gray-800 h-32 resize-none focus:ring-2 focus:ring-purple-300 focus:outline-none"
              />
              
              <button
                onClick={handleBulkInput}
                className="w-full bg-white text-purple-600 font-bold py-3 rounded-lg mt-3 hover:bg-purple-50 transition flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                Tambahkan Semua Sekaligus!
              </button>
            </>
          )}
        </div>

        {/* Weekly Chart with Week Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              📊 Grafik Mingguan
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartWeekOffset(chartWeekOffset + 1)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
              >
                ← Minggu Lalu
              </button>
              <button
                onClick={() => setChartWeekOffset(Math.max(0, chartWeekOffset - 1))}
                disabled={chartWeekOffset === 0}
                className={`px-3 py-1 rounded-lg transition text-sm ${
                  chartWeekOffset === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Minggu Depan →
              </button>
            </div>
          </div>
          
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
              <Calendar size={18} />
              <span className="font-semibold">Periode: {startDateStr} - {endDateStr}</span>
            </span>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" style={{ fontSize: '12px' }} />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="Pemasukan" fill="#10b981" />
              <Bar dataKey="Pengeluaran" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Target Pengeluaran */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target size={24} />
            Target Pengeluaran Tetap
          </h2>
          
          <div className="space-y-4 mb-4">
            {targets.map(target => {
              const remaining = target.target - target.spent;
              const percentage = (target.spent / target.target) * 100;
              const isOverBudget = target.spent > target.target;

              return (
                <div key={target.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{target.name}</h3>
                      <button
                        onClick={() => handleEditTarget(target)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTarget(target.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {editingTarget === target.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={target.target}
                          className="w-32 px-2 py-1 border border-gray-300 rounded"
                          id={`edit-${target.id}`}
                        />
                        <button
                          onClick={() => {
                            const newValue = document.getElementById(`edit-${target.id}`).value;
                            handleUpdateTarget(target.id, newValue);
                          }}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check size={20} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-600">
                        Target: {formatCurrency(target.target)}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sudah dikeluarkan: <span className="font-semibold text-red-600">{formatCurrency(target.spent)}</span></span>
                      <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                        {isOverBudget ? 'Lebih' : 'Sisa'}: {formatCurrency(Math.abs(remaining))}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      {percentage.toFixed(1)}% dari target
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add New Target */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Tambah Target Baru</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTargetName}
                onChange={(e) => setNewTargetName(e.target.value)}
                placeholder="Nama target"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={newTargetAmount}
                onChange={(e) => setNewTargetAmount(e.target.value)}
                placeholder="Jumlah target"
                className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddTarget}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Manual Input Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Input Manual (Opsional)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe Transaksi
                </label>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setCategory(categories[e.target.value][0]);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pengeluaran">Pengeluaran</option>
                  <option value="pemasukan">Pemasukan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories[type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Makan siang di warteg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah (Rp)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleAddTransaction}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Plus size={20} />
                Tambah Transaksi
              </button>
            </div>
          </div>

          {/* Transaction List with Filter */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              Riwayat Transaksi
              <Filter size={20} className="text-gray-500" />
            </h2>
            
            {/* Date Filter */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">Filter Periode</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Dari Tanggal</label>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Sampai Tanggal</label>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              {(filterStartDate || filterEndDate) && (
                <button
                  onClick={clearFilters}
                  className="mt-3 w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reset Filter
                </button>
              )}
            </div>

            {filteredTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {filterStartDate || filterEndDate ? 'Tidak ada transaksi pada periode ini' : 'Belum ada transaksi'}
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTransactions.map(transaction => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          transaction.type === 'pemasukan' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.category}
                        </span>
                        <span className="text-xs text-gray-500">{transaction.date}</span>
                      </div>
                      <p className="font-medium mt-1 text-sm">{transaction.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className={`text-base font-semibold ${
                        transaction.type === 'pemasukan' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'pemasukan' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </p>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
