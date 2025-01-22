import { guidanceMenu, koreanCurriculumMenu } from "@/app/menu";
import SelectHtmlDocs from "../../components/selectHtmlDocs";

interface GuidancePageProps {
  params: {
    category: keyof typeof guidanceMenu["korean"]; // 카테고리 값
  };
}

export default function GuidancePage({ params }: GuidancePageProps) {
  const { category } = params;

  // 제목 가져오기: guidanceMenu에서 해당 카테고리의 이름
  const title = guidanceMenu.korean[category];

  // 메뉴: koreanCurriculumMenu 사용
  const menu = koreanCurriculumMenu.korean;

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <SelectHtmlDocs title={title} menu={menu} />
    </div>
  );
}
