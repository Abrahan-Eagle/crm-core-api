import { DomainErrorCode as CommonErrorCode } from '@internal/common';

export class DomainErrorCode extends CommonErrorCode {
  private constructor(value: string, description: string) {
    super(value, description);
  }

  // Errors related with tenants
  static readonly TENANT_ID_EMPTY = super.of('TENANT_ID_EMPTY', 'Tenant id is empty.');

  static readonly TENANT_ID_INVALID = super.of('TENANT_ID_INVALID', 'Tenant id is invalid.');

  static readonly USER_TENANTS_EMPTY = super.of('USER_TENANTS_EMPTY', 'Tenant list is empty.');

  static readonly USER_TENANTS_INVALID = super.of('USER_TENANTS_INVALID', 'Tenant list is invalid.');

  // Errors related with user module
  static readonly REFERRAL_ID_EMPTY = DomainErrorCode.of('REFERRAL_ID_EMPTY', 'Referral id is empty.');

  static readonly REFERRAL_ID_INVALID = DomainErrorCode.of('REFERRAL_ID_INVALID', 'Referral id is invalid.');

  static readonly USER_PASSWORD_EMPTY = super.of('USER_PASSWORD_EMPTY', 'user password is empty.');

  static readonly USER_PASSWORD_INVALID = super.of('USER_PASSWORD_INVALID', 'user password is invalid.');

  static readonly USER_PASSWORD_TOO_WEAK = super.of('USER_PASSWORD_TOO_WEAK', 'user password is too weak.');

  static readonly USER_ID_EMPTY = super.of('USER_ID_EMPTY', 'User id is empty.');

  static readonly USER_ID_INVALID = super.of('USER_ID_INVALID', 'User id is invalid.');

  static readonly USER_ROLES_EMPTY = super.of('USER_ROLES_EMPTY', 'User roles is empty.');

  static readonly USER_ROLES_INVALID = super.of('USER_ROLES_INVALID', 'User roles is invalid.');

  static readonly USER_ROLE_EMPTY = super.of('USER_ROLE_EMPTY', 'User role is empty.');

  static readonly USER_ROLE_INVALID = super.of('USER_ROLE_INVALID', 'User role is invalid.');

  static readonly USER_FIRST_NAME_EMPTY = super.of('USER_FIRST_NAME_EMPTY', 'User first name is empty.');

  static readonly USER_FIRST_NAME_INVALID = super.of('USER_FIRST_NAME_INVALID', 'User first name is invalid.');

  static readonly USER_FIRST_NAME_TOO_SHORT = super.of('USER_FIRST_NAME_TOO_SHORT', 'User first name is too short.');

  static readonly USER_FIRST_NAME_TOO_LONG = super.of('USER_FIRST_NAME_TOO_LONG', 'User first name is too long.');

  static readonly USER_LAST_NAME_EMPTY = super.of('USER_LAST_NAME_EMPTY', 'User last name is empty.');

  static readonly USER_LAST_NAME_INVALID = super.of('USER_LAST_NAME_INVALID', 'User last name is invalid.');

  static readonly USER_LAST_NAME_TOO_SHORT = super.of('USER_LAST_NAME_TOO_SHORT', 'User last name is too short.');

  static readonly USER_LAST_NAME_TOO_LONG = super.of('USER_LAST_NAME_TOO_LONG', 'User last name is too long.');

  static readonly USER_EMAIL_EMPTY = super.of('USER_EMAIL_EMPTY', 'User email is empty.');

  static readonly USER_EMAIL_INVALID = super.of('USER_EMAIL_INVALID', 'User email is invalid.');

  static readonly USER_CREATED_AT_INVALID = super.of('USER_CREATED_AT_INVALID', 'User created at field is invalid.');

  static readonly USER_PROFILE_PICTURE_URL_INVALID = super.of(
    'USER_PROFILE_PICTURE_URL_INVALID',
    'User profile picture url is invalid.',
  );

  static readonly USER_NO_UPDATE_FIELDS = super.of('USER_NO_UPDATE_FIELDS', 'No fields to update.');

  static readonly USER_DUPLICATED = super.of('USER_DUPLICATED', 'User already exists.');

  static readonly USER_ALREADY_DELETED = super.of('USER_ALREADY_DELETED', 'User already deleted.');

  static readonly USER_DELETED = super.of('USER_DELETED', 'User was deleted.');

  // Auth
  static readonly INSUFFICIENT_SCOPE = super.of(
    'INSUFFICIENT_SCOPE',
    'You do not have sufficient permissions for this action.',
  );

  // Search
  static readonly SEARCH_INVALID = super.of('SEARCH_INVALID', 'Search is invalid.');

  static readonly SEARCH_TOO_LONG = super.of('SEARCH_TOO_LONG', 'Search is too long.');

  // Phone
  static readonly PHONE_DUPLICATED = super.of('PHONE_DUPLICATED', 'This phone is already in use.');

  static readonly PHONE_VERIFIED_INVALID = super.of('PHONE_VERIFIED_INVALID', 'Phone verified is invalid.');

  static readonly PHONE_VERIFIED_AT_INVALID = super.of('PHONE_VERIFIED_AT_INVALID', 'Phone verified at is invalid.');

  // Bank

  static readonly BANK_DUPLICATED = super.of('BANK_DUPLICATED', 'Bank already exists.');

  static readonly BANK_NAME_EMPTY = super.of('BANK_NAME_EMPTY', 'Bank name is empty.');

  static readonly BANK_NAME_INVALID = super.of('BANK_NAME_INVALID', 'Bank name is invalid.');

  static readonly BANK_NAME_TOO_SHORT = super.of('BANK_NAME_TOO_SHORT', 'Bank name is too short.');

  static readonly BANK_NAME_TOO_LONG = super.of('BANK_NAME_TOO_LONG', 'Bank commercial name is too long.');

  static readonly BANK_MANAGER_EMPTY = super.of('BANK_MANAGER_EMPTY', 'Bank name is empty.');

  static readonly BANK_MANAGER_INVALID = super.of('BANK_MANAGER_INVALID', 'Bank name is invalid.');

  static readonly BANK_MANAGER_TOO_SHORT = super.of('BANK_MANAGER_TOO_SHORT', 'Bank name is too short.');

  static readonly BANK_MANAGER_TOO_LONG = super.of('BANK_MANAGER_TOO_LONG', 'Bank commercial name is too long.');

  static readonly BANK_CONTACTS_EMPTY = super.of('BANK_CONTACTS_EMPTY', 'Bank contacts is empty.');

  static readonly BANK_CONTACTS_INVALID_SIZE = super.of('BANK_CONTACTS_INVALID_SIZE', 'Bank contacts size is invalid.');

  static readonly BANK_CONTACTS_INVALID = super.of('BANK_CONTACTS_INVALID', 'Bank contacts is invalid.');

  static readonly BANK_CONTACTS_PHONES_INVALID = super.of(
    'BANK_CONTACTS_PHONES_INVALID',
    'Bank contacts phones is invalid.',
  );

  static readonly BANK_CONTACTS_PHONES_EMPTY = super.of('BANK_CONTACTS_PHONES_EMPTY', 'Bank contacts phones is empty.');

  static readonly BANK_CONTACTS_EMAILS_EMPTY = super.of('BANK_CONTACTS_EMAILS_EMPTY', 'Bank contacts emails is empty.');

  static readonly BANK_CONTACT_TOO_MANY_EMAILS = super.of(
    'BANK_CONTACT_TOO_MANY_EMAILS',
    'Bank contact has too many emails.',
  );

  static readonly BANK_CONTACT_TOO_FEW_EMAILS = super.of(
    'BANK_CONTACT_TOO_FEW_EMAILS',
    'Bank contact has very few emails.',
  );

  static readonly BANK_CONTACT_TOO_MANY_PHONES = super.of(
    'BANK_CONTACT_TOO_MANY_PHONES',
    'Bank contact has too many phones.',
  );

  static readonly BANK_CONTACT_TOO_FEW_PHONES = super.of(
    'BANK_CONTACT_TOO_FEW_PHONES',
    'Bank contact has very few phones.',
  );

  static readonly BANK_CONTACTS_EMAILS_INVALID = super.of(
    'BANK_CONTACTS_EMAILS_INVALID',
    'Bank contacts emails is invalid.',
  );

  static readonly BANK_CLASSIFICATION_EMPTY = super.of('BANK_CLASSIFICATION_EMPTY', 'Bank classification is empty.');

  static readonly BANK_CLASSIFICATION_INVALID = super.of(
    'BANK_CLASSIFICATION_INVALID',
    'Bank classification is invalid.',
  );

  static readonly BANK_CLASSIFICATION_DUPLICATE = super.of(
    'BANK_CLASSIFICATION_DUPLICATE',
    'Duplicate values on bank classifications.',
  );

  static readonly BANK_TERRITORY_EMPTY = super.of('BANK_TERRITORY_EMPTY', 'Territory field is empty.');

  static readonly BANK_TERRITORY_INVALID = super.of('BANK_TERRITORY_INVALID', 'Territory field is invalid.');

  static readonly BANK_TERRITORY_DUPLICATED = super.of(
    'BANK_TERRITORY_DUPLICATED',
    'Duplicate values on bank territories.',
  );

  static readonly BANK_EXCLUDED_STATE_EMPTY = super.of('BANK_EXCLUDED_STATE_EMPTY', 'Territory field is empty.');

  static readonly BANK_EXCLUDED_STATE_INVALID = super.of('BANK_EXCLUDED_STATE_INVALID', 'Territory field is invalid.');

  static readonly BANK_EXCLUDED_STATE_TOO_SHORT = super.of(
    'BANK_EXCLUDED_STATE_TOO_SHORT',
    'Excluded state is too short.',
  );

  static readonly BANK_EXCLUDED_STATE_TOO_LONG = super.of(
    'BANK_EXCLUDED_STATE_TOO_LONG',
    'Excluded state is too long.',
  );

  static readonly BANK_EXCLUDED_STATE_DUPLICATED = super.of(
    'BANK_EXCLUDED_STATE_DUPLICATED',
    'Duplicate values on excluded states.',
  );

  static readonly BANK_SUPPORTED_ID_EMPTY = super.of('BANK_SUPPORTED_ID_EMPTY', 'Supported ID field is empty.');

  static readonly BANK_SUPPORTED_ID_INVALID = super.of('BANK_SUPPORTED_ID_INVALID', 'Supported ID field is invalid.');

  static readonly BANK_SUPPORTED_ID_DUPLICATED = super.of(
    'BANK_SUPPORTED_ID_DUPLICATED',
    'Duplicate values on bank supported ids.',
  );

  static readonly BANK_BLOCKED_PRODUCT_ID_EMPTY = super.of(
    'BANK_BLOCKED_PRODUCT_ID_EMPTY',
    'Blocked products field is empty.',
  );

  static readonly BANK_BLOCKED_PRODUCT_ID_INVALID = super.of(
    'BANK_BLOCKED_PRODUCT_ID_INVALID',
    'Blocked products field is invalid.',
  );

  static readonly BANK_BLOCKED_PRODUCT_ID_DUPLICATED = super.of(
    'BANK_BLOCKED_PRODUCT_ID_DUPLICATED',
    'Duplicate values on blocked products.',
  );

  static readonly BANK_POSITION_EMPTY = super.of('BANK_POSITION_EMPTY', 'Position field is empty.');

  static readonly BANK_POSITION_DUPLICATED = super.of('BANK_POSITION_DUPLICATED', 'Duplicate values on positions.');

  static readonly BANK_POSITION_INVALID = super.of('BANK_POSITION_INVALID', 'Position field is invalid.');

  static readonly POSITION_TOO_LOW = super.of('POSITION_TOO_LOW', 'Position is too low.');

  static readonly POSITION_TOO_HIGH = super.of('POSITION_TOO_HIGH', 'Position is too high.');

  static readonly BANK_POSITIONS_EMPTY = super.of('BANK_POSITIONS_EMPTY', 'Positions field is empty.');

  static readonly BANK_POSITIONS_INVALID = super.of('BANK_POSITIONS_INVALID', 'Positions field is invalid.');

  static readonly BANK_POSITIONS_DUPLICATED = super.of('BANK_POSITIONS_DUPLICATED', 'Duplicate values on positions.');

  static readonly BANK_LOAN_LIMIT_EMPTY = super.of('LOAN_LIMIT_EMPTY', 'Loan limit is empty.');

  static readonly BANK_MINIMUM_LOAN_INVALID = super.of('BANK_MINIMUM_LOAN_INVALID', 'Minimum loan field is invalid.');

  static readonly BANK_MINIMUM_LOAN_EMPTY = super.of('BANK_MINIMUM_LOAN_EMPTY', 'Minimum loan field is empty.');

  static readonly BANK_LOAN_LIMIT_INVALID = super.of('LOAN_LIMIT_INVALID', 'Loan limit is invalid.');

  static readonly BANK_HAS_LOAN_LIMIT_EMPTY = super.of('BANK_HAS_LOAN_LIMIT_EMPTY', 'Has loan limit field is empty.');

  static readonly BANK_HAS_LOAN_LIMIT_INVALID = super.of(
    'BANK_HAS_LOAN_LIMIT_INVALID',
    'has loan limit field is invalid.',
  );

  static readonly BANK_MINIMUM_MONTHS_IN_BUSINESS_EMPTY = super.of(
    'MINIMUM_MONTHS_IN_BUSINESS_EMPTY',
    'Minimum months in business is empty.',
  );

  static readonly BANK_MINIMUM_MONTHS_IN_BUSINESS_INVALID = super.of(
    'MINIMUM_MONTHS_IN_BUSINESS_INVALID',
    'Minimum months in business is invalid.',
  );

  static readonly BANK_MINIMUM_DAILY_BALANCE_EMPTY = super.of(
    'MINIMUM_DAILY_BALANCE_EMPTY',
    'Minimum daily balance is empty.',
  );

  static readonly BANK_MINIMUM_DAILY_BALANCE_INVALID = super.of(
    'MINIMUM_DAILY_BALANCE_INVALID',
    'Minimum daily balance is invalid.',
  );

  static readonly BANK_MAXIMUM_NEGATIVE_DAYS_EMPTY = super.of(
    'MAXIMUM_NEGATIVE_DAYS_EMPTY',
    'Minimum negative days is empty.',
  );

  static readonly BANK_MAXIMUM_NEGATIVE_DAYS_INVALID = super.of(
    'MAXIMUM_NEGATIVE_DAYS_INVALID',
    'Minimum negative days is invalid.',
  );

  static readonly BANK_ALLOWED_INDUSTRIES_EMPTY = super.of(
    'BANK_ALLOWED_INDUSTRIES_EMPTY',
    'Allowed industries is empty.',
  );

  static readonly BANK_ALLOWED_INDUSTRIES_INVALID = super.of(
    'BANK_ALLOWED_INDUSTRIES_INVALID',
    'Allowed industries is invalid.',
  );

  static readonly BANK_INDUSTRY_DUPLICATED = super.of(
    'BANK_INDUSTRY_DUPLICATED',
    'Duplicate values on bank industries.',
  );

  static readonly BANK_DEPOSITS_CONSTRAINTS_BY_INDUSTRIES_INVALID = DomainErrorCode.of(
    'BANK_DEPOSITS_CONSTRAINTS_BY_INDUSTRIES_INVALID',
    'Deposits constraints by industries is invalid.',
  );

  static readonly BANK_DEPOSITS_CONSTRAINTS_BY_INDUSTRIES_DUPLICATED = DomainErrorCode.of(
    'BANK_DEPOSITS_CONSTRAINTS_BY_INDUSTRIES_DUPLICATED',
    'Duplicate values on bank constraints industries.',
  );

  static readonly BANK_MINIMUM_AMOUNT_OF_DEPOSITS_EMPTY = DomainErrorCode.of(
    'BANK_MINIMUM_AMOUNT_OF_DEPOSITS_EMPTY',
    'Minimum amount of deposits is empty.',
  );

  static readonly BANK_MINIMUM_AMOUNT_OF_DEPOSITS_INVALID = DomainErrorCode.of(
    'BANK_MINIMUM_AMOUNT_OF_DEPOSITS_INVALID',
    'Minimum amount of deposits is invalid.',
  );

  static readonly BANK_MINIMUM_AMOUNT_OF_TRANSACTIONS_EMPTY = DomainErrorCode.of(
    'BANK_MINIMUM_AMOUNT_OF_TRANSACTIONS_EMPTY',
    'Minimum amount of transactions is empty.',
  );

  static readonly BANK_MINIMUM_AMOUNT_OF_TRANSACTIONS_INVALID = DomainErrorCode.of(
    'BANK_MINIMUM_AMOUNT_OF_TRANSACTIONS_INVALID',
    'Minimum amount of transfers is invalid.',
  );

  static readonly BANK_CONTACT_FIRST_NAME_EMPTY = DomainErrorCode.of(
    'BANK_CONTACT_FIRST_NAME_EMPTY',
    'Bank contact first name is empty.',
  );

  static readonly BANK_CONTACT_FIRST_NAME_INVALID = DomainErrorCode.of(
    'BANK_CONTACT_FIRST_NAME_INVALID',
    'Bank contact first name is invalid.',
  );

  static readonly BANK_CONTACT_LAST_NAME_EMPTY = DomainErrorCode.of(
    'BANK_CONTACT_LAST_NAME_EMPTY',
    'Bank contact last name is empty.',
  );

  static readonly BANK_CONTACT_LAST_NAME_INVALID = DomainErrorCode.of(
    'BANK_CONTACT_LAST_NAME_INVALID',
    'Bank contact last name is invalid.',
  );

  static readonly BANK_ID_INVALID = DomainErrorCode.of('BANK_ID_INVALID', 'Bank id is empty.');

  static readonly BANK_ID_EMPTY = DomainErrorCode.of('BANK_ID_EMPTY', 'Bank id is invalid.');

  static readonly BANK_IDS_INVALID = DomainErrorCode.of('BANK_IDS_INVALID', 'Bank id list is empty.');

  static readonly BANK_IDS_EMPTY = DomainErrorCode.of('BANK_IDS_EMPTY', 'Bank id list is invalid.');

  static readonly BANK_IDS_TOO_MANY = DomainErrorCode.of('BANK_IDS_TOO_MANY', 'Too many bank IDs provided.');

  static readonly DOCUMENT_ID_INVALID = DomainErrorCode.of('DOCUMENT_ID_INVALID', 'Document id is empty.');

  static readonly DOCUMENT_ID_EMPTY = DomainErrorCode.of('DOCUMENT_ID_EMPTY', 'Document id is invalid.');

  // Bank Documents
  static readonly BANK_DOCUMENTS_INVALID = DomainErrorCode.of(
    'BANK_DOCUMENTS_INVALID',
    'Bank documents field is invalid.',
  );

  // Files
  static readonly CONTACT_FILE_TYPE_EMPTY = super.of('CONTACT_FILE_TYPE_EMPTY', 'File type is empty.');

  static readonly CONTACT_FILE_TYPE_INVALID = super.of('CONTACT_FILE_TYPE_INVALID', 'File type is invalid.');

  static readonly COMPANY_FILE_TYPE_EMPTY = super.of('COMPANY_FILE_TYPE_EMPTY', 'File type is empty.');

  static readonly COMPANY_FILE_TYPE_INVALID = super.of('COMPANY_FILE_TYPE_INVALID', 'File type is invalid.');

  static readonly CONTACT_FILES_INVALID = DomainErrorCode.of(
    'CONTACT_FILES_INVALID',
    'Contact files field is invalid.',
  );

  static readonly FILE_NAME_INVALID = super.of('FILE_NAME_INVALID', 'File name is invalid.');

  static readonly FILE_NAME_EMPTY = super.of('FILE_NAME_EMPTY', 'File name is empty.');

  static readonly FILE_NAME_TOO_LONG = super.of('FILE_NAME_TOO_LONG', 'File name is too long.');

  static readonly FILE_PATH_EMPTY = super.of('FILE_PATH_EMPTY', 'File path is empty.');

  static readonly FILE_PATH_INVALID = super.of('FILE_PATH_INVALID', 'File path is invalid.');

  static readonly FILE_TYPE_INVALID = super.of('FILE_TYPE_INVALID', 'File type is invalid.');

  static readonly FILE_TYPE_EMPTY = super.of('FILE_TYPE_EMPTY', 'File type is empty.');

  static readonly FILE_DUPLICATED = super.of('FILE_DUPLICATED', 'File already exists.');

  static readonly BANK_STATUS_INVALID = DomainErrorCode.of('BANK_STATUS_INVALID', 'Bank status is empty.');

  static readonly BANK_STATUS_EMPTY = DomainErrorCode.of('BANK_STATUS_EMPTY', 'Bank status is invalid.');

  static readonly BANK_TYPE_INVALID = DomainErrorCode.of('BANK_TYPE_INVALID', 'Bank type is empty.');

  static readonly BANK_TYPE_EMPTY = DomainErrorCode.of('BANK_TYPE_EMPTY', 'Bank type is invalid.');

  static readonly BANK_MAX_FILES_EXCEEDED = DomainErrorCode.of('BANK_MAX_FILES_EXCEEDED', 'Bank max file exceeded.');

  static readonly BANK_BLACKLISTED_BY_EMPTY = super.of(
    'BANK_BLACKLISTED_BY_EMPTY',
    'Bank blacklisted by user ID is empty.',
  );

  static readonly BANK_BLACKLISTED_BY_INVALID = super.of(
    'BANK_BLACKLISTED_BY_INVALID',
    'Bank blacklisted by user ID is invalid.',
  );

  static readonly BANK_BLACKLIST_NOTE_EMPTY = super.of('BANK_BLACKLIST_NOTE_EMPTY', 'Bank blacklist note is empty.');

  static readonly BANK_BLACKLIST_NOTE_INVALID = super.of(
    'BANK_BLACKLIST_NOTE_INVALID',
    'Bank blacklist note is invalid.',
  );

  static readonly BANK_BLACKLIST_NOTE_TOO_SHORT = super.of(
    'BANK_BLACKLIST_NOTE_TOO_SHORT',
    'Bank blacklist note is too short.',
  );

  static readonly BANK_BLACKLIST_NOTE_TOO_LONG = super.of(
    'BANK_BLACKLIST_NOTE_TOO_LONG',
    'Bank blacklist note is too long.',
  );

  static readonly BANK_IS_NOT_BLACKLISTED = super.of('BANK_IS_NOT_BLACKLISTED', 'Bank is not blacklisted.');

  static readonly BANK_IS_ALREADY_BLACKLISTED = super.of('BANK_IS_ALREADY_BLACKLISTED', 'Bank is already blacklisted.');

  // Contact Entity.
  static readonly CONTACT_MAX_FILES_PER_TYPE_EXCEEDED = DomainErrorCode.of(
    'CONTACT_MAX_FILES_PER_TYPE_EXCEEDED',
    'Contact max file of this type exceeded.',
  );

  static readonly CONTACT_FIRST_NAME_TOO_SHORT = super.of('CONTACT_FIRST_NAME_TOO_SHORT', 'First name is too short.');

  static readonly CONTACT_FIRST_NAME_TOO_LONG = super.of('CONTACT_FIRST_NAME_TOO_LONG', 'First name is too long.');

  static readonly CONTACT_FIRST_NAME_EMPTY = super.of('CONTACT_FIRST_NAME_EMPTY', 'First name is empty.');

  static readonly CONTACT_FIRST_NAME_INVALID = super.of('CONTACT_FIRST_NAME_INVALID', 'First name is invalid.');

  static readonly CONTACT_LAST_NAME_TOO_SHORT = super.of('CONTACT_LAST_NAME_TOO_SHORT', 'Last name is too short.');

  static readonly CONTACT_LAST_NAME_TOO_LONG = super.of('CONTACT_LAST_NAME_TOO_LONG', 'Last name is too long.');

  static readonly CONTACT_LAST_NAME_EMPTY = super.of('CONTACT_LAST_NAME_EMPTY', 'Last name is empty.');

  static readonly CONTACT_LAST_NAME_INVALID = super.of('CONTACT_LAST_NAME_INVALID', 'Last name is invalid.');

  static readonly CONTACT_SSN_EMPTY = super.of('CONTACT_SSN_EMPTY', 'SSN is empty.');

  static readonly CONTACT_SSN_INVALID = super.of('CONTACT_SSN_INVALID', 'SSN is invalid.');

  static readonly CONTACT_ID_INVALID = super.of('CONTACT_ID_INVALID', 'Contact id is invalid.');

  static readonly CONTACT_ID_EMPTY = super.of('CONTACT_ID_EMPTY', 'Contact id is empty.');

  static readonly CONTACT_BIRTHDATE_INVALID = super.of('CONTACT_BIRTHDATE_INVALID', 'Birthdate is invalid.');

  static readonly CONTACT_BIRTHDATE_EMPTY = super.of('CONTACT_BIRTHDATE_EMPTY', 'Birthdate is empty.');

  static readonly CONTACT_BIRTHDATE_TOO_YOUNG = super.of(
    'CONTACT_BIRTHDATE_TOO_YOUNG',
    'The birthdate indicates that the person is too young.',
  );

  static readonly CONTACT_ADDRESS_EMPTY = super.of('CONTACT_ADDRESS_EMPTY', 'Address is empty.');

  static readonly CONTACT_EMAILS_INVALID = super.of('CONTACT_EMAILS_INVALID', 'emails is invalid.');

  static readonly CONTACT_EMAILS_INVALID_SIZE = super.of('CONTACT_EMAILS_INVALID_SIZE', 'emails has an invalid size.');

  static readonly CONTACT_EMAILS_LIMIT_EXCEEDED = super.of('CONTACT_EMAILS_LIMIT_EXCEEDED', 'emails limit exceeded.');

  static readonly CONTACT_EMAILS_EMPTY = super.of('CONTACT_EMAILS_EMPTY', 'emails is empty.');

  static readonly CONTACT_PHONES_INVALID = super.of('CONTACT_PHONES_INVALID', 'phones is invalid.');

  static readonly CONTACT_PHONES_INVALID_SIZE = super.of('CONTACT_PHONES_INVALID_SIZE', 'phones has an invalid size.');

  static readonly CONTACT_PHONES_EMPTY = super.of('CONTACT_PHONES_EMPTY', 'phones is empty.');

  static readonly CONTACT_PHONES_LIMIT_EXCEEDED = super.of('CONTACT_PHONES_LIMIT_EXCEEDED', 'phones limit exceeded.');

  static readonly CONTACT_DUPLICATED = super.of('CONTACT_DUPLICATED', 'Contact already exists.');

  //Company
  static readonly COMPANY_NAME_EMPTY = DomainErrorCode.of('COMPANY_NAME_EMPTY', 'Company name is required.');

  static readonly COMPANY_NAME_INVALID = DomainErrorCode.of(
    'COMPANY_NAME_INVALID',
    'Company name must be a valid string.',
  );

  static readonly COMPANY_NAME_TOO_SHORT = DomainErrorCode.of('COMPANY_NAME_TOO_SHORT', 'Company name is too short.');

  static readonly COMPANY_NAME_TOO_LONG = DomainErrorCode.of('COMPANY_NAME_TOO_LONG', 'Company name is too long.');

  static readonly COMPANY_SERVICE_EMPTY = DomainErrorCode.of('COMPANY_SERVICE_EMPTY', 'Company service is required.');

  static readonly COMPANY_SERVICE_INVALID = DomainErrorCode.of(
    'COMPANY_SERVICE_INVALID',
    'Company service must be a valid string.',
  );

  static readonly COMPANY_SERVICE_TOO_SHORT = DomainErrorCode.of(
    'COMPANY_SERVICE_TOO_SHORT',
    'Company service is too short.',
  );

  static readonly COMPANY_SERVICE_TOO_LONG = DomainErrorCode.of(
    'COMPANY_SERVICE_TOO_LONG',
    'Company service is too long.',
  );

  static readonly COMPANY_DBA_EMPTY = DomainErrorCode.of('COMPANY_DBA_EMPTY', 'DBA is required.');

  static readonly COMPANY_DBA_INVALID = DomainErrorCode.of('COMPANY_DBA_INVALID', 'DBA must be a valid string.');

  static readonly COMPANY_DBA_TOO_SHORT = DomainErrorCode.of('COMPANY_DBA_TOO_SHORT', 'DBA is too short.');

  static readonly COMPANY_DBA_TOO_LONG = DomainErrorCode.of('COMPANY_DBA_TOO_LONG', 'DBA is too long.');

  static readonly TAX_ID_EMPTY = DomainErrorCode.of('TAX_ID_EMPTY', 'Tax ID is required.');

  static readonly TAX_ID_INVALID = DomainErrorCode.of('TAX_ID_INVALID', 'Tax ID must be a valid string.');

  static readonly SSN_EMPTY = DomainErrorCode.of('SSN_EMPTY', 'SSN is required.');

  static readonly SSN_INVALID = DomainErrorCode.of('SSN_INVALID', 'SSN must be a valid string.');

  static readonly COMPANY_INDUSTRY_EMPTY = DomainErrorCode.of('COMPANY_INDUSTRY_EMPTY', 'Industry is required.');

  static readonly COMPANY_INDUSTRY_INVALID = DomainErrorCode.of(
    'COMPANY_INDUSTRY_INVALID',
    'Industry must be a valid string.',
  );

  static readonly COMPANY_CREATION_DATE_EMPTY = DomainErrorCode.of(
    'COMPANY_CREATION_DATE_EMPTY',
    'Creation date is required.',
  );

  static readonly COMPANY_CREATION_DATE_INVALID = DomainErrorCode.of(
    'COMPANY_CREATION_DATE_INVALID',
    'Creation date must be a valid date.',
  );

  static readonly COMPANY_CREATION_DATE_FUTURE = DomainErrorCode.of(
    'COMPANY_CREATION_DATE_FUTURE',
    'Creation date cannot be a future date.',
  );

  static readonly COMPANY_ENTITY_TYPE_EMPTY = DomainErrorCode.of(
    'COMPANY_ENTITY_TYPE_EMPTY',
    'Entity type is required.',
  );

  static readonly COMPANY_ENTITY_TYPE_INVALID = DomainErrorCode.of(
    'COMPANY_ENTITY_TYPE_INVALID',
    'Entity type must be one of the predefined values.',
  );

  static readonly COMPANY_MEMBER_TITLE_EMPTY = DomainErrorCode.of(
    'COMPANY_MEMBER_TITLE_EMPTY',
    'Member title is required.',
  );

  static readonly COMPANY_MEMBER_TITLE_INVALID = DomainErrorCode.of(
    'COMPANY_MEMBER_TITLE_INVALID',
    'Member title must be a valid string.',
  );

  static readonly COMPANY_MEMBER_TITLE_TOO_SHORT = DomainErrorCode.of(
    'COMPANY_MEMBER_TITLE_TOO_SHORT',
    'Member title is too short.',
  );

  static readonly COMPANY_MEMBER_TITLE_TOO_LONG = DomainErrorCode.of(
    'COMPANY_MEMBER_TITLE_TOO_LONG',
    'Member title is too long.',
  );

  static readonly COMPANY_MEMBER_PERCENTAGE_EMPTY = DomainErrorCode.of(
    'COMPANY_MEMBER_PERCENTAGE_EMPTY',
    'Member percentage is required.',
  );

  static readonly COMPANY_MEMBER_PERCENTAGE_INVALID = DomainErrorCode.of(
    'COMPANY_MEMBER_PERCENTAGE_INVALID',
    'Member percentage must be a valid number.',
  );

  static readonly COMPANY_MEMBER_PERCENTAGE_OUT_OF_RANGE = DomainErrorCode.of(
    'COMPANY_MEMBER_PERCENTAGE_OUT_OF_RANGE',
    'Member percentage must be between 0 and 100.',
  );

  static readonly COMPANY_MEMBER_SINCE_EMPTY = DomainErrorCode.of(
    'COMPANY_MEMBER_SINCE_EMPTY',
    'Member since date is required.',
  );

  static readonly COMPANY_MEMBER_SINCE_INVALID = DomainErrorCode.of(
    'COMPANY_MEMBER_SINCE_INVALID',
    'Member since date must be a valid date.',
  );

  static readonly COMPANY_MEMBER_SINCE_FUTURE = DomainErrorCode.of(
    'COMPANY_MEMBER_SINCE_FUTURE',
    'Member since cannot be a future date.',
  );

  static readonly COMPANY_MEMBER_ID_DUPLICATED = DomainErrorCode.of(
    'COMPANY_MEMBER_ID_DUPLICATED',
    'Members id duplicated.',
  );

  static readonly COMPANY_MEMBERS_EMPTY = DomainErrorCode.of('COMPANY_MEMBERS_EMPTY', 'Members are required.');

  static readonly COMPANY_ADDRESS = DomainErrorCode.of('COMPANY_ADDRESS_EMPTY', 'Address is required.');

  static readonly COMPANY_MEMBERS_INVALID = DomainErrorCode.of(
    'COMPANY_MEMBERS_INVALID',
    'Members must be a valid array.',
  );

  static readonly COMPANY_MEMBERS_PERCENTAGE_INVALID = DomainErrorCode.of(
    'COMPANY_MEMBERS_PERCENTAGE',
    'The sum of all member percentages must be 100.',
  );

  static readonly COMPANY_MEMBERS_TOO_FEW = DomainErrorCode.of(
    'COMPANY_MEMBERS_TOO_FEW',
    'Members must have at least one item.',
  );

  static readonly COMPANY_MEMBERS_TOO_MANY = DomainErrorCode.of(
    'COMPANY_MEMBERS_TOO_MANY',
    'Members must have no more than ten items.',
  );

  static readonly COMPANY_PHONE_NUMBERS_EMPTY = DomainErrorCode.of(
    'COMPANY_PHONE_NUMBERS_EMPTY',
    'Phone numbers are required.',
  );

  static readonly COMPANY_CONTACT_PHONE_NUMBERS_INVALID = DomainErrorCode.of(
    'COMPANY_CONTACT_PHONE_NUMBERS_INVALID',
    'Phone numbers must be a valid array.',
  );

  static readonly COMPANY_CONTACT_PHONE_NUMBERS_TOO_FEW = DomainErrorCode.of(
    'COMPANY_CONTACT_PHONE_NUMBERS_TOO_FEW',
    'Phone numbers must have at least one item.',
  );

  static readonly COMPANY_CONTACT_PHONE_NUMBERS_TOO_MANY = DomainErrorCode.of(
    'COMPANY_CONTACT_PHONE_NUMBERS_TOO_MANY',
    'Phone numbers must have no more than five items.',
  );

  static readonly COMPANY_CONTACT_EMAILS_EMPTY = DomainErrorCode.of(
    'COMPANY_CONTACT_EMAILS_EMPTY',
    'Emails are required.',
  );

  static readonly COMPANY_CONTACT_EMAILS_INVALID = DomainErrorCode.of(
    'COMPANY_CONTACT_EMAILS_INVALID',
    'Emails must be a valid array.',
  );

  static readonly COMPANY_CONTACT_EMAILS_TOO_FEW = DomainErrorCode.of(
    'COMPANY_CONTACT_EMAILS_TOO_FEW',
    'Emails must have at least one item.',
  );

  static readonly COMPANY_CONTACT_EMAILS_TOO_MANY = DomainErrorCode.of(
    'COMPANY_CONTACT_EMAILS_TOO_MANY',
    'Emails must have no more than five items.',
  );

  static readonly COMPANY_MEMBER_ID_EMPTY = DomainErrorCode.of('COMPANY_MEMBER_ID_EMPTY', 'Member ID is required.');

  static readonly COMPANY_MEMBER_ID_INVALID = DomainErrorCode.of(
    'COMPANY_MEMBER_ID_INVALID',
    'Member ID must be a valid string.',
  );

  static readonly COMPANY_ID_EMPTY = DomainErrorCode.of('COMPANY_ID_EMPTY', 'Company ID is required.');

  static readonly COMPANY_ID_INVALID = DomainErrorCode.of('COMPANY_ID_INVALID', 'Company ID must be a valid string.');

  static readonly COMPANY_DUPLICATED = DomainErrorCode.of('COMPANY_DUPLICATED', 'Company already exists.');

  static readonly COMPANY_MAX_FILES_EXCEEDED = DomainErrorCode.of(
    'COMPANY_MAX_FILES_EXCEEDED',
    'Company max file exceeded.',
  );

  static readonly COMPANY_MAX_FILES_PER_TYPE_EXCEEDED = DomainErrorCode.of(
    'COMPANY_MAX_FILES_PER_TYPE_EXCEEDED',
    'Company max files per type exceeded.',
  );

  static readonly COMPANY_DOCUMENTS_INVALID = DomainErrorCode.of(
    'COMPANY_DOCUMENTS_INVALID',
    'Company documents field is invalid.',
  );

  // Application

  static readonly BANK_STATEMENTS_INVALID = DomainErrorCode.of(
    'BANK_STATEMENTS_INVALID',
    'Bank statements field is invalid.',
  );

  // Main Document Errors
  static readonly APPLICATION_DOCUMENT_ID_EMPTY = DomainErrorCode.of(
    'APPLICATION_DOCUMENT_ID_EMPTY',
    'Application document ID is empty.',
  );

  static readonly APPLICATION_DOCUMENT_ID_INVALID = DomainErrorCode.of(
    'APPLICATION_DOCUMENT_ID_INVALID',
    'Application document ID is invalid.',
  );

  static readonly APPLICATION_DOCUMENT_NAME_EMPTY = DomainErrorCode.of(
    'APPLICATION_DOCUMENT_NAME_EMPTY',
    'Application document name is empty.',
  );

  static readonly APPLICATION_DOCUMENT_NAME_INVALID = DomainErrorCode.of(
    'APPLICATION_DOCUMENT_NAME_INVALID',
    'Application document name is invalid.',
  );

  static readonly APPLICATION_DOCUMENT_AMOUNT_EMPTY = DomainErrorCode.of(
    'APPLICATION_DOCUMENT_AMOUNT_EMPTY',
    'Application document amount is empty.',
  );

  static readonly APPLICATION_DOCUMENT_AMOUNT_INVALID = DomainErrorCode.of(
    'APPLICATION_DOCUMENT_AMOUNT_INVALID',
    'Application document amount is invalid.',
  );

  static readonly APPLICATION_DOCUMENT_TRANSACTIONS_EMPTY = DomainErrorCode.of(
    'APPLICATION_DOCUMENT_TRANSACTIONS_EMPTY',
    'Application document transactions are empty.',
  );

  static readonly APPLICATION_DOCUMENT_TRANSACTIONS_INVALID = DomainErrorCode.of(
    'APPLICATION_DOCUMENT_TRANSACTIONS_INVALID',
    'Application document transactions are invalid.',
  );

  static readonly APPLICATION_DOCUMENT_NEGATIVE_DAYS_EMPTY = DomainErrorCode.of(
    'APPLICATION_DOCUMENT_NEGATIVE_DAYS_EMPTY',
    'Application document negative days are empty.',
  );

  static readonly APPLICATION_DOCUMENT_NEGATIVE_DAYS_INVALID = DomainErrorCode.of(
    'APPLICATION_DOCUMENT_NEGATIVE_DAYS_INVALID',
    'Application document negative days are invalid.',
  );

  static readonly APPLICATION_DOCUMENT_PERIOD_EMPTY = DomainErrorCode.of(
    'APPLICATION_DOCUMENT_PERIOD_EMPTY',
    'Application document period is empty.',
  );

  static readonly APPLICATION_DOCUMENT_PERIOD_INVALID = DomainErrorCode.of(
    'APPLICATION_DOCUMENT_PERIOD_INVALID',
    'Application document period is invalid.',
  );

  static readonly APPLICATION_PERIOD_EMPTY = DomainErrorCode.of(
    'APPLICATION_PERIOD_EMPTY',
    'Application period is empty.',
  );

  static readonly APPLICATION_PERIOD_INVALID = DomainErrorCode.of(
    'APPLICATION_PERIOD_INVALID',
    'Application period is invalid.',
  );

  // APPLICATION_REFERRAL
  static readonly APPLICATION_REFERRAL_SOURCE_EMPTY = DomainErrorCode.of(
    'APPLICATION_REFERRAL_SOURCE_EMPTY',
    'Referral source is empty.',
  );

  static readonly APPLICATION_REFERRAL_SOURCE_INVALID = DomainErrorCode.of(
    'APPLICATION_REFERRAL_SOURCE_INVALID',
    'Referral source is invalid.',
  );

  static readonly APPLICATION_REFERRAL_REFERENCE_EMPTY = DomainErrorCode.of(
    'APPLICATION_REFERRAL_REFERENCE_EMPTY',
    'Referral reference is empty.',
  );

  static readonly APPLICATION_REFERRAL_REFERENCE_INVALID = DomainErrorCode.of(
    'APPLICATION_REFERRAL_REFERENCE_INVALID',
    'Referral reference is invalid.',
  );

  static readonly APPLICATION_AMOUNT_EMPTY = DomainErrorCode.of('APPLICATION_AMOUNT_EMPTY', 'Loan amount is empty.');

  static readonly APPLICATION_AMOUNT_INVALID = DomainErrorCode.of(
    'APPLICATION_AMOUNT_INVALID',
    'Loan amount is invalid.',
  );

  static readonly PROSPECT_ID_EMPTY = DomainErrorCode.of('PROSPECT_ID_EMPTY', 'Prospect is empty.');

  static readonly PROSPECT_ID_INVALID = DomainErrorCode.of('PROSPECT_ID_INVALID', 'Prospect is invalid.');

  static readonly APPLICATION_TRACKING_ID_EMPTY = DomainErrorCode.of(
    'APPLICATION_TRACKING_ID_EMPTY',
    'Tracking id is empty.',
  );

  static readonly APPLICATION_TRACKING_ID_INVALID = DomainErrorCode.of(
    'APPLICATION_TRACKING_ID_INVALID',
    'Tracking id is invalid.',
  );

  static readonly APPLICATION_PRODUCT_INVALID = DomainErrorCode.of(
    'APPLICATION_PRODUCT_INVALID',
    'Loan product is invalid.',
  );

  static readonly APPLICATION_SUBSTATUS_INVALID = DomainErrorCode.of(
    'APPLICATION_SUBSTATUS_INVALID',
    'Application substatus is invalid.',
  );

  static readonly APPLICATION_SUBSTATUS_EMPTY = DomainErrorCode.of(
    'APPLICATION_SUBSTATUS_EMPTY',
    'Application substatus is empty.',
  );

  static readonly APPLICATION_STATUS_INVALID = DomainErrorCode.of(
    'APPLICATION_STATUS_INVALID',
    'Application status is invalid.',
  );

  static readonly APPLICATION_STATUS_EMPTY = DomainErrorCode.of(
    'APPLICATION_STATUS_EMPTY',
    'Application status is empty.',
  );

  static readonly APPLICATION_REFERRAL_EMPTY = DomainErrorCode.of(
    'APPLICATION_REFERRAL_EMPTY',
    'Loan referral is empty.',
  );

  static readonly APPLICATION_COMPANY_ID_EMPTY = DomainErrorCode.of(
    'APPLICATION_COMPANY_ID_EMPTY',
    'Company id is empty.',
  );

  static readonly APPLICATION_COMPANY_ID_INVALID = DomainErrorCode.of(
    'APPLICATION_COMPANY_ID_INVALID',
    'Company id is invalid.',
  );

  // APPLICATION FILLED APPLICATIONS

  static readonly APPLICATION_FILLED_APPLICATIONS_EMPTY = DomainErrorCode.of(
    'APPLICATION_FILLED_APPLICATIONS_EMPTY',
    'Filled applications are empty.',
  );

  static readonly APPLICATION_FILLED_APPLICATIONS_INVALID = DomainErrorCode.of(
    'APPLICATION_FILLED_APPLICATIONS_INVALID',
    'Filled applications are invalid.',
  );

  static readonly APPLICATION_FILLED_APPLICATIONS_TOO_FEW = DomainErrorCode.of(
    'APPLICATION_FILLED_APPLICATIONS_TOO_FEW',
    'Too few filled applications.',
  );

  static readonly APPLICATION_FILLED_APPLICATIONS_TOO_MANY = DomainErrorCode.of(
    'APPLICATION_FILLED_APPLICATIONS_TOO_MANY',
    'Too many filled applications.',
  );

  // APPLICATION BANK STATEMENTS

  static readonly APPLICATION_BANK_STATEMENTS_EMPTY = DomainErrorCode.of(
    'APPLICATION_BANK_STATEMENTS_EMPTY',
    'Bank statements are empty.',
  );

  static readonly APPLICATION_BANK_STATEMENTS_INVALID = DomainErrorCode.of(
    'APPLICATION_BANK_STATEMENTS_INVALID',
    'Bank statements are invalid.',
  );

  static readonly APPLICATION_BANK_STATEMENTS_TOO_FEW = DomainErrorCode.of(
    'APPLICATION_BANK_STATEMENTS_TOO_FEW',
    'Too few bank statements.',
  );

  static readonly APPLICATION_BANK_STATEMENTS_TOO_MANY = DomainErrorCode.of(
    'APPLICATION_BANK_STATEMENTS_TOO_MANY',
    'Too many bank statements.',
  );

  // APPLICATION MTD STATEMENTS

  static readonly APPLICATION_MTD_STATEMENTS_EMPTY = DomainErrorCode.of(
    'APPLICATION_MTD_STATEMENTS_EMPTY',
    'MTD statements are empty.',
  );

  static readonly APPLICATION_MTD_STATEMENTS_INVALID = DomainErrorCode.of(
    'APPLICATION_MTD_STATEMENTS_INVALID',
    'MTD statements are invalid.',
  );

  static readonly APPLICATION_MTD_STATEMENTS_TOO_MANY = DomainErrorCode.of(
    'APPLICATION_MTD_STATEMENTS_TOO_MANY',
    'Too many MTD statements.',
  );

  // APPLICATION CREDIT CARD STATEMENTS

  static readonly APPLICATION_CREDIT_CARD_STATEMENTS_EMPTY = DomainErrorCode.of(
    'APPLICATION_CREDIT_CARD_STATEMENTS_EMPTY',
    'Credit card statements are empty.',
  );

  static readonly APPLICATION_CREDIT_CARD_STATEMENTS_INVALID = DomainErrorCode.of(
    'APPLICATION_CREDIT_CARD_STATEMENTS_INVALID',
    'Credit card statements are invalid.',
  );

  static readonly APPLICATION_CREDIT_CARD_STATEMENTS_TOO_MANY = DomainErrorCode.of(
    'APPLICATION_CREDIT_CARD_STATEMENTS_TOO_MANY',
    'Too many credit card statements.',
  );

  // APPLICATION ADDITIONAL STATEMENTS

  static readonly APPLICATION_ADDITIONAL_STATEMENTS_EMPTY = DomainErrorCode.of(
    'APPLICATION_ADDITIONAL_STATEMENTS_EMPTY',
    'Additional statements are empty.',
  );

  static readonly APPLICATION_ADDITIONAL_STATEMENTS_INVALID = DomainErrorCode.of(
    'APPLICATION_ADDITIONAL_STATEMENTS_INVALID',
    'Additional statements are invalid.',
  );

  static readonly APPLICATION_ADDITIONAL_STATEMENTS_TOO_MANY = DomainErrorCode.of(
    'APPLICATION_ADDITIONAL_STATEMENTS_TOO_MANY',
    'Too many additional statements.',
  );

  static readonly APPLICATION_ID_EMPTY = DomainErrorCode.of('APPLICATION_ID_EMPTY', 'Application id is empty.');

  static readonly APPLICATION_ID_INVALID = DomainErrorCode.of('APPLICATION_ID_INVALID', 'Application id is invalid.');

  static readonly APPLICATION_DUPLICATED = super.of(
    'APPLICATION_DUPLICATED',
    'This company already has an active application for this period.',
  );

  static readonly DRAFT_ID_EMPTY = DomainErrorCode.of('DRAFT_ID_EMPTY', 'Draft id is empty.');

  static readonly DRAFT_ID_INVALID = DomainErrorCode.of('DRAFT_ID_INVALID', 'Draft id is invalid.');

  static readonly APPLICATION_DRAFT_INCOMPLETED = super.of(
    'APPLICATION_DRAFT_INCOMPLETED',
    'One or more statements are incompleted.',
  );

  static readonly APPLICATION_BLOCKED = super.of(
    'APPLICATION_BLOCKED',
    'Applications with the status {0} cannot be edited.',
  );

  static readonly APPLICATION_NOT_APPROVED = super.of(
    'APPLICATION_NOT_APPROVED',
    'Applications with the status {0} cannot be completed.',
  );

  static readonly APPLICATION_CREDIT_CARD_STATEMENTS_INVALID_PERIOD = DomainErrorCode.of(
    'APPLICATION_ADDITIONAL_STATEMENTS_INVALID_PERIOD',
    'The credit card statements contain periods that are invalid.',
  );

  static readonly APPLICATION_BANK_STATEMENTS_INVALID_PERIOD = DomainErrorCode.of(
    'APPLICATION_BANK_STATEMENTS_INVALID_PERIOD',
    'The bank statements contain periods that are invalid.',
  );

  static readonly ALL_NEEDED_FILES_NOT_PRESENT = DomainErrorCode.of(
    'ALL_NEEDED_FILES_NOT_PRESENT',
    'Not all needed files are present.',
  );

  static readonly DUPLICATE_FILE_NAMES_PRESENT = DomainErrorCode.of(
    'DUPLICATE_FILE_NAMES_PRESENT',
    'Duplicate file names are present.',
  );

  // Notifications

  static readonly NOTIFICATION_ID_EMPTY = DomainErrorCode.of('NOTIFICATION_ID_EMPTY', 'Notification ID is empty.');

  static readonly NOTIFICATION_ID_INVALID = DomainErrorCode.of(
    'NOTIFICATION_ID_INVALID',
    'Notification ID is invalid.',
  );

  static readonly NOTIFICATION_MESSAGE_EMPTY = super.of('NOTIFICATION_MESSAGE_EMPTY', 'Notification message is empty.');

  static readonly NOTIFICATION_MESSAGE_INVALID = super.of(
    'NOTIFICATION_MESSAGE_INVALID',
    'Notification message is invalid.',
  );

  static readonly NOTIFICATION_MESSAGE_TOO_SHORT = super.of(
    'NOTIFICATION_MESSAGE_TOO_SHORT',
    'Notification message is too short.',
  );

  static readonly NOTIFICATION_MESSAGE_TOO_LONG = super.of(
    'NOTIFICATION_MESSAGE_TOO_LONG',
    'Notification message is too long.',
  );

  static readonly NOTIFICATION_BANK_DUPLICATED = super.of(
    'NOTIFICATION_BANK_DUPLICATED',
    'This bank has already been notified.',
  );

  static readonly NOTIFICATION_REJECT_REASON_EMPTY = super.of(
    'NOTIFICATION_REJECT_REASON_EMPTY',
    'Notification reason is empty.',
  );

  static readonly NOTIFICATION_REJECT_REASON_INVALID = super.of(
    'NOTIFICATION_REJECT_REASON_INVALID',
    'Notification reason is invalid.',
  );

  static readonly NOTIFICATION_REJECT_OTHER_EMPTY = super.of(
    'NOTIFICATION_REJECT_OTHER_EMPTY',
    'Notification other is empty.',
  );

  static readonly NOTIFICATION_REJECT_OTHER_INVALID = super.of(
    'NOTIFICATION_REJECT_OTHER_INVALID',
    'Notification other is invalid.',
  );

  static readonly NOTIFICATION_REJECT_OTHER_TOO_SHORT = super.of(
    'NOTIFICATION_REJECT_OTHER_TOO_SHORT',
    'Notification other is too short.',
  );

  static readonly NOTIFICATION_REJECT_OTHER_TOO_LONG = super.of(
    'NOTIFICATION_REJECT_OTHER_TOO_LONG',
    'Notification other is too long.',
  );

  static readonly NOTIFICATION_NOT_ELIGIBLE_FOR_REJECTION = super.of(
    'NOTIFICATION_NOT_ELIGIBLE_FOR_REJECTION',
    'The notification does not meet the criteria for rejection.',
  );

  // Offers
  static readonly OFFER_AMOUNT_EMPTY = super.of('OFFER_AMOUNT_EMPTY', 'Offer amount is empty.');

  static readonly OFFER_AMOUNT_INVALID = super.of('OFFER_AMOUNT_INVALID', 'Offer amount is invalid.');

  static readonly OFFER_PRICE_EMPTY = super.of('OFFER_PRICE_EMPTY', 'Offer price is empty.');

  static readonly OFFER_PRICE_INVALID = super.of('OFFER_PRICE_INVALID', 'Offer price is invalid.');

  static readonly OFFER_RATE_EMPTY = super.of('OFFER_RATE_EMPTY', 'Offer factor rate is empty.');

  static readonly OFFER_RATE_INVALID = super.of('OFFER_RATE_INVALID', 'Offer factor rate is invalid.');

  static readonly OFFER_COMMISSION_EMPTY = super.of('OFFER_COMMISSION_EMPTY', 'Offer commission is empty.');

  static readonly OFFER_COMMISSION_INVALID = super.of('OFFER_COMMISSION_INVALID', 'Offer commission is invalid.');

  static readonly OFFER_POSITION_EMPTY = super.of('OFFER_POSITION_EMPTY', 'Offer position is empty.');

  static readonly OFFER_POSITION_INVALID = super.of('OFFER_POSITION_INVALID', 'Offer position is invalid.');

  static readonly OFFER_PAYMENT_PLAN_DURATION_EMPTY = super.of(
    'OFFER_PAYMENT_PLAN_DURATION_EMPTY',
    'Offer payment plan duration is empty.',
  );

  static readonly OFFER_PAYMENT_PLAN_DURATION_INVALID = super.of(
    'OFFER_PAYMENT_PLAN_DURATION_INVALID',
    'Offer payment plan duration is invalid.',
  );

  static readonly OFFER_POINTS_EMPTY = super.of('OFFER_POINTS_EMPTY', 'Offer points are empty.');

  static readonly OFFER_POINTS_INVALID = super.of('OFFER_POINTS_INVALID', 'Offer points are invalid.');

  static readonly OFFER_PAYMENT_PLAN_INVALID = super.of('OFFER_PAYMENT_PLAN_INVALID', 'Offer payment plan is invalid.');

  static readonly OFFER_TERM_INVALID = super.of('OFFER_TERM_INVALID', 'Offer term is invalid.');

  static readonly OFFER_AMOUNT_GREATER_THAN_PRICE = super.of(
    'OFFER_AMOUNT_GREATER_THAN_PRICE',
    'Offer amount must not be greater than the price',
  );

  static readonly OFFER_COMMISSION_GREATER_THAN_AMOUNT = super.of(
    'OFFER_COMMISSION_GREATER_THAN_AMOUNT',
    'Offer commission must not be greater than the amount',
  );

  static readonly OFFER_ID_EMPTY = DomainErrorCode.of('OFFER_ID_EMPTY', 'Offer ID is empty.');

  static readonly OFFER_ID_INVALID = DomainErrorCode.of('OFFER_ID_INVALID', 'Offer ID is invalid.');

  static readonly OFFER_ID_DUPLICATED = DomainErrorCode.of('OFFER_ID_DUPLICATED', 'Offer ID already exists.');

  static readonly APPLICATION_REJECT_REASON_EMPTY = super.of(
    'APPLICATION_REJECT_REASON_EMPTY',
    'Application rejection reason is empty.',
  );

  static readonly APPLICATION_REJECT_REASON_INVALID = super.of(
    'APPLICATION_REJECT_REASON_INVALID',
    'Application rejection reason is invalid.',
  );

  static readonly APPLICATION_REJECT_OTHER_EMPTY = super.of(
    'APPLICATION_REJECT_OTHER_EMPTY',
    'Additional information for application rejection is empty.',
  );

  static readonly APPLICATION_REJECT_OTHER_INVALID = super.of(
    'APPLICATION_REJECT_OTHER_INVALID',
    'Additional information for application rejection is invalid.',
  );

  static readonly APPLICATION_REJECT_OTHER_TOO_SHORT = super.of(
    'APPLICATION_REJECT_OTHER_TOO_SHORT',
    'Additional information for application rejection is too short.',
  );

  static readonly APPLICATION_REJECT_OTHER_TOO_LONG = super.of(
    'APPLICATION_REJECT_OTHER_TOO_LONG',
    'Additional information for application rejection is too long.',
  );

  static readonly APPLICATION_NOT_ELIGIBLE_FOR_REJECTION = super.of(
    'APPLICATION_NOT_ELIGIBLE_FOR_REJECTION',
    'The application does not meet the criteria for rejection.',
  );

  static readonly COMMISSION_ID_EMPTY = DomainErrorCode.of('COMMISSION_ID_EMPTY', 'Commission id is empty.');

  static readonly COMMISSION_ID_INVALID = DomainErrorCode.of('COMMISSION_ID_INVALID', 'Commission id is invalid.');

  static readonly COMMISSION_TOTAL_EMPTY = super.of('COMMISSION_TOTAL_EMPTY', 'Total is empty.');

  static readonly COMMISSION_TOTAL_INVALID = super.of('COMMISSION_TOTAL_INVALID', 'Total is invalid.');

  static readonly COMMISSION_USER_ID_EMPTY = super.of('COMMISSION_USER_ID_EMPTY', 'User ID is empty.');

  static readonly COMMISSION_USER_ID_INVALID = super.of('COMMISSION_USER_ID_INVALID', 'User ID is invalid.');

  static readonly COMMISSION_AMOUNT_EMPTY = super.of('COMMISSION_AMOUNT_EMPTY', 'Amount is empty.');

  static readonly COMMISSION_AMOUNT_INVALID = super.of('COMMISSION_AMOUNT_INVALID', 'Amount is invalid.');

  static readonly COMMISSION_DUPLICATED = super.of('COMMISSION_DUPLICATED', 'Commission already exists.');

  static readonly DISTRIBUTION_INVALID = DomainErrorCode.of(
    'DISTRIBUTION_INVALID',
    'Distribution field is invalid or missing.',
  );

  static readonly OVERDISTRIBUTION = DomainErrorCode.of(
    'OVERDISTRIBUTION',
    'The sum of all distributions exceeds the total commission',
  );

  static readonly COMMISSION_IS_PUBLISHED = DomainErrorCode.of(
    'COMMISSION_IS_PUBLISHED',
    'Published commissions are not editable',
  );

  // Industries
  static readonly INDUSTRY_EMPTY = super.of('INDUSTRY_EMPTY', 'Industry is empty.');

  static readonly INDUSTRY_INVALID = super.of('INDUSTRY_INVALID', 'Industry is invalid.');

  static readonly INDUSTRY_TOO_SHORT = super.of('INDUSTRY_TOO_SHORT', 'Industry is too short.');

  static readonly INDUSTRY_TOO_LONG = super.of('INDUSTRY_TOO_LONG', 'Industry is too long.');

  // Notes
  static readonly NOTE_ID_INVALID = super.of('NOTE_ID_INVALID', 'Note id is invalid.');

  static readonly NOTE_ID_EMPTY = super.of('NOTE_ID_EMPTY', 'Note id is empty.');

  static readonly NOTE_LEVEL_EMPTY = super.of('NOTE_LEVEL_EMPTY', 'Note level is empty.');

  static readonly NOTE_LEVEL_INVALID = super.of('NOTE_LEVEL_INVALID', 'Note level is invalid.');

  static readonly NOTE_DESCRIPTION_EMPTY = super.of('NOTE_DESCRIPTION_EMPTY', 'Note description is empty.');

  static readonly NOTE_DESCRIPTION_INVALID = super.of('NOTE_DESCRIPTION_INVALID', 'Note description is invalid.');

  static readonly NOTE_DESCRIPTION_TOO_SHORT = super.of('NOTE_DESCRIPTION_TOO_SHORT', 'Note description is too short.');

  static readonly NOTE_DESCRIPTION_TOO_LONG = super.of('NOTE_DESCRIPTION_TOO_LONG', 'Note description is too long.');

  static readonly NOTE_IS_DUPLICATED = super.of('NOTE_IS_DUPLICATED', 'Note already exists.');

  // Calls
  static readonly CALL_ENTITY_TYPE_EMPTY = super.of('CALL_ENTITY_TYPE_EMPTY', 'Call entity type is empty.');

  static readonly CALL_ENTITY_TYPE_INVALID = super.of('CALL_ENTITY_TYPE_INVALID', 'Call entity type is invalid.');

  static readonly CALL_PHONE_INDEX_EMPTY = super.of('CALL_PHONE_INDEX_EMPTY', 'Call phone index is empty.');

  static readonly CALL_PHONE_INDEX_INVALID = super.of('CALL_PHONE_INDEX_INVALID', 'Call phone index is invalid.');

  static readonly CALL_ENTITY_ID_EMPTY = super.of('CALL_ENTITY_ID_EMPTY', 'Call entity id is empty.');

  static readonly CALL_ENTITY_INVALID = super.of('CALL_ENTITY_INVALID', 'Call entity id is invalid.');

  static readonly CALL_FAILED = super.of('CALL_FAILED', '{0}');

  // Prospects & Leads

  static readonly PROSPECT_COMPANY_INVALID = super.of('PROSPECT_COMPANY_INVALID', 'Prospect company is invalid.');

  static readonly PROSPECT_COMPANY_TOO_SHORT = super.of('PROSPECT_COMPANY_TOO_SHORT', 'Prospect company is too short.');

  static readonly PROSPECT_COMPANY_TOO_LONG = super.of('PROSPECT_COMPANY_TOO_LONG', 'Prospect company is too long.');

  static readonly PROSPECT_COMPANY_EMPTY = super.of('PROSPECT_COMPANY_EMPTY', 'Prospect company is empty.');

  static readonly PROSPECT_NAME_EMPTY = super.of('PROSPECT_NAME_EMPTY', 'Prospect name is empty.');

  static readonly PROSPECT_NAME_INVALID = super.of('PROSPECT_NAME_INVALID', 'Prospect name is invalid.');

  static readonly PROSPECT_NAME_TOO_SHORT = super.of('PROSPECT_NAME_TOO_SHORT', 'Prospect name is too short.');

  static readonly PROSPECT_NAME_TOO_LONG = super.of('PROSPECT_NAME_TOO_LONG', 'Prospect name is too long.');

  static readonly PROSPECT_EMAIL_EMPTY = super.of('PROSPECT_EMAIL_EMPTY', 'Prospect email is empty.');

  static readonly PROSPECT_EMAIL_INVALID = super.of('PROSPECT_EMAIL_INVALID', 'Prospect email is invalid.');

  static readonly LEAD_GROUP_NAME_INVALID = super.of('LEAD_GROUP_NAME_INVALID', 'Lead group name is invalid.');

  static readonly LEAD_GROUP_NAME_EMPTY = super.of('LEAD_GROUP_NAME_EMPTY', 'Lead group name is invalid.');

  static readonly LEAD_GROUP_NAME_TOO_SHORT = super.of('LEAD_GROUP_NAME_TOO_SHORT', 'Lead group name is too short.');

  static readonly LEAD_GROUP_NAME_TOO_LONG = super.of('LEAD_GROUP_NAME_TOO_LONG', 'Lead group name is too long.');

  static readonly LEAD_ID_INVALID = DomainErrorCode.of('LEAD_ID_INVALID', 'Lead id is empty.');

  static readonly LEAD_ID_EMPTY = DomainErrorCode.of('LEAD_ID_EMPTY', 'Lead id is invalid.');

  static readonly LEAD_ASSIGNED_ID_INVALID = DomainErrorCode.of(
    'LEAD_ASSIGNED_ID_INVALID',
    'Lead assigned id is empty.',
  );

  static readonly LEAD_ASSIGNED_ID_EMPTY = DomainErrorCode.of('LEAD_ASSIGNED_ID_EMPTY', 'Lead assigned id is invalid.');

  static readonly LEAD_FILE_HEADERS_MALFORMED = DomainErrorCode.of(
    'LEAD_FILE_HEADERS_MALFORMED',
    'The lead file headers are invalid.',
  );

  // Reminder
  static readonly FOLLOW_UP_CALL_INVALID = super.of('FOLLOW_UP_CALL_INVALID', 'Follow up call date is invalid.');

  static readonly FOLLOW_UP_CALL_EMPTY = super.of('FOLLOW_UP_CALL_EMPTY', 'Follow up call date is empty.');

  static readonly TAG_ID_EMPTY = super.of('TAG_ID_EMPTY', 'Tag id is empty.');

  static readonly TAG_ID_INVALID = super.of('TAG_ID_INVALID', 'Tag id is invalid.');

  static readonly AUDIENCE_ID_EMPTY = super.of('AUDIENCE_ID_EMPTY', 'Audience id is empty.');

  static readonly AUDIENCE_ID_INVALID = super.of('AUDIENCE_ID_INVALID', 'Audience id is invalid.');

  static readonly LANGUAGE_TAG_ID_EMPTY = super.of('LANGUAGE_TAG_ID_EMPTY', 'Language tag id is empty.');

  static readonly LANGUAGE_TAG_ID_INVALID = super.of('LANGUAGE_TAG_ID_INVALID', 'Language tag id is invalid.');

  static readonly COMPLAINT_TYPE_EMPTY = DomainErrorCode.of('COMPLAINT_TYPE_EMPTY', 'Complaint type is empty.');

  static readonly COMPLAINT_TYPE_INVALID = DomainErrorCode.of('COMPLAINT_TYPE_INVALID', 'Complaint type is invalid.');

  static readonly COMPLAINT_EMAILS_EMPTY = DomainErrorCode.of('COMPLAINT_EMAILS_EMPTY', 'Complaint emails is empty.');

  static readonly COMPLAINT_EMAILS_INVALID = DomainErrorCode.of(
    'COMPLAINT_EMAILS_INVALID',
    'Complaint emails is invalid.',
  );

  static readonly COMPLAINT_DATE_EMPTY = DomainErrorCode.of('COMPLAINT_DATE_EMPTY', 'Complaint date is empty.');

  static readonly COMPLAINT_DATE_INVALID = DomainErrorCode.of('COMPLAINT_DATE_INVALID', 'Complaint date is invalid.');

  static readonly CAMPAIGN_ID_EMPTY = DomainErrorCode.of('CAMPAIGN_ID_EMPTY', 'Campaign id is empty.');

  static readonly CAMPAIGN_ID_INVALID = DomainErrorCode.of('CAMPAIGN_ID_INVALID', 'Campaign id is invalid.');

  static readonly CAMPAIGN_FINISH = DomainErrorCode.of('CAMPAIGN_FINISH', 'No more contacts to send.');

  static readonly CAMPAIGN_SENDER_INVALID = super.of('CAMPAIGN_SENDER_INVALID', 'Campaign sender is invalid.');

  static readonly CAMPAIGN_SENDER_EMPTY = super.of('CAMPAIGN_SENDER_EMPTY', 'Campaign sender is empty.');

  static readonly CAMPAIGN_MESSAGE_INVALID = super.of('CAMPAIGN_MESSAGE_INVALID', 'Campaign message is invalid.');

  static readonly CAMPAIGN_MESSAGE_EMPTY = super.of('CAMPAIGN_MESSAGE_EMPTY', 'Campaign message is empty.');

  static readonly CAMPAIGN_MESSAGE_TOO_LONG = super.of('CAMPAIGN_MESSAGE_TOO_LONG', 'Campaign message is too long.');

  static readonly CAMPAIGN_SUBJECT_INVALID = super.of('CAMPAIGN_SUBJECT_INVALID', 'Campaign subject is invalid.');

  static readonly CAMPAIGN_SUBJECT_EMPTY = super.of('CAMPAIGN_SUBJECT_EMPTY', 'Campaign subject is empty.');

  static readonly CAMPAIGN_SUBJECT_TOO_LONG = super.of('CAMPAIGN_SUBJECT_TOO_LONG', 'Campaign subject is too long.');

  static readonly CAMPAIGN_FILE_HEADERS_MALFORMED = DomainErrorCode.of(
    'CAMPAIGN_FILE_HEADERS_MALFORMED',
    'The campaign file headers are invalid.',
  );

  static readonly CAMPAIGN_CONTACT_EMAIL_EMPTY = super.of(
    'CAMPAIGN_CONTACT_EMAIL_EMPTY',
    'Campaign contact email is empty.',
  );

  static readonly CAMPAIGN_CONTACT_EMAIL_INVALID = super.of(
    'CAMPAIGN_CONTACT_EMAIL_INVALID',
    'Campaign contact email is invalid.',
  );

  static readonly CAMPAIGN_CONTACT_FIRST_NAME_INVALID = super.of(
    'CAMPAIGN_CONTACT_FIRST_NAME_INVALID',
    'Campaign contact first name is invalid.',
  );

  static readonly CAMPAIGN_CONTACT_LAST_NAME_INVALID = super.of(
    'CAMPAIGN_CONTACT_LAST_NAME_INVALID',
    'Campaign contact last name is invalid.',
  );

  static readonly CAMPAIGN_NO_CONTACTS = super.of('CAMPAIGN_NO_CONTACTS', 'There are no valid contacts to import.');

  static readonly CAMPAIGN_CONTACTS_EMPTY = super.of('CAMPAIGN_CONTACTS_EMPTY ', 'Campaign contact count is empty.');

  static readonly CAMPAIGN_CONTACTS_INVALID = super.of(
    'CAMPAIGN_CONTACTS_INVALID',
    'Campaign contact count is invalid.',
  );

  static readonly SIGNATURE_EMPTY = super.of('SIGNATURE_EMPTY', 'Signature is empty.');

  static readonly SIGNATURE_INVALID = super.of('SIGNATURE_INVALID', 'Signature is invalid.');

  static readonly APPLICATION_POSITION_INVALID = super.of(
    'APPLICATION_POSITION_INVALID',
    'Application position must be a number between 0 and 5.',
  );

  static readonly APPLICATION_POSITION_ALREADY_SET = super.of(
    'APPLICATION_POSITION_ALREADY_SET',
    'Application position has already been set and cannot be changed.',
  );

  static readonly APPLICATION_POSITION_NOT_DEFINED = super.of(
    'APPLICATION_POSITION_NOT_DEFINED',
    'Application position must be defined before performing this operation.',
  );

  // Email Sending
  static readonly EMAIL_SUBJECT_EMPTY = DomainErrorCode.of('EMAIL_SUBJECT_EMPTY', 'Email subject is empty.');

  static readonly EMAIL_SUBJECT_INVALID = DomainErrorCode.of('EMAIL_SUBJECT_INVALID', 'Email subject is invalid.');

  static readonly EMAIL_SUBJECT_TOO_LONG = DomainErrorCode.of('EMAIL_SUBJECT_TOO_LONG', 'Email subject is too long.');

  static readonly EMAIL_MESSAGE_EMPTY = DomainErrorCode.of('EMAIL_MESSAGE_EMPTY', 'Email message is empty.');

  static readonly EMAIL_MESSAGE_INVALID = DomainErrorCode.of('EMAIL_MESSAGE_INVALID', 'Email message is invalid.');

  static readonly EMAIL_MESSAGE_TOO_LONG = DomainErrorCode.of('EMAIL_MESSAGE_TOO_LONG', 'Email message is too long.');

  static readonly EMAIL_ATTACHMENTS_EMPTY = DomainErrorCode.of(
    'EMAIL_ATTACHMENTS_EMPTY',
    'Email attachments are empty.',
  );

  static readonly EMAIL_ATTACHMENTS_INVALID = DomainErrorCode.of(
    'EMAIL_ATTACHMENTS_INVALID',
    'Email attachments are invalid.',
  );

  static readonly EMAIL_ATTACHMENTS_TOO_MANY = DomainErrorCode.of(
    'EMAIL_ATTACHMENTS_TOO_MANY',
    'Too many email attachments.',
  );

  static readonly ATTACHMENT_ENTITY_TYPE_EMPTY = DomainErrorCode.of(
    'ATTACHMENT_ENTITY_TYPE_EMPTY',
    'Attachment entity type is empty.',
  );

  static readonly ATTACHMENT_ENTITY_TYPE_INVALID = DomainErrorCode.of(
    'ATTACHMENT_ENTITY_TYPE_INVALID',
    'Attachment entity type is invalid.',
  );

  static readonly ATTACHMENT_ENTITY_ID_EMPTY = DomainErrorCode.of(
    'ATTACHMENT_ENTITY_ID_EMPTY',
    'Attachment entity ID is empty.',
  );

  static readonly ATTACHMENT_ENTITY_ID_INVALID = DomainErrorCode.of(
    'ATTACHMENT_ENTITY_ID_INVALID',
    'Attachment entity ID is invalid.',
  );

  static readonly ATTACHMENT_DOCUMENT_ID_EMPTY = DomainErrorCode.of(
    'ATTACHMENT_DOCUMENT_ID_EMPTY',
    'Attachment document ID is empty.',
  );

  static readonly ATTACHMENT_DOCUMENT_ID_INVALID = DomainErrorCode.of(
    'ATTACHMENT_DOCUMENT_ID_INVALID',
    'Attachment document ID is invalid.',
  );

  static readonly IDENTIFICATION_TYPE_EMPTY = super.of('IDENTIFICATION_TYPE_EMPTY', 'Identification type is empty.');

  static readonly IDENTIFICATION_TYPE_INVALID = super.of(
    'IDENTIFICATION_TYPE_INVALID',
    'Identification type is invalid.',
  );
}
