const StopsSchedule = ({ stops }) => {
  return (
    <section className='busStops'>
      {stops.map((stop, i) => {
        console.log(stop);

        const arr = new Date(
          stop.estimated_arrival_time_unix
            ? stop.estimated_arrival_time_unix * 1000
            : stop.scheduled_arrival_time_unix * 1000
        );
        const arrSch = stop.estimated_arrival_time_unix ? true : false;
        const dep = new Date(
          stop.estimated_departure_time_unix
            ? stop.estimated_departure_time_unix * 1000
            : stop.scheduled_departure_time_unix * 1000
        );
        const depSch = stop.estimated_departure_time_unix ? true : false;

        const dateAndTimeFormatter = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          timeZone: stop.locale,
          timeZoneName: "short",
        });

        console.log(`hsl(${Math.floor((i / stops.length) * 360)}, 68%, 40%)`)

        return (
          <div key={i} className="busStop" style={{
            backgroundColor: `hsl(${Math.floor((i / stops.length) * 360)}, 68%, 40%)`
          }}>
            <h3>{stop.name.split(":")[0]}</h3>
            <p>
              <b>
                {arrSch ? "Arrival (Scheduled): " : "Arrival: "}
                {dateAndTimeFormatter.format(arr)}
              </b>
            </p>
            <p>
              <b>
                {depSch ? "Departure (Scheduled): " : "Departure: "}
                {dateAndTimeFormatter.format(dep)}
              </b>
            </p>
          </div>
        );
      })}
    </section>
  );
};

export default StopsSchedule;
