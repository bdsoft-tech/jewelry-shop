import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1f2a24",
          border: "1.5px solid #d7b56d",
          borderRadius: "10px",
          boxSizing: "border-box",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3.5L4.5 9.5L12 20.5L19.5 9.5L12 3.5Z"
            stroke="#d7b56d"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 9.5H19.5M8.5 3.5L12 9.5L15.5 3.5M6.5 15L12 9.5L17.5 15"
            stroke="#f6e2a6"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    },
  );
}
