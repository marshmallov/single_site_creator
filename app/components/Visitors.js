'use client';

import { useEffect } from 'react';
import { getClientVisitorData, getGeolocation} from '@/app/services/visitorsClient'

export default function Visitors() {
  useEffect(() => {
    const clientData = getClientVisitorData();

    getGeolocation((geo) => {
      const payload = {
        ...clientData,
        location: geo,
      };

      fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    });
  }, []);

  return null;
}
