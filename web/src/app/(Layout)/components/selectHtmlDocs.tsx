'use client';
import { useEffect, useState } from "react";
import useCustomFetch from "@/app/lib/customFetch";
import parser from "html-react-parser";

type HtmlDocsProps = {
  title: string; // 제목 (guidanceMenu에서 가져온 값)
  menu: Record<string, string>; // 메뉴 (koreanCurriculumMenu)
};

export default function SelectHtmlDocs({ title, menu }: HtmlDocsProps) {
  const menuKeys = Object.keys(menu); // 메뉴의 키값 배열
  const [selectMenu, setSelectMenu] = useState<string>(menuKeys[0]); // 기본값은 첫 번째 키값
  const [content, setContent] = useState<string>(""); // 컨텐츠 내용
  const customFetch = useCustomFetch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await customFetch(`/posts?category=${selectMenu}`, {
          method: "GET",
        });
        setContent(data.data.content); // 데이터 가져오기
      } catch (error) {
        alert(`${title}의 글을 불러올 수 없습니다.`);
        console.error("해당 게시글을 불러올 수 없습니다.");
      }
    };
    fetchData();
  }, [selectMenu, customFetch, title]);

  const selectSmallmenu = (item: string) => {
    setSelectMenu(item); // 선택한 메뉴 변경
  };

  return (
    <div className="w-full h-screen">
      <div className="h-12 border"></div>
      {/* 제목 부분 */}
      <div className="w-full flex justify-center items-center font-bold text-3xl" style={{ height: "200px" }}>
        {title} {/* guidanceMenu에서 전달받은 제목 */}
      </div>
      {/* 메뉴 버튼 */}
      <div className="flex flex-wrap w-2/4 mx-auto">
        {menuKeys.map((key, index) => (
          <div key={index} className="w-1/4 p-0.5 text-white">
            <div
              className={`border p-2 flex items-center justify-center text-center font-bold ${
                selectMenu === key ? "bg-sky-600" : "bg-sky-300"
              }`}
              onClick={() => selectSmallmenu(key)} // 키값 전달
            >
              {menu[key]} {/* koreanCurriculumMenu의 값 */}
            </div>
          </div>
        ))}
      </div>
      {/* 컨텐츠 영역 */}
      <div className="w-full h-screen flex justify-center">
        <div className="w-3/5 border">{parser(content)}</div>
      </div>
    </div>
  );
}
