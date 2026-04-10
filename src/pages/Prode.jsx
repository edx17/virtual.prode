import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { CheckCircle2, Lock } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import PartidoCard from '../components/PartidoCard';

export default function Prode({ partidos = [], usuario, predicciones = {}, cerrado = false, CLUBES = [] }) {
  const [picks, setPicks] = useState({});

  useEffect(() => {
    if (predicciones) setPicks(predicciones);
  }, [JSON.stringify(predicciones)]);

  const handleSetPick = (id, valor) => {
    if (!cerrado) setPicks(prev => ({ ...prev, [id]: valor }));
  };

  const guardarPronosticos = async () => {
    try {
      await setDoc(doc(db, 'predicciones', usuario), { picks }, { merge: true });
      alert("Pronósticos guardados exitosamente.");
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // Agrupación de partidos por jornada
  const partidosAgrupados = partidos.reduce((acc, partido) => {
    const fecha = partido.jornada || 'Historial';
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(partido);
    return acc;
  }, {});

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {cerrado && (
        <Alert severity="warning" icon={<Lock size={20} />} sx={{ fontWeight: 800, mb: 2, borderRadius: 3 }}>
          LA FECHA ESTÁ CERRADA. No se pueden modificar los pronósticos.
        </Alert>
      )}

      {partidos.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ py: 6, fontWeight: 700 }}>
          No hay partidos cargados.
        </Typography>
      ) : (
        Object.entries(partidosAgrupados).map(([nombreFecha, lista]) => (
          <Box key={nombreFecha} sx={{ mb: 4 }}>
            <Typography 
              variant="h6" 
              sx={{ fontWeight: 900, color: 'primary.main', mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}
            >
              {nombreFecha}
            </Typography>
            
            {lista.map(p => (
              <PartidoCard 
                key={p.id} 
                partido={p} 
                pick={picks[p.id]} 
                onSetPick={handleSetPick} 
                cerrado={cerrado}
                CLUBES={CLUBES}
              />
            ))}
          </Box>
        ))
      )}

      {!cerrado && partidos.length > 0 && (
        <Button
          variant="contained"
          size="large"
          startIcon={<CheckCircle2 />}
          onClick={guardarPronosticos}
          sx={{ mt: 2, py: 2, fontWeight: 900, fontSize: '1.2rem', borderRadius: 3, boxShadow: '0 8px 25px rgba(249,115,22,0.3)' }}
        >
          REGISTRAR JUGADA
        </Button>
      )}
    </Box>
  );
}