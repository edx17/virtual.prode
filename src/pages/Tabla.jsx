import React, { useState } from 'react';
import { Box, Paper, Typography, Avatar, Stack, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, MenuItem, Select, FormControl, Divider } from '@mui/material';

export default function Tabla({ jugadores = [], partidos = [], predicciones = {}, CLUBES = [] }) {
  const [jornadaFiltro, setJornadaFiltro] = useState('Todas');
  const [tablaFiltro, setTablaFiltro] = useState('Total');

  const calcularTabla = () => {
    const tabla = jugadores.map(jugador => {
      let puntos = 0;
      const picks = predicciones[jugador] || {};
      
      partidos.forEach(p => {
        const correspondeAFecha = tablaFiltro === 'Total' || p.jornada === tablaFiltro;
        if (correspondeAFecha && p.resultadooficial && picks[p.id] === p.resultadooficial) {
          puntos += 3;
        }
      });
      return { nombre: jugador, puntos };
    });
    return tabla.sort((a, b) => b.puntos - a.puntos);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pb: 10 }}>
      
      {/* SECCIÓN RANKING */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        
        {/* CABECERA Y FILTRO DE RANKING */}
        <Paper sx={{ p: 2, borderRadius: 4, bgcolor: '#111', border: '1px solid #333' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 900 }}>Ranking</Typography>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={tablaFiltro}
                onChange={(e) => setTablaFiltro(e.target.value)}
                sx={{ fontWeight: 800, bgcolor: '#000', borderRadius: 2 }}
              >
                <MenuItem value="Total">Total Acumulado</MenuItem>
                {jornadasUnicas.map(j => (
                  <MenuItem key={`rank-${j}`} value={j}>{j}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Paper>

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

      <Divider sx={{ borderColor: '#333' }} />

      {/* SECCIÓN MATRIZ DE PRONÓSTICOS */}
      <Paper sx={{ p: 2, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid #333' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>Pronósticos</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={jornadaFiltro}
              onChange={(e) => setJornadaFiltro(e.target.value)}
              sx={{ fontWeight: 800, bgcolor: '#000', borderRadius: 2 }}
            >
              <MenuItem value="Todas">Todas</MenuItem>
              {jornadasUnicas.map(j => (
                <MenuItem key={`matriz-${j}`} value={j}>{j}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <TableContainer sx={{ maxHeight: 600, border: '1px solid #222', borderRadius: 2 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ bgcolor: '#0a0a0a', borderBottom: '2px solid #333', minWidth: 50, px: 0.5 }}></TableCell>
                {jugadores.map(j => (
                  <TableCell key={j} align="center" sx={{ bgcolor: '#0a0a0a', borderBottom: '2px solid #333', fontWeight: 900, color: '#fff', fontSize: '0.65rem', px: 0.5, py: 1, minWidth: 35 }}>
                    {j.substring(0, 4).toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {partidosFiltrados.map(p => (
                <TableRow key={p.id}>
                  <TableCell align="center" sx={{ bgcolor: '#111', borderBottom: '1px solid #222', px: 0.5, py: 0.5 }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                      <Avatar src={getEscudo(p.local)} sx={{ width: 20, height: 20, bgcolor: '#000' }} variant="square">{p.local[0]}</Avatar>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: '#555', fontSize: '0.65rem' }}>VS</Typography>
                      <Avatar src={getEscudo(p.visitante)} sx={{ width: 20, height: 20, bgcolor: '#000' }} variant="square">{p.visitante[0]}</Avatar>
                    </Stack>
                  </TableCell>
                  {jugadores.map(j => {
                    const pick = predicciones[j]?.[p.id];
                    const evaluado = !!p.resultadooficial;
                    const acierto = evaluado && pick === p.resultadooficial;
                    
                    let bg = 'transparent';
                    let col = '#666';

                    if (evaluado) {
                      bg = acierto ? '#166534' : '#27272a';
                      col = acierto ? '#fff' : '#555';
                    } else if (pick) {
                      col = '#f97316';
                    }

                    return (
                      <TableCell key={j} align="center" sx={{ bgcolor: bg, color: col, borderBottom: '1px solid #222', fontWeight: 900, fontSize: '0.8rem', px: 0.5, py: 0.5 }}>
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