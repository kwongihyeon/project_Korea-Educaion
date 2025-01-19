'use client'
import { useEffect, useState } from "react";
import useCustomFetch from "@/app/lib/customFetch";

type HtmlDocsProps = {
  name : string
}

export default function HtmlDocs(name : HtmlDocsProps) {
  const [content, setContent] = useState<string>("");
  const customFetch = useCustomFetch()
  const language = "korean" // 로컬스토리지에서 가져오는 코드로 변경해야함
  console.log(name.name)

  useEffect(()=>{
    const introData = async ()=>{
      try{
        const data = await customFetch(`/posts?category=${name.name}`,{ // name.name말고 다른식으로 받아오는 방법 생각해야함
          method : "GET"
        })
        console.log(data)
        setContent(data[0].content) // 지금은 배열 형태라서 [0] 수정 해야함
      }catch(error){
        alert(`${name.name}의 글을 불러올수 없습니다`)
        console.error('해당 게시글을 불러올수 없습니다.')
      }
    }
    introData()
  },[])

  return (
    <div className="w-full h-screen">
      <img src="/images/영진소개배너.jpg" className="w-full h-60 mt-4 flex justify-center items-center">
      </img>
      <div className="h-12 border"></div>
      <div className="w-full flex justify-center items-center font-bold text-3xl" style={{height : "200px"}}>
        {name.name}
      </div>
      <div className="w-full h-screen flex justify-center">
      <div className="w-3/5 border"> {/* border쓴 이유는 어느정도 크기인지 확인하려고 */}
      {content}
      </div>
      </div>
    </div>

  );
}
