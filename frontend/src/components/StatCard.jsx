import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

function StatCard({ title, value, icon, color = 'primary.main' }) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, {
              sx: { color: color, fontSize: 24 },
            })}
          </Box>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default StatCard; 