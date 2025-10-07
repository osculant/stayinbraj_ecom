"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.js";
import { useToast } from "../../../context/toast.js";
import "remixicon/fonts/remixicon.css";

import "../../styles/components/loginModal.css";
import { commonLinks, imageLinks, baseUrl } from "../../config/siteConfig";
import CountryModal from "../../components/countyModal/page.js";

const SignInPart = ({ closeLoginModal }) => {
  const { login } = useAuth(),
    { showToast } = useToast(),
    [view, setView] = useState("mobile"), // 'mobile', 'otp', or 'password'
    [usermobile, setUserMobile] = useState("9876543210"),
    [loading, setLoading] = useState(false),
    [showPassword, setShowPassword] = useState(false),
    [selectedCountry, setSelectedCountry] = useState({
      name: "India",
      flag: "https://i.pinimg.com/736x/76/e2/bc/76e2bc3a8c3503f9fdd53aaa924b89e5.jpg",
      code: "IN",
      dial_code: "+91",
    }),
    [countyCodemodalOpen, setCountryCodeModalOpen] = useState(false),
    [timeLeft, setTimeLeft] = useState(60); // seconds

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
  };

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const byPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.target),
      countryCode = selectedCountry.dial_code.replace("+", "");

    fd.set("mobile_no", countryCode + fd.get("mobile_no"));

    try {
      const res = await fetch(`${baseUrl}ecommerce-user-password-signin`, {
        method: "POST",
        headers: {
          access: "stayinbraj2025osculant",
        },
        body: fd,
      });

      const result = await res.json();
      if (result.status) {
        login(result.auth_token);
        closeLoginModal();
        showToast(result.message, "success");
      } else {
        showToast(result.message, "alert");
      }
    } catch (error) {
      showToast("Try again later", "alert");
    }
    setLoading(false);
  };

  const sendOtp = async (e) => {
    e.preventDefault();

    setLoading(true);
    const fd = new FormData(e.target),
      mobileNumber = fd.get("mobile_no"),
      countryCode = selectedCountry.dial_code.replace("+", "");

    fd.set("mobile_no", countryCode + mobileNumber);
    try {
      const res = await fetch(`${baseUrl}ecommerce-send-otp-for-signin`, {
        method: "POST",
        headers: {
          access: "stayinbraj2025osculant",
        },
        body: fd,
      });

      const result = await res.json();
      if (result.status) {
        setUserMobile(mobileNumber);
        setView("otp");
        setTimeLeft(60);
        showToast(result.message, "success");
      } else {
        showToast(result.message, "alert");
      }
    } catch (error) {
      showToast("Try again later", "alert");
    }
    setLoading(false);
  };

  const byOtp = async (e) => {
    e.preventDefault();

    const fd = new FormData(e.target),
      countryCode = selectedCountry.dial_code.replace("+", "");

    fd.append("mobile_no", countryCode + usermobile);

    try {
      const res = await fetch(`${baseUrl}ecommerce-user-otp-signin`, {
        method: "POST",
        headers: {
          access: "stayinbraj2025osculant",
        },
        body: fd,
      });

      const result = await res.json();
      if (result.status) {
        login(result.auth_token);
        closeLoginModal();
        showToast(result.message, "success");
      } else {
        showToast(result.message, "alert");
      }
    } catch (error) {
      showToast("Try again later", "alert");
    }
  };

  const resendOtp = async () => {
    const fd = new FormData(),
      countryCode = selectedCountry.dial_code.replace("+", "");

    fd.append("mobile_no", countryCode + usermobile);

    try {
      const res = await fetch(`${baseUrl}ecommerce-send-otp-for-signin`, {
        method: "POST",
        headers: {
          access: "stayinbraj2025osculant",
        },
        body: fd,
      });

      const result = await res.json();
      if (result.status) {
        setUserMobile(usermobile);
        setView("otp");
        setTimeLeft(60);
        showToast(result.message, "success");
      } else {
        showToast(result.message, "alert");
      }
    } catch (error) {
      showToast("Try again later", "alert");
    }
  };

  return (
    <>
      <div className="w-full">
        {view === "mobile" && (
          <form onSubmit={sendOtp} className="w-full flex-col gap-4 justify-center h-full flex">
            <div className="flex justify-between gap-1 w-full">
              <div onClick={() => setCountryCodeModalOpen(true)} className="flex justify-center items-center gap-1 uppercase w-36 bg-white rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm cursor-pointer">
                <img src={selectedCountry.flag} alt="India Flag" className="w-6 h-4 object-cover" />
                <span className="text-xs text-gray-500">
                  {selectedCountry.code} ({selectedCountry.dial_code})
                </span>
              </div>
              <input type="tel" name="mobile_no" className="px-3 block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 outline-red-500" placeholder="e.g. 9876xxxxxx" required />
            </div>
            <button type="submit" className="btn-1 px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-center rounded-3xl" disabled={loading}>
              <i className="ri-loop-right-line"></i>
              <span>Continue</span>
            </button>
            <button type="button" onClick={() => setView("password")} className="text-red-600 hover:text-gray-800 text-center cursor-pointer">
              Login With Password
            </button>
          </form>
        )}

        {view === "otp" && (
          <form onSubmit={byOtp} className="w-full flex-col gap-4 justify-center h-full flex text-black">
            <p className="text-xs">
              Enter 6 digit OTP sent to <strong>{usermobile}</strong>
              <button type="button" onClick={() => setView("mobile")} className="py-1 px-2 bg-red-50 text-red-600 rounded ms-1 cursor-pointer focus:outline-0 outline-red-500">
                <i className="ri-pencil-line"></i>
              </button>
            </p>
            <input type="number" name="otp" className="px-3 block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 outline-red-500" placeholder="Enter 6-digit OTP" required />
            <button type="submit" className="btn-1 px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-center rounded-3xl" disabled={loading}>
              <i className="ri-loop-right-line"></i>
              <span>Sign In</span>
            </button>
            {timeLeft === 0 ? (
              <button type="button" className="text-center text-sm cursor-pointer underline text-red-600 focus:outline-0 focus:ring-0" onClick={resendOtp} disabled={loading}>
                Resend OTP
              </button>
            ) : (
              <div className="text-center text-xs text-gray-500">Time left: {formatTime(timeLeft)} seconds</div>
            )}
          </form>
        )}

        {view === "password" && (
          <form onSubmit={byPassword} className="flex w-full flex-col gap-4 justify-center h-full">
            <div className="flex justify-between gap-1 w-full">
              <div onClick={() => setCountryCodeModalOpen(true)} className="flex justify-center items-center gap-1 uppercase w-36 bg-white rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:leading-6 sm:text-sm cursor-pointer">
                <img src={selectedCountry.flag} alt="India Flag" className="w-6 h-4 object-cover" />
                <span className="text-xs text-gray-500">
                  {selectedCountry.code} ({selectedCountry.dial_code})
                </span>
              </div>
              <input type="tel" name="mobile_no" className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-0 placeholder:text-gray-400 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 outline-red-500" placeholder="e.g. 9876xxxxxx" required />
            </div>
            <div className="flex items-center justify-between">
              <input type={showPassword ? "text" : "password"} name="password" className="px-3 block w-full rounded-l-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 outline-red-500" required />
              <button onClick={() => setShowPassword(!showPassword)} type="button" className="w-[48px] h-[40px] flex justify-center items-center bg-gray-100 rounded-r-md text-black cursor-pointer">
                <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
              </button>
            </div>
            <button type="submit" className="btn-1 px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-center rounded-3xl" disabled={loading}>
              <i className="ri-loop-right-line"></i>
              <span>Sign In</span>
            </button>
            <button type="button" onClick={() => setView("mobile")} className="text-red-600 hover:text-gray-800 text-center cursor-pointer">
              Login With OTP
            </button>
          </form>
        )}
      </div>
      <CountryModal isOpen={countyCodemodalOpen} onClose={() => setCountryCodeModalOpen(false)} onSelectCountry={handleSelectCountry} />
    </>
  );
};

const SignUpPart = ({ closeLoginModal }) => {
  const [view, setView] = useState("mobile"),
    { showToast } = useToast(),
    { login } = useAuth(),
    [usermobile, setUserMobile] = useState("9876543210"),
    [userEmail, setUserEmail] = useState("xyz@stayinbraj.com"),
    [loading, setLoading] = useState(false),
    [selectedCountry, setSelectedCountry] = useState({
      name: "India",
      flag: "https://i.pinimg.com/736x/76/e2/bc/76e2bc3a8c3503f9fdd53aaa924b89e5.jpg",
      code: "IN",
      dial_code: "+91",
    }),
    [countyCodemodalOpen, setCountryCodeModalOpen] = useState(false),
    [timeLeft, setTimeLeft] = useState(60);

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
  };

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.target),
      mobile_no = fd.get("mobile_no"),
      email_id = fd.get("email_id"),
      countryCode = selectedCountry.dial_code.replace("+", "");

    fd.set("mobile_no", countryCode + mobile_no);

    try {
      const res = await fetch(`${baseUrl}ecommerce-user-signup-otp`, {
        method: "POST",
        headers: {
          access: "stayinbraj2025osculant",
        },
        body: fd,
      });

      const result = await res.json();
      if (result.status) {
        setView("otp");
        setUserMobile(mobile_no);
        setUserEmail(email_id);
        setTimeLeft(60);
        showToast(result.message, "success");
      } else {
        showToast(result.message, "alert");
      }
    } catch (error) {
      showToast("Try again later", "alert");
    }

    setLoading(false);
  };

  const signup = async (e) => {
    e.preventDefault();

    const fd = new FormData(e.target),
      countryCode = selectedCountry.dial_code.replace("+", "");

    fd.append("mobile_no", countryCode + usermobile);
    fd.append("email_id", userEmail);

    try {
      const res = await fetch(`${baseUrl}ecommerce-user-signup`, {
        method: "POST",
        headers: {
          access: "stayinbraj2025osculant",
        },
        body: fd,
      });

      const result = await res.json();
      if (result.status) {
        login(result.auth_token);
        closeLoginModal();
        showToast(result.message, "success");
      } else {
        showToast(result.message, "alert");
      }
    } catch (error) {
      showToast("Try again later", "alert");
    }
  };

  const resendOtp = async () => {
    const fd = new FormData(),
      countryCode = selectedCountry.dial_code.replace("+", "");

    fd.append("mobile_no", countryCode + usermobile);
    fd.append("email_id", userEmail);

    try {
      const res = await fetch(`${baseUrl}ecommerce-user-signup-otp`, {
        method: "POST",
        headers: {
          access: "stayinbraj2025osculant",
        },
        body: fd,
      });

      const result = await res.json();
      if (result.status) {
        setUserMobile(usermobile);
        setUserEmail(userEmail);
        setView("otp");
        setTimeLeft(60);
        showToast(result.message, "success");
      } else {
        showToast(result.message, "alert");
      }
    } catch (error) {
      showToast("Try again later", "alert");
    }
  };

  return (
    <>
      <div className="w-full">
        {view == "mobile" && (
          <form onSubmit={sendOtp} className="w-full flex flex-col gap-4 justify-center h-full">
            <div className="w-full">
              <input id="email" type="email" name="email_id" className="px-3 block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 outline-red-500" placeholder="stayinbraj@gmail.com" required />
            </div>
            <div className="flex justify-between gap-1 w-full">
              <div onClick={() => setCountryCodeModalOpen(true)} className="flex justify-center items-center gap-1 uppercase w-36 bg-white rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 cursor-pointer outline-red-500">
                <img src={selectedCountry.flag} alt="India Flag" className="w-6 h-4 object-cover" />
                <span className="text-xs text-gray-500">
                  {selectedCountry.code} ({selectedCountry.dial_code})
                </span>
              </div>
              <input type="tel" name="mobile_no" className="px-3 block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 outline-red-500" placeholder="e.g. 9876xxxxxx" required />
            </div>

            <button type="submit" className="btn-1 px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-center rounded-3xl focus:outline-0 focus:ring-0" disabled={loading}>
              <i className="ri-loop-right-line"></i>
              <span>Continue</span>
            </button>
          </form>
        )}

        {view === "otp" && (
          <form onSubmit={signup} className="w-full flex-col gap-4 justify-center h-full flex text-black">
            <p className="text-xs">
              Enter 6 digit OTP sent to{" "}
              <strong>
                {usermobile} and {userEmail}
              </strong>
              <button type="button" onClick={() => setView("mobile")} className="py-1 px-2 bg-red-50 text-red-600 rounded ms-1 cursor-pointer focus:outline-0 outline-red-500">
                <i className="ri-pencil-line"></i>
              </button>
            </p>
            <input type="number" name="otp" className="px-3 block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 outline-red-500" placeholder="Enter 6-digit OTP" required />
            <button type="submit" className="btn-1 px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-center rounded-3xl" disabled={loading}>
              <i className="ri-loop-right-line"></i>
              <span>Sign In</span>
            </button>
            {timeLeft === 0 ? (
              <button type="button" className="text-center text-sm cursor-pointer underline text-red-600 focus:outline-0 focus:ring-0" onClick={resendOtp} disabled={loading}>
                Resend OTP
              </button>
            ) : (
              <div className="text-center text-xs text-gray-500">Time left: {formatTime(timeLeft)} seconds</div>
            )}
          </form>
        )}
      </div>

      <CountryModal isOpen={countyCodemodalOpen} onClose={() => setCountryCodeModalOpen(false)} onSelectCountry={handleSelectCountry} />
    </>
  );
};

const LoginModal = ({ isOpen, isClose }) => {
  const [formTab, setFormTab] = useState("signin");

  return isOpen ? (
    <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[55] w-full md:inset-0 h-screen justify-center items-center bg-[#00070a82]">
      <div className="relative p-4 w-full h-full flex justify-center items-center">
        <div className="relative rounded-lg flex w-[25rem] sm:w-[50rem] h-[32rem]">
          {/* Left Info Card */}
          <div id="loginCard" className="hidden sm:block basis-full sm:basis-1/2 bg-white rounded-xl shadow-lg p-6 my-4 translate-x-4 z-8">
            <h3 className="text-base uppercase text-gray-900">Find Your Perfect Deal Here!</h3>
            <div className="flex flex-col gap-4 my-8 w-full">
              {[
                {
                  src: imageLinks.modalBookingImg,
                  title: "Online Hotel Booking",
                  desc: "Exclusive Deals: Save More on Your Next Booking",
                },
                {
                  src: imageLinks.modalPropertyImg,
                  title: "Rent/Purchase Property",
                  desc: "Exclusive Cashback on Your Booking",
                },
                {
                  src: imageLinks.modalFoodImg,
                  title: "Online Food Order",
                  desc: "Savor Your First Meal with Exclusive Discounts",
                },
              ].map((item, index) => (
                <div className="flex w-full" key={index}>
                  <div className="basis-1/4 px-2">
                    <img src={item.src} alt={item.title} />
                  </div>
                  <div className="basis-3/4 px-2 pb-2 border-b border-gray-600">
                    <h2 className="font-bold capitalize text-lg text-gray-800">{item.title}</h2>
                    <p className="text-sm text-gray-900">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Form Section */}
          <div className="basis-full sm:basis-1/2 bg-white rounded-xl shadow-lg p-4 sm:p-5 z-10 h-full overflow-y-auto">
            <div className="tabs flex items-center justify-between p-4 md:p-5 border-b border-gray-600 rounded-t gap-2 sm:gap-4">
              <label onClick={() => setFormTab("signin")} className={`basis-2/4 p-2 ${formTab == "signin" ? "bg-[#dc2626] text-white" : "bg-white text-[#dc2626]"} text-center cursor-pointer rounded-3xl shadow-lg ff-p`}>
                Sign In
                <input type="radio" name="test" value="1" hidden defaultChecked />
              </label>
              <label onClick={() => setFormTab("signup")} className={`basis-2/4 py-2 ${formTab == "signup" ? "bg-[#dc2626] text-white" : "bg-white text-[#dc2626]"} px-0 sm:px-2 text-center cursor-pointer rounded-3xl shadow-lg ff-p`}>
                Sign Up
                <input type="radio" name="test" value="2" hidden />
              </label>
            </div>

            {/* Body Content */}
            <div className="p-4 md:p-5 flex">{formTab == "signin" ? <SignInPart closeLoginModal={isClose} /> : <SignUpPart closeLoginModal={isClose} />}</div>

            {/* Footer */}
            <div className="my-4 flex self-end">
              <p className="p-0 text-[0.6rem] text-center text-black">
                By proceeding, you agree to Stayinbraj{" "}
                <a href={commonLinks.privacyPolicy} className="text-red-600 hover:underline hover:text-red-700">
                  Privacy Policy
                </a>
                , User Agreement and{" "}
                <a href={commonLinks.termAndCondition} className="text-red-600 hover:underline hover:text-red-700">
                  Terms of Service
                </a>
              </p>
            </div>
          </div>

          {/* Close Button */}
          <div className="absolute top-0 right-0 w-6 h-6 rounded-full shadow-lg text-red-600 z-20 translate-x-2 -translate-y-2 bg-white flex justify-center items-center hover:bg-red-600 hover:text-white duration-300">
            <button onClick={isClose} type="button" className="cursor-pointer">
              <i className="ri-close-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default LoginModal;
