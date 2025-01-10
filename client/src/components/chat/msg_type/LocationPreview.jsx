import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Location = ({ message }) => {
  return (
    <div className="w-56 sm:w-64 md:w-72 h-56 p-0.5">
      <MapContainer
        center={[message.data.latitude, message.data.longitude]}
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

        <Marker position={[message.data.latitude, message.data.longitude]} />
      </MapContainer>
    </div>
  );
};

export default Location;
