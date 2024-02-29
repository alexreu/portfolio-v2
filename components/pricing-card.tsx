import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

type Props = {
    title: string;
    monthPrice?: number;
    fixedPrice?: number;
    content: { _key: string; offerContentItem: string }[];
    isCustom?: boolean;
};
export const PricingCard = ({ title, monthPrice, fixedPrice, content, isCustom }: Props) => {
    return (
        <Card className="col-span-4 row-span-2 flex flex-col text-white opacity-100 backdrop-blur-xl">
            <CardHeader>
                <h2 className="text-2xl font-semibold text-primary">{title}</h2>
                {isCustom ? (
                    <>
                        <p className="text-3xl font-bold">Custom</p>
                        <p className="text-sm tracking-wide text-muted-foreground">Sur devis</p>
                    </>
                ) : (
                    <p>
                        À partir de <br />
                        <span className="inline-flex items-center gap-2 text-3xl tracking-wider">
                            <span className="font-semibold">{fixedPrice}€</span>
                            <span className="text-xl text-muted-foreground">HT</span>
                        </span>
                        <br />
                        <span className="inline-flex items-center gap-2 text-lg tracking-wider">
                            + <b>{monthPrice}€</b>
                            <span className="text-sm text-muted-foreground">HT /mois</span>
                        </span>
                    </p>
                )}
            </CardHeader>
            <CardContent className="mt-auto">
                <ul className="flex flex-col gap-4">
                    {content.map(({ _key, offerContentItem }) => (
                        <li key={_key}>{offerContentItem}</li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
};
