import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Location = ({ data }) => {
  return (
    <div className="w-48 sm:w-60 md:w-72 md:h-64 h-48 p-0.5 z-0 overflow-hidden">
      <MapContainer
        center={[data.latitude, data.longitude]}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        attributionControl={false}
        zoomControl={false}
        className="z-0 rounded-md w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[data.latitude, data.longitude]} />
      </MapContainer>
    </div>
  );
};

export default Location;
