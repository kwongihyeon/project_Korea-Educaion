import { guidanceMenu } from "../menu"

const language = "korean"

export interface HtmlDocsProps {
  category : keyof typeof guidanceMenu["korean"]
  //[key in "id" | "category" ]: string;
}

export interface MenuType {
  [key: string]: { [key: string]: string } 
}

