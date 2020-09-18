mapboxgl.accessToken =
  "pk.eyJ1IjoibWFjcGFydGh1bSIsImEiOiJja2Y0YjA2bGgwYms1MnBuNHU1eXBwcWtiIn0.CHl4KYKsltpTGyUru9eg8A";
const zip = $("#zip").data("zip");

$.get(`/api/zipcode/${zip}`).then(results => {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [results.Longitude, results.Latitude],
    zoom: 11
  });
  const marker = new mapboxgl.Marker()
    .setLngLat([results.Longitude, results.Latitude])
    .addTo(map);
  console.log(marker);
  $("#biggestCity").text(
    `The biggest city in this zip code is ${results.City}, ${results.State}`
  );
});
