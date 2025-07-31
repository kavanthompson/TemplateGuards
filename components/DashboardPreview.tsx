
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPreview() {
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    fetch('/api/mock-usage')
      .then(res => res.json())
      .then(data => setUsage(data));
  }, []);

  if (!usage) return <p className="text-center p-6">Loading dashboard preview...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">📊 TemplateGuard Usage Summary</h2>
      <Card>
        <CardContent className="space-y-2 p-4">
          <p><strong>Templates Used:</strong> {usage.templatesUsed}</p>
          <p><strong>Phrases Favorited:</strong> {usage.favorites}</p>
          <p><strong>Estimated Time Saved:</strong> {usage.minutesSaved} minutes</p>
          <p><strong>Most Used Tags:</strong> {usage.topTags.join(', ')}</p>
          <p><strong>Reports With vs Without Tool:</strong></p>
          <ul className="list-disc list-inside">
            <li><strong>With Tool:</strong> {usage.reportsWithTool}</li>
            <li><strong>Without Tool:</strong> {usage.reportsWithoutTool}</li>
          </ul>
        </CardContent>
      </Card>
      <Button className="w-full">📥 Download Shift Report</Button>
    </div>
  );
}
