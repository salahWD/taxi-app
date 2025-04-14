import {
    rentalVehicle,
    rental_Vehicle
   } from "../endpoints/rentalVehicleEndpoint";
   import { GET_API, POST_API, PUT_API } from "../methods";
   import { RentalInterface } from "../interface/rentalVehicleInterface";
 
 
   export const rentalVehicleAdd = async (data :RentalInterface) => {
     return POST_API(data, rentalVehicle)
       .then((res) => {
         return res;
       })
       .catch((e) => {
         return e?.response;
       });
   };


   export const rentalVehicleData = async () => {
    return GET_API(rentalVehicle)
      .then((res) => {
        return res;
      })
      .catch((e) => {
        return e?.response;
      });
  };


  export const rentalVehicleUpdate = async (data :RentalInterface) => {
    return PUT_API(data,rental_Vehicle)
      .then((res) => {
        return res;
      })
      .catch((e) => {
        return e?.response;
      });
  };

 
   const rentalvehicleService = {
    rentalVehicleAdd,
    rentalVehicleData,
    rentalVehicleUpdate
   };
   
   export default rentalvehicleService;
   