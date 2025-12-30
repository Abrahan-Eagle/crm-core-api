import { TransformFnParams } from 'class-transformer';

export function HideSSNTransformer({ hideOptionName = 'hideSSN' }: { hideOptionName?: string } = {}) {
  return ({ obj, options }: TransformFnParams) => {
    const shouldHideSSN = (options as any)?.[hideOptionName];

    return shouldHideSSN ? `***-**-**${obj.ssn?.slice(-2) ?? ''}` : obj.ssn;
  };
}
