'use client'
import React, { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import useCustomFetch from "@/app/lib/customFormFetch";
import { editorCompo, postError } from "@/app/menu";
import Cookies from "js-cookie";
import useCustomFormFetch from "@/app/lib/customFormFetch";
import { Language } from "@/app/common/types";

// 미완성

export default function EditorComponent() {
  const editorRef = useRef<any>(null); // tinymce를 직접 조작하는 
  const [content, setContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [title, setTitle] = useState<string>("")
  const customFetch = useCustomFetch()
  const customFormFetch = useCustomFormFetch()
  const language : Language = Cookies.get("language") as Language || "korean"

  useEffect(() => {
    setIsClient(true);
  }, []);


  const submit = async() => {
    const formdata = new FormData()
    formdata.append("title",title)
    formdata.append("content",content)
    formdata.append("category","introduction")
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
      console.log(file.name)
      const a = encodeURIComponent(file.name) // 인코딩 했을때의 file.name
      console.log(a)
      console.log(decodeURIComponent(a)) // 디코딩 했을때의 file.name
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        console.log(formData)
  
/*         try {
          const data = await customFormFetch("/attachments", { // 주소 바꿔야함, body랑 헤더를 커스텀 함수를 만들어서 보내는걸로로 변경해야함
            method: "POST",
            body: formData,
          });
          console.log(data.url)
            const imageUrl = decodeURIComponent(data.url)
            console.log(imageUrl)
            if (editorRef.current) {
              editorRef.current.insertContent(`<img src="${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}"/>`);
            }
        } catch (error) {
          alert(postError[language]?.imgError);
        } */
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
