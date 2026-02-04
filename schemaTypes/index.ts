// Legacy schemas (keep for backward compatibility)
import about from "./about";
import homepage from "./homepage";
import pricing from "./pricing";
import services from "./services";

// New V2 schemas
import pricingPlanV2 from "./pricingPlanV2";
import serviceV2 from "./serviceV2";
import siteSettings from "./siteSettings";
import skillCategory from "./skillCategory";

export const schemaTypes = [
    // Legacy
    homepage,
    pricing,
    about,
    services,
    // V2
    siteSettings,
    serviceV2,
    pricingPlanV2,
    skillCategory,
];
