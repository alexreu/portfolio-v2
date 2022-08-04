import AboutTab from "../../components/AboutTab/AboutTab";
import Heading from "../../components/Heading/Heading";
import Image from "next/image";

function AboutSection() {
    return (
        <section id="#about" className="bg-white dark:bg-primary-darkest py-[80px] lg:py-[120px]">
            <div className="container lg:grid grid-cols-12 gap-x-12 items-center">
                <div className="col-span-5 relative min-h-[400px] rounded-lg overflow-hidden">
                    <Image
                        src="/images/about-me.jpg"
                        className={"object-cover rounded-lg overflow-hidden"}
                        layout="responsive"
                        height={400}
                        width={360}
                        alt=""
                    />
                </div>
                <div className="col-span-7 lgd:pt-10">
                    <Heading
                        variant="h2"
                        className="mb-7 text-[32px] lg:text-[50px] text-heading dark:text-white font-main font-semibold"
                    >
                        À propos de moi
                    </Heading>
                    <p className="text-gray dark:text-dark-body text-lg leading-8 font-light font-main">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident iusto odio minus laborum
                        pariatur, corporis sequi quam ad sit ipsum sint, nesciunt ullam exercitationem distinctio
                        numquam iste excepturi eius eaque!
                    </p>
                    <AboutTab />
                </div>
            </div>
        </section>
    );
}

export default AboutSection;
