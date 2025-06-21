import Douyin from '@/assets/tone/Douyin.png';
import Glam from '@/assets/tone/Glam.png';
import Korean from '@/assets/tone/Korean.png';
import Natural from '@/assets/tone/Natural.png';

export default function MakeupTones() {
    const tones = [
      { name: "Natural", image: Natural, colSpan: "col-span-1" },
      { name: "Glam", image: Glam, colSpan: "col-span-2" },
      { name: "Korean", image: Korean, colSpan: "col-span-2" },
      { name: "Douyin", image: Douyin, colSpan: "col-span-1" },
    ];
  
    return (
      <div className="flex justify-center p-6">
        <div className="bg-gray-100 rounded-3xl shadow-lg p-6 w-[75%]">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Tone trang điểm phổ biến
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {tones.map((tone, index) => (
              <div
                key={index}
                className={`relative rounded-2xl overflow-hidden ${tone.colSpan} h-64`}
              >
                <img
                  src={tone.image}
                  alt={tone.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-lg font-bold font-montserrat text-gray-800 px-2 py-1 rounded">
                  {tone.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  