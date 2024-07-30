import { FilterType } from '../models/filter';

export function filterByType(
  type: FilterType,
  value: number,
  min: number,
  max?: number
) {
  switch (type) {
    case 'above':
      return value > min;
    case 'aboveOrEqual':
      return value >= min;
    case 'below':
      return value < min;
    case 'belowOrEqual':
      return value <= min;
    case 'between':
      return max && value >= min && value <= max;
    case 'notBetween':
      return value < min || (max && value > max);
    case 'equal':
      return value === min;
    case 'notEqual':
      return value !== min;
    default:
      return false;
  }
}
