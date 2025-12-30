import { Types } from 'mongoose';

import { ENTITY_MEDIA_TYPE } from '@/app/common';
import { AttachmentInputData, SendEmailToBanksCommand } from '@/domain/bank/commands/send-email-to-banks.command';

describe('SendEmailToBanksCommand', () => {
  const mockBankId1 = new Types.ObjectId().toString();
  const mockBankId2 = new Types.ObjectId().toString();
  const mockContactId = new Types.ObjectId().toString();
  const mockCompanyId = new Types.ObjectId().toString();
  const mockDocumentId1 = new Types.ObjectId().toString();
  const mockDocumentId2 = new Types.ObjectId().toString();

  const validAttachments: AttachmentInputData[] = [
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

  describe('create', () => {
    it('should create command with valid parameters', () => {
      // Arrange
      const banksIds = [mockBankId1, mockBankId2];
      const subject = 'Test Subject';
      const message = 'Test message content';

      // Act
      const result = SendEmailToBanksCommand.create(banksIds, subject, message, validAttachments);

      // Assert
      const command = result.getOrThrow();
      expect(command.bankIds).toHaveLength(2);
      expect(command.bankIds[0].toString()).toBe(mockBankId1);
      expect(command.bankIds[1].toString()).toBe(mockBankId2);
      expect(command.subject).toBe(subject);
      expect(command.message).toBe(message);
      expect(command.attachments).toHaveLength(2);
      expect(command.attachments[0].entityType).toBe(validAttachments[0].entityType);
      expect(command.attachments[0].entityId.toString()).toBe(validAttachments[0].entityId);
      expect(command.attachments[0].documentId.toString()).toBe(validAttachments[0].documentId);
      expect(command.attachments[1].entityType).toBe(validAttachments[1].entityType);
      expect(command.attachments[1].entityId.toString()).toBe(validAttachments[1].entityId);
      expect(command.attachments[1].documentId.toString()).toBe(validAttachments[1].documentId);
    });

    it('should create command with single bank and attachment', () => {
      // Arrange
      const banksIds = [mockBankId1];
      const subject = 'Single Bank Subject';
      const message = 'Single bank message';
      const attachments = [validAttachments[0]];

      // Act
      const result = SendEmailToBanksCommand.create(banksIds, subject, message, attachments);

      // Assert
      const command = result.getOrThrow();
      expect(command.bankIds).toHaveLength(1);
      expect(command.attachments).toHaveLength(1);
    });

    describe('validation errors', () => {
      describe('bank IDs validation', () => {
        it('should fail when banksIds is empty', () => {
          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create([], 'subject', 'message', validAttachments).getOrThrow();
          }).toThrow();
        });

        it('should fail when banksIds is null', () => {
          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create(null, 'subject', 'message', validAttachments).getOrThrow();
          }).toThrow();
        });

        it('should fail when banksIds is undefined', () => {
          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create(undefined, 'subject', 'message', validAttachments).getOrThrow();
          }).toThrow();
        });

        it('should fail when too many bank IDs provided', () => {
          // Arrange
          const tooManyBanks = Array.from({ length: 51 }, () => new Types.ObjectId().toString());

          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create(tooManyBanks, 'subject', 'message', validAttachments).getOrThrow();
          }).toThrow();
        });

        it('should fail when bank ID is invalid', () => {
          // Arrange
          const invalidBankIds = ['invalid-id'];

          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create(invalidBankIds, 'subject', 'message', validAttachments).getOrThrow();
          }).toThrow();
        });
      });

      describe('subject validation', () => {
        it('should fail when subject is empty', () => {
          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create([mockBankId1], '', 'message', validAttachments).getOrThrow();
          }).toThrow();
        });

        it('should fail when subject is null', () => {
          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create([mockBankId1], null, 'message', validAttachments).getOrThrow();
          }).toThrow();
        });

        it('should fail when subject is too long', () => {
          // Arrange
          const longSubject = 'a'.repeat(36); // 36 chars > 35 limit

          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create([mockBankId1], longSubject, 'message', validAttachments).getOrThrow();
          }).toThrow();
        });

        it('should accept maximum length subject', () => {
          // Arrange
          const maxLengthSubject = 'a'.repeat(35);

          // Act
          const result = SendEmailToBanksCommand.create([mockBankId1], maxLengthSubject, 'message', validAttachments);

          // Assert
          const command = result.getOrThrow();
          expect(command.subject).toBe(maxLengthSubject);
        });
      });

      describe('message validation', () => {
        it('should fail when message is empty', () => {
          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create([mockBankId1], 'subject', '', validAttachments).getOrThrow();
          }).toThrow();
        });

        it('should fail when message is null', () => {
          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create([mockBankId1], 'subject', null, validAttachments).getOrThrow();
          }).toThrow();
        });

        it('should fail when message is too long', () => {
          // Arrange
          const longMessage = 'a'.repeat(2001);

          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create([mockBankId1], 'subject', longMessage, validAttachments).getOrThrow();
          }).toThrow();
        });

        it('should accept maximum length message', () => {
          // Arrange
          const maxLengthMessage = 'a'.repeat(2000);

          // Act
          const result = SendEmailToBanksCommand.create([mockBankId1], 'subject', maxLengthMessage, validAttachments);

          // Assert
          const command = result.getOrThrow();
          expect(command.message).toBe(maxLengthMessage);
        });
      });

      describe('attachments validation', () => {
        it('should fail when attachments is empty', () => {
          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create([mockBankId1], 'subject', 'message', []).getOrThrow();
          }).toThrow();
        });

        it('should fail when attachments is null', () => {
          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create([mockBankId1], 'subject', 'message', null).getOrThrow();
          }).toThrow();
        });

        it('should fail when too many attachments provided', () => {
          // Arrange
          const tooManyAttachments = Array.from({ length: 11 }, () => ({
            entityType: ENTITY_MEDIA_TYPE.CONTACT,
            entityId: new Types.ObjectId().toString(),
            documentId: new Types.ObjectId().toString(),
          }));

          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create([mockBankId1], 'subject', 'message', tooManyAttachments).getOrThrow();
          }).toThrow();
        });

        it('should accept maximum number of attachments', () => {
          // Arrange
          const maxAttachments = Array.from({ length: 10 }, () => ({
            entityType: ENTITY_MEDIA_TYPE.CONTACT,
            entityId: new Types.ObjectId().toString(),
            documentId: new Types.ObjectId().toString(),
          }));

          // Act
          const result = SendEmailToBanksCommand.create([mockBankId1], 'subject', 'message', maxAttachments);

          // Assert
          const command = result.getOrThrow();
          expect(command.attachments).toHaveLength(10);
        });

        it('should fail when attachment entity type is invalid', () => {
          // Arrange
          const invalidAttachments = [
            {
              entityType: 'invalid' as any,
              entityId: mockContactId,
              documentId: mockDocumentId1,
            },
          ];

          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create([mockBankId1], 'subject', 'message', invalidAttachments).getOrThrow();
          }).toThrow();
        });

        it('should fail when attachment entity ID is invalid', () => {
          // Arrange
          const invalidAttachments = [
            {
              entityType: ENTITY_MEDIA_TYPE.CONTACT,
              entityId: 'invalid-id',
              documentId: mockDocumentId1,
            },
          ];

          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create([mockBankId1], 'subject', 'message', invalidAttachments).getOrThrow();
          }).toThrow();
        });

        it('should fail when attachment document ID is invalid', () => {
          // Arrange
          const invalidAttachments = [
            {
              entityType: ENTITY_MEDIA_TYPE.CONTACT,
              entityId: mockContactId,
              documentId: 'invalid-id',
            },
          ];

          // Act & Assert
          expect(() => {
            SendEmailToBanksCommand.create([mockBankId1], 'subject', 'message', invalidAttachments).getOrThrow();
          }).toThrow();
        });

        it('should validate both CONTACT and COMPANY entity types', () => {
          // Arrange
          const contactAttachment = {
            entityType: ENTITY_MEDIA_TYPE.CONTACT,
            entityId: mockContactId,
            documentId: mockDocumentId1,
          };
          const companyAttachment = {
            entityType: ENTITY_MEDIA_TYPE.COMPANY,
            entityId: mockCompanyId,
            documentId: mockDocumentId2,
          };

          // Act
          const result1 = SendEmailToBanksCommand.create([mockBankId1], 'subject', 'message', [contactAttachment]);
          const result2 = SendEmailToBanksCommand.create([mockBankId1], 'subject', 'message', [companyAttachment]);
          const result3 = SendEmailToBanksCommand.create([mockBankId1], 'subject', 'message', [
            contactAttachment,
            companyAttachment,
          ]);

          // Assert
          expect(result1.getOrThrow().attachments[0].entityType).toBe(ENTITY_MEDIA_TYPE.CONTACT);
          expect(result2.getOrThrow().attachments[0].entityType).toBe(ENTITY_MEDIA_TYPE.COMPANY);
          expect(result3.getOrThrow().attachments).toHaveLength(2);
        });
      });
    });
  });
});
