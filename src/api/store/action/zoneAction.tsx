import {  ZONE_UPDATE, RENTAL_ZONE } from "../types/index";
import {  ZoneUpdatePayload } from "../../interface/zoneInterface";
import { zoneService } from "../../services/index";
import { createAsyncThunk } from '@reduxjs/toolkit';


export const driverZone = createAsyncThunk(
    ZONE_UPDATE,
    async (data: ZoneUpdatePayload) => {
        const response = await zoneService.zone(data);
        return response?.data;
    },
);


export const rentalZone = createAsyncThunk(
    RENTAL_ZONE,
    async ({ vehicle_type_id }: { vehicle_type_id: number}) => {
      const response = await zoneService.rentalZone(vehicle_type_id);
      return response?.data;
    }
  );