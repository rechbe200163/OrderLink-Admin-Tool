'use client';

import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  Polyline,
  Marker,
} from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const center = { lat: 51.505, lng: -0.09 };

type CustomerAddress = {
  lat: number;
  lng: number;
  customerId: string;
  name: string;
};

type RouteMapProps = {
  routeName: string;
  addresses: CustomerAddress[];
};

export default function RouteMap({ routeName, addresses }: RouteMapProps) {
  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);

  useEffect(() => {
    if (addresses.length) {
      setPath(
        addresses.map((address) => ({ lat: address.lat, lng: address.lng }))
      );
    }
  }, [addresses]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <h2 className='text-xl font-bold mb-4'>{routeName}</h2>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={path[0] || center}
      >
        {addresses.map((address) => (
          <Marker
            key={address.customerId}
            position={{ lat: address.lat, lng: address.lng }}
            label={address.name}
          />
        ))}
        {path.length > 1 && (
          <Polyline
            path={path}
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 3,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
