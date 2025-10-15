'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export type ProjectFormData = {
  name: string;
  budget: number;
  location: string;
  tower_type: string;
  substation_type: string;
  geographic_conditions: string;
  tax_rate: number;
};

type ProjectFormProps = {
  onSubmit: (data: ProjectFormData) => void;
  loading?: boolean;
};

export function ProjectForm({ onSubmit, loading }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    budget: 0,
    location: '',
    tower_type: '',
    substation_type: '',
    geographic_conditions: '',
    tax_rate: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>Enter project parameters to generate material demand forecast</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="e.g., Delhi-Agra Transmission Line"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 50000000"
                value={formData.budget || ''}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location/Region</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North">North</SelectItem>
                  <SelectItem value="South">South</SelectItem>
                  <SelectItem value="East">East</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                  <SelectItem value="Central">Central</SelectItem>
                  <SelectItem value="Coastal">Coastal</SelectItem>
                  <SelectItem value="Mountain">Mountain</SelectItem>
                  <SelectItem value="Plain">Plain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tower_type">Tower Type</Label>
              <Select
                value={formData.tower_type}
                onValueChange={(value) => setFormData({ ...formData, tower_type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tower type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Transmission 400kV">Transmission 400kV</SelectItem>
                  <SelectItem value="Transmission 220kV">Transmission 220kV</SelectItem>
                  <SelectItem value="Transmission 132kV">Transmission 132kV</SelectItem>
                  <SelectItem value="Distribution 66kV">Distribution 66kV</SelectItem>
                  <SelectItem value="Distribution 33kV">Distribution 33kV</SelectItem>
                  <SelectItem value="Distribution 11kV">Distribution 11kV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="substation_type">Substation Type</Label>
              <Select
                value={formData.substation_type}
                onValueChange={(value) => setFormData({ ...formData, substation_type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select substation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Grid Substation">Grid Substation</SelectItem>
                  <SelectItem value="Switching Station">Switching Station</SelectItem>
                  <SelectItem value="Distribution Substation">Distribution Substation</SelectItem>
                  <SelectItem value="Transformation Substation">Transformation Substation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="geographic_conditions">Geographic Conditions</Label>
              <Select
                value={formData.geographic_conditions}
                onValueChange={(value) => setFormData({ ...formData, geographic_conditions: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select terrain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Plain">Plain</SelectItem>
                  <SelectItem value="Hilly">Hilly</SelectItem>
                  <SelectItem value="Mountain">Mountain</SelectItem>
                  <SelectItem value="Coastal">Coastal</SelectItem>
                  <SelectItem value="Desert">Desert</SelectItem>
                  <SelectItem value="Forest">Forest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_rate">Tax Rate (%)</Label>
              <Input
                id="tax_rate"
                type="number"
                step="0.01"
                placeholder="e.g., 18"
                value={formData.tax_rate || ''}
                onChange={(e) => setFormData({ ...formData, tax_rate: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Forecast...
              </>
            ) : (
              'Predict Material Demand'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
