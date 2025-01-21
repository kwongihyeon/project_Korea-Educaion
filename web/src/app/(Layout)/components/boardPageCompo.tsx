'use client'

import useCustomFetch from "@/app/lib/customFetch"
import { boardMenu } from "@/app/menu"
import { useEffect, useState } from "react"


type BoardPageProps = {
  name : keyof typeof boardMenu["korean"]
}

interface BoardData {
  id : string,
  title : string,
  content : string,
  author : string,
  createAt : string,
  category : string

}

export default function BoardPageCompo({name} : BoardPageProps){
  const customFetch = useCustomFetch()
  const [sort, setSort] = useState<string>("제목")
  const [boardData, setBoardData] = useState<BoardData[]>([])

  useEffect(()=>{
    const fetchBoard = async ()=>{
      try{
        const data = await customFetch(`/posts?category=${name}`,{ // 주소 바꿔야함 `posts/{name}?limit=10&page=1
          method : "GET"
        })
        console.log(data)
        setBoardData(data)  
      }catch(error){
        alert(`${name}의 글을 불러오지 못했습니다.`)
        console.error('게시글들을 불러올수 없습니다.')
      }
    }
    fetchBoard()
  },[])

  return (
    <div className="w-full h-screen">
      <div className="w-full flex justify-center items-center font-bold text-3xl" style={{height : "200px"}}>
        {boardMenu["korean"]?.[name]}
      </div>
      <div className="w-full flex pl-40">
        <div className="w-2/5 flex justify-evenly">
        <select
        className="w-28 h-8 border-2 border-black rounded" 
        value={sort}
        onChange={(e)=>{setSort(e.target.value)}}> {/* 하드코딩말고 import로 가져오는형식으로 바꿔야함 -> 얘도 menu.tsx같은 파일에 저장? */}
          <option value={"제목"}>제목</option>
          <option value={"내용"}>내용</option>
          <option value={"작성일"}>작성일</option>
        </select>
        <input className="w-60 h-8 border-2 border-black rounded pl-2 ml-2"
        placeholder="제목을 입력하세요">
        </input>
        <button className="min-w-12 bg-[#0093EE] text-white ml-2">
          검색
        </button>
        </div>
        <div className="w-3/5 flex justify-center">
          <button className="w-16 bg-[#0093EE] text-white">
            작성
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
  <div className="w-4/5 h-16 border-x-0 border-y-2 border-black mt-12 flex items-center">
    <div className="w-1/5 font-bold pl-10">순번</div>
    <div className="w-2/5 font-bold flex justify-center">제목</div>
    <div className="w-1/5 font-bold flex justify-center">작성자</div>
    <div className="w-1/5 font-bold flex justify-center">작성일</div>
  </div>
  {boardData.map((item, index) => (
    <div
      key={index}
      className="w-4/5 h-16 border-b-2 border-black flex items-center"
    >
      <div className="w-1/5 pl-12">{item.id}</div>
      <div className="w-2/5">{item.title}</div>
      <div className="w-1/5 flex justify-center">{item.author}</div>
      <div className="w-1/5 flex justify-center">{item.createAt}</div>
    </div>
  ))}
</div>
    </div>
  )
}