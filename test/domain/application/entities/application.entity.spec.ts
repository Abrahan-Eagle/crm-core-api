import { NotFound } from '@internal/common';

import {
  Application,
  APPLICATION_STATUS,
  BankNotification,
  NOTIFICATION_STATUS,
  Offer,
  OFFER_PAYMENT_PLAN,
  OFFER_STATUS,
} from '@/domain/application';
import { ApplicationPositionNotDefined, Id, PRODUCT_TYPE } from '@/domain/common';

describe('Application Entity', () => {
  describe('addNotification', () => {
    it('should fail with ApplicationPositionNotDefined when position is null', () => {
      // Arrange
      const application = new Application(
        Id.empty(),
        APPLICATION_STATUS.READY_TO_SEND,
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
        [],
        null,
        null,
        null,
        null,
        new Date(),
        new Date(),
        null, // position is null
      );
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
      const application = new Application(
        Id.empty(),
        APPLICATION_STATUS.READY_TO_SEND,
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
        [],
        null,
        null,
        null,
        null,
        new Date(),
        new Date(),
        3, // position is set
      );
      const notificationId = Id.empty();
      const offer = new Offer(
        Id.empty(),
        50000,
        0.15,
        1,
        100,
        OFFER_PAYMENT_PLAN.MONTHLY,
        12,
        OFFER_STATUS.ON_HOLD,
        new Date(),
        new Date(),
      );
      // Act
      const result = application.addOffer(notificationId, offer);
      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.error).toBeInstanceOf(NotFound);
    });
  });
});
