import * as moment from 'moment';

export const NODE_ENV = process.env.NODE_ENV || 'development';

export enum NODE_ENVIRONMENT {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export const ERROR_LOGS_LOCATION = () =>
  `logs/error/${new Date().toDateString()}-error.log`;
export const INFO_LOGS_LOCATION = () =>
  `logs/info/${new Date().toDateString()}-info.log`;

export function generateNumbers(range: number): string {
  let output = '';
  const max = 1;
  const min = 9;

  Array.from(
    { length: range },
    () => (output += Math.floor(Math.random() * (max - min + 1) + min)),
  );

  return output;
}

export const saltRounds = 10;
type transformValueTypes =
  | 'upper'
  | 'lower'
  | 'datetime'
  | 'date'
  | 'time'
  | 'number'
  | 'currency'
  | 'zeropad'
  | 'tofixed'
  | 'number-string'
  | 'currency-string';
export const transformValue = (transform: transformValueTypes, value: any) => {
  let _value = undefined;

  const zeroPad = (num, places) => String(num).padStart(places, '0');
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  switch (transform) {
    case 'upper':
      return value.toUpperCase();
    case 'lower':
      return value.toLowerCase();
    case 'datetime':
      _value = moment(value).format('YYYY-MM-DDTHH:mm:ss');
      // _value = moment(value).utc().format('YYYY-MM-DDTHH:mm:ss');
      if (_value !== 'Invalid date') {
        value = _value;
      }
      return value;
    case 'date':
      // _value = moment(value).utc().format('YYYY-MM-DD');
      _value = moment(value).format('YYYY-MM-DD');
      if (_value !== 'Invalid date') {
        value = _value;
      }
      return value;
    case 'time':
      return moment(value).format('HH:mm');
    case 'number':
      return parseFloat(value);
    case 'currency':
      return parseFloat(value).toFixed(2);
    case 'zeropad':
      value = zeroPad(value, 2);
      return value;
    case 'tofixed':
      value = parseFloat(value).toFixed(2);
      return value;
    case 'number-string':
      value = numberWithCommas(value);
      return value;
    case 'currency-string':
      value = parseFloat(value).toFixed(2);
      value = numberWithCommas(value);
      return value;
    default:
      return value;
  }
};

export const getDateDiffFromNow = (
  date: Date,
  returnUnit: moment.unitOfTime.DurationConstructor,
) => {
  const dateA = moment();
  const dateB = moment(date).subtract(1, 'hours');

  const diffMinutes = dateA.diff(dateB, returnUnit);
  return diffMinutes;
};
