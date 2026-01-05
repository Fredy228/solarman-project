"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type {
  ConditionalFilter,
  CrudFilter,
  CrudFilters,
  LogicalFilter,
} from "@refinedev/core";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  DataGridMultiFilterProps,
  MultiFilterFieldConfig,
  MultiFilterLabels,
  MultiFilterRule,
  MultiFilterRuleValue,
} from "./types";

const defaultLabels: MultiFilterLabels = {
  title: "Filters",
  add: "Add filter",
  apply: "Apply",
  reset: "Reset",
  empty: "No filters selected",
  fieldLabel: "Field",
  operatorLabel: "Operator",
};

const isConditionalFilter = (
  filter: CrudFilter
): filter is ConditionalFilter => {
  if (!("operator" in filter)) {
    return false;
  }

  return filter.operator === "or" || filter.operator === "and";
};

const flattenFilters = (filters?: CrudFilters): LogicalFilter[] => {
  if (!filters || filters.length === 0) {
    return [];
  }

  const logical: LogicalFilter[] = [];
  const walk = (items: CrudFilters) => {
    items.forEach((item) => {
      if (isConditionalFilter(item)) {
        walk(item.value as CrudFilters);
      } else {
        logical.push(item);
      }
    });
  };

  walk(filters);

  return logical;
};

const createRuleId = () => Math.random().toString(36).slice(2, 11);

const parseRuleValue = (
  value: MultiFilterRuleValue,
  field?: MultiFilterFieldConfig
) => {
  if (field?.valueParser) {
    return field.valueParser(value);
  }

  if (value === "" || value === undefined) {
    return undefined;
  }

  if (field?.type === "number") {
    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? undefined : numericValue;
  }

  return value;
};

const buildCrudFilters = (
  rules: MultiFilterRule[],
  fieldsMap: Record<string, MultiFilterFieldConfig>
): CrudFilters => {
  const logical: LogicalFilter[] = [];

  rules.forEach((rule) => {
    const field = fieldsMap[rule.field];
    if (!field) {
      return;
    }

    const parsedValue = parseRuleValue(rule.value, field);
    if (parsedValue === undefined || parsedValue === null) {
      return;
    }

    logical.push({
      field: rule.field,
      operator: rule.operator,
      value: parsedValue,
    });
  });

  if (logical.length === 0) {
    return [];
  }

  return logical;
};

const getRuleDisplayValue = (
  rule: MultiFilterRule,
  field?: MultiFilterFieldConfig
): string => {
  if (!field) {
    return String(rule.value ?? "");
  }

  if (field.valueFormatter) {
    return field.valueFormatter(rule.value);
  }

  if (field.type === "select" && field.options) {
    const option = field.options.find((opt) => opt.value === rule.value);
    return option?.label ?? String(rule.value ?? "");
  }

  if (field.type === "date" && rule.value) {
    const d = dayjs(String(rule.value));
    return d.isValid() ? d.format("DD.MM.YYYY") : String(rule.value);
  }

  return String(rule.value ?? "");
};

export const DataGridMultiFilter = ({
  fields,
  filters,
  onApply,
  labels,
  isLoading = false,
  disableChips = false,
}: DataGridMultiFilterProps) => {
  const mergedLabels = { ...defaultLabels, ...labels };

  const fieldsMap = useMemo(
    () =>
      fields.reduce<Record<string, MultiFilterFieldConfig>>((acc, field) => {
        acc[field.field] = field;
        return acc;
      }, {}),
    [fields]
  );

  const [rules, setRules] = useState<MultiFilterRule[]>(() =>
    flattenFilters(filters).map((filter) => {
      const fieldConfig = fields.find((f) => f.field === filter.field);
      let displayValue: any = filter.value;
      if (fieldConfig?.type === "number" && typeof filter.value === "number") {
        displayValue = filter.value / 100;
      }
      if (fieldConfig?.type === "date" && filter.value) {
        // convert ISO/Date string to input-friendly yyyy-MM-dd
        const d = dayjs(filter.value as string);
        displayValue = d.isValid()
          ? d.format("YYYY-MM-DD")
          : String(filter.value);
      }

      return {
        id: createRuleId(),
        field: filter.field,
        operator: filter.operator,
        value: displayValue,
      };
    })
  );

  useEffect(() => {
    let isActive = true;
    const nextRules = flattenFilters(filters).map((filter) => {
      const fieldConfig = fields.find((f) => f.field === filter.field);
      let displayValue: any = filter.value;
      if (fieldConfig?.type === "number" && typeof filter.value === "number") {
        displayValue = filter.value / 100;
      }
      if (fieldConfig?.type === "date" && filter.value) {
        const d = dayjs(filter.value as string);
        displayValue = d.isValid()
          ? d.format("YYYY-MM-DD")
          : String(filter.value);
      }

      return {
        id: createRuleId(),
        field: filter.field,
        operator: filter.operator,
        value: displayValue,
      };
    });

    Promise.resolve().then(() => {
      if (isActive) {
        setRules(nextRules);
      }
    });

    return () => {
      isActive = false;
    };
  }, [filters]);

  const availableFields = useMemo(
    () => fields.filter((f) => !rules.some((r) => r.field === f.field)),
    [fields, rules]
  );

  const handleAddRule = () => {
    const fieldToAdd = fields.find(
      (f) => !rules.some((r) => r.field === f.field)
    );
    if (!fieldToAdd) {
      return;
    }

    const operator = fieldToAdd.operators[0]?.value ?? "eq";

    setRules((prev) => [
      ...prev,
      {
        id: createRuleId(),
        field: fieldToAdd.field,
        operator,
        value: undefined,
      },
    ]);
  };

  const handleRemoveRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
  }, []);

  const handleRuleChange = <K extends keyof MultiFilterRule>(
    id: string,
    key: K,
    value: MultiFilterRule[K]
  ) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              [key]: value,
            }
          : rule
      )
    );
  };

  const handleFieldChange = (id: string, nextField: string) => {
    const fallback = fieldsMap[nextField]?.operators[0]?.value ?? "eq";
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              field: nextField,
              operator: fallback,
              value: undefined,
            }
          : rule
      )
    );
  };

  const handleApply = async () => {
    const nextFilters = buildCrudFilters(rules, fieldsMap);
    await onApply(nextFilters);
  };

  const handleReset = async () => {
    setRules([]);
    await onApply([]);
  };

  const activeRules = rules.filter(
    (rule) =>
      rule.value !== undefined && rule.value !== null && rule.value !== ""
  );

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterAltIcon fontSize="small" />
            <Typography variant="subtitle1">{mergedLabels.title}</Typography>
          </Stack>
        </Stack>

        {rules.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {mergedLabels.empty}
          </Typography>
        ) : (
          <Stack spacing={1}>
            {rules.map((rule) => {
              const field = fieldsMap[rule.field] ?? fields[0];
              return (
                <Card key={rule.id} variant="outlined" sx={{ p: 1 }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1}
                    alignItems={{ xs: "stretch", md: "center" }}
                  >
                    <TextField
                      select
                      label={mergedLabels.fieldLabel}
                      size="small"
                      value={rule.field}
                      onChange={(event) =>
                        handleFieldChange(rule.id, event.target.value)
                      }
                      sx={{ minWidth: 160 }}
                    >
                      {fields.map((filterField) => (
                        <MenuItem
                          key={filterField.field}
                          value={filterField.field}
                          disabled={rules.some(
                            (r) =>
                              r.id !== rule.id && r.field === filterField.field
                          )}
                        >
                          {filterField.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      label={mergedLabels.operatorLabel}
                      size="small"
                      value={rule.operator}
                      onChange={(event) =>
                        handleRuleChange(
                          rule.id,
                          "operator",
                          event.target.value as MultiFilterRule["operator"]
                        )
                      }
                      sx={{ minWidth: 160 }}
                    >
                      {(field?.operators ?? []).map((operator) => (
                        <MenuItem key={operator.value} value={operator.value}>
                          {operator.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    {field?.renderValueInput ? (
                      <Box flex={1}>
                        {field.renderValueInput({
                          field,
                          rule,
                          onChange: (value) =>
                            handleRuleChange(rule.id, "value", value),
                        })}
                      </Box>
                    ) : field?.type === "select" ? (
                      <TextField
                        select
                        label={field?.placeholder ?? field?.label}
                        size="small"
                        value={rule.value ?? ""}
                        onChange={(event) =>
                          handleRuleChange(rule.id, "value", event.target.value)
                        }
                        sx={{ minWidth: 180 }}
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        {(field?.options ?? []).map((option) => (
                          <MenuItem
                            key={String(option.value)}
                            value={String(option.value)}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <TextField
                        label={field?.placeholder ?? field?.label}
                        size="small"
                        type={
                          field?.type === "number"
                            ? "number"
                            : field?.type === "date"
                              ? "date"
                              : "text"
                        }
                        value={rule.value ?? ""}
                        onChange={(event) =>
                          handleRuleChange(rule.id, "value", event.target.value)
                        }
                        InputLabelProps={
                          field?.type === "date" ? { shrink: true } : undefined
                        }
                        fullWidth
                      />
                    )}
                    <IconButton onClick={() => handleRemoveRule(rule.id)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        )}

        {!disableChips && activeRules.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {activeRules.map((rule) => {
              const field = fieldsMap[rule.field];
              const operatorLabel = field?.operators.find(
                (item) => item.value === rule.operator
              )?.label;

              return (
                <Chip
                  key={rule.id}
                  label={`${field?.label ?? rule.field} ${operatorLabel ? `(${operatorLabel})` : ""} ${getRuleDisplayValue(
                    rule,
                    field
                  )}`.trim()}
                  onDelete={() => handleRemoveRule(rule.id)}
                />
              );
            })}
          </Stack>
        )}

        <Divider />

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={handleAddRule}
            disabled={availableFields.length === 0}
          >
            {mergedLabels.add}
          </Button>
          <Button
            startIcon={<FilterAltIcon />}
            variant="contained"
            onClick={handleApply}
            disabled={isLoading}
          >
            {mergedLabels.apply}
          </Button>
          <Button
            startIcon={<RestartAltIcon />}
            color="secondary"
            variant="text"
            onClick={handleReset}
            disabled={isLoading}
          >
            {mergedLabels.reset}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default DataGridMultiFilter;
