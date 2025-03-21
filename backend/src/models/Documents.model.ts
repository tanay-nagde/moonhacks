import { Document, Model, model, Schema } from "mongoose";

interface IDocument {
  clubId: string; // Foreign key to Clubs collection
  title: string; // Document title
  content: string; // Document content (large text)
  authorId: string; // Foreign key to Users collection
}

interface IDocumentDocument extends IDocument, Document {}
type IDocumentModel = Model<IDocumentDocument>;

const DocumentSchema = new Schema<IDocumentDocument>(
  {
    clubId: { type: String, required: true, ref: "Club" }, // References Clubs collection
    title: { type: String, required: true }, // Document title
    content: { type: String, required: true }, // Large text content
    authorId: { type: String, required: true, ref: "User" }, // References Users collection
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export const DocumentModel: IDocumentModel = model<IDocumentDocument>(
  "Document",
  DocumentSchema
);
