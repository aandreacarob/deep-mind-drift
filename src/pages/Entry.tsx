import { Link } from "react-router-dom";
import { ThoughtThreads } from "@/components/ThoughtThreads";

const Entry = () => {
  const doors = [
    { number: "I", title: "LA DERIVA", path: "/seccion-1" },
    { number: "II", title: "RAÍCES", path: "/seccion-2" },
    { number: "III", title: "CINCO MOMENTOS", path: "/seccion-3" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center justify-center">
      <ThoughtThreads />
      
      <div className="relative z-10 text-center mb-16 px-4">
        <h1 className="font-['Playfair_Display'] text-white text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
          MUSEO DIGITAL
        </h1>
        <p className="font-['Playfair_Display'] text-white text-2xl md:text-3xl font-light italic">
          Mil Caminos, Tres Puertas
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-4 max-w-6xl">
        {doors.map((door) => (
          <Link
            key={door.number}
            to={door.path}
            className="group"
          >
            <div className="bg-white border-4 border-white rounded-lg p-12 md:p-16 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              <div className="text-center">
                <div className="text-[#1a1a1a] font-['Playfair_Display'] text-5xl md:text-6xl font-bold mb-4">
                  {door.number}
                </div>
                <div className="text-[#1a1a1a] font-['Playfair_Display'] text-xl md:text-2xl tracking-wider">
                  {door.title}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Entry;
