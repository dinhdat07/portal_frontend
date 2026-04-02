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
      <PageHeader eyebrow="Backend Guardrail" title={title} description={description} />
      <Card className="p-6">
        <Alert
          tone="warning"
          title="Intentionally disabled"
          description="This frontend keeps unsupported backend behavior out of the UI instead of exposing unreliable forms."
        />
      </Card>
    </div>
  );
}
