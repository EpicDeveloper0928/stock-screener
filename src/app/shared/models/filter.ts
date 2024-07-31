export type FilterType =
  | 'below'
  | 'belowOrEqual'
  | 'above'
  | 'aboveOrEqual'
  | 'between'
  | 'notBetween'
  | 'equal'
  | 'notEqual';

export interface IFilterItem {
  type: FilterType;
  min: number;
  max?: number;
}
