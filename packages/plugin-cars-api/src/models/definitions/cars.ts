import { Schema, Document } from "mongoose";
import { CAR_SELECT_OPTIONS } from "./constants";
import { schemaHooksWrapper } from "./utils";

const getEnum = (fieldName: string): string[] => {
  return CAR_SELECT_OPTIONS[fieldName].map((option) => option.value);
};

export interface ICar {}

export interface ICarDocument extends ICar, Document {
  _id: string;
  createdAt: Date;
}

export interface ICarCategory {
  name: string;
  code: string;
  parentId?: string;
  description?: string;
}

export interface ICarCategoryDocument extends ICarCategory, Document {
  _id: string;
  order?: string;
  createdAt: Date;
}

export const carCategorySchema = schemaHooksWrapper(
  new Schema({
    _id: { pkey: true },
    name: { type: String, label: "Name" },
    code: { type: String, unique: true, label: "Code" },
    order: { type: String, label: "Order" },
    parentId: { type: String, optional: true, label: "Parent" },
    description: { type: String, optional: true, label: "Description" },
    createdAt: {
      type: Date,
      default: new Date(),
      label: "Created at",
    },
  }),
  "erxes_carCategory"
);

const attachmentSchema = new Schema(
  {
    name: String,
    url: String,
    type: String,
    size: Number,
  },
  { _id: false }
);

export const carSchema = schemaHooksWrapper(
  new Schema({
    _id: { pkey: true },

    createdAt: { type: Date, label: "Created at" },

    modifiedAt: { type: Date, label: "Modified at" },

    ownerId: { type: String, optional: true, label: "Owner" },

    plateNumber: {
      type: String,
      optional: true,
      label: "Plate number",
      index: true,
    },

    vinNumber: {
      type: String,
      label: "VIN number",
      optional: true,
      index: true,
    },

    colorCode: { type: String, label: "Color code", optional: true },

    categoryId: { type: String, label: "Category", index: true },

    bodyType: {
      type: String,
      enum: getEnum("BODY_TYPES"),
      default: "",
      optional: true,
      label: "Brand",
      esType: "keyword",
      selectOptions: CAR_SELECT_OPTIONS.BODY_TYPES,
    },

    fuelType: {
      type: String,
      enum: getEnum("FUEL_TYPES"),
      default: "",
      optional: true,
      label: "Brand",
      esType: "keyword",
      selectOptions: CAR_SELECT_OPTIONS.BODY_TYPES,
    },

    gearBox: {
      type: String,
      enum: getEnum("GEARBOX"),
      default: "",
      optional: true,
      label: "Gear box",
      esType: "keyword",
      selectOptions: CAR_SELECT_OPTIONS.BODY_TYPES,
    },

    vintageYear: {
      type: Number,
      label: "Vintage year",
      default: new Date().getFullYear(),
    },

    importYear: {
      type: Number,
      label: "Imported year",
      default: new Date().getFullYear(),
    },

    status: {
      type: String,
      enum: getEnum("STATUSES"),
      default: "Active",
      optional: true,
      label: "Status",
      esType: "keyword",
      selectOptions: CAR_SELECT_OPTIONS.STATUSES,
      index: true,
    },

    description: { type: String, optional: true, label: "Description" },

    tagIds: {
      type: [String],
      optional: true,
      label: "Tags",
    },

    // Merged car ids
    mergedIds: { type: [String], optional: true, label: "Merged companies" },

    searchText: { type: String, optional: true, index: true },

    attachment: { type: attachmentSchema },
  }),
  "erxes_cars"
);
