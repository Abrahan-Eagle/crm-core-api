export enum Permission {
  // CONTACTS
  CREATE_CONTACT = 'create:contact',
  READ_CONTACT = 'read:contact',
  READ_OWN_CONTACT = 'read-own:contact',
  LIST_CONTACTS = 'list:contact',
  LIST_OWN_CONTACTS = 'list-own:contact',
  DELETE_CONTACT = 'delete:contact',
  UPDATE_CONTACT = 'update:contact',

  // BANKS
  CREATE_BANK = 'create:bank',
  READ_BANK = 'read:bank',
  LIST_BANKS = 'list:bank',
  DELETE_BANK = 'delete:bank',
  UPDATE_BANK = 'update:bank',
  SEND_EMAIL_TO_BANKS = 'send-email:bank',

  // APPLICATIONS
  CREATE_APPLICATION = 'create:application',
  READ_APPLICATION = 'read:application',
  LIST_APPLICATIONS = 'list:application',
  DELETE_APPLICATION = 'delete:application',
  UPDATE_APPLICATION = 'update:application',
  SEND_APPLICATION = 'send:application',
  READ_OWN_APPLICATION = 'read-own:application',
  LIST_OWN_APPLICATION = 'list-own:application',
  TRANSFER_APPLICATION = 'transfer:application',
  VIEW_FULL_NOTIFICATION = 'view_full_notification:application',

  // DRAFTS
  READ_DRAFT_APPLICATION = 'read:draft-application',
  READ_OWN_DRAFT_APPLICATION = 'read:own-draft-application',
  DELETE_DRAFT_APPLICATION = 'delete:draft-application',
  CREATE_DRAFT_APPLICATION = 'create:draft-application',
  UPDATE_DRAFT_APPLICATION = 'update:draft-application',
  PUBLISH_DRAFT_APPLICATION = 'publish:draft-application',
  LIST_DRAFT_APPLICATIONS = 'list:draft-application',
  LIST_OWN_DRAFT_APPLICATIONS = 'list:own-draft-application',
  TRANSFER_DRAFT = 'transfer:draft-application',

  // COMPANY
  CREATE_COMPANY = 'create:company',
  READ_COMPANY = 'read:company',
  READ_OWN_COMPANY = 'read-own:company',
  LIST_COMPANIES = 'list:company',
  DELETE_COMPANY = 'delete:company',
  UPDATE_COMPANY = 'update:company',
  LIST_OWN_COMPANIES = 'list-own:company',
  TRANSFER_COMPANY = 'transfer:company',

  // GENERAL
  VIEW_FULL_SSN = 'view:full_ssn',
  VIEW_FULL_PHONE = 'view:full_phone',
  VIEW_FULL_TAX_ID = 'view:full_tax_id',
  VIEW_FULL_EMAIL = 'view:full_email',

  // COMMISSIONS
  UPDATE_COMMISSION = 'update:commission',
  READ_COMMISSION = 'read:commission',
  LIST_COMMISSIONS = 'list:commission',
  PUBLISH_COMMISSION = 'publish:commission',

  // USERS
  LIST_USER = 'list:user',
  CREATE_USER = 'create:user',
  UPDATE_USER = 'update:user',

  // NOTES
  ADD_CONTACT_NOTE = 'create-note:contact',
  DELETE_CONTACT_NOTE = 'delete-note:contact',
  ADD_COMPANY_NOTE = 'create-note:company',
  DELETE_COMPANY_NOTE = 'delete-note:company',

  // Leads
  CREATE_LEAD = 'create:lead',
  READ_LEAD = 'read:lead',
  LIST_LEADS = 'list:lead',
  DELETE_LEAD = 'delete:lead',
  LIST_OWN_LEADS = 'list-own:lead',
  ADD_PROSPECT_NOTE = 'create-note:prospect',
  TRANSFER_LEAD = 'transfer:lead',

  // Calls
  REQUEST_CALL = 'create:call',
  REQUEST_CUSTOM_CALL = 'create:custom-call',

  // Campaigns
  LIST_CAMPAIGNS = 'list:campaign',
  CREATE_CAMPAIGN = 'create:campaign',

  // Dashboard
  READ_DASHBOARD = 'read:dashboard',
}
