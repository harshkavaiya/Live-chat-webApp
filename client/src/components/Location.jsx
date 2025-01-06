import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IoLocationOutline } from "react-icons/io5";

const Location = ({ latitude, longitude, close, shareLocation }) => {
  return (
    <div data-theme="business" className="absolute top-0  z-50 w-full h-full">
      <div className="h-screen bg-base-100 text-base-content absolute w-full z-30">
        {/* Header */}
        <header className="navbar bg-base-200 border-b  border-base-300 fixed top-0 left-0 right-0 z-50">
          <div className="w-full flex items-center justify-center">
            <p className="text-lg text-center font-semibold">Send location</p>
          </div>
        </header>

        {/* Map Container */}
        <main className="flex relative h-[600px] overflow-hidden">
          <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            className="w-full h-full"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {latitude && longitude && (
              <Marker position={[latitude, longitude]}>
                <Popup>Name</Popup>
              </Marker>
            )}
          </MapContainer>
        </main>

        {/* Bottom Sheet */}
        <div className="bg-base-200 px-4 py-3 rounded-t-box shadow-lg flex justify-center gap-x-2">
          <button
            onClick={shareLocation}
            className="btn btn-primary rounded-lg justify-start gap-2 hover:bg-primary/80 border-none"
          >
            <IoLocationOutline size={24} />
            Share Your Live Location
          </button>
          <button
            onClick={close}
            className="btn btn-secondary rounded-lg justify-start gap-2 hover:bg-secondary/80 border-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Location;
