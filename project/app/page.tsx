'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ProjectForm, ProjectFormData } from '@/components/project-form';
import { ForecastResults } from '@/components/forecast-results';
import { DashboardStats } from '@/components/dashboard-stats';
import { ProjectHistory } from '@/components/project-history';
import { supabase, Project, Forecast, MaterialPrediction } from '@/lib/supabase';
import { generateForecast, exportToCSV } from '@/lib/forecast-engine';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

type ProjectWithForecast = Project & {
  forecasts: Forecast[];
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectWithForecast[]>([]);
  const [currentForecast, setCurrentForecast] = useState<{
    projectName: string;
    materials: MaterialPrediction;
    confidence: number;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      const projectsWithForecasts = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data: forecastsData } = await supabase
            .from('forecasts')
            .select('*')
            .eq('project_id', project.id)
            .order('created_at', { ascending: false });

          return {
            ...project,
            forecasts: forecastsData || [],
          };
        })
      );

      setProjects(projectsWithForecasts);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleSubmit = async (formData: ProjectFormData) => {
    setLoading(true);
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: formData.name,
          budget: formData.budget,
          location: formData.location,
          tower_type: formData.tower_type,
          substation_type: formData.substation_type,
          geographic_conditions: formData.geographic_conditions,
          tax_rate: formData.tax_rate,
        })
        .select()
        .maybeSingle();

      if (projectError) throw projectError;

      const { materials, confidence } = generateForecast({
        budget: formData.budget,
        location: formData.location,
        tower_type: formData.tower_type,
        substation_type: formData.substation_type,
        geographic_conditions: formData.geographic_conditions,
        tax_rate: formData.tax_rate,
      });

      const { error: forecastError } = await supabase
        .from('forecasts')
        .insert({
          project_id: project!.id,
          confidence_score: confidence,
          predicted_materials: materials,
          model_version: 'v1.0',
        });

      if (forecastError) throw forecastError;

      setCurrentForecast({
        projectName: formData.name,
        materials,
        confidence,
      });

      await loadProjects();

      toast({
        title: 'Forecast Generated',
        description: 'Material demand prediction completed successfully',
      });

      setActiveTab('forecast');
    } catch (error) {
      console.error('Error generating forecast:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate forecast. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!currentForecast) return;

    const csv = exportToCSV(
      currentForecast.projectName,
      currentForecast.materials,
      currentForecast.confidence
    );

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentForecast.projectName.replace(/\s+/g, '_')}_forecast.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: 'Forecast data has been downloaded as CSV',
    });
  };

  const handleViewForecast = (project: Project, forecast: Forecast) => {
    setCurrentForecast({
      projectName: project.name,
      materials: forecast.predicted_materials as MaterialPrediction,
      confidence: forecast.confidence_score,
    });
    setActiveTab('forecast');
  };

  const totalProjects = projects.length;
  const totalForecasts = projects.reduce((sum, p) => sum + p.forecasts.length, 0);
  const avgConfidence =
    totalForecasts > 0
      ? projects.reduce((sum, p) =>
          sum + p.forecasts.reduce((fSum, f) => fSum + f.confidence_score, 0), 0
        ) / totalForecasts
      : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-slate-600 mt-1">Overview of your material forecasting projects</p>
              </div>

              <DashboardStats
                totalProjects={totalProjects}
                totalForecasts={totalForecasts}
                avgConfidence={avgConfidence}
              />

              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
                <ProjectHistory
                  projects={projects.slice(0, 5)}
                  onViewForecast={handleViewForecast}
                />
              </div>
            </div>
          )}

          {activeTab === 'forecast' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Material Demand Forecast</h1>
                <p className="text-slate-600 mt-1">Generate predictions for your infrastructure project</p>
              </div>

              {!currentForecast ? (
                <ProjectForm onSubmit={handleSubmit} loading={loading} />
              ) : (
                <ForecastResults
                  projectName={currentForecast.projectName}
                  materials={currentForecast.materials}
                  confidence={currentForecast.confidence}
                  onExport={handleExport}
                />
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Project History</h1>
                <p className="text-slate-600 mt-1">View all your forecasting projects</p>
              </div>

              <ProjectHistory
                projects={projects}
                onViewForecast={handleViewForecast}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-slate-600 mt-1">Configure your forecasting preferences</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">Model Information</h3>
                  <p className="text-sm text-slate-600">Current Version: v1.0</p>
                  <p className="text-sm text-slate-600 mt-1">Algorithm: Multi-factor Regression</p>
                  <p className="text-sm text-slate-600 mt-1">Last Updated: October 2025</p>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">Data Sources</h3>
                  <p className="text-sm text-slate-600">Historical project data</p>
                  <p className="text-sm text-slate-600 mt-1">Regional cost variations</p>
                  <p className="text-sm text-slate-600 mt-1">Market price indices</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Toaster />
    </div>
  );
}
