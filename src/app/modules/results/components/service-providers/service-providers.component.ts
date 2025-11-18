import { Component } from '@angular/core';

interface ServiceProvider {
  name: string;
  type: string;
  services: string;
  contact: {
    phone: string;
    location: string;
  };
}

@Component({
  selector: 'app-service-providers',
  templateUrl: './service-providers.component.html',
  styleUrls: ['./service-providers.component.scss']
})
export class ServiceProvidersComponent {
  providers: ServiceProvider[] = [
    {
      name: 'Green Field Seeds',
      type: 'Seeds Supplier',
      services: 'Quality seeds, fertilizers, and farming tools',
      contact: {
        phone: '+91-9876543210',
        location: 'Near Agricultural Market'
      }
    },
    {
      name: 'Krishi Transport',
      type: 'Logistics',
      services: 'Harvest transportation to market',
      contact: {
        phone: '+91-9876543211',
        location: 'Transport Nagar'
      }
    },
    {
      name: 'Crop Care Center',
      type: 'Pesticides',
      services: 'Organic pesticides and crop consultation',
      contact: {
        phone: '+91-9876543212',
        location: 'Main Road'
      }
    }
  ];

  contactProvider(provider: ServiceProvider, action: 'call' | 'directions'): void {
    if (action === 'call') {
      alert(`Calling ${provider.name} at ${provider.contact.phone}`);
    } else {
      alert(`Getting directions to ${provider.contact.location}`);
    }
  }
}
