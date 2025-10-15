'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, PackageCheck, AlertCircle } from 'lucide-react';

type DashboardStatsProps = {
  totalProjects: number;
  totalForecasts: number;
  avgConfidence: number;
};

export function DashboardStats({ totalProjects, totalForecasts, avgConfidence }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Total Projects</CardTitle>
          <BarChart3 className="w-4 h-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
          <p className="text-xs text-slate-500 mt-1">Active infrastructure projects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Forecasts Generated</CardTitle>
          <TrendingUp className="w-4 h-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalForecasts}</div>
          <p className="text-xs text-slate-500 mt-1">Material predictions made</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Avg Confidence</CardTitle>
          <PackageCheck className="w-4 h-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgConfidence.toFixed(1)}%</div>
          <p className="text-xs text-slate-500 mt-1">Model accuracy score</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Model Status</CardTitle>
          <AlertCircle className="w-4 h-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Active</div>
          <p className="text-xs text-slate-500 mt-1">v1.0 operational</p>
        </CardContent>
      </Card>
    </div>
  );
}
