import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// console.log("main.jsx loading...");

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
