import { Alert } from './Alert';
import { Card } from './Card';
import { PageHeader } from './PageHeader';

export function FeatureUnavailablePage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Unavailable" title={title} description={description} />
      <Card className="p-6">
        <Alert
          tone="warning"
          title="Not available right now"
          description="This section is temporarily unavailable. Please use the other available pages for now."
        />
      </Card>
    </div>
  );
}
