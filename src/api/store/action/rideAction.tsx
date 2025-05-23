import {
  RIDEGET,
  RIDEEND,
  RIDESTART,
  RIDECOMPLETE,
  RIDEGETS,
} from "../types/index";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { bidServices, rideServices } from "../../services";
import { RidePostInterface } from "../../interface/rideInterface";

export const rideDataGet = createAsyncThunk(
  RIDEGET,
  async (ride_id: number) => {
    const response = await rideServices.rideDataGet(ride_id);
    return response?.data;
  }
);

export const rideDataGets = createAsyncThunk(RIDEGETS, async () => {
  const response = await rideServices.rideDataGets();
  return response?.data;
});

export const rideDataPut = createAsyncThunk(
  RIDECOMPLETE,
  async ({ data, ride_id }: { data: RidePostInterface; ride_id: number }) => {
    const response = await rideServices.rideUpdate({ data, ride_id });
    return response?.data;
  }
);

export const rideEndPatch = createAsyncThunk(
  RIDEEND,
  async ({ data, ride_id }: { data: RidePostInterface; ride_id: number }) => {
    const response = await rideServices.rideEnd({ data, ride_id });
    return response?.data;
  }
);

export const rideStartData = createAsyncThunk(
  RIDESTART,
  async (data: RidePostInterface) => {
    const response = await rideServices.userstartRide(data);
    return response?.data;
  }
);
