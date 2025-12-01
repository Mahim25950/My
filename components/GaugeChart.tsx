import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value: number;
  color: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, color }) => {
  // Cap BMI at 40 for visualization purposes (Morbid Obesity starts around there)
  const normalizedValue = Math.min(Math.max(value, 10), 40);
  
  // Calculate percentage for the gauge (10 to 40 range)
  // 10 is 0%, 40 is 100%
  // This is just for visual filling of the bar
  const percentage = ((normalizedValue - 10) / 30) * 100;

  const data = [
    {
      name: 'BMI',
      value: percentage,
      fill: color,
    },
  ];

  return (
    <div className="w-full h-48 relative flex justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="70%" 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={20} 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-[60%] flex flex-col items-center">
        <span className="text-3xl font-bold text-slate-800">{value.toFixed(1)}</span>
        <span className="text-xs text-slate-500 font-medium">BMI SCORE</span>
      </div>
    </div>
  );
};

export default GaugeChart;
