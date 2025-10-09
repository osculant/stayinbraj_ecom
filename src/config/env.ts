export const ENV = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER,
  email: process.env.NEXT_PUBLIC_EMAIL?.trim(),

  imageLinks: {
    logo: process.env.NEXT_PUBLIC_LOGO,
    modalBookingImg: process.env.NEXT_PUBLIC_MODAL_BOOKING_IMG,
    modalPropertyImg: process.env.NEXT_PUBLIC_MODAL_PROPERTY_IMG,
    modalFoodImg: process.env.NEXT_PUBLIC_MODAL_FOOD_IMG,
  },

  links: {
    company: process.env.NEXT_PUBLIC_COMPANY_LINK,
    web: process.env.NEXT_PUBLIC_WEB_LINK,
    aboutUs: process.env.NEXT_PUBLIC_ABOUT_US,
    contactUs: process.env.NEXT_PUBLIC_CONTACT_US,
    vendorListing: process.env.NEXT_PUBLIC_VENDOR_LISTING,
    travelAgentListing: process.env.NEXT_PUBLIC_TRAVEL_AGENT_LISTING,
    privacyPolicy: process.env.NEXT_PUBLIC_PRIVACY_POLICY,
    terms: process.env.NEXT_PUBLIC_TERMS_CONDITIONS,
    refund: process.env.NEXT_PUBLIC_RETURN_REFUND,
    foodNav: process.env.NEXT_PUBLIC_FOOD_NAV_LINK,
    propertyNav: process.env.NEXT_PUBLIC_PROPERTY_NAV_LINK,
    comingSoon: process.env.NEXT_PUBLIC_COMMING_SOON,
    userRoomBooking: process.env.NEXT_PUBLIC_USER_ROOM_BOOKING,

    userFoodOrders: process.env.NEXT_PUBLIC_USER_FOOD_ORDERS,
    userPropertyEnquiry: process.env.NEXT_PUBLIC_USER_PROPERTY_ENQUIRY,
    channelManager: process.env.NEXT_PUBLIC_CHANNEL_MANAGER,
  },
};
