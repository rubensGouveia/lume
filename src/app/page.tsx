import Image from "next/image";
import { SiInstagram } from "react-icons/si";
export default function Home() {
  return (
    <div className="bg-amber-500/5 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 shadow-xl justify-center items-center rounded-md bg-background p-8 md:max-w-md">
        <a
          href="https://www.instagram.com/batistalume/"
          className="flex items-center gap-2 self-center font-medium"
          target="_blank"
          rel="noopener"
        >
          <div className="bg-primary text-primary-foreground flex w-50 h-12  items-center justify-center rounded-md">
            <Image
              src="/lume_logo.svg"
              alt="Lume logo"
              width={2599}
              height={1123}
              priority
            />
          </div>
        </a>
        <h1 className="text-3xl font-bold text-[#ef8e2e] text-center">
          Estamos preparando <br />
          algo especial!
        </h1>
        <h4 className="text-lg text-center text-foreground/70">
          O site da igreja Batista Lume está em construção.
        </h4>

        <a
          href="https://www.instagram.com/batistalume/ "
          target="_blank"
          rel="noopener"
          className="bg-[#ef8e2e] px-5 py-2 rounded-full mt-4 flex  items-center justify-center gap-2 text-sm text-white font-medium"
        >
          Novidades no Instagram <SiInstagram size={20} color="#fff" />
        </a>
      </div>
    </div>
  );
}
