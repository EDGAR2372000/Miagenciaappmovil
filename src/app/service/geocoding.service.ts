import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface NominatimResult {
  lat: string;
  lon: string;
}

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  constructor(private http: HttpClient) {}

  geocode(address: string) {
    const url = 'https://nominatim.openstreetmap.org/search';
    return this.http.get<NominatimResult[]>(
      url,
      {
        params: {
          q: address,
          format: 'json',
          limit: '1'
        }
      }
    );
  }
}