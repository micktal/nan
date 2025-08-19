import { useState } from 'react';
import { X, Bell, CheckCircle, AlertCircle, AlertTriangle, Info, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNotifications, type Notification } from '@/hooks/use-notifications';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  progress: Loader
};

const colorMap = {
  success: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  error: 'text-red-500 bg-red-500/10 border-red-500/20',
  warning: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  info: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  progress: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
};

function NotificationItem({ notification }: { notification: Notification }) {
  const { removeNotification, markAsRead } = useNotifications();
  const Icon = iconMap[notification.type];

  const handleClose = () => {
    removeNotification(notification.id);
  };

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.action) {
      notification.action.onClick();
    }
  };

  return (
    <Card
      className={`border glass-effect hover-lift smooth-transition cursor-pointer ${colorMap[notification.type]} ${
        !notification.read ? 'ring-1 ring-current' : ''
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Icon className={`w-5 h-5 mt-0.5 ${notification.type === 'progress' ? 'animate-spin' : ''}`} />
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-semibold text-white">{notification.title}</h4>
              <p className="text-xs text-slate-300">{notification.message}</p>
              
              {notification.type === 'progress' && typeof notification.progress === 'number' && (
                <div className="space-y-1">
                  <Progress value={notification.progress} className="h-2" />
                  <span className="text-xs text-slate-400">{notification.progress}%</span>
                </div>
              )}
              
              {notification.action && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs border-current text-current hover:bg-current hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    notification.action!.onClick();
                  }}
                >
                  {notification.action.label}
                </Button>
              )}
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-slate-500">
          {new Date(notification.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, getUnreadCount, clearAll } = useNotifications();

  const unreadCount = getUnreadCount();
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="sm"
        className="relative bg-white/10 border-white/20 text-white hover:bg-white/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 z-50">
          <Card className="glass-effect border-slate-600/50 shadow-2xl">
            <CardContent className="p-0">
              {/* Header */}
              <div className="p-4 border-b border-slate-600/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <span className="text-xs text-slate-400">{unreadCount} non lues</span>
                    )}
                    {notifications.length > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-slate-400 hover:text-white"
                        onClick={clearAll}
                      >
                        Tout effacer
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {recentNotifications.length > 0 ? (
                  <div className="p-2 space-y-2">
                    {recentNotifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune notification</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 5 && (
                <div className="p-3 border-t border-slate-600/50 text-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-slate-400 hover:text-white"
                    onClick={() => {
                      // Could open full notification history
                      setIsOpen(false);
                    }}
                  >
                    Voir toutes les notifications ({notifications.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
