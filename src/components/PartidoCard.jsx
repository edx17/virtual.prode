import React from 'react';
import { Card, Box, Typography, Button, Stack, Avatar } from '@mui/material';

export default function PartidoCard({ partido, pick, onSetPick, cerrado, CLUBES }) {
  const local = CLUBES.find(c => c.nombre === partido.local);
  const visita = CLUBES.find(c => c.nombre === partido.visitante);

  return (
    <Card variant="outlined" sx={{ mb: 2, bgcolor: '#0a0a0a', borderColor: '#222' }}>
      <Box sx={{ textAlign: 'center', py: 1, bgcolor: '#111', borderBottom: '1px solid #222' }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: 1.5 }}>
          FUTSAL PRIMERA C
        </Typography>
      </Box>
      
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Avatar src={local?.escudo} sx={{ width: 64, height: 64, mx: 'auto', mb: 1, bgcolor: '#000' }}>
              {partido.local[0]}
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{partido.local}</Typography>
          </Box>

          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 900, fontStyle: 'italic' }}>
            VS
          </Typography>

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Avatar src={visita?.escudo} sx={{ width: 64, height: 64, mx: 'auto', mb: 1, bgcolor: '#000' }}>
              {partido.visitante[0]}
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{partido.visitante}</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
          {['L', 'E', 'V'].map((op) => (
            <Button
              key={op}
              fullWidth
              variant={pick === op ? 'contained' : 'outlined'}
              disabled={cerrado}
              onClick={() => onSetPick(partido.id, op)}
              sx={{ 
                height: 50, 
                fontWeight: 900, 
                fontSize: '1.1rem',
                borderWidth: 2,
                '&:hover': { borderWidth: 2 }
              }}
            >
              {op}
            </Button>
          ))}
        </Stack>
      </Box>
    </Card>
  );
}