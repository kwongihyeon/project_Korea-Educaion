'use client'
import React, { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

// 미완성

export default function EditorComponent() {
  const editorRef = useRef<any>(null); // tinymce를 직접 조작하는 
  const [content, setContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleFileSelect = async () => {
    const input = fileInputRef.current;
    if (input && input.files) {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/upload", { // 주소 바꿔야함, body랑 헤더를 커스텀 함수를 만들어서 보내는걸로로 변경해야함
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.url;
          if (editorRef.current) {
            editorRef.current.insertContent(`<img src="${imageUrl}" alt="${file.name}" />`);
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

  return (
    <div style={{ width: "60%" }}>
      <Editor
        apiKey="dkxgo7v9zvu93g67zowihgqjppgbxr7n3muiqmciqyc4drfq"
        init={{
          height: 500,
          plugins: ["lists", "link", "image"],
          toolbar: "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | forecolor backcolor",
          onInit: (_: any, editor: any) => {
            editorRef.current = editor;
          },
          file_picker_types: "image", // 파일 선택기에서 다룰 파일 형식
          file_picker_callback: () => {
            fileInputRef.current?.click(); 
          },
        }}
        onEditorChange={(item)=>{
          setContent(item)
          console.log(content)
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
    </div>
  );
}
