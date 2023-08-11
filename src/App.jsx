import { useEffect, useState } from "react";
import StopsSchedule from "./Schedule";
import Map from "./Map";

const App = () => {
  const [dataSource, setDataSource] = useState("table");
  const [isLoading, setIsLoading] = useState(true);
  const [busData, setBusData] = useState([]);
  const [processedStops, setProcessedStops] = useState([]);
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [updatedAt, setUpdatedAt] = useState(new Date());
  const [now, setNow] = useState(new Date());

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const hoursAndMinutesUntil = (date) => {
    const diff = date.valueOf() - now.valueOf();

    if (diff < 0) {
      return "Now";
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `in ${hours}h ${minutes}m`;
  };

  useEffect(() => {
    setInterval(() => {
      setNow(new Date());
    }, 5000);
  }, []);

  useEffect(() => {
    const fetchBusData = async () => {
      const response = await fetch(
        "https://store.piemadd.com/jeremy_and_miles"
      );
      const data = await response.json();

      let processedStopsTemp = [];

      const stops = data.flatMap((bus) => bus.stops);
      stops.forEach((stop, i) => {
        if (i === 0) {
          processedStopsTemp.push(stop);
          return;
        }

        // if prev stop is the current stop, make the departure time of this stop the departure time of the next stop
        // also remove the stop from the array
        if (stop.internal_id === stops[i - 1]?.internal_id) {
          //console.log("Shared stop!");
          processedStopsTemp.pop();

          stop.live_arrival_time_unix = stops[i - 1].live_arrival_time_unix;
          stop.scheduled_arrival_time_unix =
            stops[i - 1].scheduled_arrival_time_unix;

          stop.live_arrival_time_formatted_local =
            stops[i - 1].live_arrival_time_formatted_local;
          stop.scheduled_arrival_time_formatted_local =
            stops[i - 1].scheduled_arrival_time_formatted_local;
        }

        processedStopsTemp.push(stop);

        // if the last stop of the array, skip
        if (i === stops.length - 1) return;
      });

      const activeBus = data.find(
        (bus) =>
          bus.active_vehicle !== null &&
          bus.coachtracker?.status_description !== "Journey Completed"
      );

      if (activeBus) {
        setLat(activeBus.active_vehicle.current_wgs84_latitude_degrees);
        setLon(activeBus.active_vehicle.current_wgs84_longitude_degrees);
      } else {
        //find most recent stop
        const mostRecentStop = data
          .flatMap((bus) => bus.stops)
          .filter((stop) => stop.live_departure_time_unix === null)
          .sort((a, b) => {
            return (
              b.scheduled_departure_time_unix - a.scheduled_departure_time_unix
            );
          })[0];

        console.log("Most recent stop", mostRecentStop);
        setLat(mostRecentStop.wgs84_latitude_degrees);
        setLon(mostRecentStop.wgs84_longitude_degrees);
      }

      console.log("Active bus", activeBus);
      console.log("Bus data", data);

      setBusData(data);
      setProcessedStops(processedStopsTemp);
      setUpdatedAt(new Date());
      setIsLoading(false);
    };

    fetchBusData();

    setInterval(() => {
      fetchBusData();
    }, 180000);
  }, []);

  return isLoading ? (
    <>Loading app data...</>
  ) : (
    <>
      <h1
        style={{
          textAlign: "center",
          marginTop: "8px",
        }}
      >
        Where&apos;s Jeremy and Miles?
      </h1>
      <p
        style={{
          marginBottom: "8px",
        }}
      >
        v1.2.3 | Made by{" "}
        <a href='https://piemadd.com/' target='_blank' rel='noreferrer'>
          Piero
        </a>
      </p>
      {
        <>
          <main>
            <div className='data-source-selector'>
              <button
                type='radio'
                name='data-source'
                id='table'
                value='table'
                onClick={(e) => {
                  console.log("Setting to", e.target.value);
                  setDataSource(e.target.value);
                }}
                className={
                  dataSource === "table" ? "data-source-selected" : undefined
                }
              >
                Stops
              </button>
              <button
                type='radio'
                name='data-source'
                id='map'
                value='map'
                onClick={(e) => {
                  console.log("Setting to", e.target.value);
                  setDataSource(e.target.value);
                }}
                className={
                  dataSource === "map" ? "data-source-selected" : undefined
                }
              >
                Map
              </button>
            </div>
            <div
              style={{
                display: dataSource === "table" ? "block" : "none",
              }}
            >
              <StopsSchedule stops={processedStops} />
            </div>

            <div
              style={{
                display: dataSource === "map" ? "block" : "none",
              }}
            >
              <Map pointLat={lat} pointLon={lon} stops={processedStops} />
            </div>
            <p
              style={{
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              This site is unofficial and not affiliated with neither Miles
              Taylor nor Jeremy Zorek.
            </p>
            <p
              style={{
                textAlign: "center",
                marginBottom: "8px",
              }}
            >
              This site uses google analytics.{" "}
            </p>
          </main>
        </>
      }
    </>
  );
};

export default App;
