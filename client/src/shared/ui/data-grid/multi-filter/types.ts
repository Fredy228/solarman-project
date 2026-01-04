import type { CrudFilters, CrudOperators } from "@refinedev/core";
import type { ReactNode } from "react";

export type MultiFilterOperatorOption = {
  value: Exclude<CrudOperators, "or" | "and">;
  label: string;
};

export type MultiFilterOption = {
  label: string;
  value: string | number;
};

export type MultiFilterValueType = "text" | "number" | "select" | "date";

export type MultiFilterRuleValue = string | number | boolean | null | undefined;

export type MultiFilterRule = {
  id: string;
  field: string;
  operator: Exclude<CrudOperators, "or" | "and">;
  value: MultiFilterRuleValue;
};

export type MultiFilterValueInputProps = {
  field: MultiFilterFieldConfig;
  rule: MultiFilterRule;
  onChange: (value: MultiFilterRuleValue) => void;
};

export type MultiFilterFieldConfig = {
  field: string;
  label: string;
  operators: MultiFilterOperatorOption[];
  type?: MultiFilterValueType;
  options?: MultiFilterOption[];
  placeholder?: string;
  valueParser?: (value: MultiFilterRuleValue) => unknown;
  valueFormatter?: (value: MultiFilterRuleValue) => string;
  renderValueInput?: (props: MultiFilterValueInputProps) => ReactNode;
};

export type MultiFilterLabels = {
  title: string;
  add: string;
  apply: string;
  reset: string;
  empty: string;
  fieldLabel: string;
  operatorLabel: string;
};

export type DataGridMultiFilterProps = {
  fields: MultiFilterFieldConfig[];
  filters?: CrudFilters;
  onApply: (filters: CrudFilters) => void | Promise<void>;
  labels?: Partial<MultiFilterLabels>;
  isLoading?: boolean;
  disableChips?: boolean;
};
