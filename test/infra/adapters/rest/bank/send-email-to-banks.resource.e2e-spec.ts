import { Types } from 'mongoose';

import { SendEmailToBanksRequest } from '@/app/bank';
import { ENTITY_MEDIA_TYPE } from '@/app/common';
import { SendEmailToBanksCommand } from '@/domain/bank';

describe('SendEmailToBanksResource (Integration Test)', () => {
  const mockBankId1 = new Types.ObjectId().toString();
  const mockBankId2 = new Types.ObjectId().toString();
  const mockContactId = new Types.ObjectId().toString();
  const mockCompanyId = new Types.ObjectId().toString();
  const mockDocumentId1 = new Types.ObjectId().toString();
  const mockDocumentId2 = new Types.ObjectId().toString();

  describe('SendEmailToBanksCommand Creation', () => {
    it('should create command with valid request payload', () => {
      // Arrange
      const request: SendEmailToBanksRequest = {
        bankIds: [mockBankId1, mockBankId2],
        subject: 'Required documents for application',
        message: 'Hello! Please find the requested documents attached.',
        attachments: [
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
        ],
      };

      // Act
      const result = SendEmailToBanksCommand.create(
        request.bankIds,
        request.subject,
        request.message,
        request.attachments.map((attachment) => ({
          entityType: attachment.entityType,
          entityId: attachment.entityId,
          documentId: attachment.documentId,
        })),
      );

      // Assert
      const command = result.getOrThrow();
      expect(command.bankIds).toHaveLength(2);
      expect(command.bankIds[0].toString()).toBe(mockBankId1);
      expect(command.bankIds[1].toString()).toBe(mockBankId2);
      expect(command.subject).toBe(request.subject);
      expect(command.message).toBe(request.message);
      expect(command.attachments).toHaveLength(2);
      expect(command.attachments[0].entityType).toBe(ENTITY_MEDIA_TYPE.CONTACT);
      expect(command.attachments[1].entityType).toBe(ENTITY_MEDIA_TYPE.COMPANY);
    });

    it('should handle single bank with single attachment', () => {
      // Arrange
      const request: SendEmailToBanksRequest = {
        bankIds: [mockBankId1],
        subject: 'Single document',
        message: 'Here is the document.',
        attachments: [
          {
            entityType: ENTITY_MEDIA_TYPE.CONTACT,
            entityId: mockContactId,
            documentId: mockDocumentId1,
          },
        ],
      };

      // Act
      const result = SendEmailToBanksCommand.create(
        request.bankIds,
        request.subject,
        request.message,
        request.attachments.map((attachment) => ({
          entityType: attachment.entityType,
          entityId: attachment.entityId,
          documentId: attachment.documentId,
        })),
      );

      // Assert
      const command = result.getOrThrow();
      expect(command.bankIds).toHaveLength(1);
      expect(command.attachments).toHaveLength(1);
      expect(command.subject).toBe('Single document');
      expect(command.message).toBe('Here is the document.');
    });

    it('should handle maximum allowed banks and attachments', () => {
      // Arrange
      const maxBanks = Array.from({ length: 50 }, () => new Types.ObjectId().toString());
      const maxAttachments = Array.from({ length: 10 }, (_, i) => ({
        entityType: i % 2 === 0 ? ENTITY_MEDIA_TYPE.CONTACT : ENTITY_MEDIA_TYPE.COMPANY,
        entityId: new Types.ObjectId().toString(),
        documentId: new Types.ObjectId().toString(),
      }));

      const request: SendEmailToBanksRequest = {
        bankIds: maxBanks,
        subject: 'Maximum capacity test',
        message: 'Testing maximum number of banks and attachments.',
        attachments: maxAttachments,
      };

      // Act
      const result = SendEmailToBanksCommand.create(
        request.bankIds,
        request.subject,
        request.message,
        request.attachments.map((attachment) => ({
          entityType: attachment.entityType,
          entityId: attachment.entityId,
          documentId: attachment.documentId,
        })),
      );

      // Assert
      const command = result.getOrThrow();
      expect(command.bankIds).toHaveLength(50);
      expect(command.attachments).toHaveLength(10);
    });

    it('should handle both CONTACT and COMPANY entity types in single request', () => {
      // Arrange
      const request: SendEmailToBanksRequest = {
        bankIds: [mockBankId1],
        subject: 'Mixed entity types',
        message: 'Documents from both contact and company.',
        attachments: [
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
          {
            entityType: ENTITY_MEDIA_TYPE.CONTACT,
            entityId: new Types.ObjectId().toString(),
            documentId: new Types.ObjectId().toString(),
          },
        ],
      };

      // Act
      const result = SendEmailToBanksCommand.create(
        request.bankIds,
        request.subject,
        request.message,
        request.attachments.map((attachment) => ({
          entityType: attachment.entityType,
          entityId: attachment.entityId,
          documentId: attachment.documentId,
        })),
      );

      // Assert
      const command = result.getOrThrow();
      expect(command.attachments).toHaveLength(3);
      expect(command.attachments.filter((a) => a.entityType === ENTITY_MEDIA_TYPE.CONTACT)).toHaveLength(2);
      expect(command.attachments.filter((a) => a.entityType === ENTITY_MEDIA_TYPE.COMPANY)).toHaveLength(1);
    });

    it('should handle maximum length subject and message', () => {
      // Arrange
      const maxSubject = 'A'.repeat(35);
      const maxMessage = 'B'.repeat(2000);

      const request: SendEmailToBanksRequest = {
        bankIds: [mockBankId1],
        subject: maxSubject,
        message: maxMessage,
        attachments: [
          {
            entityType: ENTITY_MEDIA_TYPE.CONTACT,
            entityId: mockContactId,
            documentId: mockDocumentId1,
          },
        ],
      };

      // Act
      const result = SendEmailToBanksCommand.create(
        request.bankIds,
        request.subject,
        request.message,
        request.attachments.map((attachment) => ({
          entityType: attachment.entityType,
          entityId: attachment.entityId,
          documentId: attachment.documentId,
        })),
      );

      // Assert
      const command = result.getOrThrow();
      expect(command.subject).toBe(maxSubject);
      expect(command.subject).toHaveLength(35);
      expect(command.message).toBe(maxMessage);
      expect(command.message).toHaveLength(2000);
    });

    describe('validation errors', () => {
      it('should fail with empty banks list', () => {
        // Arrange
        const request: SendEmailToBanksRequest = {
          bankIds: [],
          subject: 'Test Subject',
          message: 'Test Message',
          attachments: [
            {
              entityType: ENTITY_MEDIA_TYPE.CONTACT,
              entityId: mockContactId,
              documentId: mockDocumentId1,
            },
          ],
        };

        // Act & Assert
        expect(() => {
          SendEmailToBanksCommand.create(
            request.bankIds,
            request.subject,
            request.message,
            request.attachments.map((attachment) => ({
              entityType: attachment.entityType,
              entityId: attachment.entityId,
              documentId: attachment.documentId,
            })),
          ).getOrThrow();
        }).toThrow();
      });

      it('should fail with too many banks', () => {
        // Arrange
        const tooManyBanks = Array.from({ length: 51 }, () => new Types.ObjectId().toString());
        const request: SendEmailToBanksRequest = {
          bankIds: tooManyBanks,
          subject: 'Test Subject',
          message: 'Test Message',
          attachments: [
            {
              entityType: ENTITY_MEDIA_TYPE.CONTACT,
              entityId: mockContactId,
              documentId: mockDocumentId1,
            },
          ],
        };

        // Act & Assert
        expect(() => {
          SendEmailToBanksCommand.create(
            request.bankIds,
            request.subject,
            request.message,
            request.attachments.map((attachment) => ({
              entityType: attachment.entityType,
              entityId: attachment.entityId,
              documentId: attachment.documentId,
            })),
          ).getOrThrow();
        }).toThrow();
      });

      it('should fail with empty subject', () => {
        // Arrange
        const request: SendEmailToBanksRequest = {
          bankIds: [mockBankId1],
          subject: '',
          message: 'Test Message',
          attachments: [
            {
              entityType: ENTITY_MEDIA_TYPE.CONTACT,
              entityId: mockContactId,
              documentId: mockDocumentId1,
            },
          ],
        };

        // Act & Assert
        expect(() => {
          SendEmailToBanksCommand.create(
            request.bankIds,
            request.subject,
            request.message,
            request.attachments.map((attachment) => ({
              entityType: attachment.entityType,
              entityId: attachment.entityId,
              documentId: attachment.documentId,
            })),
          ).getOrThrow();
        }).toThrow();
      });

      it('should fail with subject too long', () => {
        // Arrange
        const request: SendEmailToBanksRequest = {
          bankIds: [mockBankId1],
          subject: 'A'.repeat(36),
          message: 'Test Message',
          attachments: [
            {
              entityType: ENTITY_MEDIA_TYPE.CONTACT,
              entityId: mockContactId,
              documentId: mockDocumentId1,
            },
          ],
        };

        // Act & Assert
        expect(() => {
          SendEmailToBanksCommand.create(
            request.bankIds,
            request.subject,
            request.message,
            request.attachments.map((attachment) => ({
              entityType: attachment.entityType,
              entityId: attachment.entityId,
              documentId: attachment.documentId,
            })),
          ).getOrThrow();
        }).toThrow();
      });

      it('should fail with empty message', () => {
        // Arrange
        const request: SendEmailToBanksRequest = {
          bankIds: [mockBankId1],
          subject: 'Test Subject',
          message: '',
          attachments: [
            {
              entityType: ENTITY_MEDIA_TYPE.CONTACT,
              entityId: mockContactId,
              documentId: mockDocumentId1,
            },
          ],
        };

        // Act & Assert
        expect(() => {
          SendEmailToBanksCommand.create(
            request.bankIds,
            request.subject,
            request.message,
            request.attachments.map((attachment) => ({
              entityType: attachment.entityType,
              entityId: attachment.entityId,
              documentId: attachment.documentId,
            })),
          ).getOrThrow();
        }).toThrow();
      });

      it('should fail with message too long', () => {
        // Arrange
        const request: SendEmailToBanksRequest = {
          bankIds: [mockBankId1],
          subject: 'Test Subject',
          message: 'A'.repeat(2001),
          attachments: [
            {
              entityType: ENTITY_MEDIA_TYPE.CONTACT,
              entityId: mockContactId,
              documentId: mockDocumentId1,
            },
          ],
        };

        // Act & Assert
        expect(() => {
          SendEmailToBanksCommand.create(
            request.bankIds,
            request.subject,
            request.message,
            request.attachments.map((attachment) => ({
              entityType: attachment.entityType,
              entityId: attachment.entityId,
              documentId: attachment.documentId,
            })),
          ).getOrThrow();
        }).toThrow();
      });

      it('should fail with empty attachments', () => {
        // Arrange
        const request: SendEmailToBanksRequest = {
          bankIds: [mockBankId1],
          subject: 'Test Subject',
          message: 'Test Message',
          attachments: [],
        };

        // Act & Assert
        expect(() => {
          SendEmailToBanksCommand.create(
            request.bankIds,
            request.subject,
            request.message,
            request.attachments.map((attachment) => ({
              entityType: attachment.entityType,
              entityId: attachment.entityId,
              documentId: attachment.documentId,
            })),
          ).getOrThrow();
        }).toThrow();
      });

      it('should fail with too many attachments', () => {
        // Arrange
        const tooManyAttachments = Array.from({ length: 11 }, () => ({
          entityType: ENTITY_MEDIA_TYPE.CONTACT,
          entityId: new Types.ObjectId().toString(),
          documentId: new Types.ObjectId().toString(),
        }));

        const request: SendEmailToBanksRequest = {
          bankIds: [mockBankId1],
          subject: 'Test Subject',
          message: 'Test Message',
          attachments: tooManyAttachments,
        };

        // Act & Assert
        expect(() => {
          SendEmailToBanksCommand.create(
            request.bankIds,
            request.subject,
            request.message,
            request.attachments.map((attachment) => ({
              entityType: attachment.entityType,
              entityId: attachment.entityId,
              documentId: attachment.documentId,
            })),
          ).getOrThrow();
        }).toThrow();
      });

      it('should fail with invalid bank ID', () => {
        // Arrange
        const request: SendEmailToBanksRequest = {
          bankIds: ['invalid-bank-id'],
          subject: 'Test Subject',
          message: 'Test Message',
          attachments: [
            {
              entityType: ENTITY_MEDIA_TYPE.CONTACT,
              entityId: mockContactId,
              documentId: mockDocumentId1,
            },
          ],
        };

        // Act & Assert
        expect(() => {
          SendEmailToBanksCommand.create(
            request.bankIds,
            request.subject,
            request.message,
            request.attachments.map((attachment) => ({
              entityType: attachment.entityType,
              entityId: attachment.entityId,
              documentId: attachment.documentId,
            })),
          ).getOrThrow();
        }).toThrow();
      });

      it('should fail with invalid entity ID in attachment', () => {
        // Arrange
        const request: SendEmailToBanksRequest = {
          bankIds: [mockBankId1],
          subject: 'Test Subject',
          message: 'Test Message',
          attachments: [
            {
              entityType: ENTITY_MEDIA_TYPE.CONTACT,
              entityId: 'invalid-entity-id',
              documentId: mockDocumentId1,
            },
          ],
        };

        // Act & Assert
        expect(() => {
          SendEmailToBanksCommand.create(
            request.bankIds,
            request.subject,
            request.message,
            request.attachments.map((attachment) => ({
              entityType: attachment.entityType,
              entityId: attachment.entityId,
              documentId: attachment.documentId,
            })),
          ).getOrThrow();
        }).toThrow();
      });

      it('should fail with invalid document ID in attachment', () => {
        // Arrange
        const request: SendEmailToBanksRequest = {
          bankIds: [mockBankId1],
          subject: 'Test Subject',
          message: 'Test Message',
          attachments: [
            {
              entityType: ENTITY_MEDIA_TYPE.CONTACT,
              entityId: mockContactId,
              documentId: 'invalid-document-id',
            },
          ],
        };

        // Act & Assert
        expect(() => {
          SendEmailToBanksCommand.create(
            request.bankIds,
            request.subject,
            request.message,
            request.attachments.map((attachment) => ({
              entityType: attachment.entityType,
              entityId: attachment.entityId,
              documentId: attachment.documentId,
            })),
          ).getOrThrow();
        }).toThrow();
      });
    });
  });
});
