import 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.5.1/mapbox-gl-geocoder.min.js'
import 'https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.js'
import './input.js'

mapboxgl.accessToken = 'pk.eyJ1IjoiYXppem5kYW8iLCJhIjoiY2tsdHVveHRjMDB2OTJucGx2ZXFtdWRuZiJ9.-5kaZgWHIuMROBeSu6yjyw';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11'
});

window.map = map;

map.addControl(new mapboxgl.NavigationControl());

map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
}));
