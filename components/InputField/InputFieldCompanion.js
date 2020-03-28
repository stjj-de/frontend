import debounce from "lodash.debounce";

const ALLOWED_TYPES = ["text", "password", "number"];

export class InputFieldCompanion {
  constructor({
    defaultValue = "",
    type = "text",
    keepShowingState = true,
    validate = null,
    validateOrSaveAsync = null,
    debounceWait = 800,
    disabled = false,
    transform = null,
    min,
    max,
    stepSize
  }) {
    if (!ALLOWED_TYPES.includes(type)) {
      throw new Error("type must be 'text', 'number' or 'password'");
    }

    this.type = type;
    this.value = defaultValue;
    this.keepShowingState = keepShowingState;
    this.validate = validate;
    this.validateOrSaveAsync = validateOrSaveAsync;
    this.disabled = disabled;
    this.transform = transform;
    this._state = null;
    this._error = null;
    this._lazyErrorText = "";
    this._cancelValidateOrSaveHandlers = [];
    this._instance = null; // is set by the component
    this.touched = false;
    this.min = min;
    this.max = max;
    this.stepSize = stepSize === undefined ? 1 : stepSize;

    if ([min, max, stepSize].some(value => value !== undefined)) {
      if (this.type !== "number") {
        throw new Error("min, max and stepSize are only allowed with type 'number'.");
      }
    }

    this._debouncedRunValidateOrSaveAsync = debounce(this._runValidateOrSaveAsync, debounceWait);

    this._runValidate();
  }

  get valid() {
    return this._error === null && this._state !== "loading";
  }

  get transformedValue() {
    return this.transform === null ? this.value : this.transform(this.value);
  }

  touch() {
    this.touched = true;
  }

  setError(error, focus = false) {
    if (error === null) return;

    this._error = error;
    this._lazyErrorText = this._error;

    if (focus) {
      this.focus();
    }
  }

  focus() {
    this._instance.focus();
  }

  _onChange() {
    this._runValidate();

    if (this._error === null && this.validateOrSaveAsync !== null) {
      this._state = "loading";
      this._debouncedRunValidateOrSaveAsync();
    }
  }

  _runValidate() {
    this._error = this.validate === null ? null : this.validate(this.transformedValue) || null;

    if (this._error !== null) {
      this._lazyErrorText = this._error;
      this._state = null;
    }
  }

  _runValidateOrSaveAsync() {
    this._cancelValidateOrSaveHandlers.forEach(handler => handler());
    this._cancelValidateOrSaveHandlers = [];

    const { transformedValue } = this;

    if (this.validateOrSaveAsync === null) {
      this._state = null;
    } else {
      this.validateOrSaveAsync(transformedValue, handler => {
        this._cancelValidateOrSaveHandlers.push(handler);
      }).then(error => {
        if (transformedValue !== this.transformedValue) return;

        if (error) {
          this._error = error;
          this._lazyErrorText = this._error;
          this._state = "failed";
        } else {
          this._error = null;
          this._state = "success";
        }
      });
    }
  }
}
