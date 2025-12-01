import React, { useState, useEffect, useRef } from 'react';
import { 
  Calculator, 
  RefreshCcw, 
  Info, 
  ChevronDown, 
  Ruler, 
  Weight, 
  Calendar, 
  User,
  Droplets,
  Flame,
  History,
  Trash2,
  Share2
} from 'lucide-react';
import GaugeChart from './components/GaugeChart';
import AIInsights from './components/AIInsights';
import { Gender, UnitSystem, BMIResult, HistoryItem } from './types';

function App() {
  // State
  const [unit, setUnit] = useState<UnitSystem>(UnitSystem.Metric);
  const [gender, setGender] = useState<Gender>(Gender.Male);
  const [age, setAge] = useState<number | ''>(25);
  const [heightCm, setHeightCm] = useState<number | ''>(175);
  const [heightFt, setHeightFt] = useState<number | ''>(5);
  const [heightIn, setHeightIn] = useState<number | ''>(9);
  const [weightKg, setWeightKg] = useState<number | ''>(70);
  const [weightLbs, setWeightLbs] = useState<number | ''>(154);
  const [result, setResult] = useState<BMIResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  // Constants
  const BMI_CATEGORIES = [
    { label: 'Underweight', range: '< 18.5', color: '#3b82f6', activeColor: 'text-blue-500', min: 0, max: 18.5 },
    { label: 'Normal', range: '18.5 - 24.9', color: '#22c55e', activeColor: 'text-green-500', min: 18.5, max: 24.9 },
    { label: 'Overweight', range: '25 - 29.9', color: '#eab308', activeColor: 'text-yellow-500', min: 25, max: 29.9 },
    { label: 'Obese', range: '≥ 30', color: '#ef4444', activeColor: 'text-red-500', min: 30, max: 100 },
  ];

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('bmi_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Automatic Link Opener (Ad) - Opens every 5 seconds, max 5 times
  useEffect(() => {
    let count = 0;
    const maxOpens = 5;

    const timer = setInterval(() => {
      count++;
      window.open('https://corruptioneasiestsubmarine.com/rr5m2xntt?key=56d2ab4ba16a5e923e573756dcd10c33', '_blank');

      if (count >= maxOpens) {
        clearInterval(timer);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Save History Helper
  const saveToHistory = (newResult: BMIResult) => {
    const item: HistoryItem = {
      ...newResult,
      id: Date.now().toString(),
    };
    // Keep last 5
    const updated = [item, ...history].slice(0, 5);
    setHistory(updated);
    localStorage.setItem('bmi_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('bmi_history');
  };

  const calculateBMI = () => {
    let weightInKg = 0;
    let heightInM = 0;
    let heightInCm = 0;

    if (unit === UnitSystem.Metric) {
      if (!weightKg || !heightCm) return;
      weightInKg = Number(weightKg);
      heightInCm = Number(heightCm);
      heightInM = heightInCm / 100;
    } else {
      if (!weightLbs || (!heightFt && heightFt !== 0)) return;
      weightInKg = Number(weightLbs) * 0.453592;
      const totalInches = (Number(heightFt) * 12) + Number(heightIn || 0);
      heightInCm = totalInches * 2.54;
      heightInM = heightInCm / 100;
    }

    if (heightInM <= 0 || weightInKg <= 0 || !age) return;

    const bmiValue = weightInKg / (heightInM * heightInM);
    
    let category = '';
    let color = '';
    
    if (bmiValue < 18.5) {
      category = 'Underweight';
      color = '#3b82f6';
    } else if (bmiValue < 25) {
      category = 'Normal Weight';
      color = '#22c55e';
    } else if (bmiValue < 30) {
      category = 'Overweight';
      color = '#eab308';
    } else {
      category = 'Obesity';
      color = '#ef4444';
    }

    // Ideal weight calculation (reversed BMI formula for Normal range 18.5-24.9)
    const minIdeal = 18.5 * heightInM * heightInM;
    const maxIdeal = 24.9 * heightInM * heightInM;
    
    let idealRange = '';
    if (unit === UnitSystem.Metric) {
      idealRange = `${minIdeal.toFixed(1)} - ${maxIdeal.toFixed(1)} kg`;
    } else {
      idealRange = `${(minIdeal / 0.453592).toFixed(1)} - ${(maxIdeal / 0.453592).toFixed(1)} lbs`;
    }

    // BMR Calculation (Mifflin-St Jeor Equation)
    let bmr = 0;
    if (gender === Gender.Male) {
      bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * Number(age)) + 5;
    } else {
      bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * Number(age)) - 161;
    }

    // Water Intake (Approx 33ml per kg)
    const waterIntake = (weightInKg * 0.033);

    const resultData: BMIResult = {
      bmi: bmiValue,
      category,
      color,
      idealWeightRange: idealRange,
      bmr,
      waterIntake,
      timestamp: Date.now()
    };

    setResult(resultData);
    saveToHistory(resultData);

    // Smooth scroll to result on mobile
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const resetCalculator = () => {
    setResult(null);
    // Optional: Keep age/gender as they rarely change session-to-session
    if (unit === UnitSystem.Metric) {
      setHeightCm(175);
      setWeightKg(70);
    } else {
      setHeightFt(5);
      setHeightIn(9);
      setWeightLbs(154);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-md bg-white/90">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">ProHealth</h1>
              <span className="text-xs text-indigo-600 font-semibold tracking-wider">PREMIUM TOOLS</span>
            </div>
          </div>
          {/* <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
             <Settings className="w-5 h-5" />
          </button> */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Calculator Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                  <User className="w-5 h-5 mr-2 text-indigo-500" />
                  Your Stats
                </h2>
                {/* Unit Switcher - Compact */}
                <div className="flex bg-slate-200/50 p-1 rounded-lg">
                  <button
                    onClick={() => { setUnit(UnitSystem.Metric); setResult(null); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      unit === UnitSystem.Metric ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Metric
                  </button>
                  <button
                    onClick={() => { setUnit(UnitSystem.Imperial); setResult(null); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      unit === UnitSystem.Imperial ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Imperial
                  </button>
                </div>
              </div>
              
              <div className="p-5 md:p-6 space-y-6">
                {/* Gender & Age */}
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                    <div className="relative">
                      <select 
                        value={gender}
                        onChange={(e) => setGender(e.target.value as Gender)}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 pr-8 transition-shadow"
                      >
                        <option value={Gender.Male}>Male</option>
                        <option value={Gender.Female}>Female</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="w-4 h-4 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-3 transition-shadow"
                        placeholder="25"
                      />
                    </div>
                  </div>
                </div>

                {/* Height & Weight Row on Desktop, Stack on Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Height */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700 flex items-center">
                      <Ruler className="w-4 h-4 mr-1.5 text-slate-400" />
                      Height
                    </label>
                    {unit === UnitSystem.Metric ? (
                      <div className="relative">
                        <input
                          type="number"
                          value={heightCm}
                          onChange={(e) => setHeightCm(Number(e.target.value))}
                          className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 pr-10"
                          placeholder="175"
                        />
                        <span className="absolute right-4 top-3 text-slate-400 text-xs font-medium">cm</span>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <div className="relative w-full">
                          <input
                            type="number"
                            value={heightFt}
                            onChange={(e) => setHeightFt(Number(e.target.value))}
                            className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 pr-8"
                            placeholder="5"
                          />
                          <span className="absolute right-3 top-3 text-slate-400 text-xs font-medium">ft</span>
                        </div>
                        <div className="relative w-full">
                          <input
                            type="number"
                            value={heightIn}
                            onChange={(e) => setHeightIn(Number(e.target.value))}
                            className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 pr-8"
                            placeholder="9"
                          />
                          <span className="absolute right-3 top-3 text-slate-400 text-xs font-medium">in</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Weight */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700 flex items-center">
                      <Weight className="w-4 h-4 mr-1.5 text-slate-400" />
                      Weight
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={unit === UnitSystem.Metric ? weightKg : weightLbs}
                        onChange={(e) => unit === UnitSystem.Metric ? setWeightKg(Number(e.target.value)) : setWeightLbs(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 pr-10"
                        placeholder={unit === UnitSystem.Metric ? "70" : "154"}
                      />
                      <span className="absolute right-4 top-3 text-slate-400 text-xs font-medium">{unit === UnitSystem.Metric ? 'kg' : 'lbs'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={calculateBMI}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-xl active:scale-95 flex justify-center items-center text-base"
                  >
                    Calculate Results
                  </button>
                  <button
                    onClick={resetCalculator}
                    className="bg-slate-100 border border-transparent text-slate-600 hover:bg-slate-200 font-medium py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center active:scale-95"
                    aria-label="Reset"
                  >
                    <RefreshCcw className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Embedded Banner Ad (320x50) */}
                <div className="flex justify-center pt-2">
                  <div className="w-[320px] h-[50px] bg-slate-50 rounded overflow-hidden">
                    <iframe 
                      srcDoc={`
                        <div style="display:flex;justify-content:center;align-items:center;margin:0;padding:0;height:100%;">
                          <script type="text/javascript">
                            atOptions = {
                              'key' : 'ebfe532d79a15105e9c635cd81d22b4b',
                              'format' : 'iframe',
                              'height' : 50,
                              'width' : 320,
                              'params' : {}
                            };
                          </script>
                          <script type="text/javascript" src="//corruptioneasiestsubmarine.com/ebfe532d79a15105e9c635cd81d22b4b/invoke.js"></script>
                        </div>
                      `}
                      width="320"
                      height="50"
                      className="border-none block"
                      title="Sponsor"
                      scrolling="no"
                    />
                  </div>
                </div>

              </div>
            </div>

             {/* History Section (Mobile: Below Form) */}
            {history.length > 0 && (
               <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center">
                     <History className="w-4 h-4 mr-2" />
                     Recent History
                   </h3>
                   <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-700 flex items-center">
                     <Trash2 className="w-3 h-3 mr-1" /> Clear
                   </button>
                 </div>
                 <div className="space-y-2">
                   {history.map((item) => (
                     <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm border border-slate-100 hover:border-slate-200 transition-colors">
                       <div className="flex flex-col">
                         <span className="font-bold text-slate-700">BMI {item.bmi.toFixed(1)}</span>
                         <span className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                       </div>
                       <div className="flex items-center">
                          <span className="px-2 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                            {item.category}
                          </span>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

            {/* Information Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hidden md:block">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Standard BMI Categories
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {BMI_CATEGORIES.map((cat) => (
                  <div key={cat.label} className={`flex items-center justify-between text-sm p-3 rounded-lg border transition-all ${result && result.bmi >= cat.min && result.bmi <= cat.max ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-center">
                      <span className={`w-2.5 h-2.5 rounded-full mr-2.5`} style={{ backgroundColor: cat.color }}></span>
                      <span className={`font-medium ${result && result.bmi >= cat.min && result.bmi <= cat.max ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                        {cat.label}
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono text-xs">{cat.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5 space-y-6" ref={resultRef}>
            {result ? (
              <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700 sticky top-24">
                 
                 {/* Main Result */}
                 <div className="p-6 md:p-8 text-center border-b border-slate-100 relative bg-gradient-to-b from-white to-slate-50/50">
                   <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
                   
                   <div className="flex justify-between items-start mb-2">
                     <div className="text-left">
                       <h2 className="text-2xl font-bold text-slate-800">Your Result</h2>
                       <p className="text-slate-500 text-sm">Based on your measurements</p>
                     </div>
                     <div className="bg-slate-100 p-2 rounded-full cursor-help group relative">
                       <Info className="w-5 h-5 text-slate-400" />
                       <div className="absolute right-0 top-10 w-48 bg-slate-800 text-white text-xs p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                         BMI is a screening tool, not a full health diagnosis.
                       </div>
                     </div>
                   </div>
                   
                   <div className="mt-8 mb-6 transform scale-100 sm:scale-110 transition-transform">
                      <GaugeChart value={result.bmi} color={result.color} />
                   </div>
                   
                   <div className="mt-4 flex flex-col items-center">
                     <span 
                       className="inline-block px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm"
                       style={{ backgroundColor: result.color, color: '#fff' }}
                     >
                       {result.category}
                     </span>
                     
                     <div className="mt-6 w-full p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                        <span className="block text-xs uppercase text-indigo-400 font-bold tracking-wider mb-1">Target Ideal Weight</span>
                        <span className="text-lg font-bold text-indigo-900">{result.idealWeightRange}</span>
                     </div>
                   </div>
                 </div>

                 {/* Extra Metrics Grid */}
                 <div className="grid grid-cols-2 border-b border-slate-100 divide-x divide-slate-100">
                    <div className="p-4 flex flex-col items-center text-center hover:bg-slate-50 transition-colors group">
                      <div className="bg-orange-100 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                        <Flame className="w-5 h-5 text-orange-500" />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">BMR</span>
                      <span className="text-lg font-bold text-slate-800 mt-1">{Math.round(result.bmr)} <span className="text-xs font-normal text-slate-400">kcal/day</span></span>
                      <span className="text-[10px] text-slate-400 mt-1">Metabolic Rate</span>
                    </div>
                    <div className="p-4 flex flex-col items-center text-center hover:bg-slate-50 transition-colors group">
                      <div className="bg-blue-100 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                        <Droplets className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Water</span>
                      <span className="text-lg font-bold text-slate-800 mt-1">{result.waterIntake.toFixed(1)} <span className="text-xs font-normal text-slate-400">L/day</span></span>
                      <span className="text-[10px] text-slate-400 mt-1">Recommended</span>
                    </div>
                 </div>

                 {/* AI Section Integration */}
                 <div className="p-6 bg-white">
                    <AIInsights 
                      bmi={result.bmi} 
                      age={Number(age)} 
                      gender={gender} 
                      category={result.category}
                      bmr={result.bmr}
                    />
                 </div>
              </div>
            ) : (
              // Empty State
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 border-dashed text-center">
                <div className="bg-indigo-50 p-6 rounded-full mb-6 animate-pulse">
                  <Calculator className="w-10 h-10 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Ready to Calculate</h3>
                <p className="text-slate-500 max-w-xs leading-relaxed">
                  Enter your body parameters to get professional-grade health metrics, including BMR, Water Intake, and AI-powered advice.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
      
      {/* Simple Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center">
         {/* Ad Units */}
         <div className="flex flex-col items-center gap-4 w-full mb-6 overflow-hidden">
            {/* First Ad (468x60) */}
            <div className="flex justify-center w-full">
              <iframe 
                srcDoc={`
                  <div style="display:flex;justify-content:center;margin:0;padding:0;">
                    <script type="text/javascript">
                      atOptions = {
                        'key' : 'd56b9299e54f47f2d3fd9e97fa4c605b',
                        'format' : 'iframe',
                        'height' : 60,
                        'width' : 468,
                        'params' : {}
                      };
                    </script>
                    <script type="text/javascript" src="//corruptioneasiestsubmarine.com/d56b9299e54f47f2d3fd9e97fa4c605b/invoke.js"></script>
                  </div>
                `}
                width="468"
                height="60"
                className="border-none max-w-full"
                title="Partner Content 1"
                scrolling="no"
              />
            </div>
            
            {/* Second Ad (320x50) */}
            <div className="flex justify-center w-full">
              <iframe 
                srcDoc={`
                  <div style="display:flex;justify-content:center;margin:0;padding:0;">
                    <script type="text/javascript">
                      atOptions = {
                        'key' : 'ebfe532d79a15105e9c635cd81d22b4b',
                        'format' : 'iframe',
                        'height' : 50,
                        'width' : 320,
                        'params' : {}
                      };
                    </script>
                    <script type="text/javascript" src="//corruptioneasiestsubmarine.com/ebfe532d79a15105e9c635cd81d22b4b/invoke.js"></script>
                  </div>
                `}
                width="320"
                height="50"
                className="border-none max-w-full"
                title="Partner Content 2"
                scrolling="no"
              />
            </div>
         </div>

         <div className="flex justify-center space-x-4 mb-4">
           {/* Mock Social/Share Links */}
           <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Share2 className="w-5 h-5" /></button>
         </div>
         <p className="text-slate-400 text-xs">
           &copy; {new Date().getFullYear()} ProHealth Tools. 
           <br className="md:hidden" /> 
           <span className="hidden md:inline"> • </span>
           This tool is for informational purposes only and does not constitute medical advice.
         </p>
      </footer>
    </div>
  );
}

export default App;