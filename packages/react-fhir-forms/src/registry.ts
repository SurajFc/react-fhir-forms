import type { ComponentType } from 'react';
import type { ItemType, QuestionnaireItem } from './types';

export interface RendererProps {
  item: QuestionnaireItem;
}

export type RendererRegistry = Partial<Record<ItemType, ComponentType<RendererProps>>>;
