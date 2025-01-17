'use client'
import { useState } from "react";
import { smallMenu } from "@/app/menu";

export default function HtmlDocs() {
  const [content, setContent] = useState<string>("");
  const language = "korean"

  return (
    <div className="w-full h-screen">
      <div className="w-full flex justify-center items-center font-bold text-3xl" style={{height : "200px"}}>
        {smallMenu[language]?.centerIntro}
      </div>
    </div>

  );
}
