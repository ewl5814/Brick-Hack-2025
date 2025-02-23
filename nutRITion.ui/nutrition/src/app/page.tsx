import Nav from "./navbar";
import CreateMealView from "./create-meal"
import Image from "next/image";

export default function Home() {
    return (
        <div className="flex flex-col items-center">
            <Nav />
            <Image
                src="/home.png"
                alt="Some buritos"
                sizes="(max-width: 1920) 100vw, 33vw"
                width={1920}
                height={300}
            />
            <CreateMealView />
        </div>
  );
}
