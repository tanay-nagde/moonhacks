import { Document, Model, model, Schema, Types} from "mongoose";

interface IClub{
  name: string;
  description: string;
  logo: string;
  dateOfCreation?: Date;
 
}

interface IClubDocument extends IClub, Document {}
type IClubModel = Model<IClubDocument>;
const ClubSchema = new Schema<IClubDocument>(
  {
    name: { type: String, required: true , unique: true},
    description: { type: String, required: true },
    logo: { type: String, required: true },
    dateOfCreation: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export const Club: IClubModel = model<IClubDocument>("Club", ClubSchema);
