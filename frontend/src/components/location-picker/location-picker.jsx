import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LocationPicker({ location, setLocation }) {
  const [gettingLocation, setGettingLocation] = useState(false);

  const getLocation = () => {
    setGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGettingLocation(false);
          toast.success('Ubicación capturada');
        },
        (error) => {
          setGettingLocation(false);
          toast.error('No se pudo obtener la ubicación');
        }
      );
    } else {
      setGettingLocation(false);
      toast.error('Geolocalización no soportada');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">Ubicación GPS</label>
      <button
        type="button"
        onClick={getLocation}
        disabled={gettingLocation}
        className="w-full h-32 flex flex-col items-center justify-center bg-slate-900/50 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors"
      >
        {gettingLocation ? (
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
        ) : location.lat ? (
          <>
            <MapPin className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm text-green-400 font-medium">Ubicación guardada</span>
          </>
        ) : (
          <>
            <MapPin className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-sm text-slate-400">Obtener ubicación actual</span>
          </>
        )}
      </button>
    </div>
  );
}
