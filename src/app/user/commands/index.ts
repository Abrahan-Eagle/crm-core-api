import { AddRoleToUserCommandHandler } from './add-role-to-user.command-handler';
import { CreateAffiliateCommandHandler } from './create-affiliate.command-handler';
import { CreateUserCommandHandler } from './create-user.command-handler';
import { DisableUserCommandHandler } from './disable-user.command-handler';
import { EnableUserCommandHandler } from './enable-user.command-handler';
import { MakeACallCommandHandler } from './make-a-call.command-handler';
import { MakeACustomCallCommandHandler } from './make-a-custom-call.command-handler';
import { RemoveRoleFromUserCommandHandler } from './remove-role-from-user.command-handler';
import { UpdateMyProfileCommandHandler } from './update-my-profile.command-handler';
import { UpdateUserCommandHandler } from './update-user.command-handler';

export const UserCommandHandlers = [
  AddRoleToUserCommandHandler,
  CreateAffiliateCommandHandler,
  CreateUserCommandHandler,
  DisableUserCommandHandler,
  EnableUserCommandHandler,
  MakeACallCommandHandler,
  MakeACustomCallCommandHandler,
  RemoveRoleFromUserCommandHandler,
  UpdateMyProfileCommandHandler,
  UpdateUserCommandHandler,
];
