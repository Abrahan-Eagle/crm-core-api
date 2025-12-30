import { TransformFnParams } from 'class-transformer';

export function HideValueTransformer({ hideOptionName = 'hideValue' }: { hideOptionName?: string } = {}) {
  return ({ obj, options, key }: TransformFnParams) => {
    const shouldHideValue = (options as any)?.[hideOptionName];

    return shouldHideValue ? `******` : obj[key];
  };
}
