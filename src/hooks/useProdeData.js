import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function useProdeData() {
  const [jugadores, setJugadores] = useState([]);
  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "prode_partidos"), snap => {
      const data = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() }));
      setPartidos(data);
    });

    return () => unsub();
  }, []);

  return { jugadores, partidos };
}

export const CLUBES = [
  { nombre: "Almafuerte", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/almafuerte.png" },
  { nombre: "Asturiano", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/asturiano.png" },
  { nombre: "25 de Mayo", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/25demayo.png" },
  { nombre: "V. Malcolm", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/vmalcolm.png" },
  { nombre: "V. Heredia", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/vheredia.png" },
  { nombre: "UnLam", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/unlam.png" },
  { nombre: "V. Modelo", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/vmodelo.png" },
  { nombre: "E. Maldonado", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/emaldonado.png" },
  { nombre: "J. Tapiales", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/jtapiales.png" },
  { nombre: "El Talar", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/eltalar.png" },
  { nombre: "D. Moron", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/dmoron.png" },
  { nombre: "CIDECO", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/cideco.png" },
  { nombre: "GEVS", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/gevs.png" },
  { nombre: "Excursionistas", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/excursionistas.png" },
  { nombre: "D. Merlo", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/dmerlo.png" },
  { nombre: "R. Central", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/rcentral.png" },
  { nombre: "P. Junta", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/pjunta.png" },
  { nombre: "Libertadores SC", escudo: "https://tudominio.supabase.co/storage/v1/object/public/escudos/libertadores.png" }
];