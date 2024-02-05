import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

const MapWithRouting = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapRef.current).setView([37.7749, -122.4194], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );

    const startPoint = L.latLng(37.7749, -122.4194); // San Francisco, CA
    const endPoint = L.latLng(34.0522, -118.2437); // Los Angeles, CA

    L.marker(startPoint).addTo(map);
    L.marker(endPoint).addTo(map);

    // Add routing control
    const routingControl = L.Routing.control({
      waypoints: [startPoint, endPoint],
      routeWhileDragging: true,
    });

    routingControl.addTo(map);

    // Optional event listener for route change
    routingControl.on("routesfound", function (event) {
      const routes = event.routes;
      console.log("Found routes:", routes);
    });
  }, []);

  return <div ref={mapRef} style={{ height: "500px", width: "100%" }} />;
};

export default MapWithRouting;
