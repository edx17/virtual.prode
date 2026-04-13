import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Tabs, Tab, Container, IconButton } from '@mui/material';
import { Trophy, LogOut, Settings, Calendar, Medal } from 'lucide-react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, collection, setDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';

import Login from './pages/Login';
import Prode from './pages/Prode';
import Tabla from './pages/Tabla';
import Admin from './pages/Admin';

const CLUBES = [
  { nombre: "25 de Mayo", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/25DEMAYO.jpg" },
  { nombre: "Almafuerte", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/ALMAFUERTE.png" },
  { nombre: "Asturiano", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/ASTURIANO.jpg" },
  { nombre: "CIDECO", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/CIDECO.png" },
  { nombre: "E. Maldonado", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/MALDONADO.png" },
  { nombre: "El Talar", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/ELTALAR.jpg" },
  { nombre: "Excursionistas", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/EXCURSIONISTAS.svg" },
  { nombre: "GEVS", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/GEVS.jpg" },
  { nombre: "J. Tapiales", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/TAPIALES.jpg" },
  { nombre: "Libertadores SC", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/escudo_a3666c8b-fae1-4685-8d84-f53d34693b27_1773939866248.png" },
  { nombre: "D. Merlo", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/MERLO.jpg" },
  { nombre: "D. Moron", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/MORON.png" },
  { nombre: "P. Junta", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/PRIMERAJUNTA.jpg" },
  { nombre: "R. Central", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/ROSARIOCENTRAL.png" },
  { nombre: "UnLam", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/UNLAM.jpg" },
  { nombre: "V. Heredia", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/VILLAHEREDIA.png" },
  { nombre: "V. Malcolm", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/VMALCOLM.jpg" },
  { nombre: "V. Modelo", escudo: "https://xwjskbhmwdeadgepsbns.supabase.co/storage/v1/object/public/escudos/VILLAMODELO.jpg" }
];

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#f97316' },
    background: { default: '#000000', paper: '#121212' },
  },
  shape: { borderRadius: 16 },
  typography: { fontFamily: 'Inter, sans-serif' },
});

export default function App() {
  const [user, setUser] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [jugadores, setJugadores] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [predicciones, setPredicciones] = useState({});
  const [config, setConfig] = useState({ cierre: "", jornadaActiva: "Fecha 1" });

  useEffect(() => {
    signInAnonymously(auth).catch(err => console.error(err));
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubConfig = onSnapshot(doc(db, "config", "prode"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setJugadores(data.jugadores || []);
        setConfig({ 
          cierre: data.cierre || "", 
          jornadaActiva: data.jornadaActiva || "Fecha 1" 
        });
      } else {
        setDoc(doc(db, "config", "prode"), { jugadores: [], cierre: "", jornadaActiva: "Fecha 1" });
      }
    });

    const unsubPartidos = onSnapshot(collection(db, "partidos"), (snap) => {
      setPartidos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubPreds = onSnapshot(collection(db, "predicciones"), (snap) => {
      const allPreds = {};
      snap.forEach(d => { allPreds[d.id] = d.data().picks || {}; });
      setPredicciones(allPreds);
    });

    return () => { unsubConfig(); unsubPartidos(); unsubPreds(); };
  }, [user]);

  if (!usuarioActual) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login 
          jugadores={jugadores} 
          onLogin={(u) => setUsuarioActual(u)} 
          onAdmin={(pass) => { 
            if(pass === 'prode2026') { setUsuarioActual('Admin'); setEsAdmin(true); setTabIndex(2); } 
            else { alert('Clave incorrecta'); }
          }} 
        />
      </ThemeProvider>
    );
  }

  const tiempoExpirado = config.cierre ? new Date() > new Date(config.cierre) : false;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', position: 'sticky', top: 0, zIndex: 100 }}>
        <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', height: 70, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Trophy color="#f97316" size={28} />
            <Box component="span" sx={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>
              VIRTUAL<Box component="span" sx={{ color: 'primary.main' }}>.PRODE</Box>
            </Box>
          </Box>
          <IconButton onClick={() => { setUsuarioActual(null); setEsAdmin(false); setTabIndex(0); }} color="inherit">
            <LogOut size={20} />
          </IconButton>
        </Container>

        <Container maxWidth="md">
          <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} variant="fullWidth" textColor="primary" indicatorColor="primary">
            <Tab icon={<Calendar size={20} />} label="JUGAR" />
            <Tab icon={<Medal size={20} />} label="RANKING" />
            {esAdmin && <Tab icon={<Settings size={20} />} label="ADMIN" />}
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ py: 4 }}>
        {tabIndex === 0 && (
          <Prode 
            partidos={partidos} 
            usuario={usuarioActual} 
            predicciones={predicciones[usuarioActual] || {}} 
            cerrado={tiempoExpirado}
            jornadaActiva={config.jornadaActiva}
            CLUBES={CLUBES}
          />
        )}
        {tabIndex === 1 && (
          <Tabla 
            jugadores={jugadores} 
            partidos={partidos} 
            predicciones={predicciones} 
          />
        )}
        {tabIndex === 2 && esAdmin && (
          <Admin 
            jugadores={jugadores} 
            partidos={partidos} 
            cierre={config.cierre} 
            jornadaActiva={config.jornadaActiva}
            CLUBES={CLUBES} 
          />
        )}
      </Container>
    </ThemeProvider>
  );
}