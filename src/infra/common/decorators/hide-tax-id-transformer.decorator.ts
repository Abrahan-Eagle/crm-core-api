import { TransformFnParams } from 'class-transformer';

export function HideTaxIdTransformer({ hideOptionName = 'hideTaxId' }: { hideOptionName?: string } = {}) {
  return ({ obj, options }: TransformFnParams) => {
    const shouldHideTaxId = (options as any)?.[hideOptionName];

    return shouldHideTaxId ? `**-****${obj.tax_id?.slice(-3) ?? ''}` : obj.tax_id;
  };
}
