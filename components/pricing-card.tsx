import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, Sparkle } from "lucide-react";

type Props = {
    title: string;
    monthPrice?: number;
    fixedPrice?: number;
    content: { _key: string; offerContentItem: string }[];
    isCustom?: boolean;
};

export const PricingCard = ({ title, monthPrice, fixedPrice, content, isCustom }: Props) => {
    return (
        <Card
            className="col-span-1 flex flex-col divide-y-2 text-white opacity-100 backdrop-blur-xl xl:col-span-4
                xl:row-span-2"
        >
            <CardHeader className="min-h-48 gap-2">
                <h2 className="inline-flex items-center gap-2 text-2xl font-semibold text-primary">
                    <Sparkle strokeWidth={1} size={28} /> {title}
                </h2>
                {isCustom ? (
                    <>
                        <p className="text-3xl font-semibold">Custom</p>
                        <p className="text-sm tracking-wide text-white">
                            Possibilité d&apos;adapter le pack à vos besoins
                        </p>
                        <p className="text-sm tracking-wide text-muted-foreground">Sur devis</p>
                    </>
                ) : (
                    <div className="mt-0 flex flex-col">
                        <p className="mt-0 inline-flex flex-col">
                            <span>À partir de </span>
                            <span className="my-1 inline-flex items-center gap-2">
                                <span className="text-4xl font-semibold tracking-widest">{fixedPrice}€</span>
                                <span className="text-base text-muted-foreground">HT</span>
                            </span>
                            <span className="inline-flex items-center gap-2 text-lg tracking-wider">
                                <span className="font-medium">{monthPrice}€</span>
                                <span className="text-sm text-muted-foreground">HT /mois</span>
                            </span>
                        </p>
                    </div>
                )}
            </CardHeader>
            <CardContent className="pt-6">
                <ul className="flex flex-col gap-4">
                    {content.map(({ _key, offerContentItem }) => (
                        <li key={_key} className="flex items-center gap-3 text-base font-medium tracking-wide">
                            <span>
                                <Check size={20} className="stroke-primary" />
                            </span>
                            <span className="line-clamp-2 inline-flex flex-wrap break-words font-light">
                                {offerContentItem}
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            {/* <CardFooter></CardFooter> */}
        </Card>
    );
};
