import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { CheckCircle2, Lock, ChevronDown } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import PartidoCard from '../components/PartidoCard';

const obtenerOrdenFecha = (nombreFecha) => {
  const match = /fecha\s*(\d+)/i.exec(nombreFecha || '');
  if (match) return parseInt(match[1], 10);
  if (nombreFecha?.toLowerCase() === 'historial') return -1;
  return 0;
};

export default function Prode({
  partidos = [],
  usuario,
  predicciones = {},
  cerrado = false, 
  CLUBES = [],
  jornadaActiva = ''
}) {
  const [picks, setPicks] = useState({});

  useEffect(() => {
    if (predicciones) setPicks(predicciones);
  }, [JSON.stringify(predicciones)]);

  const handleSetPick = (id, valor) => {
    setPicks(prev => ({ ...prev, [id]: valor }));
  };

  const guardarPronosticos = async () => {
    try {
      await setDoc(doc(db, 'predicciones', usuario), { picks }, { merge: true });
      alert("¡Pronósticos guardados!");
    } catch (error) {
      console.error(error);
    }
  };

  const partidosAgrupados = partidos.reduce((acc, partido) => {
    const fecha = partido.jornada || 'Historial';
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(partido);
    return acc;
  }, {});

  const fechasOrdenadas = Object.entries(partidosAgrupados)
    .sort(([a], [b]) => obtenerOrdenFecha(b) - obtenerOrdenFecha(a));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Solo mostramos la alerta si la jornada que el usuario ve como activa está realmente cerrada por tiempo */}
      {cerrado && (
        <Alert severity="warning" icon={<Lock size={20} />} sx={{ fontWeight: 800, mb: 2, borderRadius: 3 }}>
          TIEMPO AGOTADO para la {jornadaActiva}.
        </Alert>
      )}

      {fechasOrdenadas.map(([nombreFecha, lista]) => {
        // LÓGICA DE HIERRO:
        const esVigente = nombreFecha.trim() === jornadaActiva.trim();
        
        return (
          <Accordion key={nombreFecha} defaultExpanded={esVigente}>
            <AccordionSummary 
              expandIcon={<ChevronDown size={18} />}
              sx={{ 
                bgcolor: esVigente ? 'rgba(249, 115, 22, 0.1)' : '#111',
                borderLeft: esVigente ? '4px solid #f97316' : 'none'
              }}
            >
              <Typography sx={{ fontWeight: 900, color: esVigente ? 'primary.main' : 'text.secondary' }}>
                {nombreFecha} {!esVigente && '(Bloqueada)'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, bgcolor: '#050505' }}>
              {lista.map(p => {
                // SE BLOQUEA SI: No es la vigente O (siendo la vigente) el tiempo ya expiró
                const inhabilitado = !esVigente || (esVigente && cerrado);

                return (
                  <PartidoCard
                    key={p.id}
                    partido={p}
                    pick={picks[p.id]}
                    onSetPick={(id, valor) => {
                      if (!inhabilitado) handleSetPick(id, valor);
                    }}
                    cerrado={inhabilitado}
                    CLUBES={CLUBES}
                  />
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}

      {!cerrado && (
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<CheckCircle2 />}
          onClick={guardarPronosticos}
          sx={{ mt: 2, py: 2, fontWeight: 900 }}
        >
          GUARDAR {jornadaActiva}
        </Button>
      )}
    </Box>
  );
}