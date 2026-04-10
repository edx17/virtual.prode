import React from 'react';
import { Box, Paper, Typography, Avatar, Stack } from '@mui/material';

export default function Tabla({ jugadores = [], partidos = [], predicciones = {} }) {
  
  const calcularTabla = () => {
    const tabla = jugadores.map(jugador => {
      let puntos = 0;
      const picks = predicciones[jugador] || {};
      
      partidos.forEach(p => {
        if (p.resultadooficial && picks[p.id] === p.resultadooficial) {
          puntos += 3;
        }
      });
      return { nombre: jugador, puntos };
    });
    return tabla.sort((a, b) => b.puntos - a.puntos);
  };

  const posiciones = calcularTabla();

  const getMedalColor = (index) => {
    if (index === 0) return 'linear-gradient(135deg, #fbbf24, #d97706)'; // Oro
    if (index === 1) return 'linear-gradient(135deg, #d4d4d8, #71717a)'; // Plata
    if (index === 2) return 'linear-gradient(135deg, #b45309, #78350f)'; // Bronce
    return '#111'; // Resto
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {posiciones.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ py: 6, fontWeight: 700 }}>
          No hay datos de jugadores registrados.
        </Typography>
      ) : (
        posiciones.map((fila, i) => (
          <Paper 
            key={fila.nombre} 
            elevation={2}
            sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              borderRadius: 4,
              bgcolor: 'background.paper',
              border: '1px solid #222'
            }}
          >
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                background: getMedalColor(i),
                fontWeight: 900,
                color: i < 3 ? '#fff' : 'text.secondary',
                border: i >= 3 ? '1px solid #333' : 'none'
              }}
            >
              {i + 1}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{fila.nombre}</Typography>
            </Box>

            <Stack alignItems="flex-end">
              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 900, lineHeight: 1 }}>
                {fila.puntos}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                PTS
              </Typography>
            </Stack>
          </Paper>
        ))
      )}
    </Box>
  );
}