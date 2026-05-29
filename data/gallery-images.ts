export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

export const galleryImages: GalleryImage[] = [
  {
    src: "/images/factory/factory-line.svg",
    alt: "Automated Production Line",
    category: "Factory",
  },
  {
    src: "/images/factory/quality-lab.svg",
    alt: "Quality Testing Laboratory",
    category: "Quality",
  },
  {
    src: "/images/factory/warehouse.svg",
    alt: "Warehouse & Logistics",
    category: "Factory",
  },
  {
    src: "/images/products/bulk-barrels.svg",
    alt: "Bulk Packaging Line",
    category: "Products",
  },
  {
    src: "/images/factory/r-and-d-center.svg",
    alt: "R&D Center",
    category: "Factory",
  },
  {
    src: "/images/quality/testing-rig.svg",
    alt: "Tensile Testing Equipment",
    category: "Quality",
  },
  {
    src: "/images/products/cartridge-line.svg",
    alt: "Cartridge Filling Line",
    category: "Products",
  },
  {
    src: "/images/factory/raw-materials.svg",
    alt: "Raw Material Storage",
    category: "Factory",
  },
  {
    src: "/images/quality/inspection.svg",
    alt: "Final Quality Inspection",
    category: "Quality",
  },
];

export const galleryCategories = [
  "All",
  "Factory",
  "Products",
  "Quality",
];
