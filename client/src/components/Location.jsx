import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IoClose, IoLocationOutline } from "react-icons/io5";

const Location = ({ latitude, longitude, close, shareLocation }) => {
  return (
    <div className="w-full mx-auto absolute z-10 overflow-hidden top-0 h-full flex items-center justify-center left-0 backdrop-blur-sm">
      <div className="w-[90%] md:w-[40%] h-[90%] md:h-[70%] text-primary-content bg-base-100 border border-base-300 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-content h-[10%] p-3 flex items-center justify-between">
          <h1 className="text-lg font-medium">Send Location</h1>
          <button className="p-1">
            <IoClose size={24} onClick={close} />
          </button>
        </div>

        {/* Map Preview */}
        <div className="p-4 h-[70%]">
          <h2 className="text-primary font-medium mb-4">Your Location</h2>
          <main className="h-full w-full overflow-hidden">
            <MapContainer
              center={[latitude, longitude]}
              zoom={15}
              className="w-full h-full"
              scrollWheelZoom={false}
              dragging={false}
              doubleClickZoom={false}
              attributionControl={false}
              zoomControl={false}
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
        </div>

        {/*Bottom */}
        <div className="bg-base-100 h-[25%] text-primary-content flex items-center justify-center">
          <button
            onClick={shareLocation}
            className="btn btn-primary rounded-lg gap-2 hover:bg-primary/80 border-none"
          >
            <IoLocationOutline size={24} />
            Share Your Live Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default Location;
