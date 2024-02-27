import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

type Props = {
    title: string;
    monthPrice?: string;
    fixedPrice?: string;
    isCustom?: boolean;
};
export const PricingCard = ({ title, monthPrice, fixedPrice, isCustom }: Props) => {
    return (
        <Card className="col-span-4 text-white opacity-100 backdrop-blur-xl">
            <CardHeader>
                <h2 className="text-primary">{title}</h2>
                {isCustom ? (
                    <p className="text-3xl font-bold">Custom</p>
                ) : (
                    <p>
                        À partir de <br />
                        <span className="inline-flex items-center gap-2 text-3xl tracking-wider">
                            <b>{fixedPrice}€</b>
                            <span className="text-xl text-muted-foreground">HT</span>
                        </span>
                        <br />
                        <span className="inline-flex items-center gap-2 text-lg tracking-wider">
                            + <b>{monthPrice}</b>
                            <span className="text-sm text-muted-foreground">HT /mois</span>
                        </span>
                    </p>
                )}
            </CardHeader>
            <CardContent>
                <ul className="flex flex-col gap-4">
                    <li>5 pages de contenu</li>
                    <li>Maquettes pré-défini</li>
                    <li>Modification de la couleur et du logo</li>
                    <li>Hébergement + nom de domaine</li>
                    <li>Maintenance</li>
                    <li>Accès à un espace d&apos;administration</li>
                </ul>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
};
