import { Types } from 'mongoose';

import { FileDuplicated } from '@/domain/common';
import { AddCompanyDocumentCommand, SUPPORTED_COMPANY_FILES } from '@/domain/company';

describe('AddCompanyDocumentResource (Integration Test)', () => {
  const mockCompanyId = new Types.ObjectId().toString();
  const mockFileBuffer = Buffer.from('mock file content');
  const mockFile = {
    originalname: 'test-document.pdf',
    buffer: mockFileBuffer,
    mimetype: 'application/pdf',
    size: 1024,
  } as Express.Multer.File;

  describe('AddCompanyDocumentCommand Creation', () => {
    it('should create command with valid parameters', () => {
      // Arrange
      const documentType = SUPPORTED_COMPANY_FILES.EIN;

      // Act
      const result = AddCompanyDocumentCommand.create(mockCompanyId, mockFile, documentType);

      // Assert
      const command = result.getOrThrow();
      expect(command.id.toString()).toBe(mockCompanyId);
      expect(command.type).toBe(documentType);
      expect(command.file.name).toContain('testdocument.pdf');
      expect(command.file.file).toBe(mockFileBuffer);
      expect(command.file.extension).toBe('.pdf');
      expect(command.file.mimeType).toBe('application/pdf');
    });

    it('should handle all supported document types', () => {
      // Act & Assert - Test each supported type
      for (const documentType of Object.values(SUPPORTED_COMPANY_FILES)) {
        const result = AddCompanyDocumentCommand.create(mockCompanyId, mockFile, documentType);

        const command = result.getOrThrow();
        expect(command.type).toBe(documentType);
      }
    });

    it('should fail with invalid company ID', () => {
      // Arrange
      const invalidCompanyId = 'invalid-id';
      const documentType = SUPPORTED_COMPANY_FILES.W9;

      // Act & Assert
      expect(() => {
        AddCompanyDocumentCommand.create(invalidCompanyId, mockFile, documentType).getOrThrow();
      }).toThrow();
    });

    it('should fail with empty company ID', () => {
      // Arrange
      const emptyCompanyId = '';
      const documentType = SUPPORTED_COMPANY_FILES.TAXES;

      // Act
      const result = AddCompanyDocumentCommand.create(emptyCompanyId, mockFile, documentType);

      // Assert
      expect(() => {
        result.getOrThrow();
      }).toThrow();
    });

    it('should fail with invalid document type', () => {
      // Arrange
      const invalidDocumentType = 'INVALID_TYPE';

      // Act
      const result = AddCompanyDocumentCommand.create(mockCompanyId, mockFile, invalidDocumentType);

      // Assert
      expect(() => {
        result.getOrThrow();
      }).toThrow();
    });

    it('should fail with empty document type', () => {
      // Arrange
      const emptyDocumentType = '';

      // Act
      const result = AddCompanyDocumentCommand.create(mockCompanyId, mockFile, emptyDocumentType);

      // Assert
      expect(() => {
        result.getOrThrow();
      }).toThrow();
    });

    it('should fail when no file is provided', () => {
      // Arrange
      const documentType = SUPPORTED_COMPANY_FILES.OTHER;

      // Act
      const result = AddCompanyDocumentCommand.create(mockCompanyId, null, documentType);

      // Assert
      expect(() => {
        result.getOrThrow();
      }).toThrow();
    });

    it('should handle PDF files correctly', () => {
      // Arrange
      const documentType = SUPPORTED_COMPANY_FILES.OPEN_COMPANY_LETTER;
      const pdfFile = {
        originalname: 'company-letter.pdf',
        buffer: Buffer.from('PDF content'),
        mimetype: 'application/pdf',
        size: 2048,
      } as Express.Multer.File;

      // Act
      const result = AddCompanyDocumentCommand.create(mockCompanyId, pdfFile, documentType);

      // Assert
      const command = result.getOrThrow();
      expect(command.file.extension).toBe('.pdf');
      expect(command.file.mimeType).toBe('application/pdf');
    });

    it('should handle image files correctly', () => {
      // Arrange
      const documentType = SUPPORTED_COMPANY_FILES.EIN;
      const imageFile = {
        originalname: 'ein-document.jpg',
        buffer: Buffer.from('JPEG content'),
        mimetype: 'image/jpeg',
        size: 1536,
      } as Express.Multer.File;

      // Act
      const result = AddCompanyDocumentCommand.create(mockCompanyId, imageFile, documentType);

      // Assert
      const command = result.getOrThrow();
      expect(command.file.extension).toBe('.jpg');
      expect(command.file.mimeType).toBe('image/jpeg');
    });

    it('should normalize file names correctly', () => {
      // Arrange
      const documentType = SUPPORTED_COMPANY_FILES.W9;
      const fileWithSpecialChars = {
        originalname: 'W9 Form (2024) - Company Name.pdf',
        buffer: Buffer.from('PDF content'),
        mimetype: 'application/pdf',
        size: 1024,
      } as Express.Multer.File;

      // Act
      const result = AddCompanyDocumentCommand.create(mockCompanyId, fileWithSpecialChars, documentType);

      // Assert
      const command = result.getOrThrow();
      // File name should be normalized (spaces and special chars handled)
      expect(command.file.name).toContain(mockCompanyId);
      expect(command.file.name).toContain('.pdf');
      // Should not contain the original filename exactly due to normalization
      expect(command.file.name).not.toBe(fileWithSpecialChars.originalname);
    });

    it('should handle case insensitive document types', () => {
      // Arrange
      const documentType = 'ein'; // lowercase
      const expectedType = SUPPORTED_COMPANY_FILES.EIN;

      // Act
      const result = AddCompanyDocumentCommand.create(mockCompanyId, mockFile, documentType);

      // Assert
      const command = result.getOrThrow();
      expect(command.type).toBe(expectedType);
    });

    it('should handle document type with whitespace', () => {
      // Arrange
      const documentType = '  EIN  '; // with whitespace
      const expectedType = SUPPORTED_COMPANY_FILES.EIN;

      // Act
      const result = AddCompanyDocumentCommand.create(mockCompanyId, mockFile, documentType);

      // Assert
      const command = result.getOrThrow();
      expect(command.type).toBe(expectedType);
    });
  });

  describe('FileDuplicated Error', () => {
    it('should create FileDuplicated error correctly', () => {
      // Act
      const error = new FileDuplicated();

      // Assert
      expect(error).toBeInstanceOf(FileDuplicated);
      expect(error.name).toBe('FileDuplicated');
    });
  });

  describe('SUPPORTED_COMPANY_FILES Enum', () => {
    it('should contain all required document types', () => {
      // Assert
      expect(SUPPORTED_COMPANY_FILES.EIN).toBe('EIN');
      expect(SUPPORTED_COMPANY_FILES.W9).toBe('W9');
      expect(SUPPORTED_COMPANY_FILES.VOIDED_CHECK).toBe('VOIDED_CHECK');
      expect(SUPPORTED_COMPANY_FILES.OPEN_COMPANY_LETTER).toBe('OPEN_COMPANY_LETTER');
      expect(SUPPORTED_COMPANY_FILES.TAXES).toBe('TAXES');
      expect(SUPPORTED_COMPANY_FILES.OTHER).toBe('OTHER');
    });

    it('should have exactly 6 document types', () => {
      // Assert
      const values = Object.values(SUPPORTED_COMPANY_FILES);
      expect(values).toHaveLength(6);
    });
  });
});
