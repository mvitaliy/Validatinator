const ALPHA_REGEX = new RegExp(/^[a-zA-Z]*$/);
const ALPHA_DASH_REGEX = new RegExp(/^[a-zA-Z-_]*$/);
const ALPHA_NUMERIC_REGEX = new RegExp(/^[a-zA-Z0-9]*$/);
const ALPHA_NUMERIC_DASH_REGEX = new RegExp(/^[a-zA-Z0-9-_]*$/);
const EMAIL_REGEX = new RegExp(
    /^([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/
);
const IPV4_REGEX = new RegExp(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
const URL_REGEX = new RegExp(/^(https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/);

const MIN_BYTE_VALUE = 0;
const MAX_BYTE_VALUE = 255;

export class HTMLFormValidations {

  /**
   * Checks to see if the field has been accepted.
   *
   * Note: Only works on checkboxes.
   */
  static accepted(form: HTMLFormElement, field: HTMLInputElement) {
    if (!!field) return field.checked === true;
  }

  /**
   * Ensures the value of the field only contains alpha characters.
   */
  static alpha(form: HTMLFormElement, field: HTMLInputElement) {
    return (field.value?.length ?? 0) > 0 ? ALPHA_REGEX.test(field.value) : true;
  }

  static alphaDash(form: HTMLFormElement, field: HTMLInputElement) {
    return (field.value?.length ?? 0) > 0 ? ALPHA_DASH_REGEX.test(field.value) : true;
  }

  static alphaNum(form: HTMLFormElement, field: HTMLInputElement) {
    return (field.value?.length ?? 0) > 0 ? ALPHA_NUMERIC_REGEX.test(field.value) : true;
  }

  static alphaDashNum(form: HTMLFormElement, field: HTMLInputElement) {
    return (field.value?.length ?? 0) > 0 ? ALPHA_NUMERIC_DASH_REGEX.test(field.value) : true;
  }

  static between(
    form: HTMLFormElement,
    field: HTMLInputElement,
    min: string | number,
    max: string | number
  ) {
    if (isNaN(min as number)) min = parseInt(min as string, 10);
    if (isNaN(max as number)) max = parseInt(max as string, 10);

    if (isNaN(min as number) || isNaN(max as number)) {
      throw new Error("min and max must both be numbers in the `between` validation.");
    }

    const value = parseInt(field.value, 10);
    return (!isNaN(value) && min <= value && value <= max);
  }

  static betweenLength(
    form: HTMLFormElement,
    field: HTMLInputElement,
    min: string | number,
    max: string | number
  ) {
    if (isNaN(min as number)) min = parseInt(min as string, 10);
    if (isNaN(max as number)) max = parseInt(max as string, 10);

    if (isNaN(min as number) || isNaN(max as number)) {
      throw new Error("min and max must both be numbers in the `betweenLength` validation.");
    }

    const valueLength = field.value?.length ?? 0;
    return (min <= valueLength && valueLength <= max);
  }

  static contains(form: HTMLFormElement, field: HTMLInputElement, ...arr: string[]) {
    return arr.indexOf(field.value) !== -1;
  }

  static dateBefore(form: HTMLFormElement, field: HTMLInputElement, date: string) {
    return Date.parse(field.value) < Date.parse(date);
  }

  static dateAfter(form: HTMLFormElement, field: HTMLInputElement, date: string) {
    return Date.parse(field.value) > Date.parse(date);
  }

  static different(
    form: HTMLFormElement,
    field: HTMLInputElement,
    otherField: HTMLInputElement | string,
    strict: string = "true"
  ) {
    return !HTMLFormValidations.same(form, field, otherField, strict);
  }

  static digitsLength(
    form: HTMLFormElement,
    field: HTMLInputElement,
    length: string | number
  ) {
    if (isNaN(parseInt(field.value))) {
      return false;
    }

    length = parseInt(length as string, 10);
    if (isNaN(length as number)) {
      throw new Error("length must be of numerical value in the `digitsLength` validation.");
    }

    const valueLength = field.value?.length ?? 0;
    return valueLength == length;
  }

  static digitsLengthBetween(
    form: HTMLFormElement,
    field: HTMLInputElement,
    minLength: string | number,
    maxLength: string | number
  ) {
    if (isNaN(parseInt(field.value))) {
      return false;
    }

    return HTMLFormValidations.betweenLength(form, field, minLength, maxLength);
  }

  static email(form: HTMLFormElement, field: HTMLInputElement) {
    return (field.value?.length ?? 0) > 0 ? EMAIL_REGEX.test(field.value) : true;
  }

  static ipvFour(form: HTMLFormElement, field: HTMLInputElement) {
    // Get an array with all four of our integer values.
    const ipvFourSegs = field.value?.match(IPV4_REGEX) ?? [];

    const isSegmentValid = (seg: string) => {
      if (seg === null || seg === undefined) return false;

      const segInt = parseInt(seg, 10);
      return segInt >= MIN_BYTE_VALUE && segInt <= MAX_BYTE_VALUE;
    }

    return (
      isSegmentValid(ipvFourSegs[1]) &&
      isSegmentValid(ipvFourSegs[2]) &&
      isSegmentValid(ipvFourSegs[3]) &&
      isSegmentValid(ipvFourSegs[4])
    );
  }

  static max(form: HTMLFormElement, field: HTMLInputElement, max: string | number) {
    return HTMLFormValidations.between(form, field, -Infinity, max);
  }

  static maxLength(form: HTMLFormElement, field: HTMLInputElement, maxLength: string | number) {
    if (!!field) return (field.value?.length ?? 0) > 0 ? HTMLFormValidations.betweenLength(form, field, -Infinity, maxLength) : true;
  }

  static min(form: HTMLFormElement, field: HTMLInputElement, min: string | number) {
    return HTMLFormValidations.between(form, field, min, Infinity);
  }

  static minLength(form: HTMLFormElement, field: HTMLInputElement, minLength: string | number) {
    if (!!field) return (field.value?.length ?? 0) > 0 ? HTMLFormValidations.betweenLength(form, field, minLength, Infinity) : true;
  }

  static notIn(form: HTMLFormElement, field: HTMLInputElement, ...arr: string[]) {
    return !HTMLFormValidations.contains(form, field, ...arr);
  }

  static number(form: HTMLFormElement, field: HTMLInputElement) {
    return !isNaN(parseFloat(field.value));
  }

  static required(form: HTMLFormElement, field: HTMLInputElement|HTMLFormElement) {
    if (!!field) {
      let value: any = field.value;

      if (!!(field as HTMLFormElement).options && !!(field as HTMLFormElement).options[(field as HTMLFormElement).selectedIndex].value) {
          value = (field as HTMLFormElement).options[(field as HTMLFormElement).selectedIndex].value;
      }
      return (value?.length ?? 0) > 0;
    }
  }

  static requiredIf(
    form: HTMLFormElement,
    field: HTMLInputElement,
    otherField: HTMLInputElement | string,
    value: any
  ) {
    if(typeof(otherField) == "string"){
      otherField = form.querySelector(otherField) as HTMLInputElement;
    }
    return otherField?.value != value || HTMLFormValidations.required(form, field);
  }

  static requiredIfNot(
    form: HTMLFormElement,
    field: HTMLInputElement,
    otherField: HTMLInputElement | string,
    value: any
  ) {
    if(typeof(otherField) == "string"){
      otherField = form.querySelector(otherField) as HTMLInputElement;
    }
    return otherField?.value == value || HTMLFormValidations.required(form, field);
  }

  static same(
    form: HTMLFormElement,
    field: HTMLInputElement,
    otherField: HTMLInputElement | string,
    strict: string = "true"
  ) {
    if(typeof(otherField) == "string"){
      otherField = form.querySelector(otherField) as HTMLInputElement;
    }
    return (strict.toLowerCase() == "true") ?
      field.value == otherField?.value :
      field.value?.toLowerCase() == otherField.value?.toLowerCase();
  }

  static typeString(form: HTMLFormElement, field: HTMLInputElement|any) {
    if (!!field) return (field.value?.length ?? 0) > 0 ? (typeof field.value === 'string' || field.value instanceof String) : true;
  }

  static trim(form: HTMLFormElement, field: HTMLInputElement) {
    if (!!field) {
      field.value = (field.value?.length ?? 0) > 0 ? field.value.trim() : field.value;

      return true;
    }
  }

  static url(form: HTMLFormElement, field: HTMLInputElement) {
    return (field.value?.length ?? 0) > 0 ? URL_REGEX.test(field.value) : true;
  }

  static pattern(form: HTMLFormElement, field: HTMLInputElement, regexString: string | RegExp) {
    if (!!field) {
      const regex = new RegExp(regexString);

      return (field.value?.length ?? 0) > 0 ? regex.test(field.value) : true;
    }
  }
}
