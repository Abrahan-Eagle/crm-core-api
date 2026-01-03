import { NotFound } from '@internal/common';
import { Types } from 'mongoose';

import {
  Application,
  APPLICATION_STATUS,
  BankNotification,
  NOTIFICATION_STATUS,
  Offer,
  OFFER_PAYMENT_PLAN,
  OFFER_STATUS,
  REJECT_REASONS,
} from '@/domain/application';
import { ApplicationPositionNotDefined, DomainErrorCode, Id, PRODUCT_TYPE } from '@/domain/common';

// Helper function to create a basic application
const createApplication = (
  status: APPLICATION_STATUS,
  notifications: BankNotification[] = [],
  position: number | null = 3,
): Application => {
  return new Application(
    Id.empty(),
    status,
    null,
    Id.empty(),
    'abc123456789',
    '2024-01',
    50000,
    PRODUCT_TYPE.FACTORING,
    null,
    [],
    [],
    [],
    [],
    [],
    notifications,
    null,
    null,
    null,
    null,
    new Date(),
    new Date(),
    position,
  );
};

// Helper function to create a notification with offers
const createNotificationWithOffers = (
  notificationId: Id,
  bankId: Id,
  status: NOTIFICATION_STATUS,
  offers: Offer[] = [],
): BankNotification => {
  return new BankNotification(
    notificationId,
    bankId,
    status,
    null,
    null,
    offers,
    new Date(),
    new Date(),
  );
};

// Helper function to create an offer
const createOffer = (offerId: Id, status: OFFER_STATUS): Offer => {
  return new Offer(
    offerId,
    50000,
    0.15,
    1,
    100,
    OFFER_PAYMENT_PLAN.MONTHLY,
    12,
    status,
    new Date(),
    new Date(),
  );
};

// Helper function to create an Id from string
const createId = (idString?: string): Id => {
  return Id.create(
    idString || new Types.ObjectId().toString(),
    () => DomainErrorCode.APPLICATION_ID_EMPTY,
    () => DomainErrorCode.APPLICATION_ID_INVALID,
  ).getOrThrow();
};

describe('Application Entity', () => {
  describe('addNotification', () => {
    it('should fail with ApplicationPositionNotDefined when position is null', () => {
      // Arrange
      const application = createApplication(APPLICATION_STATUS.READY_TO_SEND, [], null);
      const notification = new BankNotification(
        Id.empty(),
        Id.empty(),
        NOTIFICATION_STATUS.PENDING,
        null,
        null,
        [],
        new Date(),
        new Date(),
      );
      // Act
      const result = application.addNotification(notification);
      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.error).toBeInstanceOf(ApplicationPositionNotDefined);
    });
  });

  describe('addOffer', () => {
    it('should fail with NotFound when notification does not exist', () => {
      // Arrange
      const application = createApplication(APPLICATION_STATUS.READY_TO_SEND);
      const notificationId = Id.empty();
      const offer = createOffer(Id.empty(), OFFER_STATUS.ON_HOLD);
      // Act
      const result = application.addOffer(notificationId, offer);
      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.error).toBeInstanceOf(NotFound);
    });
  });

  describe('cancelOffer', () => {
    it('should change status to REPLIED when canceling the only pending offer and there are REPLIED notifications', () => {
      // Arrange
      const notificationId1 = createId();
      const notificationId2 = createId();
      const offerId = createId();
      const offer = createOffer(offerId, OFFER_STATUS.ACCEPTED);
      // Notification con oferta que será cancelada
      const notification1 = createNotificationWithOffers(
        notificationId1,
        Id.empty(),
        NOTIFICATION_STATUS.OFFERED,
        [offer],
      );
      // Notification con estado REPLIED (sin ofertas)
      const notification2 = createNotificationWithOffers(
        notificationId2,
        Id.empty(),
        NOTIFICATION_STATUS.REPLIED,
        [],
      );
      const application = createApplication(APPLICATION_STATUS.OFFERED, [notification1, notification2]);

      // Act
      const result = application.cancelOffer(notificationId1, offerId);

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(application.status).toBe(APPLICATION_STATUS.REPLIED);
    });

    it('should change status to SENT when canceling the only pending offer and no REPLIED/SENT notifications', () => {
      // Arrange
      const notificationId = createId();
      const offerId = createId();
      const offer = createOffer(offerId, OFFER_STATUS.ACCEPTED);
      const notification = createNotificationWithOffers(
        notificationId,
        Id.empty(),
        NOTIFICATION_STATUS.REJECTED,
        [offer],
      );
      const application = createApplication(APPLICATION_STATUS.OFFERED, [notification]);

      // Act
      const result = application.cancelOffer(notificationId, offerId);

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(application.status).toBe(APPLICATION_STATUS.SENT);
    });

    it('should maintain status OFFERED when canceling an offer but there are other pending offers', () => {
      // Arrange
      const notificationId1 = createId();
      const notificationId2 = createId();
      const offerId1 = createId();
      const offerId2 = createId();
      const offer1 = createOffer(offerId1, OFFER_STATUS.ACCEPTED);
      const offer2 = createOffer(offerId2, OFFER_STATUS.ACCEPTED);
      const notification1 = createNotificationWithOffers(
        notificationId1,
        Id.empty(),
        NOTIFICATION_STATUS.OFFERED,
        [offer1],
      );
      const notification2 = createNotificationWithOffers(
        notificationId2,
        Id.empty(),
        NOTIFICATION_STATUS.OFFERED,
        [offer2],
      );
      const application = createApplication(APPLICATION_STATUS.OFFERED, [notification1, notification2]);

      // Act
      const result = application.cancelOffer(notificationId1, offerId1);

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(application.status).toBe(APPLICATION_STATUS.OFFERED);
    });

    it('should maintain status OFFER_ACCEPTED when there is an accepted notification', () => {
      // Arrange
      const notificationId1 = createId();
      const notificationId2 = createId();
      const offerId1 = createId();
      const offerId2 = createId();
      const offer1 = createOffer(offerId1, OFFER_STATUS.ACCEPTED);
      const offer2 = createOffer(offerId2, OFFER_STATUS.ACCEPTED);
      const notification1 = createNotificationWithOffers(
        notificationId1,
        Id.empty(),
        NOTIFICATION_STATUS.ACCEPTED,
        [offer1],
      );
      const notification2 = createNotificationWithOffers(
        notificationId2,
        Id.empty(),
        NOTIFICATION_STATUS.OFFERED,
        [offer2],
      );
      const application = createApplication(APPLICATION_STATUS.OFFER_ACCEPTED, [notification1, notification2]);

      // Act
      const result = application.cancelOffer(notificationId2, offerId2);

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(application.status).toBe(APPLICATION_STATUS.OFFER_ACCEPTED);
    });
  });

  describe('rejectNotification', () => {
    it('should change status to REPLIED when rejecting notification with no pending offers', () => {
      // Arrange
      const notificationId = createId();
      const notification = createNotificationWithOffers(
        notificationId,
        Id.empty(),
        NOTIFICATION_STATUS.OFFERED,
        [],
      );
      const application = createApplication(APPLICATION_STATUS.OFFERED, [notification]);

      // Act
      const result = application.rejectNotification(notificationId, REJECT_REASONS.OTHER, 'Test reason');

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(application.status).toBe(APPLICATION_STATUS.REPLIED);
    });

    it('should change status to REPLIED when rejecting notification from SENT status with no pending offers', () => {
      // Arrange
      const notificationId = createId();
      const notification = createNotificationWithOffers(
        notificationId,
        Id.empty(),
        NOTIFICATION_STATUS.SENT,
        [],
      );
      const application = createApplication(APPLICATION_STATUS.SENT, [notification]);

      // Act
      const result = application.rejectNotification(notificationId, REJECT_REASONS.OTHER, 'Test reason');

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(application.status).toBe(APPLICATION_STATUS.REPLIED);
    });

    it('should maintain status OFFERED when rejecting notification but there are other pending offers', () => {
      // Arrange
      const notificationId1 = createId();
      const notificationId2 = createId();
      const offerId = createId();
      const offer = createOffer(offerId, OFFER_STATUS.ACCEPTED);
      const notification1 = createNotificationWithOffers(
        notificationId1,
        Id.empty(),
        NOTIFICATION_STATUS.OFFERED,
        [],
      );
      const notification2 = createNotificationWithOffers(
        notificationId2,
        Id.empty(),
        NOTIFICATION_STATUS.OFFERED,
        [offer],
      );
      const application = createApplication(APPLICATION_STATUS.OFFERED, [notification1, notification2]);

      // Act
      const result = application.rejectNotification(notificationId1, REJECT_REASONS.OTHER, 'Test reason');

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(application.status).toBe(APPLICATION_STATUS.OFFERED);
    });

    it('should maintain status OFFER_ACCEPTED when there is an accepted notification', () => {
      // Arrange
      const notificationId1 = createId();
      const notificationId2 = createId();
      const offerId = createId();
      const offer = createOffer(offerId, OFFER_STATUS.ACCEPTED);
      const notification1 = createNotificationWithOffers(
        notificationId1,
        Id.empty(),
        NOTIFICATION_STATUS.OFFERED,
        [],
      );
      const notification2 = createNotificationWithOffers(
        notificationId2,
        Id.empty(),
        NOTIFICATION_STATUS.ACCEPTED,
        [offer],
      );
      const application = createApplication(APPLICATION_STATUS.OFFER_ACCEPTED, [notification1, notification2]);

      // Act
      const result = application.rejectNotification(notificationId1, REJECT_REASONS.OTHER, 'Test reason');

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(application.status).toBe(APPLICATION_STATUS.OFFER_ACCEPTED);
    });
  });
});
