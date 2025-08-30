import React from "react";
import "@google/model-viewer";
import { API_URL } from "@/api/client";

interface ModelViewer3DProps {
  glbUrl: string;
  alt?: string;
  height?: string | number;
  style?: React.CSSProperties;
}

const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  glbUrl,
  alt = "3D Model",
  height = "400px",
  style = {},
}) => {
  return (
    <div style={{ position: "relative" }}>
      <model-viewer
        src={API_URL + glbUrl}
        alt={alt}
        auto-rotate
        camera-controls
        ar
        ar-modes="scene-viewer quick-look webxr"
        environment-image="neutral"
        shadow-intensity="1"
        loading="lazy"
        style={{
          width: "100%",
          height,
          borderRadius: "16px",
          boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
          ...style,
        }}
      ></model-viewer>
    </div>
  );
};

export default ModelViewer3D;
