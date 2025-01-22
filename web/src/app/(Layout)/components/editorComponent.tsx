'use client'
import React, { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import useCustomFetch from "@/app/lib/customFormFetch";
import parser from "html-react-parser"


export default function EditorComponent() {
  const editorRef = useRef<any>(null); // tinymce를 직접 조작하는 
  const [content, setContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [title, setTitle] = useState<string>("")
  const customFetch = useCustomFetch()

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

        const response = await fetch("/upload", {
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
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API}
        init={{
          height: 500,
          plugins: ["lists", "link", "image"],
          toolbar: "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | forecolor backcolor | custombutton",
          setup: (editor: any) => {
            editor.ui.registry.addButton("custombutton", {
              tooltip: "Insert Google Map",
              text: "Map",
              onAction: insertGoogleMap,
            });
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
      <button onClick={submit}>제출</button>
    </div>
  );
}
