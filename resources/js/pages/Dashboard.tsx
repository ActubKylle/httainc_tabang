import { useState, useEffect } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    pusher: Pusher;
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [lastEvent, setLastEvent] = useState<any>(null);

  useEffect(() => {
    const pusher = new Pusher('e78fcdf46d18b95765d8', {
      cluster: 'ap1',
      forceTLS: true,
      encrypted: true,
    });

    const channel = pusher.subscribe('my-channel');
    
    channel.bind('my-event', (data: any) => {
      console.log('Pusher event received:', data);
      
      // Update state to trigger UI re-render
      setLastEvent(data);
      setNotifications(prev => [...prev, data]);
    });

    window.pusher = pusher;

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        {/* Notification Area */}
        {lastEvent && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
            <p className="font-bold">New Event Received</p>
            <p>{JSON.stringify(lastEvent)}</p>
          </div>
        )}

        {/* Your existing UI */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
          
          {/* Other grid items */}
          {/* ... */}
        </div>
        
        {/* Event History */}
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
          
          <div className="absolute inset-0 p-4 overflow-y-auto">
            <h3 className="text-lg font-bold mb-2">Event History</h3>
            <ul className="space-y-2">
              {notifications.map((event, index) => (
                <li key={index} className="bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                  <pre className="text-xs">{JSON.stringify(event, null, 2)}</pre>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}