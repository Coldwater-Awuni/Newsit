'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { XCircle, PlusCircle, Info, BrainCircuit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SafetySetting, SafetyThreshold } from '@/lib/types';

interface AiConfigurationCardProps {
  modelName: string;
  sourceSites: string[];
  onAddSourceSite: (site: string) => void;
  onRemoveSourceSite: (site: string) => void;
  safetySettings: SafetySetting[];
}

const AiConfigurationCard: React.FC<AiConfigurationCardProps> = ({
  modelName,
  sourceSites,
  onAddSourceSite,
  onRemoveSourceSite,
  safetySettings,
}) => {
  const [newSite, setNewSite] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [safetyLevels, setSafetyLevels] = useState(safetySettings);

  const handleAddSite = () => {
    if (newSite && !sourceSites.includes(newSite)) {
      onAddSourceSite(newSite);
      setNewSite('');
    }
  };

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Sources</CardTitle>
              <CardDescription>Add trusted websites for AI content generation</CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add websites that the AI can use as reference for content generation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter website URL"
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSite()}
            />
            <Button onClick={handleAddSite} disabled={!newSite || !aiEnabled}>
              <PlusCircle className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="h-[200px] w-full border rounded-md p-2">
            <div className="space-y-2">
              {sourceSites.map((site) => (
                <div
                  key={site}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded"
                >
                  <span className="text-sm truncate">{site}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveSourceSite(site)}
                    disabled={!aiEnabled}
                  >
                    <XCircle className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {sourceSites.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No content sources added yet
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Settings</CardTitle>
              <CardDescription>Configure AI behavior and safety settings</CardDescription>
            </div>
            <Switch
              checked={aiEnabled}
              onCheckedChange={setAiEnabled}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Model</Label>
            <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{modelName}</span>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Content Safety Settings</Label>
            {safetyLevels.map((setting, index) => (
              <div key={setting.category} className="space-y-2">
                <Label className="text-sm">
                  {setting.category.split('_').slice(2).join(' ').toLowerCase()}
                </Label>
                <Select
                  defaultValue={setting.threshold}                  onValueChange={(value: SafetyThreshold) => {
                    const newSettings = [...safetyLevels];
                    newSettings[index] = { ...setting, threshold: value };
                    setSafetyLevels(newSettings);
                  }}
                  disabled={!aiEnabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BLOCK_NONE">Block None</SelectItem>
                    <SelectItem value="BLOCK_LOW_AND_ABOVE">Block Low & Above</SelectItem>
                    <SelectItem value="BLOCK_MEDIUM_AND_ABOVE">Block Medium & Above</SelectItem>
                    <SelectItem value="BLOCK_HIGH_AND_ABOVE">Block High & Above</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={!aiEnabled}>
            <BrainCircuit className="w-4 h-4 mr-2" />
            Test AI Configuration
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AiConfigurationCard;
