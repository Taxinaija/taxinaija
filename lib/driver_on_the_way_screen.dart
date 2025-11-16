import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class DriverOnTheWayScreen extends StatelessWidget {
  // Other class members...
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Driver on the Way'),
      ),
      body: FlutterMap(
        options: MapOptions(
          center: LatLng(51.5, -0.09),
          zoom: 13,
        ),
        layers: [
          TileLayerOptions(
            urlTemplate: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoiaXNob2xhMTAxMiIsImEiOiJjbWhhN2c0ZTQxN2VyMmxwcXlzZnJuOGl5In0.cNFCZaM7kmHhx14As5M4sQ',
            retinaMode: true,
            // Additional parameters...
          ),
          // Other layers...
        ],
      ),
    );
  }
}