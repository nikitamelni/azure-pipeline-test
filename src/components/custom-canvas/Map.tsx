import { FC } from 'react';
import GoogleMapReact from 'google-map-react';
import { ComponentProps } from '@uniformdev/canvas-react';

export type MapParameters = {
  displayName?: string;
};

type MapProps = ComponentProps<MapParameters>;

const defaultProps = {
  center: {
    lat: 10.99835602,
    lng: 77.01502627,
  },
  zoom: 11,
};

const mapOptions = (maps: typeof google.maps) => ({
  mapTypeId: maps.MapTypeId.ROADMAP,
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  // zoomControl: true, // enable if you want
  styles: [
    // overall desaturation
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ saturation: -10 }],
    },
    // land
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#e4f2e1' }, { lightness: 0 }],
    },
    // parks / natural
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#cde9c3' }],
    },
    // highways (yellow / orange)
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#f6c36b' }],
    },
    // other roads
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#f8e4bc' }],
    },
    // road outlines
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#d6b27e' }, { weight: 0.3 }],
    },
    // road labels
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#5e5e5e' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#ffffff' }, { weight: 2 }],
    },
    // water
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#a2d1f5' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#4c7aa3' }],
    },
    // admin / city labels
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#555555' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
  ],
});

const Map: FC<MapProps & MapParameters> = () => (
  <GoogleMapReact
    bootstrapURLKeys={{ key: '' }}
    defaultCenter={defaultProps.center}
    defaultZoom={defaultProps.zoom}
    options={mapOptions}
  ></GoogleMapReact>
);

export default Map;
