interface LoginViewProps {
  googleLogin?: () => void;
  appleLogin?: () => void;
  gotoOTP?: () => void;
  gotoRegistration?: () => void;
  phoneNumber?: string;
  setPhoneNumber?: (text: string) => void;
  countryCode?: string;
  setCountryCode?: (text: string) => void;
  demouser?: string;
  setDemouser?: () => void;
}
export default LoginViewProps;
