// import * as React from "react";
// import Map, { Marker } from "react-map-gl";

// const MapComponent = () => {
//   return (
//     <Map
//       mapboxAccessToken="pk.eyJ1IjoibWRhdmlzaCIsImEiOiJja3pkNzZ4cDYydmF6MnZtemZrNXJxYmtvIn0.9CYfaiw9PB90VlQEqt3dRQ"
//       initialViewState={{
//         longitude: -100,
//         latitude: 40,
//         zoom: 3.5,
//       }}
//       style={{
//         color: "blue",
//         width: "45vw",
//         height: "66vh",
//         flexShrink: 0,
//       }}
//       mapStyle="mapbox://styles/mapbox/streets-v9"
//     >
//       {module.results.map((result) => {
//         console.log(JSON.stringify(result));

//         return (
//           <Marker
//             latitude={result.data.yextDisplayCoordinate.latitude}
//             longitude={result.data.yextDisplayCoordinate.longitude}
//           />
//         );
//       })}
//     </Map>
//   );
// };

// export default MapComponent;
// pages/index.js

import { Component, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "mapbox-gl/dist/mapbox-gl.css";
import * as React from "react";

const Map = dynamic(() => import("react-map-gl"), { ssr: false });

class MapErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Mapbox-GL Error:", error);
    console.error("Error Info:", errorInfo);
    this.setState({ hasError: true, error, errorInfo });
    // You can also log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      // You can customize the fallback UI here
      return (
        <div>
          <p>Oops! Something went wrong with the Map.</p>
          <p>Error: {this.state.error.toString()}</p>
          <p>Stack Trace: {this.state.errorInfo.componentStack}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const MapComponent = () => {
  const [viewport, setViewport] = useState({
    latitude: 37.7749, // Your initial latitude
    longitude: -122.4194, // Your initial longitude
    zoom: 10, // Initial zoom level
  });

  return (
    <MapErrorBoundary>
      <div style={{ height: "100vh" }}>
        <Map
          {...viewport}
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onViewportChange={(newViewport) => setViewport(newViewport)}
          mapboxApiAccessToken="pk.eyJ1IjoibWRhdmlzaCIsImEiOiJja3pkNzZ4cDYydmF6MnZtemZrNXJxYmtvIn0.9CYfaiw9PB90VlQEqt3dRQ"
        />
      </div>
    </MapErrorBoundary>
  );
};

export default MapComponent;
