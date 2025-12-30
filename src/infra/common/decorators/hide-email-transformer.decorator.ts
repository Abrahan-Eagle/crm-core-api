import { TransformFnParams } from 'class-transformer';

export function HideEmailTransformer({ hideOptionName = 'hideEmail' }: { hideOptionName?: string } = {}) {
  return ({ obj, options }: TransformFnParams) => {
    const shouldHideEmail = (options as any)?.[hideOptionName];

    const hideEmail = (email: string) => {
      const [username, domain] = email.split('@');
      return `***${username.slice(-3)}@${domain}`;
    };

    return (obj.emails as string[])?.map((email) => (shouldHideEmail ? hideEmail(email) : email)) ?? [];
  };
}
