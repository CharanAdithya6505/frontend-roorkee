import { Carousel } from 'primereact/carousel';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const DynamicCarousel = ({ c1Images, c2Images }) => {
  const schemeTemplate = (image, index) => {
    return (
      <div className="w-[50%] h-[153px] overflow-hidden flex items-center justify-center">
        <img
          src={image}
          alt={`Image-${index}`}
          className="w-full h-full object-fit"
        />
      </div>
    );
  };

  const characterTemplate = (image, index) => {
    return (
      <div className="w-[60%] h-[350px]  overflow-hidden flex items-center justify-center">
        <img
          src={image}
          alt={`Image-${index}`}
          className="w-full h-full object-fit"
        />
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen">
      {/* C1 Carousel (Top) */}
      <div className="absolute top-[48%] w-full h-auto px-4 z-20">
        <Carousel
          value={c1Images}
          itemTemplate={schemeTemplate}
          numVisible={1}
          numScroll={1}
          circular
          autoplayInterval={3000}
          showNavigators={false}
        />
      </div>

      {/* C2 Carousel (Bottom) */}
      <div className="absolute bottom-0 left-[38%] w-full h-auto px-4 z-20">
        <Carousel
          value={c2Images}
          itemTemplate={characterTemplate}
          numVisible={1}
          numScroll={1}
          circular
          autoplayInterval={3000}
          showNavigators={false}
        />
      </div>
    </div>
  );
};

export default DynamicCarousel;
