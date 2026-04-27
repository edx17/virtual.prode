import React, { useState } from 'react';
import { Box, Paper, Typography, Avatar, Stack, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, MenuItem, Select, FormControl, Divider } from '@mui/material';

export default function Tabla({ jugadores = [], partidos = [], predicciones = {}, CLUBES = [] }) {
  const [jornadaFiltro, setJornadaFiltro] = useState('Todas');
  const [tablaFiltro, setTablaFiltro] = useState('Total');

  const calcularTabla = () => {
    const tabla = jugadores.map(jugador => {
      let puntosVistaActual = 0;
      let puntosTotales = 0;
      const picks = predicciones[jugador] || {};
      
      partidos.forEach(p => {
        if (p.resultadooficial && picks[p.id] === p.resultadooficial) {
          puntosTotales += 3;
          if (tablaFiltro === 'Total' || p.jornada === tablaFiltro) {
            puntosVistaActual += 3;
          }
        }
      });
      return { nombre: jugador, puntos: puntosVistaActual, puntosTotales };
    });

    return tabla.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      if (tablaFiltro !== 'Total' && b.puntosTotales !== a.puntosTotales) return b.puntosTotales - a.puntosTotales;
      return a.nombre.localeCompare(b.nombre);
    });
  };

  const posiciones = calcularTabla();

  const getMedalColor = (index) => {
    if (index === 0) return 'linear-gradient(135deg, #fbbf24, #d97706)';
    if (index === 1) return 'linear-gradient(135deg, #d4d4d8, #71717a)';
    if (index === 2) return 'linear-gradient(135deg, #b45309, #78350f)';
    return '#111';
  };

  const getEscudo = (nombre) => CLUBES.find(c => c.nombre === nombre)?.escudo;

  const jornadasUnicas = [...new Set(partidos.map(p => p.jornada).filter(Boolean))].sort();
  const partidosFiltrados = jornadaFiltro === 'Todas' ? partidos : partidos.filter(p => p.jornada === jornadaFiltro);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 8 }}>
      
      {/* SECCIÓN RANKING COMPACTO */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Paper sx={{ p: 1.5, borderRadius: 3, bgcolor: '#111', border: '1px solid #333' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Ranking</Typography>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <Select
                value={tablaFiltro}
                onChange={(e) => setTablaFiltro(e.target.value)}
                sx={{ fontWeight: 800, bgcolor: '#000', borderRadius: 2, fontSize: '0.75rem' }}
              >
                <MenuItem value="Total">Total</MenuItem>
                {jornadasUnicas.map(j => (
                  <MenuItem key={`rank-${j}`} value={j}>{j}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {posiciones.map((fila, i) => (
          <Paper 
            key={fila.nombre} 
            elevation={0}
            sx={{ 
              p: 1, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid #222'
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                background: getMedalColor(i),
                fontWeight: 900,
                fontSize: '0.9rem',
                color: i < 3 ? '#fff' : 'text.secondary',
                border: i >= 3 ? '1px solid #333' : 'none'
              }}
            >
              {i + 1}
            </Avatar>
            <Typography variant="body2" sx={{ flex: 1, fontWeight: 700, fontSize: '0.9rem' }}>
              {fila.nombre}
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.5}>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 900, fontSize: '1.1rem' }}>
                {fila.puntos}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.6rem' }}>
                PTS
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Divider sx={{ borderColor: '#333', my: 1 }} />

      {/* MATRIZ DE PRONÓSTICOS OPTIMIZADA */}
      <Paper sx={{ p: 1.5, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid #333' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Pronósticos</Typography>
          <FormControl size="small" sx={{ minWidth: 110 }}>
            <Select
              value={jornadaFiltro}
              onChange={(e) => setJornadaFiltro(e.target.value)}
              sx={{ fontWeight: 800, bgcolor: '#000', borderRadius: 2, fontSize: '0.75rem' }}
            >
              <MenuItem value="Todas">Todas</MenuItem>
              {jornadasUnicas.map(j => (
                <MenuItem key={`matriz-${j}`} value={j}>{j}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <TableContainer sx={{ maxHeight: 500, borderRadius: 2, border: '1px solid #222' }}>
          <Table stickyHeader size="small" sx={{ '& .MuiTableCell-root': { padding: '2px 1px' } }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ bgcolor: '#0a0a0a', borderBottom: '2px solid #333', width: 35 }}></TableCell>
                {jugadores.map(j => (
                  <TableCell key={j} align="center" sx={{ bgcolor: '#0a0a0a', borderBottom: '2px solid #333', fontWeight: 900, color: '#fff', fontSize: '0.55rem', minWidth: 40, lineHeight: 1 }}>
                    {j.toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {partidosFiltrados.map(p => (
                <TableRow key={p.id}>
                  <TableCell align="center" sx={{ bgcolor: '#111', borderBottom: '1px solid #222' }}>
                    <Stack direction="column" alignItems="center" spacing={0.2}>
                      <Avatar src={getEscudo(p.local)} sx={{ width: 16, height: 16, bgcolor: '#000' }} variant="square">{p.local[0]}</Avatar>
                      <Avatar src={getEscudo(p.visitante)} sx={{ width: 16, height: 16, bgcolor: '#000' }} variant="square">{p.visitante[0]}</Avatar>
                    </Stack>
                  </TableCell>
                  {jugadores.map(j => {
                    const pick = predicciones[j]?.[p.id];
                    const evaluado = !!p.resultadooficial;
                    const acierto = evaluado && pick === p.resultadooficial;
                    
                    let bg = 'transparent';
                    let col = '#555';

                    if (evaluado) {
                      bg = acierto ? '#1b4332' : '#27272a';
                      col = acierto ? '#fff' : '#666';
                    } else if (pick) {
                      col = '#f97316';
                    }

                    return (
                      <TableCell key={j} align="center" sx={{ bgcolor: bg, color: col, borderBottom: '1px solid #222', fontWeight: 900, fontSize: '0.7rem' }}>
                        {pick || '-'}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}