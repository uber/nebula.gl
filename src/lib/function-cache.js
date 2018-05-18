// @flow

type ExtractReturnType = <R>((...args: mixed) => R) => R;

export default class FunctionCache<T: Function, UT = any> {
  _function: T;
  _lastParameters: ?Array<mixed>;
  _lastResult: $Call<ExtractReturnType, T>;
  _updateTrigger: UT;

  constructor(targetFunction: T) {
    this._function = targetFunction;
  }

  _compareArgs(args: Array<mixed>): boolean {
    if (!this._lastParameters) {
      return false;
    }

    if (this._lastParameters.length !== args.length) {
      return false;
    }

    for (let i = 0; i < args.length; i++) {
      if (this._lastParameters[i] !== args[i]) {
        return false;
      }
    }

    return true;
  }

  call: T;
  call(...args: *): $Call<ExtractReturnType, T> {
    if (this._compareArgs(args) === false) {
      this._lastResult = this._function.apply(null, args);
      this._lastParameters = args;
    }

    return this._lastResult;
  }

  invalidate(): FunctionCache<T> {
    this._lastParameters = null;
    return this;
  }

  updateTrigger(updateTrigger: UT): FunctionCache<T> {
    if (this._updateTrigger !== updateTrigger) {
      this._updateTrigger = updateTrigger;
      this.invalidate();
    }

    return this;
  }
}
