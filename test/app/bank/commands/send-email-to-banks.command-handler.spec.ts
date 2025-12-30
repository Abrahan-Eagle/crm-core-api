import { NotFound } from '@internal/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { of, throwError } from 'rxjs';

import { SendEmailToBanksCommandHandler } from '@/app/bank/commands/send-email-to-banks.command-handler';
import { ENTITY_MEDIA_TYPE, InjectionConstant, MediaConfig, TenantConfig } from '@/app/common';
import { BankRepository } from '@/domain/bank';
import { AttachmentInputData, SendEmailToBanksCommand } from '@/domain/bank/commands/send-email-to-banks.command';
import { DomainErrorCode, Id, InvalidTenantId, MailerService, UrlSignerService } from '@/domain/common';
import { Company, CompanyRepository } from '@/domain/company';
import { Contact, ContactRepository } from '@/domain/contact';
import { ExtendedAuthContextStorage } from '@/infra/common';

describe('SendEmailToBanksCommandHandler', () => {
  let handler: SendEmailToBanksCommandHandler;
  let bankRepository: jest.Mocked<BankRepository>;
  let companyRepository: jest.Mocked<CompanyRepository>;
  let contactRepository: jest.Mocked<ContactRepository>;
  let mailerService: jest.Mocked<MailerService>;
  let mediaConfig: jest.Mocked<MediaConfig>;
  let tenantConfig: jest.Mocked<TenantConfig>;
  let context: jest.Mocked<ExtendedAuthContextStorage>;
  let urlSigner: jest.Mocked<UrlSignerService>;

  const mockBankId1 = Id.create(
    new Types.ObjectId().toString(),
    () => DomainErrorCode.BANK_ID_EMPTY,
    () => DomainErrorCode.BANK_ID_INVALID,
  ).getOrThrow();
  const mockBankId2 = Id.create(
    new Types.ObjectId().toString(),
    () => DomainErrorCode.BANK_ID_EMPTY,
    () => DomainErrorCode.BANK_ID_INVALID,
  ).getOrThrow();
  const mockContactId = new Types.ObjectId().toString();
  const mockCompanyId = new Types.ObjectId().toString();
  const mockDocumentId1 = new Types.ObjectId().toString();
  const mockDocumentId2 = new Types.ObjectId().toString();
  const mockTenantId = 'test-tenant';

  beforeEach(async () => {
    const bankRepositoryMock = {
      findManyById: jest.fn(),
    };

    const companyRepositoryMock = {
      findById: jest.fn(),
      findMany: jest.fn(),
    };

    const contactRepositoryMock = {
      findById: jest.fn(),
      findMany: jest.fn(),
    };

    const mailerServiceMock = {
      send: jest.fn(),
    };

    const mediaConfigMock = {
      getMediaConfig: jest.fn(),
    };

    const tenantConfigMock = {
      tenants: [
        {
          id: mockTenantId,
          email: 'test@tenant.com',
        },
      ],
    };

    const contextMock = {
      store: {
        tenantId: mockTenantId,
      },
    };

    const urlSignerMock = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendEmailToBanksCommandHandler,
        {
          provide: InjectionConstant.BANK_REPOSITORY,
          useValue: bankRepositoryMock,
        },
        {
          provide: InjectionConstant.COMPANY_REPOSITORY,
          useValue: companyRepositoryMock,
        },
        {
          provide: InjectionConstant.CONTACT_REPOSITORY,
          useValue: contactRepositoryMock,
        },
        {
          provide: InjectionConstant.MAILER_SERVICE,
          useValue: mailerServiceMock,
        },
        {
          provide: MediaConfig,
          useValue: mediaConfigMock,
        },
        {
          provide: TenantConfig,
          useValue: tenantConfigMock,
        },
        {
          provide: ExtendedAuthContextStorage,
          useValue: contextMock,
        },
        {
          provide: InjectionConstant.URL_SIGNER_SERVICE,
          useValue: urlSignerMock,
        },
      ],
    }).compile();

    handler = module.get<SendEmailToBanksCommandHandler>(SendEmailToBanksCommandHandler);
    bankRepository = module.get(InjectionConstant.BANK_REPOSITORY);
    companyRepository = module.get(InjectionConstant.COMPANY_REPOSITORY);
    contactRepository = module.get(InjectionConstant.CONTACT_REPOSITORY);
    mailerService = module.get(InjectionConstant.MAILER_SERVICE);
    mediaConfig = module.get(MediaConfig);
    tenantConfig = module.get(TenantConfig);
    context = module.get(ExtendedAuthContextStorage);
    urlSigner = module.get(InjectionConstant.URL_SIGNER_SERVICE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should successfully send email to banks with attachments', (done) => {
      // Arrange
      const attachments: AttachmentInputData[] = [
        {
          entityType: ENTITY_MEDIA_TYPE.CONTACT,
          entityId: mockContactId,
          documentId: mockDocumentId1,
        },
        {
          entityType: ENTITY_MEDIA_TYPE.COMPANY,
          entityId: mockCompanyId,
          documentId: mockDocumentId2,
        },
      ];

      const command = SendEmailToBanksCommand.create(
        [mockBankId1.toString(), mockBankId2.toString()],
        'Test Subject',
        'Test Message',
        attachments,
      ).getOrThrow();

      const mockBanks = [
        {
          contacts: [
            {
              emails: [{ value: 'bank1@test.com' }, { value: 'bank1-alt@test.com' }],
            },
          ],
        },
        {
          contacts: [
            {
              emails: [{ value: 'bank2@test.com' }],
            },
          ],
        },
      ];

      const mockContact = {
        id: { toString: () => mockContactId },
        documents: [
          {
            id: {
              toString: () => mockDocumentId1,
              equals: (id: any) => id.toString() === mockDocumentId1,
            },
            name: 'contact-document.pdf',
          },
        ],
      } as Contact;

      const mockCompany = {
        id: { toString: () => mockCompanyId },
        documents: [
          {
            id: {
              toString: () => mockDocumentId2,
              equals: (id: any) => id.toString() === mockDocumentId2,
            },
            name: 'company-document.pdf',
          },
        ],
      } as Company;

      bankRepository.findManyById.mockReturnValue(of(mockBanks as any));
      contactRepository.findMany.mockReturnValue(of([mockContact]));
      companyRepository.findMany.mockReturnValue(of([mockCompany]));
      mediaConfig.getMediaConfig.mockImplementation((type) => ({
        uri: type === ENTITY_MEDIA_TYPE.CONTACT ? 'https://contact-uri' : 'https://company-uri',
        entity: type,
        bucket: 'test-bucket',
        path: 'test-path',
      }));
      urlSigner.sign.mockImplementation((url) => `signed-${url}`);
      mailerService.send.mockReturnValue(of(undefined));

      // Act
      handler.handle(command).subscribe({
        next: () => {
          // Assert
          expect(bankRepository.findManyById).toHaveBeenCalledWith([mockBankId1, mockBankId2]);
          expect(contactRepository.findMany).toHaveBeenCalled();
          expect(companyRepository.findMany).toHaveBeenCalled();
          expect(urlSigner.sign).toHaveBeenCalledWith('https://contact-uri/contact-document.pdf');
          expect(urlSigner.sign).toHaveBeenCalledWith('https://company-uri/company-document.pdf');
          expect(mailerService.send).toHaveBeenCalledWith({
            from: 'test@tenant.com',
            subject: 'Test Subject',
            message: 'Test Message',
            bcc: ['bank1@test.com', 'bank1-alt@test.com', 'bank2@test.com'],
            attachments: [
              'signed-https://contact-uri/contact-document.pdf',
              'signed-https://company-uri/company-document.pdf',
            ],
          });
          done();
        },
        error: done.fail,
      });
    });

    it('should handle single bank and single attachment', (done) => {
      // Arrange
      const attachments: AttachmentInputData[] = [
        {
          entityType: ENTITY_MEDIA_TYPE.CONTACT,
          entityId: mockContactId,
          documentId: mockDocumentId1,
        },
      ];

      const command = SendEmailToBanksCommand.create(
        [mockBankId1.toString()],
        'Single Bank Subject',
        'Single Bank Message',
        attachments,
      ).getOrThrow();

      const mockBanks = [
        {
          contacts: [
            {
              emails: [{ value: 'single-bank@test.com' }],
            },
          ],
        },
      ];

      const mockContact = {
        id: { toString: () => mockContactId },
        documents: [
          {
            id: {
              toString: () => mockDocumentId1,
              equals: (id: any) => id.toString() === mockDocumentId1,
            },
            name: 'single-document.pdf',
          },
        ],
      } as Contact;

      bankRepository.findManyById.mockReturnValue(of(mockBanks as any));
      contactRepository.findMany.mockReturnValue(of([mockContact]));
      mediaConfig.getMediaConfig.mockReturnValue({
        uri: 'https://contact-uri',
        entity: 'contact',
        bucket: 'test-bucket',
        path: 'test-path',
      });
      urlSigner.sign.mockReturnValue('signed-url');
      mailerService.send.mockReturnValue(of(undefined));

      // Act
      handler.handle(command).subscribe({
        next: () => {
          // Assert
          expect(mailerService.send).toHaveBeenCalledWith({
            from: 'test@tenant.com',
            subject: 'Single Bank Subject',
            message: 'Single Bank Message',
            bcc: ['single-bank@test.com'],
            attachments: ['signed-url'],
          });
          done();
        },
        error: done.fail,
      });
    });

    it('should throw NotFound when contact does not exist', (done) => {
      // Arrange
      const attachments: AttachmentInputData[] = [
        {
          entityType: ENTITY_MEDIA_TYPE.CONTACT,
          entityId: mockContactId,
          documentId: mockDocumentId1,
        },
      ];

      const command = SendEmailToBanksCommand.create(
        [mockBankId1.toString()],
        'Test Subject',
        'Test Message',
        attachments,
      ).getOrThrow();

      bankRepository.findManyById.mockReturnValue(of([]));
      contactRepository.findMany.mockReturnValue(of([]));

      // Act
      handler.handle(command).subscribe({
        next: () => done.fail('Expected error but got success'),
        error: (error) => {
          // Assert
          expect(error).toBeInstanceOf(NotFound);
          done();
        },
      });
    });

    it('should throw NotFound when company does not exist', (done) => {
      // Arrange
      const attachments: AttachmentInputData[] = [
        {
          entityType: ENTITY_MEDIA_TYPE.COMPANY,
          entityId: mockCompanyId,
          documentId: mockDocumentId2,
        },
      ];

      const command = SendEmailToBanksCommand.create(
        [mockBankId1.toString()],
        'Test Subject',
        'Test Message',
        attachments,
      ).getOrThrow();

      bankRepository.findManyById.mockReturnValue(of([]));
      companyRepository.findMany.mockReturnValue(of([]));

      // Act
      handler.handle(command).subscribe({
        next: () => done.fail('Expected error but got success'),
        error: (error) => {
          // Assert
          expect(error).toBeInstanceOf(NotFound);
          done();
        },
      });
    });

    it('should throw NotFound when contact document does not exist', (done) => {
      // Arrange
      const attachments: AttachmentInputData[] = [
        {
          entityType: ENTITY_MEDIA_TYPE.CONTACT,
          entityId: mockContactId,
          documentId: mockDocumentId1,
        },
      ];

      const command = SendEmailToBanksCommand.create(
        [mockBankId1.toString()],
        'Test Subject',
        'Test Message',
        attachments,
      ).getOrThrow();

      const mockContact = {
        id: { toString: () => mockContactId },
        documents: [], // No documents
      } as unknown as Contact;

      bankRepository.findManyById.mockReturnValue(of([]));
      contactRepository.findMany.mockReturnValue(of([mockContact]));

      // Act
      handler.handle(command).subscribe({
        next: () => done.fail('Expected error but got success'),
        error: (error) => {
          // Assert
          expect(error).toBeInstanceOf(NotFound);
          done();
        },
      });
    });

    it('should throw NotFound when company document does not exist', (done) => {
      // Arrange
      const attachments: AttachmentInputData[] = [
        {
          entityType: ENTITY_MEDIA_TYPE.COMPANY,
          entityId: mockCompanyId,
          documentId: mockDocumentId2,
        },
      ];

      const command = SendEmailToBanksCommand.create(
        [mockBankId1.toString()],
        'Test Subject',
        'Test Message',
        attachments,
      ).getOrThrow();

      const mockCompany = {
        id: { toString: () => mockCompanyId },
        documents: [], // No documents
      } as unknown as Company;

      bankRepository.findManyById.mockReturnValue(of([]));
      companyRepository.findMany.mockReturnValue(of([mockCompany]));

      // Act
      handler.handle(command).subscribe({
        next: () => done.fail('Expected error but got success'),
        error: (error) => {
          // Assert
          expect(error).toBeInstanceOf(NotFound);
          done();
        },
      });
    });

    it('should throw InvalidTenantId when tenant is not found', (done) => {
      // Arrange
      const attachments: AttachmentInputData[] = [
        {
          entityType: ENTITY_MEDIA_TYPE.CONTACT,
          entityId: mockContactId,
          documentId: mockDocumentId1,
        },
      ];

      const command = SendEmailToBanksCommand.create(
        [mockBankId1.toString()],
        'Test Subject',
        'Test Message',
        attachments,
      ).getOrThrow();

      // Set invalid tenant context
      context.store.tenantId = 'invalid-tenant';

      const mockBanks = [
        {
          contacts: [
            {
              emails: [{ value: 'bank@test.com' }],
            },
          ],
        },
      ];

      const mockContact = {
        id: { toString: () => mockContactId },
        documents: [
          {
            id: {
              toString: () => mockDocumentId1,
              equals: (id: any) => id.toString() === mockDocumentId1,
            },
            name: 'document.pdf',
          },
        ],
      } as Contact;

      bankRepository.findManyById.mockReturnValue(of(mockBanks as any));
      contactRepository.findMany.mockReturnValue(of([mockContact]));
      mediaConfig.getMediaConfig.mockReturnValue({
        uri: 'https://contact-uri',
        entity: 'contact',
        bucket: 'test-bucket',
        path: 'test-path',
      });
      urlSigner.sign.mockReturnValue('signed-url');

      // Act
      handler.handle(command).subscribe({
        next: () => done.fail('Expected error but got success'),
        error: (error) => {
          // Assert
          expect(error).toBeInstanceOf(InvalidTenantId);
          done();
        },
      });
    });

    it('should throw InvalidTenantId when tenant email is not configured', (done) => {
      // Arrange
      const attachments: AttachmentInputData[] = [
        {
          entityType: ENTITY_MEDIA_TYPE.CONTACT,
          entityId: mockContactId,
          documentId: mockDocumentId1,
        },
      ];

      const command = SendEmailToBanksCommand.create(
        [mockBankId1.toString()],
        'Test Subject',
        'Test Message',
        attachments,
      ).getOrThrow();

      // Remove email from tenant config
      tenantConfig.tenants[0].email = null as any;

      const mockBanks = [
        {
          contacts: [
            {
              emails: [{ value: 'bank@test.com' }],
            },
          ],
        },
      ];

      const mockContact = {
        id: { toString: () => mockContactId },
        documents: [
          {
            id: {
              toString: () => mockDocumentId1,
              equals: (id: any) => id.toString() === mockDocumentId1,
            },
            name: 'document.pdf',
          },
        ],
      } as Contact;

      bankRepository.findManyById.mockReturnValue(of(mockBanks as any));
      contactRepository.findMany.mockReturnValue(of([mockContact]));
      mediaConfig.getMediaConfig.mockReturnValue({
        uri: 'https://contact-uri',
        entity: 'contact',
        bucket: 'test-bucket',
        path: 'test-path',
      });
      urlSigner.sign.mockReturnValue('signed-url');

      // Act
      handler.handle(command).subscribe({
        next: () => done.fail('Expected error but got success'),
        error: (error) => {
          // Assert
          expect(error).toBeInstanceOf(InvalidTenantId);
          done();
        },
      });
    });

    it('should handle mailer service errors', (done) => {
      // Arrange
      const attachments: AttachmentInputData[] = [
        {
          entityType: ENTITY_MEDIA_TYPE.CONTACT,
          entityId: mockContactId,
          documentId: mockDocumentId1,
        },
      ];

      const command = SendEmailToBanksCommand.create(
        [mockBankId1.toString()],
        'Test Subject',
        'Test Message',
        attachments,
      ).getOrThrow();

      const mockBanks = [
        {
          contacts: [
            {
              emails: [{ value: 'bank@test.com' }],
            },
          ],
        },
      ];

      const mockContact = {
        id: { toString: () => mockContactId },
        documents: [
          {
            id: {
              toString: () => mockDocumentId1,
              equals: (id: any) => id.toString() === mockDocumentId1,
            },
            name: 'document.pdf',
          },
        ],
      } as Contact;

      bankRepository.findManyById.mockReturnValue(of(mockBanks as any));
      contactRepository.findMany.mockReturnValue(of([mockContact]));
      mediaConfig.getMediaConfig.mockReturnValue({
        uri: 'https://contact-uri',
        entity: 'contact',
        bucket: 'test-bucket',
        path: 'test-path',
      });
      urlSigner.sign.mockReturnValue('signed-url');
      mailerService.send.mockReturnValue(throwError(() => new Error('Mailer service error')));

      // Act
      handler.handle(command).subscribe({
        next: () => done.fail('Expected error but got success'),
        error: (error) => {
          // Assert
          expect(error.message).toBe('Mailer service error');
          done();
        },
      });
    });
  });
});
