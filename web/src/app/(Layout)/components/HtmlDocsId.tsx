'use client'
import { useEffect, useState } from "react";
import useCustomFetch from "@/app/lib/customFetch";
import { guidanceMenu } from "@/app/menu";
import parser from "html-react-parser"
import { getError } from "@/app/menu";
import Cookies from "js-cookie";

type HtmlDocsPropsId = {
  id : string
  // [key in "id" | "category" ]: string;
}

export default function HtmlDocsId({id} : HtmlDocsPropsId) {
  const [content, setContent] = useState<string>("");
  const customFetch = useCustomFetch()
  const language = Cookies.get('language') || "korean"
  
  console.log(id)

  useEffect(()=>{
    const introData = async ()=>{
      try{
        const data = await customFetch(`/posts?id=${id}`,{
          method : "GET"
        })
        console.log(data)
        setContent(data.data.content)

      }catch(error){
        alert(getError[language]?.boardError)
        console.error(getError[language]?.boardError)
      }
    }
    introData()
  },[])

  return (
    <div className="w-full h-screen">
      <div className="h-12 border"></div>
      <div className="w-full flex justify-center items-center font-bold text-3xl" style={{height : "200px"}}>
      </div>
      <div className="w-full h-screen flex justify-center">
      <div className="w-3/5 border"> {/* border쓴 이유는 어느정도 크기인지 확인하려고 */}
      {parser(content)}
      </div>
      </div>
    </div>

  );
}
