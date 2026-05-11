import { useQuestionnaireCtx } from './context';
import { isEnabled } from './enableWhen';
import type { QuestionnaireItem } from './types';

export function ItemRenderer({ item }: { item: QuestionnaireItem }) {
  const { answers, registry } = useQuestionnaireCtx();
  if (!isEnabled(item, answers)) return null;
  const Renderer = registry[item.type];
  if (!Renderer) {
    return (
      <div data-fhir-unsupported={item.type}>
        Unsupported item type: <code>{item.type}</code> ({item.linkId})
      </div>
    );
  }
  return <Renderer item={item} />;
}
