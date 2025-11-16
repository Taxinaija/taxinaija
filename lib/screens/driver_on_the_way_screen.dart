const String MAPBOX_ACCESS_TOKEN = 'sk.eyJ1IjoiaXNob2xhMTAxMiIsImEiOiJjbWhhN2c0ZTQxN2VyMmxwcXlzZnJuOGl5In0.cNFCZaM7kmHhx14As5M4sQ';

// Other code remains unchanged
TileLayer(
  urlTemplate: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + MAPBOX_ACCESS_TOKEN,
  retinaMode: true,
  // Other properties remain unchanged
),