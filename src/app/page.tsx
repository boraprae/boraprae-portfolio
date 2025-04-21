import Image from "next/image";
import styles from "./page.module.css";
import "nes.css/css/nes.min.css";
import "tailwindcss";

export default function Home() {
  return (
    // <div className={styles.page}>
    <div className="">
      {/* 🔹 Row แรก */}
      <div className="flex flex-col gap-6">
        {/* ✅ Row แรก */}
        <div className="nes-container is-dark is-rounded">
          <p>Good morning. Thou hast had a good night's sleep, I hope.</p>
        </div>

        {/* ✅ Row ที่สอง */}
        <div className="flex flex-row w-full gap-4">
          {/* 🟦 คอลัมน์ซ้าย - 40% */}
          <div className="w-2/5">
            <div className="nes-container is-dark with-title w-full">
              <Image
                src="/asset/pixcel-profile.jpg"
                alt="Profile Image"
                width={200}
                height={200}
                className="rounded-full object-cover mx-auto"
              />
            </div>
            <p className="text-lg text-center mt-2">Yainezu</p>
          </div>

          {/* 🟥 คอลัมน์ขวา - 60% */}
          <div className="w-3/5 flex flex-col justify-center">
            <p className="text-xl font-bold">SOFTWARE ENGINEER</p>
            <p className="mt-2 text-base">
              Frontend dev who loves pixel art and retro design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
