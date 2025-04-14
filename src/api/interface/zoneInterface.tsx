export interface ZoneUpdatePayload {
    success?: boolean;
    locations: locationDataPayload;
    rentalZones?:rentalZoneInterface;
    loading?: boolean;


}

export interface locationDataPayload {
    lat: number,
    lng: number
}

export interface rentalZoneInterface {
    
}