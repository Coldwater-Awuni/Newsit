
'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { XCircle, PlusCircle, Info } from 'lucide-react';
import type { SafetySetting } from '@/lib/types';

interface AiConfigurationCardProps {
  modelName: string;
  sourceSites: string[];
  onAddSourceSite: (site: string) => void;
  onRemoveSourceSite: (site: string) => void;
  safetySettings: SafetySetting[];
}

const AiConfigurationCard: FC<AiConfigurationCardProps> = ({
  modelName,
  sourceSites,
  onAddSourceSite,
  onRemoveSourceSite,
  safetySettings,
}) => {
  const [newSourceSite, setNewSourceSite] = useState('');

  const handleAddSite = () => {
    if (newSourceSite.trim()) {
      // Basic URL validation (optional, can be improved)
      try {
        new URL(newSourceSite.trim()); // Check if it's a valid URL structure
        if (!sourceSites.includes(newSourceSite.trim())) {
            onAddSourceSite(newSourceSite.trim());
            setNewSourceSite('');
        } else {
            // Optionally, notify user that site already exists
            console.warn("Source site already exists");
        }
      } catch (_) {
        // Optionally, notify user of invalid URL
        console.warn("Invalid URL format");
        return;
      }
    }
  };

  return (
    <Card className="mt-6 mb-6">
      <CardHeader>
        <CardTitle>AI Configuration</CardTitle>
        <CardDescription>Manage settings related to GenAI features.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="modelName" className="flex items-center text-sm font-medium">
            <Info className="mr-2 h-4 w-4 text-muted-foreground" />
            Current AI Model
          </Label>
          <Input id="modelName" value={modelName} readOnly className="mt-1 bg-muted/50 text-sm" />
          <p className="text-xs text-muted-foreground mt-1">
            This is the primary model used for content generation tasks.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="newSourceSite" className="text-sm font-medium">Manage Source Sites (URLs)</Label>
          <div className="flex gap-2">
            <Input
              id="newSourceSite"
              value={newSourceSite}
              onChange={(e) => setNewSourceSite(e.target.value)}
              placeholder="https://example.com/news-source"
              className="text-sm"
            />
            <Button onClick={handleAddSite} variant="outline" size="icon" aria-label="Add Source Site">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
          {sourceSites.length > 0 && (
            <ScrollArea className="h-32 w-full rounded-md border p-2 mt-2 bg-background">
              <div className="space-y-1.5">
                {sourceSites.map((site) => (
                  <div key={site} className="flex items-center justify-between p-2 bg-muted/40 rounded-md text-sm">
                    <span className="truncate flex-grow mr-2" title={site}>{site}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => onRemoveSourceSite(site)}
                      aria-label={`Remove ${site}`}
                    >
                      <XCircle className="h-4 w-4 text-destructive hover:text-destructive/80" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
           <p className="text-xs text-muted-foreground mt-1">
            List of trusted URLs. (Currently informational, not yet used by AI flows).
          </p>
        </div>

        <div>
          <Label className="flex items-center text-sm font-medium">
             <Info className="mr-2 h-4 w-4 text-muted-foreground" />
            Current Safety Settings (Informational)
            </Label>
          <ScrollArea className="h-40 mt-1 w-full rounded-md border p-3 bg-muted/50">
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(safetySettings, null, 2)}
            </pre>
          </ScrollArea>
           <p className="text-xs text-muted-foreground mt-1">
            These are the default safety configurations for the AI model. Modifying these typically requires code changes and a server restart.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Changes to source sites are managed locally for this session. AI Model and Safety Settings are informational.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AiConfigurationCard;
