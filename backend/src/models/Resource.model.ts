import { Document, Model, model, Schema } from "mongoose";

export enum ResourceType {
    HARDWARE = "hardware", // Physical devices like Raspberry Pi, Arduino, etc.
    SOFTWARE = "software", // Licensed tools, development environments
    COMPONENTS = "components", // Electronic components like sensors, resistors
    FUNDING = "funding", // Financial support for projects
    VENUE = "venue", // Lab or event space
    DOCUMENTATION = "documentation", // Guides, research papers, or reports
    OTHER = "other", // Any other type of resource
  }
  
  export enum ResourceStatus {
    AVAILABLE = "available",
    RESERVED = "reserved",
    IN_USE = "in-use",
  }
  

interface IResource {
  name: string;
  type: ResourceType; // Use the exported enum
  clubId: string;
  allocatedTo?: string | null;
  status: ResourceStatus; // Use the exported enum
}

interface IResourceDocument extends IResource, Document {}
type IResourceModel = Model<IResourceDocument>;

const ResourceSchema = new Schema<IResourceDocument>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(ResourceType), // Use enum values
      required: true,
    },
    clubId: { type: String, required: true, ref: "Club" },
    allocatedTo: { type: String, ref: "User", default: null },
    status: {
      type: String,
      enum: Object.values(ResourceStatus), // Use enum values
      required: true,
      default: ResourceStatus.AVAILABLE,
    },
  },
  { timestamps: true }
);

export const Resource: IResourceModel = model<IResourceDocument>(
  "Resource",
  ResourceSchema
);
