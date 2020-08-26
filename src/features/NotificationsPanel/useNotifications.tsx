import { useContext, useEffect, useState } from 'react';
import moment from 'moment';

import { DataContext } from '@services/Store';
import { ANALYTICS_CATEGORIES } from '@services';
import { ExtendedNotification, LSKeys } from '@types';
import { generateUUID, notUndefined, useAnalytics } from '@utils';
import { NotificationTemplates, notificationsConfigs } from './constants';

function getCurrent(notifications: ExtendedNotification[]) {
  const visible = notifications
    .sort((a, b) => {
      return new Date(a.dateDisplayed).getTime() - new Date(b.dateDisplayed).getTime();
    })
    .filter((x) => {
      return (
        !x.dismissed &&
        (notificationsConfigs[x.template].condition
          ? notificationsConfigs[x.template].condition!(x)
          : true)
      );
    });
  return visible[visible.length - 1];
}

function isValidNotification(n: ExtendedNotification) {
  const config = notificationsConfigs[n.template];

  // Check conditions for repeating and non-repeating notifications, show notification if needed
  const shouldShowRepeatingNotification =
    config.repeatInterval &&
    n.dismissed &&
    config.repeatInterval <=
      moment.duration(moment(new Date()).diff(moment(n.dateDismissed))).asSeconds();
  const isNonrepeatingNotification = !config.repeatInterval && !n.dismissed;
  const isConfigCondition = config.condition && config.condition(n);

  return isConfigCondition && (shouldShowRepeatingNotification || isNonrepeatingNotification);
}

const useNotifications = () => {
  const { notifications, createActions } = useContext(DataContext);
  const Notification = createActions(LSKeys.NOTIFICATIONS);
  const [currentNotification, setCurrentNotification] = useState<ExtendedNotification>();
  const trackNotificationDisplayed = useAnalytics({
    category: ANALYTICS_CATEGORIES.NOTIFICATION
  });

  useEffect(() => {
    // hide notifications that should be shown only once
    hideShowOneTimeNotifications();
    // update notifications that should be displayed again
    notifications.filter(isValidNotification).forEach((n) =>
      Notification.update(n.uuid, {
        ...n,
        dismissed: false,
        dateDisplayed: new Date()
      })
    );
  }, []);

  useEffect(() => {
    const current = getCurrent(notifications);
    setCurrentNotification(current);
    if (current) {
      trackNotificationDisplayed({
        actionName: `${
          notificationsConfigs[current.template].analyticsEvent
        } notification displayed`
      });
    }
  }, [notifications]);

  const hideShowOneTimeNotifications = () => {
    notifications.forEach((n) => {
      const config = notificationsConfigs[n.template];
      if (config.showOneTime && !n.dismissed) {
        dismissNotification(n);
      }
    });
  };

  const displayNotification = (templateName: string, templateData?: object) => {
    // Dismiss previous notifications that need to be dismissed
    if (!notificationsConfigs[templateName].preventDismisExisting) {
      notifications
        .filter((x) => notificationsConfigs[x.template].dismissOnOverwrite && !x.dismissed)
        .forEach(dismissNotification);
    }

    // Create the notification object
    const notification: ExtendedNotification = {
      uuid: generateUUID(),
      template: templateName,
      templateData,
      dateDisplayed: new Date(),
      dismissed: false,
      dateDismissed: undefined
    };

    // If notification with this template already exists update it,
    // otherwise create a new one
    const existingNotification = notifications.find((x) => x.template === notification.template);

    if (existingNotification) {
      /* Prevent displaying notifications that have been dismissed forever and repeating notifications
         before their waiting period is over.*/
      if (
        notificationsConfigs[templateName].repeatInterval ||
        notificationsConfigs[templateName].dismissForever
      ) {
        notification.dismissed = existingNotification.dismissed;
        notification.dateDismissed = existingNotification.dateDismissed;
      }

      Notification.update(existingNotification.uuid, notification);
    } else {
      Notification.createWithID(notification, notification.uuid);
    }
  };

  const dismissNotification = (notif?: ExtendedNotification) => {
    if (notUndefined(notif)) {
      Notification.update(notif.uuid, {
        ...notif,
        dismissed: true,
        dateDismissed: new Date()
      });
    }
  };

  const dismissCurrentNotification = () => dismissNotification(currentNotification);

  return {
    notifications,
    currentNotification,
    displayNotification,
    dismissCurrentNotification,
    templates: NotificationTemplates
  };
};

export default useNotifications;
