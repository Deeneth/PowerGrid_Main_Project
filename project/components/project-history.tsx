'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, MapPin } from 'lucide-react';
import { Project, Forecast } from '@/lib/supabase';

type ProjectWithForecast = Project & {
  forecasts: Forecast[];
};

type ProjectHistoryProps = {
  projects: ProjectWithForecast[];
  onViewForecast: (project: Project, forecast: Forecast) => void;
};

export function ProjectHistory({ projects, onViewForecast }: ProjectHistoryProps) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-slate-600">No projects found. Create your first forecast to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </CardDescription>
              </div>
              <Badge variant="outline">{project.tower_type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-600">Budget</p>
                <p className="font-semibold">₹{(project.budget / 1_000_000).toFixed(1)}M</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Terrain</p>
                <p className="font-semibold">{project.geographic_conditions}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Substation</p>
                <p className="font-semibold">{project.substation_type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Tax Rate</p>
                <p className="font-semibold">{project.tax_rate}%</p>
              </div>
            </div>
            {project.forecasts.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Forecasts ({project.forecasts.length})</p>
                <div className="flex flex-wrap gap-2">
                  {project.forecasts.map((forecast) => (
                    <Button
                      key={forecast.id}
                      variant="outline"
                      size="sm"
                      onClick={() => onViewForecast(project, forecast)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View ({forecast.confidence_score}% confidence)
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
