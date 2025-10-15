'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, TrendingUp } from 'lucide-react';
import { MaterialPrediction } from '@/lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

type ForecastResultsProps = {
  projectName: string;
  materials: MaterialPrediction;
  confidence: number;
  onExport: () => void;
};

export function ForecastResults({ projectName, materials, confidence, onExport }: ForecastResultsProps) {
  const materialData = [
    { name: 'Steel', quantity: materials.steel_tons, unit: 'tons', category: 'Primary' },
    { name: 'Concrete', quantity: materials.concrete_m3, unit: 'm³', category: 'Primary' },
    { name: 'Copper Cable', quantity: materials.copper_km, unit: 'km', category: 'Primary' },
    { name: 'Insulators', quantity: materials.insulators_units, unit: 'units', category: 'Components' },
    { name: 'Transformers', quantity: materials.transformers_units, unit: 'units', category: 'Equipment' },
    { name: 'Circuit Breakers', quantity: materials.circuit_breakers_units, unit: 'units', category: 'Equipment' },
  ];

  const trendData = [
    { month: 'Month 1', demand: materials.steel_tons * 0.2 },
    { month: 'Month 2', demand: materials.steel_tons * 0.4 },
    { month: 'Month 3', demand: materials.steel_tons * 0.65 },
    { month: 'Month 4', demand: materials.steel_tons * 0.85 },
    { month: 'Month 5', demand: materials.steel_tons * 0.95 },
    { month: 'Month 6', demand: materials.steel_tons },
  ];

  const chartData = [
    { name: 'Steel', value: materials.steel_tons, fill: '#3b82f6' },
    { name: 'Concrete', value: materials.concrete_m3, fill: '#10b981' },
    { name: 'Copper', value: materials.copper_km * 10, fill: '#f59e0b' },
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 80) return 'bg-blue-500';
    if (confidence >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{projectName}</h2>
          <p className="text-sm text-slate-600">Material Demand Forecast</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-600">Confidence Score</p>
            <div className="flex items-center gap-2">
              <Badge className={getConfidenceColor(confidence)}>{confidence}%</Badge>
            </div>
          </div>
          <Button onClick={onExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Steel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.steel_tons.toLocaleString()}</div>
            <p className="text-xs text-slate-500">tons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Concrete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.concrete_m3.toLocaleString()}</div>
            <p className="text-xs text-slate-500">cubic meters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Copper Cable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.copper_km.toLocaleString()}</div>
            <p className="text-xs text-slate-500">kilometers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Projected Material Demand Timeline
            </CardTitle>
            <CardDescription>Steel demand over project duration</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="demand" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDemand)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Material Distribution</CardTitle>
            <CardDescription>Primary materials comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Material Requirements</CardTitle>
          <CardDescription>Complete breakdown of all materials</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materialData.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">{item.quantity.toLocaleString()}</TableCell>
                  <TableCell className="text-slate-600">{item.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
