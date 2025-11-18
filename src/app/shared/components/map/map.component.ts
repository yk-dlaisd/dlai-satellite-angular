import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer, MapOptions } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  options: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 10,
    center: latLng(18.5204, 73.8567) // Pune coordinates
  };

  constructor() { }

  ngOnInit(): void {
    console.log('Leaflet map component initialized');
  }

  onMapReady(map: L.Map) {
    console.log('Map is ready', map);
  }
}
