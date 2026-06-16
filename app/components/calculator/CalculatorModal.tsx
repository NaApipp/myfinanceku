"use client";

import React, { useState } from 'react';
import { calculate, Operator } from '@/app/lib/calculator/basicCalc';
import { calculateEMI } from '@/app/lib/calculator/emiCalc';
import { calculateCompoundInterest } from '@/app/lib/calculator/compoundInterest';
import { calculateFutureValue } from '@/app/lib/calculator/futureValue';
import { calculateEmergencyFund } from '@/app/lib/calculator/emergencyFund';

type CalcTab = 'basic' | 'emi' | 'compound' | 'future' | 'emergency';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalculatorModal({ isOpen, onClose }: CalculatorModalProps) {
  const [activeTab, setActiveTab] = useState<CalcTab>('basic');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Kalkulator Finansial</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold">
            ✕
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b dark:border-gray-700 p-2 gap-2 bg-gray-50 dark:bg-gray-900/50" style={{scrollbarWidth: 'none'}}>
          {[
            { id: 'basic', label: 'Dasar' },
            { id: 'emi', label: 'Kredit (EMI)' },
            { id: 'compound', label: 'Bunga Majemuk' },
            { id: 'future', label: 'Nilai Masa Depan' },
            { id: 'emergency', label: 'Dana Darurat' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CalcTab)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 bg-white dark:bg-gray-800" style={{maxHeight: '60vh'}}>
          {activeTab === 'basic' && <BasicCalculator />}
          {activeTab === 'emi' && <EMICalculator />}
          {activeTab === 'compound' && <CompoundInterestCalculator />}
          {activeTab === 'future' && <FutureValueCalculator />}
          {activeTab === 'emergency' && <EmergencyFundCalculator />}
        </div>
      </div>
    </div>
  );
}

// 1. Basic Calculator
function BasicCalculator() {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForNewVal, setWaitingForNewVal] = useState(false);

  const formatDisplay = (val: string) => {
    if (val === 'Error' || val === 'NaN' || val === 'Infinity' || val === '-Infinity') return val;
    const parts = val.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? ',' + parts[1] : (val.endsWith('.') ? ',' : '');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedInteger + decimalPart;
  };

  const inputDigit = (digit: string) => {
    if (waitingForNewVal) {
      setDisplay(digit);
      setWaitingForNewVal(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForNewVal) {
      setDisplay('0.');
      setWaitingForNewVal(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevVal(null);
    setOperator(null);
    setWaitingForNewVal(false);
  };

  const performOperation = (nextOp: Operator | '=') => {
    const inputValue = parseFloat(display);

    if (prevVal == null) {
      setPrevVal(inputValue);
    } else if (operator) {
      const result = calculate(prevVal, inputValue, operator);
      setDisplay(String(result));
      setPrevVal(result);
    }

    setWaitingForNewVal(true);
    setOperator(nextOp === '=' ? null : nextOp as Operator);
  };

  return (
    <div className="flex flex-col gap-3 max-w-[280px] mx-auto">
      <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl text-right text-3xl font-mono overflow-x-auto dark:text-white">
        {formatDisplay(display)}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button onClick={clear} className="col-span-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-lg font-bold">C</button>
        <button onClick={() => performOperation('/')} className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-3 rounded-lg font-bold">÷</button>
        <button onClick={() => performOperation('*')} className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-3 rounded-lg font-bold">×</button>
        
        <button onClick={() => inputDigit('7')} className="bg-gray-100 dark:bg-gray-700 dark:text-white p-3 rounded-lg font-bold">7</button>
        <button onClick={() => inputDigit('8')} className="bg-gray-100 dark:bg-gray-700 dark:text-white p-3 rounded-lg font-bold">8</button>
        <button onClick={() => inputDigit('9')} className="bg-gray-100 dark:bg-gray-700 dark:text-white p-3 rounded-lg font-bold">9</button>
        <button onClick={() => performOperation('-')} className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-3 rounded-lg font-bold">-</button>
        
        <button onClick={() => inputDigit('4')} className="bg-gray-100 dark:bg-gray-700 dark:text-white p-3 rounded-lg font-bold">4</button>
        <button onClick={() => inputDigit('5')} className="bg-gray-100 dark:bg-gray-700 dark:text-white p-3 rounded-lg font-bold">5</button>
        <button onClick={() => inputDigit('6')} className="bg-gray-100 dark:bg-gray-700 dark:text-white p-3 rounded-lg font-bold">6</button>
        <button onClick={() => performOperation('+')} className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-3 rounded-lg font-bold">+</button>
        
        <button onClick={() => inputDigit('1')} className="bg-gray-100 dark:bg-gray-700 dark:text-white p-3 rounded-lg font-bold">1</button>
        <button onClick={() => inputDigit('2')} className="bg-gray-100 dark:bg-gray-700 dark:text-white p-3 rounded-lg font-bold">2</button>
        <button onClick={() => inputDigit('3')} className="bg-gray-100 dark:bg-gray-700 dark:text-white p-3 rounded-lg font-bold">3</button>
        <button onClick={() => performOperation('=')} className="row-span-2 bg-blue-600 text-white p-3 rounded-lg font-bold">=</button>
        
        <button onClick={() => inputDigit('0')} className="col-span-2 bg-gray-100 dark:bg-gray-700 dark:text-white p-3 rounded-lg font-bold">0</button>
        <button onClick={inputDot} className="bg-gray-100 dark:bg-gray-700 dark:text-white p-3 rounded-lg font-bold">,</button>
      </div>
    </div>
  );
}

const formatCurrencyInput = (val: string) => {
  const numericValue = val.replace(/[^0-9]/g, '');
  if (!numericValue) return '';
  return parseInt(numericValue, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// 2. EMI Calculator
function EMICalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [months, setMonths] = useState('');
  const [result, setResult] = useState<{emi: number, totalPayment: number, totalInterest: number} | null>(null);

  const handleCalc = () => {
    const p = parseFloat(principal.replace(/\./g, ''));
    const r = parseFloat(rate);
    const m = parseFloat(months);
    if (!isNaN(p) && !isNaN(r) && !isNaN(m)) {
      setResult(calculateEMI(p, r, m));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-gray-300">Jumlah Pinjaman (Pokok)</label>
        <input type="text" value={principal} onChange={e => setPrincipal(formatCurrencyInput(e.target.value))} className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 10.000.000" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-gray-300">Suku Bunga Tahunan (%)</label>
        <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 10" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-gray-300">Tenor (Bulan)</label>
        <input type="number" value={months} onChange={e => setMonths(e.target.value)} className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 12" />
      </div>
      <button onClick={handleCalc} className="bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Hitung Cicilan</button>

      {result && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg flex flex-col gap-2">
          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Cicilan Per Bulan:</span> <span className="font-bold dark:text-white">Rp {result.emi.toLocaleString('id-ID', {maximumFractionDigits:0})}</span></div>
          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Total Bunga:</span> <span className="font-bold dark:text-white">Rp {result.totalInterest.toLocaleString('id-ID', {maximumFractionDigits:0})}</span></div>
          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Total Pembayaran:</span> <span className="font-bold dark:text-white">Rp {result.totalPayment.toLocaleString('id-ID', {maximumFractionDigits:0})}</span></div>
        </div>
      )}
    </div>
  );
}

// 3. Compound Interest Calculator
function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [frequency, setFrequency] = useState('12');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<{finalAmount: number, totalInterest: number} | null>(null);

  const handleCalc = () => {
    const p = parseFloat(principal.replace(/\./g, ''));
    const r = parseFloat(rate);
    const f = parseFloat(frequency);
    const y = parseFloat(years);
    if (!isNaN(p) && !isNaN(r) && !isNaN(f) && !isNaN(y)) {
      setResult(calculateCompoundInterest(p, r, f, y));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-gray-300">Modal Awal</label>
        <input type="text" value={principal} onChange={e => setPrincipal(formatCurrencyInput(e.target.value))} className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 5.000.000" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-gray-300">Suku Bunga Tahunan (%)</label>
        <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 6" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-gray-300">Frekuensi Kompon</label>
        <select value={frequency} onChange={e => setFrequency(e.target.value)} className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="1">Tahunan (1x)</option>
          <option value="2">Semesteran (2x)</option>
          <option value="4">Kuartalan (4x)</option>
          <option value="12">Bulanan (12x)</option>
          <option value="365">Harian (365x)</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-gray-300">Durasi (Tahun)</label>
        <input type="number" value={years} onChange={e => setYears(e.target.value)} className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 5" />
      </div>
      <button onClick={handleCalc} className="bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Hitung Hasil</button>

      {result && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg flex flex-col gap-2">
          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Total Bunga:</span> <span className="font-bold dark:text-white">Rp {result.totalInterest.toLocaleString('id-ID', {maximumFractionDigits:0})}</span></div>
          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Total Akhir:</span> <span className="font-bold text-green-600 dark:text-green-400">Rp {result.finalAmount.toLocaleString('id-ID', {maximumFractionDigits:0})}</span></div>
        </div>
      )}
    </div>
  );
}

// 4. Future Value Calculator
function FutureValueCalculator() {
  const [initialAmount, setInitialAmount] = useState('0');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<{finalAmount: number, totalInvested: number, totalGain: number} | null>(null);

  const handleCalc = () => {
    const mc = parseFloat(monthlyContribution.replace(/\./g, ''));
    const r = parseFloat(rate);
    const y = parseFloat(years);
    const ia = parseFloat(initialAmount.replace(/\./g, '')) || 0;
    if (!isNaN(mc) && !isNaN(r) && !isNaN(y)) {
      setResult(calculateFutureValue(mc, r, y, ia));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-gray-300">Modal Awal (Opsional)</label>
        <input type="text" value={initialAmount} onChange={e => setInitialAmount(formatCurrencyInput(e.target.value))} className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-gray-300">Investasi Bulanan</label>
        <input type="text" value={monthlyContribution} onChange={e => setMonthlyContribution(formatCurrencyInput(e.target.value))} className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 1.000.000" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-gray-300">Estimasi Return per Tahun (%)</label>
        <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 8" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-gray-300">Durasi Investasi (Tahun)</label>
        <input type="number" value={years} onChange={e => setYears(e.target.value)} className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 10" />
      </div>
      <button onClick={handleCalc} className="bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Hitung Nilai Masa Depan</button>

      {result && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg flex flex-col gap-2">
          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Total Modal Disetor:</span> <span className="font-bold dark:text-white">Rp {result.totalInvested.toLocaleString('id-ID', {maximumFractionDigits:0})}</span></div>
          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Estimasi Keuntungan:</span> <span className="font-bold dark:text-white">Rp {result.totalGain.toLocaleString('id-ID', {maximumFractionDigits:0})}</span></div>
          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Total Nilai Masa Depan:</span> <span className="font-bold text-blue-600 dark:text-blue-400">Rp {result.finalAmount.toLocaleString('id-ID', {maximumFractionDigits:0})}</span></div>
        </div>
      )}
    </div>
  );
}

// 5. Emergency Fund Calculator
function EmergencyFundCalculator() {
  const [expenses, setExpenses] = useState('');
  const [stability, setStability] = useState<'stable' | 'moderate' | 'unstable'>('moderate');
  const [result, setResult] = useState<{recommended: number, monthly: number} | null>(null);

  const handleCalc = () => {
    const e = parseFloat(expenses.replace(/\./g, ''));
    if (!isNaN(e)) {
      setResult(calculateEmergencyFund(e, stability));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-gray-300">Pengeluaran Rutin per Bulan</label>
        <input type="text" value={expenses} onChange={e => setExpenses(formatCurrencyInput(e.target.value))} className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 3.000.000" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-gray-300">Stabilitas Pekerjaan / Pendapatan</label>
        <select value={stability} onChange={e => setStability(e.target.value as 'stable'|'moderate'|'unstable')} className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="stable">Sangat Stabil (PNS / Karyawan Tetap) - 3 Bulan</option>
          <option value="moderate">Cukup Stabil (Karyawan Swasta) - 6 Bulan</option>
          <option value="unstable">Kurang Stabil (Freelancer / Usaha) - 12 Bulan</option>
        </select>
      </div>
      <button onClick={handleCalc} className="bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Hitung Target Dana Darurat</button>

      {result && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex flex-col gap-2 text-center">
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Target Dana Darurat Ideal:</span>
          <span className="text-2xl font-bold text-blue-800 dark:text-blue-300">Rp {result.recommended.toLocaleString('id-ID', {maximumFractionDigits:0})}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">({(result.recommended / parseFloat(expenses)).toFixed(0)} x pengeluaran bulanan)</span>
        </div>
      )}
    </div>
  );
}
