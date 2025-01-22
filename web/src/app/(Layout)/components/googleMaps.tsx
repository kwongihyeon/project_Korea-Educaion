'use client'

import React, { useState, useEffect } from "react";

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

const GoogleMapButton = () => {
  const [isMapVisible, setIsMapVisible] = useState(false);

  useEffect(() => {
    // Google Maps API 스크립트 로드 함수
    const loadScript = (src: string, id: string) => {
      if (!document.getElementById(id)) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        script.id = id;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("Google Maps API 스크립트 로드 완료");
          if (window.google) {
            window.initMap(); // Google Maps 로드 완료 후, 지도 초기화
          }
        };
        script.onerror = () => {
          console.error("Google Maps API 스크립트 로드 실패");
        };
        document.body.appendChild(script);
      }
    };

    // Google Maps API 초기화 함수 정의
    window.initMap = function () {
      const mapElement = document.getElementById("map");
      if (mapElement && window.google) {
        new window.google.maps.Map(mapElement, {
          center: { lat: 37.7749, lng: -122.4194 }, // 샌프란시스코의 좌표
          zoom: 12,
        });
      }
    };

    // Google Maps API 스크립트 URL
    const src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&callback=initMap`;
    loadScript(src, "google-maps-api");
  }, []);

  // 버튼 클릭 시 지도 표시/숨기기 토글
  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };

  return (
    <div>
      <button onClick={toggleMapVisibility}>
        {isMapVisible ? "Hide Map" : "Show Map"}
      </button>

      {isMapVisible && (
        <div id="map" style={{ width: "100%", height: "500px", marginTop: "20px" }} />
      )}
    </div>
  );
};

export default GoogleMapButton;
