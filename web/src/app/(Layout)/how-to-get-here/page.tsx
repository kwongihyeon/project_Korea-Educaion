import HtmlDocs from "../components/htmlDocs";
import { smallMenu } from "@/app/menu";

export default function howToGetHere() {
  const name = smallMenu["korean"].howToGetHere

  return (
    <main className="w-full h-screen flex justify-center items-center">
      <HtmlDocs name={name}/>
    </main>
  );
}
