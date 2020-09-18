mapboxgl.accessToken =
  "pk.eyJ1Ijoia2lsbGVyY29kaW5nbW9ua2V5IiwiYSI6ImNrMnc4enluazBjOGEzYm5xMjcyeHVlZ3IifQ.RqVe0wJ3PN2eap3PmnR2pA";
const zip = $("#zip").data("zip");
console.log(zip);

$.get(`/api/zipcode/${zip}`).then(results => {
  console.log(results);
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
