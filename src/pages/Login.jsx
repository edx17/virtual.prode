import React, { useState } from 'react';
import { Box, Paper, Typography, Button, TextField, MenuItem, Container } from '@mui/material';
import { Trophy, ChevronRight } from 'lucide-react';

export default function Login({ jugadores = [], onLogin, onAdmin }) {
  const [nombre, setNombre] = useState('');
  const [passAdmin, setPassAdmin] = useState('');
  const [modoAdmin, setModoAdmin] = useState(false);

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
      <Paper elevation={24} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid #333' }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ bgcolor: 'primary.main', p: 2, borderRadius: '50%', boxShadow: '0 0 20px rgba(249,115,22,0.4)' }}>
            <Trophy size={40} color="#000" />
          </Box>
        </Box>

        <Typography variant="h4" align="center" sx={{ fontWeight: 900, letterSpacing: -1, mb: 0.5 }}>
          Virtual.Prode
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4, fontWeight: 700 }}>
          FUTSAL PRIMERA C
        </Typography>

        {!modoAdmin ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              select
              fullWidth
              label="Seleccionar Jugador"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              variant="outlined"
            >
              {jugadores.length === 0 && <MenuItem disabled value="">No hay jugadores</MenuItem>}
              {jugadores.map((j) => (
                <MenuItem key={j} value={j}>{j}</MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              size="large"
              disabled={!nombre}
              onClick={() => onLogin(nombre)}
              endIcon={<ChevronRight />}
              sx={{ py: 1.5, fontWeight: 900, fontSize: '1.1rem' }}
            >
              INGRESAR
            </Button>

            <Button size="small" sx={{ mt: 2, color: 'text.secondary' }} onClick={() => setModoAdmin(true)}>
              Acceso Panel Admin
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              type="password"
              label="Clave de Administrador"
              value={passAdmin}
              onChange={(e) => setPassAdmin(e.target.value)}
              variant="outlined"
            />
            <Button
              variant="contained"
              size="large"
              onClick={() => onAdmin(passAdmin)}
              sx={{ py: 1.5, fontWeight: 900 }}
            >
              AUTORIZAR
            </Button>
            <Button size="small" sx={{ color: 'text.secondary' }} onClick={() => setModoAdmin(false)}>
              Volver
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}