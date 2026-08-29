import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function CognitiveRadarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center pro-text-muted italic">
        Insufficient data for neural mapping.
      </div>
    );
  }

  // Get current text color from a hidden element or CSS variable 
  // We'll use a CSS variable directly in the component style mapping
  
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="var(--border-color)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false}
          />
          <Radar
            name="Performance"
            dataKey="score"
            stroke="var(--accent-primary)"
            fill="var(--accent-primary)"
            fillOpacity={0.4}
            animationBegin={0}
            animationDuration={1500}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
