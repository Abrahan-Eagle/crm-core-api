import { AddressResolver } from './address-resolver.service';
import { AppClonerService } from './app-cloner.service';

export * from './app-cloner.service';

export const ApplicationServices = [AppClonerService, AddressResolver];
