'use client'
import React, { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import useCustomFetch from "@/app/lib/customFormFetch";
import parser from "html-react-parser"


// 미완성

export default function EditorComponent() {
  const editorRef = useRef<any>(null);
  const [content, setContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [title, setTitle] = useState<string>("")
  const customFetch = useCustomFetch()

  const [isMapVisible, setIsMapVisible] = useState(false);  // 구글 맵 관련 상태

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 구글 맵 API를 한 번만 로드하는 함수
  useEffect(() => {
    // Google Maps API 로드 함수
    const loadGoogleMapsAPI = () => {
      const scriptId = "google-maps-api";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.id = scriptId;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        // 글로벌 함수 초기화
        window.initMap = () => {
          console.log("Google Map API Loaded");
        };
      }
    };

    loadGoogleMapsAPI();
  }, []);

  const insertGoogleMap = () => {
    const iframeHtml = `
      <div class="google-map-container" style="width: 100%; height: 500px; position: relative;">
        <iframe 
          src="https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_EMBED_API_KEY}&q=San+Francisco"
          width="100%" 
          height="100%" 
          style="border:0;" 
          allowfullscreen=""
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups">
        </iframe>
      </div>
    `;
    if (editorRef.current) {
      editorRef.current.insertContent(iframeHtml);
    }
  };

  const submit = async() => {
    const formdata = new FormData()
    formdata.append("title",title)
    formdata.append("content",content)
    formdata.append("category","review")
    formdata.append("language","korean")

    try{const response = await customFetch(`/posts`, {
      method : 'POST',
      body : formdata
    })
    console.log(response)}

    catch(error){
      alert('그 요청 안된다')
    }
  }


  const handleFileSelect = async () => {
    const input = fileInputRef.current;
    if (input && input.files) {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/attachments", { // 주소 바꿔야함, body랑 헤더를 커스텀 함수를 만들어서 보내는걸로로 변경해야함
          method: "POST",
          body: formData,
        });
        // 반환받은 이미지url을 쿠키에 저장해놓고 업로드 버튼을 누를때 쿠키에서 이미지ur을 가져와서 백엔드로 보내줘야함
        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.url;
          if (editorRef.current) {
            editorRef.current.insertContent(`<img src="${imageUrl}"/>`);
          }
        } else {
          console.error("업로드에 실패했습니다.");
        }
      }
    }
  };

  if (!isClient) {
    return null;
  }

  const onChange = (e : any)=>{
    setTitle(e.target.value)
    console.log(title)
  }


  return (
    <div style={{ width: "60%" }}>
      <input className="w-40 border-2" onChange={onChange}></input>
      <Editor
        apiKey={process.env.TINYMCE_API_KEY}
        init={{
          height: 500,
          plugins: ["lists", "link", "image", "table"],
          toolbar: "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | forecolor backcolor | table",
          onInit: (_: any, editor: any) => {
            editorRef.current = editor;
          },
          file_picker_types: "image",
          file_picker_callback: () => {
            fileInputRef.current?.click();
          },
        }}
        onEditorChange={(item) => {
          setContent(item);
          console.log(content);
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
      <button onClick={submit}>제출</button>
    </div>
  );
}
