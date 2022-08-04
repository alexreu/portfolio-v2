import Image from 'next/image';
import AboutTab from '../../components/AboutTab/AboutTab';
import Heading from '../../components/heading/Heading';
const AboutSection = () => {
    return (
        <section id="#about" className='py-[120px]'>
            <div className="container grid grid-cols-12">
              <div className="col-span-5 relative py-10">
                <Image
                  src="/images/about-me.jpg"
                  layout='fill'
                  objectFit='cover'
                />
              </div>
              <div className="col-span-7">
                <Heading variant="h2" className="text-[50px] text-black dark:text-white font-main font-semibold">
                  À propos de moi
                </Heading>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident iusto odio minus laborum pariatur, corporis sequi quam ad sit ipsum sint, nesciunt ullam exercitationem distinctio numquam iste excepturi eius eaque!
                </p>
                <AboutTab />
              </div>
            </div>
        </section>
    );
};

export default AboutSection;
