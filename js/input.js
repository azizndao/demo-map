const start = document.querySelector('.start #start')
const startSuggestions = document.querySelector('.start .suggestions');
const compute = document.querySelector('.compute')

const end = document.querySelector('.end #end')
const endSuggestions = document.querySelector('.end .suggestions');
let startPoint = null
let endPoint = null

start.addEventListener('keyup', (event) => {
  fetchStartSuggestions(event.target.value)
})

end.addEventListener('keyup', (event) => {
  fetchEndSuggestions(event.target.value)
})

compute.addEventListener('click', () => {
  drawRoute(startPoint, endPoint)
})

function fetchStartSuggestions(query) {
  fetchSuggestions(query).then(({ features }) => {
    startSuggestions.innerHTML = null
    features.forEach(addStartFeature)
  }).catch(reason => console.log(`Error`, reason));
}

function addStartFeature(feature) {
  const li = document.createElement('li')
  li.classList.add('item')
  li.textContent = feature.place_name
  li.addEventListener('click', () => {
    startPoint = feature
    start.value = feature.place_name
    startSuggestions.innerHTML = null
    drawPoint(feature.geometry.coordinates)
  })
  startSuggestions.appendChild(li)
}

function fetchEndSuggestions(query) {
  fetchSuggestions(query).then(({ features }) => {
    endSuggestions.innerHTML = null
    features.forEach(addEndFeature)
  }).catch(reason => console.log(`Error`, reason));
}

function addEndFeature(feature) {
  const li = document.createElement('li')
  li.classList.add('item')
  li.textContent = feature.place_name
  li.addEventListener('click', () => {
    end.value = feature.place_name
    endSuggestions.innerHTML = null
    endPoint = feature
    drawPoint(feature.geometry.coordinates)
  })
  endSuggestions.appendChild(li)
}

async function fetchSuggestions(query) {
  if (query === '') return;
  const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=pk.eyJ1IjoiYXppem5kYW8iLCJhIjoiY2tsdHVveHRjMDB2OTJucGx2ZXFtdWRuZiJ9.-5kaZgWHIuMROBeSu6yjyw`);
  return await res.json();
}

function drawPoint(coordinates) {

  window.map.flyTo({ center: coordinates, zoom: 12 });
}

function drawRoute() {
  if (startPoint === null || endPoint == null) return;
  const point1 = startPoint.geometry.coordinates
  const point2 = endPoint.geometry.coordinates
  const url = `https://api.mapbox.com/directions/v5/mapbox/cycling/${point1[0]},${point1[1]};${point2[0]},${point2[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;

  fetch(url).then(res => res.json())
    .then(result => {
      const data = result.routes[0];
      const route = data.geometry.coordinates;
      console.log(result);
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };
      // if the route already exists on the map, reset it using setData
      if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
      } else { // otherwise, make a new request
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: geojson
              }
            }
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }
      // add turn instructions here at the end
    })
}