import { PricingCard } from "@/components/pricing-card";

export default function Pricing() {
    return (
        <div className="grid grid-cols-12 gap-5">
            <PricingCard title="Offre basique" fixedPrice="499" />
            <PricingCard title="Offre custom" fixedPrice="1299" />
            <PricingCard title="Sur mesure" isCustom />
        </div>
    );
}
