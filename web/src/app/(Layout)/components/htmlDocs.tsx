'use client'
import { useEffect, useState } from "react";
import useCustomFetch from "@/app/lib/customFetch";
import { guidanceMenu } from "@/app/menu";
import parser from "html-react-parser"

type HtmlDocsProps = {
  name : keyof typeof guidanceMenu["korean"]
  // name : string // string으로 받고 name을 그대로 쓰면 한국어의 제목이 아닌 영어제목 그대로 나옴, 다른 방법있으면 그거 쓰기기
}

export default function HtmlDocs({name} : HtmlDocsProps) {
  const [content, setContent] = useState<string>("");
  const customFetch = useCustomFetch()
  const language = "korean" // 로컬스토리지에서 가져오는 코드로 변경해야함
  console.log(name)

  useEffect(()=>{
    const introData = async ()=>{
      try{
        const data = await customFetch(`/posts?category=${name}`,{ // korean을 하드코딩이 아닌 로컬스토리지에서 받아오는 식으로 수정
          method : "GET"
        })
        console.log(data)
        setContent(data[0].content) // 지금은 배열 형태라서 [0] 수정 해야함
      }catch(error){
        alert(`${guidanceMenu[language]?.[name]}의 글을 불러올수 없습니다`)
        console.error('해당 게시글을 불러올수 없습니다.')
      }
    }
    introData()
  },[])

  return (
    <div className="w-full h-screen">
      <div className="h-12 border"></div>
      <div className="w-full flex justify-center items-center font-bold text-3xl" style={{height : "200px"}}>
        {guidanceMenu[language]?.[name]}

      </div>
      <div className="w-full h-screen flex justify-center">
      <div className="w-3/5 border"> {/* border쓴 이유는 어느정도 크기인지 확인하려고 */}
      {parser(content)}
      </div>
      </div>
    </div>

  );
}
