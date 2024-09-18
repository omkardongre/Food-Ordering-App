import hero from '../assets/hero.png';

const Hero = () => {
  return (
    <div>
      <img
        src={hero}
        alt="Delicious food spread on a table"
        className="w-full max-h-600 object-cover"
      />
    </div>
  );
};

export default Hero;
