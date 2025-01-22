'use client'
import React, { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import useCustomFetch from "@/app/lib/customFormFetch";
import { editorCompo, postError } from "@/app/menu";
import Cookies from "js-cookie";

// 미완성

export default function EditorComponent() {
  const editorRef = useRef<any>(null); // tinymce를 직접 조작하는 
  const [content, setContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [title, setTitle] = useState<string>("")
  const customFetch = useCustomFetch()
  const language = Cookies.get("language") || "korean"

  useEffect(() => {
    setIsClient(true);
  }, []);


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
      alert(postError[language]?.subError)
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
          console.error(postError[language]?.imgError);
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
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API}
        init={{
          height: 500,
          plugins: ["lists", "link", "image", "table"],
          toolbar: "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | forecolor backcolor | table",
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
      <button onClick={submit}>{editorCompo[language]?.submit}</button>
    </div>
  );
}
