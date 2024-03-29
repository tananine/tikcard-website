import React from 'react';
import { Typography, Box, Skeleton } from '@mui/material';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '150px',
};

const MapComponent = ({ latitude, longitude }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      }}
      zoom={15}
      options={{
        fullscreenControl: false,
        draggable: false,
      }}
    />
  ) : (
    <Skeleton animation="wave" variant="rounded" width="100%" height="150px" />
  );
};

const MapLayout = ({ title, name, note, latitude, longitude, onClick }) => {
  return (
    <Box
      bgcolor="#f1f1f1"
      borderRadius={4}
      padding={{ xs: 1, md: 1.5, lg: 2 }}
      sx={{ cursor: 'pointer' }}
    >
      <Typography variant="h4" marginBottom={1} sx={{ lineBreak: 'anywhere' }}>
        {name || title}
      </Typography>
      <Typography
        variant="caption"
        marginBottom={1}
        sx={{ lineBreak: 'anywhere' }}
      >
        {note}
      </Typography>
      {latitude && longitude ? (
        <MapComponent latitude={latitude} longitude={longitude} />
      ) : (
        <Skeleton
          animation={false}
          variant="rounded"
          width="100%"
          height="150px"
        />
      )}
    </Box>
  );
};

export default MapLayout;
