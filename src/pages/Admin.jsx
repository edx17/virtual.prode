import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Chip, Divider, MenuItem, Stack, IconButton } from '@mui/material';
import { Trash2, Plus, Save, CalendarDays } from 'lucide-react';
import { doc, setDoc, addDoc, collection, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Admin({
  jugadores = [],
  partidos = [],
  cierre = '',
  CLUBES = [],
  jornadaActiva: jornadaActivaProp = 'Fecha 1'
}) {
  const [nuevoJugador, setNuevoJugador] = useState('');
  const [nuevoCierre, setNuevoCierre] = useState(cierre || '');
  const [jornadaParaCrear, setJornadaParaCrear] = useState('Fecha 1');
  const [jornadaActiva, setJornadaActiva] = useState(jornadaActivaProp);
  const [local, setLocal] = useState('');
  const [visita, setVisita] = useState('');

  // Sincronizar cuando cambia en Firebase
  useEffect(() => {
    setJornadaActiva(jornadaActivaProp);
  }, [jornadaActivaProp]);

  useEffect(() => {
    setNuevoCierre(cierre);
  }, [cierre]);

  const agregarJugador = async () => {
    if (!nuevoJugador || jugadores.includes(nuevoJugador)) return;
    await setDoc(doc(db, "config", "prode"), { jugadores: [...jugadores, nuevoJugador] }, { merge: true });
    setNuevoJugador('');
  };

  const eliminarJugador = async (j) => {
    const filtrados = jugadores.filter(x => x !== j);
    await setDoc(doc(db, "config", "prode"), { jugadores: filtrados }, { merge: true });
  };

  const guardarCierre = async () => {
    await setDoc(doc(db, "config", "prode"), { cierre: nuevoCierre }, { merge: true });
    alert("Límite de tiempo actualizado");
  };

const guardarJornadaActiva = async () => {
    if (!jornadaActiva) return;
    // .trim() para evitar que un espacio nos rompa la comparación en Prode.jsx
    const jornadaLimpia = jornadaActiva.trim();
    await setDoc(doc(db, "config", "prode"), { jornadaActiva: jornadaLimpia }, { merge: true });
    alert(`Jornada activa: ${jornadaLimpia}`);
  };

  const agregarPartido = async () => {
    if (!local || !visita || !jornadaParaCrear) return;
    await addDoc(collection(db, "partidos"), { 
      local, 
      visitante: visita, 
      resultadooficial: null, 
      jornada: jornadaParaCrear 
    });
    setLocal('');
    setVisita('');
  };

  const eliminarPartido = async (id) => {
    if(window.confirm("¿Borrar partido?")) {
      await deleteDoc(doc(db, "partidos", id));
    }
  };

  const setResultadoOficial = async (id, res) => {
    await updateDoc(doc(db, "partidos", id), { resultadooficial: res });
  };

  // Obtener lista única de jornadas existentes para el selector de "Activa"
  const jornadasExistentes = [...new Set(partidos.map(p => p.jornada))].sort();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pb: 10 }}>
      
      {/* CONFIGURACIÓN DE LA FECHA VIGENTE */}
      <Paper sx={{ p: 3, borderRadius: 4, border: '2px solid #f97316', bgcolor: '#111' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarDays color="#f97316" /> CONTROL DE JORNADA ACTIVA
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              select
              label="Seleccionar Jornada Vigente"
              value={jornadaActiva}
              onChange={(e) => setJornadaActiva(e.target.value)}
              helperText="Los jugadores solo podrán editar partidos de esta jornada."
            >
              {jornadasExistentes.length > 0 ? (
                jornadasExistentes.map(j => <MenuItem key={j} value={j}>{j}</MenuItem>)
              ) : (
                <MenuItem value={jornadaActiva}>{jornadaActiva}</MenuItem>
              )}
            </TextField>
            <Button variant="contained" onClick={guardarJornadaActiva} sx={{ height: 56, px: 4 }}>
              ACTIVAR
            </Button>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#888' }}>Límite de tiempo para la jornada activa:</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              type="datetime-local"
              value={nuevoCierre}
              onChange={(e) => setNuevoCierre(e.target.value)}
            />
            <Button variant="outlined" onClick={guardarCierre} startIcon={<Save />}>Guardar Límite</Button>
          </Stack>
        </Stack>
      </Paper>

      {/* CREAR PARTIDOS */}
      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #333' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Cargar Partidos Nuevos</Typography>
        <Stack spacing={2}>
          <TextField
            label="¿A qué fecha pertenece? (Ej: Fecha 3)"
            value={jornadaParaCrear}
            onChange={(e) => setJornadaParaCrear(e.target.value)}
          />
          <Stack direction="row" spacing={2}>
            <TextField select fullWidth label="Local" value={local} onChange={(e) => setLocal(e.target.value)}>
              {CLUBES.map(c => <MenuItem key={c.nombre} value={c.nombre}>{c.nombre}</MenuItem>)}
            </TextField>
            <TextField select fullWidth label="Visitante" value={visita} onChange={(e) => setVisita(e.target.value)}>
              {CLUBES.map(c => <MenuItem key={c.nombre} value={c.nombre}>{c.nombre}</MenuItem>)}
            </TextField>
          </Stack>
          <Button variant="contained" onClick={agregarPartido} sx={{ fontWeight: 800, py: 1.5 }}>
            AGREGAR PARTIDO A {jornadaParaCrear.toUpperCase()}
          </Button>
        </Stack>
      </Paper>

      {/* LISTADO DE RESULTADOS */}
      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #333' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Gestión de Resultados</Typography>
        <Stack spacing={2}>
          {partidos.sort((a,b) => b.jornada.localeCompare(a.jornada)).map(p => {
            const esDeFechaActiva = p.jornada === jornadaActiva;
            return (
              <Paper key={p.id} sx={{ p: 2, bgcolor: '#0a0a0a', border: esDeFechaActiva ? '1px solid #f97316' : '1px solid #222' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box>
                    <Chip 
                      label={p.jornada} 
                      size="small" 
                      sx={{ mb: 1, bgcolor: esDeFechaActiva ? '#f97316' : '#222', color: esDeFechaActiva ? '#000' : '#888', fontWeight: 900 }} 
                    />
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{p.local} vs {p.visitante}</Typography>
                  </Box>
                  <IconButton size="small" color="error" onClick={() => eliminarPartido(p.id)}>
                    <Trash2 size={18} />
                  </IconButton>
                </Stack>
                <Stack direction="row" spacing={1}>
                  {['L', 'E', 'V'].map(r => (
                    <Button
                      key={r}
                      fullWidth
                      variant={p.resultadooficial === r ? 'contained' : 'outlined'}
                      onClick={() => setResultadoOficial(p.id, p.resultadooficial === r ? null : r)}
                      sx={{ fontWeight: 900 }}
                    >
                      {r}
                    </Button>
                  ))}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Paper>

      {/* JUGADORES */}
      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #333' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Usuarios del Sistema</Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField fullWidth label="Nombre del Jugador" value={nuevoJugador} onChange={(e) => setNuevoJugador(e.target.value)} />
          <Button variant="contained" onClick={agregarJugador}><Plus /></Button>
        </Stack>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {jugadores.map(j => (
            <Chip key={j} label={j} onDelete={() => eliminarJugador(j)} sx={{ fontWeight: 700, borderRadius: 2 }} />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}