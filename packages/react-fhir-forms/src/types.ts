export type ItemType =
  | 'group'
  | 'display'
  | 'string'
  | 'text'
  | 'integer'
  | 'decimal'
  | 'boolean'
  | 'date'
  | 'dateTime'
  | 'choice'
  | 'open-choice';

export interface Coding {
  system?: string;
  code: string;
  display?: string;
}

export interface AnswerOption {
  valueCoding?: Coding;
  valueString?: string;
  valueInteger?: number;
}

export type EnableWhenOperator = '=' | '!=' | 'exists' | '>' | '<' | '>=' | '<=';

export interface EnableWhen {
  question: string;
  operator: EnableWhenOperator;
  answerString?: string;
  answerInteger?: number;
  answerDecimal?: number;
  answerBoolean?: boolean;
  answerDate?: string;
  answerDateTime?: string;
  answerCoding?: Coding;
}

export interface QuestionnaireItem {
  linkId: string;
  text?: string;
  type: ItemType;
  required?: boolean;
  repeats?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  enableWhen?: EnableWhen[];
  enableBehavior?: 'all' | 'any';
  answerOption?: AnswerOption[];
  item?: QuestionnaireItem[];
  // Loose extension support — consumers can read these in custom renderers.
  extension?: Array<{ url: string; [key: string]: unknown }>;
}

export interface Questionnaire {
  resourceType: 'Questionnaire';
  id?: string;
  url?: string;
  title?: string;
  status?: 'draft' | 'active' | 'retired' | 'unknown';
  item: QuestionnaireItem[];
}

// Internal answer representation — always an array (handles repeats uniformly).
export type AnswerValue =
  | { kind: 'string'; value: string }
  | { kind: 'integer'; value: number }
  | { kind: 'decimal'; value: number }
  | { kind: 'boolean'; value: boolean }
  | { kind: 'date'; value: string }
  | { kind: 'dateTime'; value: string }
  | { kind: 'coding'; value: Coding };

export type AnswerState = Record<string, AnswerValue[]>;

// QuestionnaireResponse output types (FHIR R4 subset).
export interface QuestionnaireResponseAnswer {
  valueString?: string;
  valueInteger?: number;
  valueDecimal?: number;
  valueBoolean?: boolean;
  valueDate?: string;
  valueDateTime?: string;
  valueCoding?: Coding;
  item?: QuestionnaireResponseItem[];
}

export interface QuestionnaireResponseItem {
  linkId: string;
  text?: string;
  answer?: QuestionnaireResponseAnswer[];
  item?: QuestionnaireResponseItem[];
}

export interface QuestionnaireResponse {
  resourceType: 'QuestionnaireResponse';
  questionnaire?: string;
  status: 'in-progress' | 'completed';
  authored?: string;
  item: QuestionnaireResponseItem[];
}

export interface ValidationIssue {
  linkId: string;
  message: string;
}
