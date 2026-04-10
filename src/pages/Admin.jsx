import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Chip, Divider, MenuItem, Stack, IconButton } from '@mui/material';
import { Trash2, Plus, Save } from 'lucide-react';
import { doc, setDoc, addDoc, collection, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Admin({ jugadores = [], partidos = [], cierre = '', CLUBES = [] }) {
  const [nuevoJugador, setNuevoJugador] = useState('');
  const [nuevoCierre, setNuevoCierre] = useState(cierre || '');
  
  const [jornada, setJornada] = useState('Fecha 1');
  const [local, setLocal] = useState('');
  const [visita, setVisita] = useState('');

  // JUGADORES
  const agregarJugador = async () => {
    if (!nuevoJugador || jugadores.includes(nuevoJugador)) return;
    await setDoc(doc(db, "config", "prode"), { jugadores: [...jugadores, nuevoJugador] }, { merge: true });
    setNuevoJugador('');
  };

  const eliminarJugador = async (j) => {
    const filtrados = jugadores.filter(x => x !== j);
    await setDoc(doc(db, "config", "prode"), { jugadores: filtrados }, { merge: true });
  };

  // CIERRE
  const guardarCierre = async () => {
    await setDoc(doc(db, "config", "prode"), { cierre: nuevoCierre }, { merge: true });
    alert("Horario de cierre actualizado");
  };

  // PARTIDOS
  const agregarPartido = async () => {
    if (!local || !visita || !jornada) return;
    await addDoc(collection(db, "partidos"), { local, visitante: visita, resultadooficial: null, jornada });
    setLocal('');
    setVisita('');
  };

  const eliminarPartido = async (id) => {
    await deleteDoc(doc(db, "partidos", id));
  };

  const setResultadoOficial = async (id, res) => {
    await updateDoc(doc(db, "partidos", id), { resultadooficial: res });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      
      {/* SECCIÓN JUGADORES */}
      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #333' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Usuarios Permitidos</Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField fullWidth size="small" label="Nuevo Jugador" value={nuevoJugador} onChange={(e) => setNuevoJugador(e.target.value)} />
          <Button variant="contained" onClick={agregarJugador}><Plus /></Button>
        </Stack>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {jugadores.map(j => (
            <Chip key={j} label={j} onDelete={() => eliminarJugador(j)} sx={{ fontWeight: 700, borderRadius: 2 }} />
          ))}
        </Box>
      </Paper>

      {/* SECCIÓN FECHA LÍMITE */}
      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #333' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Límite Global para Apostar</Typography>
        <Stack direction="row" spacing={2}>
          <TextField 
            fullWidth size="small" type="datetime-local" 
            value={nuevoCierre} onChange={(e) => setNuevoCierre(e.target.value)} 
          />
          <Button variant="contained" onClick={guardarCierre} startIcon={<Save />}>Guardar</Button>
        </Stack>
      </Paper>

      {/* SECCIÓN PARTIDOS */}
      <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #333' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Crear Partido</Typography>
        <Stack spacing={2} sx={{ mb: 4 }}>
          <TextField size="small" label="Nombre de la Fecha (Ej: Fecha 1)" value={jornada} onChange={(e) => setJornada(e.target.value)} />
          <TextField select size="small" label="Local" value={local} onChange={(e) => setLocal(e.target.value)}>
            {CLUBES.map(c => <MenuItem key={c.nombre} value={c.nombre}>{c.nombre}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Visitante" value={visita} onChange={(e) => setVisita(e.target.value)}>
            {CLUBES.map(c => <MenuItem key={c.nombre} value={c.nombre}>{c.nombre}</MenuItem>)}
          </TextField>
          <Button variant="contained" onClick={agregarPartido} sx={{ fontWeight: 800 }}>CARGAR PARTIDO</Button>
        </Stack>

        <Divider sx={{ my: 3, borderColor: '#333' }} />
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Resultados Reales</Typography>
        
        <Stack spacing={2}>
          {partidos.map(p => (
            <Paper key={p.id} sx={{ p: 2, bgcolor: '#0a0a0a', border: '1px solid #222' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Chip label={p.jornada || 'Sin Fecha'} size="small" sx={{ mb: 1, bgcolor: '#222', color: '#888', fontWeight: 800 }} />
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{p.local} vs {p.visitante}</Typography>
                </Box>
                <IconButton size="small" color="error" onClick={() => eliminarPartido(p.id)}><Trash2 size={18} /></IconButton>
              </Stack>
              <Stack direction="row" spacing={1}>
                {['L', 'E', 'V'].map(r => (
                  <Button
                    key={r} fullWidth
                    variant={p.resultadooficial === r ? 'contained' : 'outlined'}
                    onClick={() => setResultadoOficial(p.id, p.resultadooficial === r ? null : r)}
                    sx={{ fontWeight: 900 }}
                  >
                    {r}
                  </Button>
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Paper>

    </Box>
  );
}