import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Container, Box } from '@mui/material';

const HomePage = () => {
  console.log(import.meta.env.DEV)
  const gcloud_url = "https://form-filling-z5upmrywta-uc.a.run.app";

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2,
      }}
    >
      <Typography
        variant="h1"
        align="center"
        sx={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: 2,
        }}
      >
        PCC CLEAR Clinic form filling
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Button
          component={Link}
          to={`${gcloud_url}/#/gender`}
          variant="contained"
          color="primary"
          size="large"
        >
          Name and Gender Change
        </Button>
        <Button
          component={Link}
          to={`${gcloud_url}/#/eviction`}
          variant="contained"
          color="primary"
          size="large"
        >
          Eviction Expungement
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;