"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  MapPin,
  ExternalLink,
  Save,
  X,
} from "lucide-react";
import { CreateCampusData, UpdateCampusData, Campus, createCampus, updateCampus } from "@/lib/campus-actions";

interface CampusFormProps {
  campus?: Campus;
  mode: 'create' | 'edit';
}

interface FormData {
  name: string;
  address: string;
  google_maps_link: string;
  status: string;
}

const initialFormData: FormData = {
  name: '',
  address: '',
  google_maps_link: '',
  status: 'active',
};

export function CampusForm({ campus, mode }: CampusFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<FormData>(() => {
    if (mode === 'edit' && campus) {
      return {
        name: campus.name || '',
        address: campus.address || '',
        google_maps_link: campus.google_maps_link || '',
        status: campus.status || 'active',
      };
    }
    return initialFormData;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Campus name is required';
    }

    // URL validation for Google Maps link
    if (formData.google_maps_link && formData.google_maps_link.trim()) {
      try {
        new URL(formData.google_maps_link);
      } catch {
        newErrors.google_maps_link = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        if (mode === 'create') {
          const createData: CreateCampusData = {
            name: formData.name,
            address: formData.address || undefined,
            google_maps_link: formData.google_maps_link || undefined,
            status: formData.status,
          };
          await createCampus(createData);
        } else if (campus) {
          const updateData: UpdateCampusData = {
            name: formData.name,
            address: formData.address || undefined,
            google_maps_link: formData.google_maps_link || undefined,
            status: formData.status,
          };
          await updateCampus(campus.id, updateData);
        }
        
        router.push('/dashboard/campuses');
        router.refresh();
      } catch (error) {
        console.error('Error saving campus:', error);
        setErrors({ submit: 'Failed to save campus. Please try again.' });
      }
    });
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-red-100 text-red-800",
    maintenance: "bg-yellow-100 text-yellow-800",
  } as const;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">
            {mode === 'create' ? 'Create New Campus' : 'Edit Campus'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'create' 
              ? 'Add a new campus location to the system' 
              : `Update information for ${formData.name}`
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-primary" />
          </div>
          {formData.status && (
            <Badge className={statusColors[formData.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
              {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
            </Badge>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Campus Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campus Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Enter campus name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Location Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                placeholder="Enter the full address of the campus"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Include street address, city, state, and postal code for better identification.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_maps_link">Google Maps Link</Label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="google_maps_link"
                  type="url"
                  value={formData.google_maps_link}
                  onChange={(e) => updateFormData('google_maps_link', e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="pl-10"
                />
              </div>
              {errors.google_maps_link && (
                <p className="text-sm text-red-600">{errors.google_maps_link}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Optional: Provide a Google Maps link for easy navigation to the campus.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>

          <div className="flex items-center space-x-3">
            {errors.submit && (
              <p className="text-sm text-red-600">{errors.submit}</p>
            )}
            <Button type="submit" disabled={isPending}>
              <Save className="w-4 h-4 mr-2" />
              {isPending 
                ? (mode === 'create' ? 'Creating...' : 'Updating...') 
                : (mode === 'create' ? 'Create Campus' : 'Update Campus')
              }
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 