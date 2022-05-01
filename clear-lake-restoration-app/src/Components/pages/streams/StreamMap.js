export default class StreamMap extends Map() {
    render() {
        return (
            <div>
              <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
              </div>
              <div ref={mapContainer} className="map-container" />
            </div>
          );
    }
}