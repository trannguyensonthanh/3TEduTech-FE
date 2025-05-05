import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  X,
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  CheckCircle,
} from 'lucide-react';
import { Notification, useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const { markAsRead, removeNotification } = useNotifications();

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getIcon = () => {
    switch (notification.variant) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'destructive':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const content = (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-start p-3 gap-3 border-b last:border-b-0 cursor-pointer hover:bg-accent/50 transition-colors',
        !notification.read && 'bg-accent/20'
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4
            className={cn(
              'text-sm font-medium',
              !notification.read && 'font-semibold'
            )}
          >
            {notification.title}
          </h4>
          <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {notification.message}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 flex-shrink-0 opacity-70 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          removeNotification(notification.id);
        }}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Remove</span>
      </Button>
    </div>
  );

  if (notification.link) {
    return (
      <Link to={notification.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default NotificationItem;
