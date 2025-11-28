'use client'
import Image from "next/image";

interface CardProps {
    image: string;
    title: string;
    category: string;
    price: number | string;
    label?: string;
    colors?: string;
}

export default function Card({ image, title, category, price, label, colors }: CardProps) {
    return (
        <div className="group cursor-pointer flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden bg-light-200">
                {label && (
                    <span className="absolute top-4 left-4 z-10 bg-white px-3 py-1 text-xs font-medium text-dark-900">
                        {label}
                    </span>
                )}
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <div className="flex flex-col gap-1">
                {label && label === "Just In" && (
                    <p className="text-orange font-medium text-[15px]">Just In</p>
                )}
                <div className="flex justify-between items-start">
                    <h3 className="text-[15px] font-medium text-dark-900 leading-tight group-hover:underline decoration-1 underline-offset-2">
                        {title}
                    </h3>
                    <p className="text-[15px] font-medium text-dark-900">
                        {typeof price === 'number' ? `$ ${price.toLocaleString('en-US')}` : price}
                    </p>
                </div>
                <p className="text-[15px] text-dark-700">{category}</p>
                {colors && (
                    <p className="text-[15px] text-dark-700">{colors}</p>
                )}
            </div>
        </div>
    );
}
