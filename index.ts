import notifier from "node-notifier";
import axios from "axios";

let intervalId: NodeJS.Timeout;

const COOKIE = "";
const SOCIAL_SECURITY_NUMBER = ""; // YYYYMMDD-XXXX Swedish personal number
const START_DATE = "2023-08-13";
const END_DATE = "2023-08-23";
const LOCATION_ID = 1000134;
// 1000134 -solletuna
// 1000326 - jarfalla

var options = {
  method: "POST",
  url: "https://fp.trafikverket.se/Boka/occasion-bundles",
  headers: {
    Accept: "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    Connection: "keep-alive",
    "Content-Type": "application/json",
    Cookie: COOKIE,
    Origin: "https://fp.trafikverket.se",
    Referer: "https://fp.trafikverket.se/Boka/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua":
      '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
  },
  data: {
    bookingSession: {
      socialSecurityNumber: SOCIAL_SECURITY_NUMBER,
      licenceId: 5,
      bookingModeId: 0,
      ignoreDebt: false,
      ignoreBookingHindrance: false,
      examinationTypeId: 0,
      excludeExaminationCategories: [],
      rescheduleTypeId: 0,
      paymentIsActive: false,
      paymentReference: null,
      paymentUrl: null,
      searchedMonths: 0,
    },
    occasionBundleQuery: {
      startDate: "1970-01-01T00:00:00.000Z",
      searchedMonths: 0,
      locationId: 1000134,
      nearbyLocationIds: [],
      languageId: 0,
      vehicleTypeId: 4,
      tachographTypeId: 1,
      occasionChoiceId: 1,
      examinationTypeId: 12,
    },
  },
};

const run = async () => {
  const response = await axios.request(options);
  const availableDate = new Date(
    response.data.data.bundles[0].occasions[0].date
  );

  console.log(availableDate);

  //exclusive dates
  const startDate = new Date(START_DATE);
  const endDate = new Date(END_DATE);

  if (startDate < availableDate && endDate > availableDate) {
    notifier.notify({
      title: "Date available",
      message: String(availableDate),
      timeout: 30000,
    });
    clearInterval(intervalId);
  }
};

const main = async () => {
  // Set the interval for printing the message (1 minute = 60,000 milliseconds)
  const interval = 60 * 1000; // 1 minute in milliseconds

  // Call the printMessage function every 1 minute
  intervalId = setInterval(run, interval);
};

main();

process.on("SIGINT", function () {
  console.log("\ngracefully shutting down from  SIGINT (Crtl-C)");
  // some other closing procedures go here
  process.exit();
});
