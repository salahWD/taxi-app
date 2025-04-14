import {  RENTAL_VEHICLE, RENTAL_VEHICLE_LIST, RENTAL_VEHICLE_UPDATE } from "../types/index";
import {  RentalInterface } from "../../interface/rentalVehicleInterface";
import { rentalvehicleService } from "../../services/index";
import { createAsyncThunk } from '@reduxjs/toolkit';


export const rentalVehicleAdd = createAsyncThunk(
    RENTAL_VEHICLE,
    async (data: RentalInterface) => {
        const response = await rentalvehicleService.rentalVehicleAdd(data);
        return response?.data;
    },
);


export const rentalVehicleData = createAsyncThunk(
    RENTAL_VEHICLE_LIST,
    async () => {
        const response = await rentalvehicleService.rentalVehicleData();       
        return response?.data;
    },
);



export const rentalVehicleUpdate = createAsyncThunk(
    RENTAL_VEHICLE_UPDATE,
    async (data: RentalInterface) => {
        const response = await rentalvehicleService.rentalVehicleUpdate(data);       
        return response?.data;
    },
);

