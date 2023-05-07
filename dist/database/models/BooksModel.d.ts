import { Model } from "./Model";
type TBook = {
    skill: String;
    volume: Number;
};
declare const Books: Model<TBook>;
export { Books };
