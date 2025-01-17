'use client'
import React, { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function EditorComponent() {
  const editorRef = useRef<any>(null); // tinymce를 직접 조작하는 
  const [content, setContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const contentChange = (e: any) => {
    setContent(e.target.getContent());
    console.log(content);
  }

  const handleFileSelect = async () => {
    const input = fileInputRef.current;
    if (input && input.files) {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/upload", {
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
          onChange: contentChange,
          file_picker_types: "image", // 파일 선택기에서 다룰 파일 형식
          file_picker_callback: (callback) => {
            fileInputRef.current?.click(); 
          },
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
