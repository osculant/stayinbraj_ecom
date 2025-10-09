"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "../../context/toast.js";
import CountryModal from "../components/countyModal/page.js";

import { ENV } from '@/config/env'; 

export default function HotelSignup() {
  const totalSteps = 6,
    { showToast } = useToast(),
    [step, setStep] = useState(1),
    [otpTimer, setOtpTimer] = useState(60),
    [loading, setLoading] = useState(false),
    [selectedCountry, setSelectedCountry] = useState({
      name: "India",
      flag: "https://i.pinimg.com/736x/76/e2/bc/76e2bc3a8c3503f9fdd53aaa924b89e5.jpg",
      code: "IN",
      dial_code: "+91",
    }),
    [countyCodemodalOpen, setCountryCodeModalOpen] = useState(false),
    [showPassword, setShowPassword] = useState(false),
    [canResendOtp, setCanResendOtp] = useState(false);

  const [basicInfoFormData, setBasicInfoFormData] = useState({
    owner_name: "",
    owner_email: "",
    owner_address: "",
    owner_phone: "",
    type: "ECOMMERCE",
    otp: ["", "", "", "", "", ""],
    password: "",
    confirmPassword: "",
  });

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
  };

  const next = () => {
    if (step === 1 && !basicInfoFormData.owner_name.trim()) {
      return showToast("Please enter your name", "alert");
    }
    if (step === 2 && !basicInfoFormData.owner_email.trim()) {
      return showToast("Please enter your email", "alert");
    }
    if (step === 3 && !basicInfoFormData.owner_address.trim()) {
      return showToast("Please enter your address", "alert");
    }
    if (step === 4 && !basicInfoFormData.owner_phone.trim()) {
      return showToast("Please enter your phone number", "alert");
    }

    setStep((s) => Math.min(s + 1, totalSteps + 1));
  };

  const handleOtpChange = (i, val) => {
    const newOtp = [...basicInfoFormData.otp];
    newOtp[i] = val;
    setBasicInfoFormData({ ...basicInfoFormData, otp: newOtp });
  };

  useEffect(() => {
    let timer;
    if (step === 5) {
      setOtpTimer(60);
      setCanResendOtp(false);

      timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  const handleResendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("mobile_no", countryCode + basicInfoFormData.owner_phone);
    fd.append("email_id", basicInfoFormData.owner_email);

    try {
      const res = await fetch(`${ENV.baseUrl}ecommerce-partner-send-otp`, {
        method: "POST",
        headers: {
          access: "stayinbraj2025osculant", // Note: No need to set Content-Type for FormData
        },
        body: fd,
      });

      const result = await res.json();

      if (result.status) {
        setStep(5); // Go to OTP step
        showToast(result.message, "success");
      } else {
        showToast(result.message, "alert");
      }
    } catch (error) {
      console.error("OTP Send Error:", error);
      showToast("Try again later", "warning");
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(),
      countryCode = selectedCountry.dial_code.replace("+", "");

    fd.append("mobile_no", countryCode + basicInfoFormData.owner_phone);
    fd.append("email_id", basicInfoFormData.owner_email);

    try {
      const res = await fetch(`${ENV.baseUrl}ecommerce-partner-send-otp`, {
        method: "POST",
        headers: {
          access: "stayinbraj2025osculant", // Note: No need to set Content-Type for FormData
        },
        body: fd,
      });

      const result = await res.json();

      if (result.status) {
        setStep(5); // Go to OTP step
        showToast(result.message, "success");
      } else {
        showToast(result.message, "alert");
      }
    } catch (error) {
      console.error("OTP Send Error:", error);
      showToast("Try again later", "warning");
    } finally {
      setLoading(false);
    }
  };

  const validateOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const otp = basicInfoFormData.otp.map((code) => code.trim()).join(""),
        fd = new FormData(),
        countryCode = selectedCountry.dial_code.replace("+", "");

      fd.append("mobile_no", countryCode + basicInfoFormData.owner_phone);
      fd.append("mobile_otp", otp);

      const res = await fetch(`${ENV.baseUrl}ecommerce-check-partner-otp`, {
        method: "POST",
        headers: {
          access: "stayinbraj2025osculant", // Note: No need to set Content-Type for FormData
        },
        body: fd,
      });
      const result = await res.json();

      if (result.status) {
        setStep(6);
        showToast(result.message, "success");
      } else {
        showToast(result.message, "alert");
      }
    } catch (error) {
      console.error("OTP Check Error:", error);
      showToast("Try again later", "warning");
    }

    setLoading(false);
  };

  const submitDetail = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(),
      otp = basicInfoFormData.otp.map((code) => code.trim()).join(""),
      countryCode = selectedCountry.dial_code.replace("+", "");

    fd.append("owner_name", basicInfoFormData.owner_name);
    fd.append("email_id", basicInfoFormData.owner_email);
    fd.append("password", basicInfoFormData.password);
    fd.append("confirm_password", basicInfoFormData.confirmPassword);
    fd.append("mobile_no", countryCode + basicInfoFormData.owner_phone);
    fd.append("owner_address", basicInfoFormData.owner_address);
    fd.append("type", basicInfoFormData.type);
    fd.append("otp", otp);
    fd.append("country_code", countryCode);

    try {
      const res = await fetch(`${ENV.baseUrl}ecommerce-store-partner-info`, {
        method: "POST",
        headers: {
          access: "stayinbraj2025osculant", // Note: No need to set Content-Type for FormData
        },
        body: fd,
      });

      const result = await res.json();
      if (result.status) {
        setStep(7);
        showToast(result.message, "success");
      } else {
        showToast(result.message, "alert");
      }
    } catch (error) {
      console.error("Store partner info Error:", error);
      showToast("Try again later", "warning");
    }

    setLoading(false);
  };

  return (
    <section className="bg-[#e7eaff] w-full lg:h-auto h-screen">
      <section className="px-2 py-4 sm:px-16 sm:py-8">
        {/* Progress Bar */}
        <div className="flex justify-between items-center lg:mb-8 mb-16 lg:mt-0 mt-4">
          <div className="basis-1/2 sm:basis-1/3 lg:basis-1/6 px-2">
            <img src={ENV.imageLinks.logo} alt="logo" className="h-16" />
          </div>
          <div className="basis-1/2 sm:basis-1/3 lg:basis-1/6 bg-gray-100 flex justify-between items-baseline px-4 py-2 rounded-xl">
            <div className="bg-gray-300 rounded-full flex-grow h-[10px] overflow-hidden">
              <div className="bg-green-600 h-full transition-all" style={{ width: `${(step / totalSteps) * 100}%` }} />
            </div>
            <div className="w-12 text-center">{step <= totalSteps ? `${step}/${totalSteps}` : "✔️"}</div>
          </div>
        </div>

        {/* Title */}
        <h1 className="lg:text-xl text-md sm:text-xl text-center font-semibold uppercase text-red-600 border-b-2 border-red-600 w-full lg:w-1/3 mx-auto pb-2">
          <i className="fa-solid fa-hotel"></i> Ecommerce Store Listing Process
        </h1>

        {/* Summary Bubbles */}
        {step <= 5 && (basicInfoFormData.owner_name || basicInfoFormData.owner_email || basicInfoFormData.owner_address || basicInfoFormData.owner_phone) && (
          <div className="p-4 flex lg:flex-row flex-col flex-wrap justify-center items-center gap-x-8 lg:gap-y-0 gap-y-2">
            {basicInfoFormData.owner_name && (
              <p onClick={() => setStep(1)} className="text-sm cursor-pointer">
                Name : <strong className="text-lg">{basicInfoFormData.owner_name}</strong>
              </p>
            )}
            {basicInfoFormData.owner_email && (
              <p onClick={() => setStep(2)} className="text-sm cursor-pointer">
                Email : <strong className="text-lg">{basicInfoFormData.owner_email}</strong>
              </p>
            )}
            {basicInfoFormData.owner_address && (
              <p onClick={() => setStep(3)} className="text-sm cursor-pointer">
                Address : <strong className="text-lg">{basicInfoFormData.owner_address}</strong>
              </p>
            )}
            {basicInfoFormData.owner_phone && (
              <p onClick={() => setStep(4)} className="text-sm cursor-pointer">
                Phone : <strong className="text-lg">{basicInfoFormData.owner_phone}</strong>
              </p>
            )}
          </div>
        )}

        {/* Step 1 - Name */}
        {step === 1 && (
          <div className="flex flex-col justify-center items-center h-[calc(100%-4rem)] py-8 px-4">
            <div className="w-full lg:w-6/12 mx-auto mt-8">
              <label htmlFor="owner_name" className="lg:text-3xl text-xl font-bold block mb-4">
                What's your name?
              </label>
              <input type="text" id="owner_name" name="owner_name" placeholder="e.g. Rohit Sharma" required value={basicInfoFormData.owner_name} onChange={(e) => setBasicInfoFormData({ ...basicInfoFormData, owner_name: e.target.value })} className="px-3 block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-red-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 outline-red-500" />
            </div>
            <div className="w-full lg:w-6/12 mx-auto pt-4 border-gray-500">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm text-gray-500">
                  Need help? email{" "}
                  <a href="mailto:example@example.com" className="text-red-600 outline-0 focus:ring-1 focus:ring-red-500">
                    stayinbraj.com
                  </a>
                </p>
                <button type="button" onClick={next} className="btn-1 w-24 font-semibold py-2 rounded-md bg-red-600 text-white cursor-pointer focus:outline-0 focus:ring-red-600">
                  <i className="ri-loop-right-line"></i>
                  <span>Continue</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 - Email */}
        {step === 2 && (
          <div className="flex flex-col justify-center items-center h-[calc(100%-4rem)] py-8 px-4">
            <div className="w-full lg:w-6/12 mx-auto">
              <label htmlFor="owner_email" className="lg:text-3xl text-xl font-bold block mb-4">
                What's your email Id?
              </label>
              <input type="email" id="owner_email" name="owner_email" placeholder="e.g. example@gmail.com" required value={basicInfoFormData.owner_email} onChange={(e) => setBasicInfoFormData({ ...basicInfoFormData, owner_email: e.target.value })} className="px-3 block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-red-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 outline-red-500" />
            </div>
            <div className="w-full lg:w-6/12 mx-auto pt-4">
              <div className="flex justify-between items-center">
                <button type="button" onClick={() => setStep(1)} className="btn-1 w-24 font-semibold py-2 rounded-md border border-red-600 text-red-500 cursor-pointer focus:outline-0 focus:ring-red-600">
                  Back
                </button>
                <button type="button" onClick={next} className="btn-1 w-24 font-semibold py-2 rounded-md bg-red-600 text-white cursor-pointer focus:outline-0 focus:ring-red-600">
                  <i className="ri-loop-right-line"></i>
                  <span>Continue</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 - Address */}
        {step === 3 && (
          <div className="flex flex-col justify-center items-center h-[calc(100%-4rem)] py-8 px-4">
            <div className="w-full lg:w-6/12 mx-auto">
              <label htmlFor="owner_address" className="lg:text-3xl text-xl font-bold block mb-4">
                What's your current address?
              </label>
              <textarea id="owner_address" name="owner_address" className="px-3 block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-red-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 outline-red-500 resize-none" rows="3" placeholder="Enter Contact Person Address" required value={basicInfoFormData.owner_address} onChange={(e) => setBasicInfoFormData({ ...basicInfoFormData, owner_address: e.target.value })}></textarea>
            </div>
            <div className="w-full lg:w-6/12 mx-auto pt-4">
              <div className="flex justify-between items-center">
                <button type="button" onClick={() => setStep(2)} className="btn-1 w-24 font-semibold py-2 rounded-md border border-red-600 text-red-500 cursor-pointer focus:outline-0 focus:ring-red-600">
                  Back
                </button>
                <button type="button" onClick={next} className="btn-1 w-24 font-semibold py-2 rounded-md bg-red-600 text-white cursor-pointer focus:outline-0 focus:ring-red-600">
                  <i className="ri-loop-right-line"></i>
                  <span>Continue</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 - Phone */}
        {step === 4 && (
          <div className="flex flex-col justify-center items-center h-[calc(100%-4rem)] py-8 px-4">
            <div className="w-full lg:w-6/12 mx-auto">
              <label htmlFor="owner_phone" className="lg:text-3xl text-xl font-bold block mb-4">
                What's your Phone number?
              </label>
              <div className="flex justify-between gap-1 w-full">
                <div onClick={() => setCountryCodeModalOpen(true)} className="flex justify-center items-center gap-1 uppercase w-36 bg-white rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-red-300 sm:text-sm">
                  <img src={selectedCountry.flag} alt="India Flag" className="w-6 h-4 object-cover" />
                  <span className="text-xs text-gray-500">
                    {selectedCountry.code} ({selectedCountry.dial_code})
                  </span>
                </div>
                <input type="tel" name="mobile_no" value={basicInfoFormData.owner_phone} onChange={(e) => setBasicInfoFormData({ ...basicInfoFormData, owner_phone: e.target.value })} className="px-3 block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-red-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 outline-red-500" placeholder="e.g. 9876xxxxxx" required />
              </div>
            </div>
            <div className="w-full lg:w-6/12 mx-auto pt-4">
              <div className="flex justify-between items-center">
                <button type="button" onClick={() => setStep(3)} className="btn-1 w-24 font-semibold py-2 rounded-md border border-red-600 text-red-500 cursor-pointer focus:outline-0 focus:ring-red-600">
                  Back
                </button>
                <button type="button" onClick={sendOtp} className="btn-1 w-24 font-semibold py-2 rounded-md bg-red-600 text-white cursor-pointer focus:outline-0 focus:ring-red-600" disabled={loading}>
                  <i className="ri-loop-right-line"></i>
                  <span>Continue</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5 - OTP */}
        {step === 5 && (
          <div className="flex flex-col justify-center items-center h-[calc(100%-4rem)] py-8 px-4">
            <div className="w-full lg:w-6/12 mx-auto">
              <label className="lg:text-3xl text-xl font-bold block mb-4">Enter OTP</label>
              <div className="w-full flex justify-between mb-4">
                {[...Array(6)].map((_, i) => (
                  <input key={i} type="text" maxLength="1" autoComplete="one-time-code" name="otp_digit" className="shadow-xs flex w-12 h-12 sm:w-16 sm:h-16 items-center justify-center rounded-lg bg-white p-2 text-center text-2xl font-medium text-gray-500 sm:text-4xl ring ring-red-400 outline-0 focus:outline-0" value={basicInfoFormData.otp[i]} onChange={(e) => handleOtpChange(i, e.target.value)} />
                ))}
              </div>

              {/* OTP Timer / Resend Link */}
              <div id="timeContainer" className="mb-2 text-center">
                {!canResendOtp ? (
                  <div className="text-sm font-bold text-red-600">
                    Time left: <span id="signUpTimer">{otpTimer}</span> seconds
                  </div>
                ) : (
                  <a id="signUpResendOtpBtn" className="text-sm cursor-pointer underline text-red-600 font-bold" onClick={handleResendOtp}>
                    Resend OTP
                  </a>
                )}
              </div>
            </div>

            <div className="w-full lg:w-6/12 mx-auto pt-4 text-end">
              <button type="button" onClick={validateOtp} className="btn-1 w-32 font-semibold py-2 rounded-md bg-red-600 text-white cursor-pointer" disabled={loading}>
                <i className="ri-loop-right-line"></i>
                <span>Continue</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 6 - Confirm password */}
        {step === 6 && (
          <div className="flex flex-col justify-center items-center h-[calc(100%-4rem)] py-8 px-4">
            <div className="w-full lg:w-6/12 mx-auto mt-8">
              <label htmlFor="owner_password" className="lg:text-3xl text-xl font-bold block mb-4">
                Password
              </label>
              <div className="flex items-center justify-between">
                <input type={showPassword ? "text" : "password"} name="password" className="px-3 block w-full rounded-l-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-red-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 outline-red-500" required value={basicInfoFormData.password} onChange={(e) => setBasicInfoFormData({ ...basicInfoFormData, password: e.target.value })} />
                <button onClick={() => setShowPassword(!showPassword)} type="button" className="w-[48px] h-[48px] flex justify-center items-center bg-red-50 rounded-r-md text-black cursor-pointer border border-l-0 border-red-300">
                  <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
                </button>
              </div>
            </div>

            <div className="w-full lg:w-6/12 mx-auto mt-8">
              <label className="lg:text-3xl text-xl font-bold block mb-4">Confirm Password</label>
              <div className="flex items-center justify-between">
                <input type={showPassword ? "text" : "password"} name="password" className="px-3 block w-full rounded-l-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-red-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 outline-red-500" required value={basicInfoFormData.confirmPassword} onChange={(e) => setBasicInfoFormData({ ...basicInfoFormData, confirmPassword: e.target.value })} />
                <button onClick={() => setShowPassword(!showPassword)} type="button" className="w-[48px] h-[48px] flex justify-center items-center bg-red-50 rounded-r-md text-black cursor-pointer border-l-0 border border-red-300">
                  <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
                </button>
              </div>
            </div>

            <div className="w-full lg:w-6/12 mx-auto pt-4 mt-4 text-end">
              <button type="button" onClick={submitDetail} className="btn-1 w-24 font-semibold py-2 rounded-md bg-red-600 text-white cursor-pointer" disabled={loading}>
                <i className="ri-loop-right-line"></i>
                <span>Submit</span>
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="flex flex-col justify-center items-center h-[calc(100%-4rem)] py-8 px-4">
            <div className="h-full w-full sm:w-1/2 mx-auto flex justify-center items-center flex-col gap-12">
              <div className="text-center text-xl">
                Welcome, <span className="font-bold">{basicInfoFormData.owner_name}</span>, to Stay in Braj!
                <br />
                Your basic store details have been submitted successfully. We're glad to have you take the first step towards joining our marketplace.
                <br />
                To continue your eCommerce store listing process, please click the button below and complete the remaining steps.
              </div>
              <div className="w-full flex justify-center items-center">
                <a href={ENV.links.channelManager} className="px-8 py-4 text-white bg-red-600 hover:bg-red-700 rounded-full shadow-lg text-lg font-bold">
                  Continue Store Listing
                </a>
              </div>
            </div>
          </div>
        )}
        <CountryModal isOpen={countyCodemodalOpen} onClose={() => setCountryCodeModalOpen(false)} onSelectCountry={handleSelectCountry} />
      </section>
    </section>
  );
}
