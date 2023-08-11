/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import * as pmtiles from "pmtiles";
import layers from "protomaps-themes-base";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import taxiStations from "./stations";
import mapLines from "./lines.json";

const Map = ({ pointLat, pointLon, stops }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(pointLon);
  const [lat] = useState(pointLat);
  const [zoom] = useState(5);

  let protocol = new pmtiles.Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);

  useEffect(() => {
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    const hoursAndMinutesUntil = (date) => {
      const now = new Date();
      const diff = date.valueOf() - now.valueOf();

      if (diff < 0) {
        return "Now";
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `in ${hours}h ${minutes}m`;
    };

    //if (map.current) return; // initialize map only once

    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        id: "43f36e14-e3f5-43c1-84c0-50a9c80dc5c7",
        name: "MapLibre",
        zoom: 0,
        pitch: 0,
        center: [41.884579601743276, -87.6279871036212],
        glyphs:
          "https://cdn.jsdelivr.net/gh/piemadd/fonts@54b954f510dc79e04ae47068c5c1f2ee39a69216/_output/{fontstack}/{range}.pbf",
        layers: layers("protomaps", "black"),
        bearing: 0,
        sources: {
          protomaps: {
            type: "vector",
            tiles: [
              "https://tilea.piemadd.com/tiles/{z}/{x}/{y}.mvt",
              "https://tileb.piemadd.com/tiles/{z}/{x}/{y}.mvt",
              "https://tilec.piemadd.com/tiles/{z}/{x}/{y}.mvt",
              "https://tiled.piemadd.com/tiles/{z}/{x}/{y}.mvt",
              //"http://10.0.0.237:8081/basemap/{z}/{x}/{y}.mvt"
            ],
            maxzoom: 13,
          },
        },
        version: 8,
        metadata: {},
      },
      center: [lng, lat],
      zoom: zoom,
      maxZoom: 16,
    });

    map.current.on("load", () => {
      map.current.on("moveend", () => {
        console.log(
          `Map moved to ${map.current.getCenter()} with zoom ${map.current.getZoom()}`
        );
      });

      stops.forEach((stop, i) => {
        const dateAndTimeFormatter = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          timeZone: stop.locale,
          timeZoneName: "short",
        });

        const arr = new Date(
          stop.live_arrival_time_unix !== null
            ? stop.live_arrival_time_unix * 1000
            : stop.scheduled_arrival_time_unix * 1000
        );
        const arrSch = stop.live_arrival_time_unix ? false : true;
        const dep = new Date(
          stop.live_departure_time_unix
            ? stop.live_departure_time_unix * 1000
            : stop.scheduled_departure_time_unix * 1000
        );
        const depSch = stop.live_departure_time_unix ? false : true;

        new maplibregl.Marker({
          color: `hsl(${Math.floor((i / stops.length) * 360)}, 68%, 40%)`,
          properties: {
            name: stop.name.split(":")[0],
          },
        })
          .setLngLat([
            stop.wgs84_longitude_degrees,
            stop.wgs84_latitude_degrees,
          ])
          .setPopup(
            new maplibregl.Popup({ offset: 25 }) // add popups
              .setHTML(`
              <h4>${stop.name.split(":")[0]}</h4>
              <br/>
              <p><b>${
                arrSch ? "Arrival (Scheduled): " : "Arrival: "
              }<br/>${dateAndTimeFormatter.format(arr)}</b></p>
              <p><b>${
                depSch ? "Departure (Scheduled): " : "Departure: "
              }<br/>${dateAndTimeFormatter.format(dep)}</b></p>
              `)
          )
          .addTo(map.current);
      });

      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = `url(/theboys64.png)`;
      el.style.width = `64px`;
      el.style.height = `64px`;

      const nextStop = stops.filter(
        (stop) => stop.has_stop_been_passed === false
      );
      new maplibregl.Marker({
        color: "#fdd323",
        properties: {
          name: "Jeremy and Miles",
        },
        element: el,
      })
        .setLngLat([pointLon, pointLat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }) // add popups
            .setHTML(
              `<h3>Jeremy and Miles</h3><p>why do they do this? idk</p><p>Next Stop: ${
                nextStop[0].name.split(":")[0]
              }</p>`
            )
        )
        .addTo(map.current);
    });

    console.log("Map initialized");
  });

  return (
    <>
      <div ref={mapContainer} className='map'></div>

      <div
        style={{
          textAlign: "right",
          marginBottom: "8px",
        }}
      >
        Map Attribution:{" "}
        <a href='https://protomaps.com' target='_blank' rel='noreferrer'>
          Protomaps
        </a>{" "}
        |{" "}
        <a
          href='https://openstreetmap.org/copyright'
          target='_blank'
          rel='noreferrer'
        >
          © OpenStreetMap
        </a>{" "}
        | <span>© Amtraker Tiles</span>
      </div>
    </>
  );
};

export default Map;
