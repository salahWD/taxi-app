export interface AuthInterface {

}


export interface DriverLoginInterface {
    phone?: string,
    country_code?: string;
}

export interface VerifyOtpInterface {
    phone:  string | null,
    country_code: string | null,
    token: number | null | string,
    email: string | null,
    fcm_token: string;
}
export interface UserLoginEmailInterface {
    email?: string;
  }


  
export interface DriverRegistrationPayload {

}


export interface UserLoginInterface {

}