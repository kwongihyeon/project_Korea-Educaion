import HtmlDocs from "../components/htmlDocs";
import { smallMenu } from "@/app/menu";

export default function CenterIntro() {
  const name = smallMenu["korean"].centerIntro

  return (
    <main className="w-full h-screen flex justify-center items-center">
      <HtmlDocs name={name}/>
    </main>
  );
}
