import { DemoHeading } from "./demo-heading";

type DemoFaqProps = {
    items: readonly { readonly question: string; readonly answer: string }[];
};

export const DemoFaq = ({ items }: DemoFaqProps) => (
    <section id="faq" aria-labelledby="faq-titre" className="scroll-mt-16 py-20 md:py-30">
        <div className="mx-auto grid max-w-310 gap-6 px-4 md:grid-cols-[5fr_7fr] md:gap-18 md:px-7">
            <DemoHeading
                id="faq-titre"
                number="07"
                label="Questions"
                heading={{ text: "Bon à savoir", emphasis: "à savoir" }}
            />
            <div>
                {items.map((item, index) => (
                    <details
                        key={item.question}
                        open={index === 0}
                        className="group border-demo-line border-t last:border-b"
                    >
                        <summary className="font-demo-serif flex min-h-14 cursor-pointer list-none items-center justify-between gap-5 py-5 text-2xl leading-snug [&::-webkit-details-marker]:hidden">
                            {item.question}
                            <span
                                aria-hidden="true"
                                className="font-demo-sans text-2xl font-light transition-transform group-open:rotate-45"
                            >
                                +
                            </span>
                        </summary>
                        <p className="text-demo-ink-2 pr-10 pb-5.5">{item.answer}</p>
                    </details>
                ))}
            </div>
        </div>
    </section>
);
