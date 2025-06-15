
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area, ScatterChart, Scatter, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart,
  Treemap, FunnelChart, Funnel, LabelList
} from "recharts";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SequenceGraphProps {
  data: number[];
}

const COLORS = ['#B794F4', '#9F7AEA', '#805AD5', '#6B46C1', '#553C9A', '#44337A'];

export const SequenceGraph = ({ data }: SequenceGraphProps) => {
  const [graphType, setGraphType] = useState<"line" | "bar" | "area" | "scatter" | "pie" | "radar" | "composed" | "treemap" | "funnel">("line");
  
  // Format data for different chart types
  const chartData = data.map((value, index) => ({
    n: index + 1,
    value,
    name: `Term ${index + 1}`,
    fill: COLORS[index % COLORS.length]
  }));

  // Prepare data for pie chart (limit to prevent overcrowding)
  const pieData = chartData.slice(0, 8).map((item, index) => ({
    name: `T${item.n}`,
    value: Math.abs(item.value), // Use absolute value for pie chart
    fill: COLORS[index % COLORS.length]
  }));

  // Prepare data for radar chart
  const radarData = chartData.slice(0, 6).map(item => ({
    subject: `T${item.n}`,
    value: Math.abs(item.value),
    fullMark: Math.max(...data.map(Math.abs))
  }));

  // Prepare data for treemap
  const treemapData = chartData.slice(0, 10).map(item => ({
    name: `Term ${item.n}`,
    size: Math.abs(item.value) || 1, // Ensure positive values
    fill: item.fill
  }));

  // Custom tooltip with better spacing
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2A2F3C] border border-purple-900/50 rounded-lg p-3 shadow-lg">
          <p className="text-purple-200 font-medium mb-2">{`Term: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-purple-100" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getVisualization = () => {
    switch (graphType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332940" />
              <XAxis 
                dataKey="n" 
                stroke="#9F7AEA" 
                fontSize={12}
                tickMargin={10}
              />
              <YAxis 
                stroke="#9F7AEA" 
                fontSize={12}
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#B794F4" 
                activeDot={{ r: 8, fill: '#A855F7' }}
                animationDuration={1500}
                name="Sequence Value"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332940" />
              <XAxis 
                dataKey="n" 
                stroke="#9F7AEA" 
                fontSize={12}
                tickMargin={10}
              />
              <YAxis 
                stroke="#9F7AEA" 
                fontSize={12}
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar 
                dataKey="value" 
                fill="#9F7AEA" 
                animationDuration={1500}
                name="Sequence Value"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332940" />
              <XAxis 
                dataKey="n" 
                stroke="#9F7AEA" 
                fontSize={12}
                tickMargin={10}
              />
              <YAxis 
                stroke="#9F7AEA" 
                fontSize={12}
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#B794F4"
                fill="#9F7AEA"
                fillOpacity={0.3}
                animationDuration={1500}
                name="Sequence Value"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332940" />
              <XAxis 
                dataKey="n" 
                name="Term" 
                stroke="#9F7AEA" 
                fontSize={12}
                tickMargin={10}
              />
              <YAxis 
                dataKey="value" 
                name="Value" 
                stroke="#9F7AEA" 
                fontSize={12}
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Scatter 
                name="Sequence Values" 
                data={chartData} 
                fill="#B794F4"
                animationDuration={1500}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1500}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        );

      case "radar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <PolarGrid stroke="#332940" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9F7AEA', fontSize: 12 }} />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 'dataMax']} 
                tick={{ fill: '#9F7AEA', fontSize: 10 }}
                tickCount={6}
              />
              <Radar
                name="Sequence Values"
                dataKey="value"
                stroke="#B794F4"
                fill="#9F7AEA"
                fillOpacity={0.3}
                animationDuration={1500}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </RadarChart>
          </ResponsiveContainer>
        );

      case "composed":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332940" />
              <XAxis 
                dataKey="n" 
                stroke="#9F7AEA" 
                fontSize={12}
                tickMargin={10}
              />
              <YAxis 
                stroke="#9F7AEA" 
                fontSize={12}
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                fill="#9F7AEA" 
                fillOpacity={0.2}
                name="Area"
              />
              <Bar dataKey="value" fill="#805AD5" name="Bars" />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#B794F4" 
                strokeWidth={2}
                name="Line"
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case "treemap":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4/3}
              stroke="#332940"
              fill="#9F7AEA"
              animationDuration={1500}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        );

      case "funnel":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip content={<CustomTooltip />} />
              <Funnel
                dataKey="value"
                data={chartData.slice(0, 6)}
                isAnimationActive={true}
                animationDuration={1500}
              >
                <LabelList position="center" fill="#fff" stroke="none" />
                {chartData.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332940" />
              <XAxis 
                dataKey="n" 
                stroke="#9F7AEA" 
                fontSize={12}
                tickMargin={10}
              />
              <YAxis 
                stroke="#9F7AEA" 
                fontSize={12}
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#B794F4" 
                activeDot={{ r: 8, fill: '#A855F7' }}
                animationDuration={1500}
                name="Sequence Value"
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select 
          value={graphType} 
          onValueChange={(value: typeof graphType) => setGraphType(value)}
        >
          <SelectTrigger className="w-[200px] bg-purple-900/20 border-purple-900/40 text-purple-200">
            <SelectValue placeholder="Visualization Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#2A2F3C] border-purple-900/30 text-purple-200 z-50">
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="area">Area Chart</SelectItem>
            <SelectItem value="scatter">Scatter Plot</SelectItem>
            <SelectItem value="pie">Pie Chart</SelectItem>
            <SelectItem value="radar">Radar Chart</SelectItem>
            <SelectItem value="composed">Composed Chart</SelectItem>
            <SelectItem value="treemap">Treemap</SelectItem>
            <SelectItem value="funnel">Funnel Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[350px] w-full bg-[#221F26]/60 border border-purple-900/20 rounded-lg p-4">
        {getVisualization()}
      </div>
    </div>
  );
};
