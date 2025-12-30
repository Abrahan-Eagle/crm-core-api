export const enum InjectionConstant {
  STORAGE_REPOSITORY = 'StorageRepository',
  BANK_REPOSITORY = 'BankRepository',
  USER_REPOSITORY = 'UserRepository',

  EXTERNAL_CONTACTS_REPOSITORY = 'ExternalContactsRepository',
  COMPANY_REPOSITORY = 'CompanyRepository',
  APPLICATION_REPOSITORY = 'ApplicationRepository',
  COMMISSION_REPOSITORY = 'CommissionRepository',
  INDUSTRY_REPOSITORY = 'IndustryRepository',
  IDENTITY_PROVIDER_REPOSITORY = 'IdentityProviderRepository',

  VOIP_PROVIDER_REPOSITORY = 'VoIPProviderRepository',

  NOTIFICATION_REPOSITORY = 'NotificationRepository',
  NOTIFICATION_API = 'NotificationAPI',

  TRANSACTION_SERVICE = 'TransactionService',
  SCHEDULER_SERVICE = 'SchedulerService',
  DEMOGRAPHICS_SERVICE = 'DemographicsService',
  MAILER_SERVICE = 'MailerService',
  URL_SIGNER_SERVICE = 'URLSignerService',

  LEAD_MODEL = 'Lead',
  PROSPECT_MODEL = 'Prospect',
  LEAD_REPOSITORY = 'LeadRepository',

  USER_MODEL = 'User',
  BANK_MODEL = 'Bank',
  CONTACT_MODEL = 'Contact',
  COMPANY_MODEL = 'Company',
  INDUSTRY_MODEL = 'Industry',
  APPLICATION_MODEL = 'Application',
  COMMISSION_MODEL = 'Commission',

  DRAFT_APPLICATION_REPOSITORY = 'DraftApplicationRepository',
  DRAFT_APPLICATION_MODEL = 'DraftApplication',

  CONTACT_REPOSITORY = 'ContactRepository',

  TENANT_CONFIG_MODEL = 'TenantConfig',

  CAMPAIGN_REPOSITORY = 'CampaignRepository',
  CAMPAIGN_MODEL = 'Campaign',
  COMPLAINT_MODEL = 'Complaint',
  CAMPAIGN_CONTACT_MODEL = 'CampaignContact',
}

export const enum CollectionNames {
  USER = 'users',
  LEAD = 'leads',
  PROSPECT = 'prospects',
  BANK = 'banks',
  INDUSTRY = 'industries',
  TENANT_CONFIG = 'tenants-config',
  CONTACT = 'contacts',
  COMPANY = 'companies',
  APPLICATION = 'applications',
  DRAFT_APPLICATION = 'draft-applications',
  COMMISSION = 'commissions',
  CAMPAIGN = 'campaigns',
  CAMPAIGN_CONTACT = 'campaign-contacts',
  COMPLAINT = 'complaints',
}

export const enum SubscriptionKey {}

export const enum MessageKey {}

export enum ENTITY_MEDIA_TYPE {
  BANK = 'bank',
  CONTACT = 'contact',
  COMPANY = 'company',
  APPLICATION = 'application',
}

export const HEADER_TENANT_ID = 'x-tenant';
