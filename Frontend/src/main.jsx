import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  "pk_test_51R4FCMCk5YBj75TPca9y9QChNKVMY8x1WIm0Jtg5ELCawp8l2Mlsz3N4JIC8wl6nsv3xhAYtBYPDgMpinv0UMrBL0001H2aAbb"
);

createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
