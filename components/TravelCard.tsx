"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";

interface TravelCardProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  location: string;
  country: string;
  coverImage: string;
  readingTime: string;
  index?: number;
}

export function TravelCard({
  slug,
  title,
  description,
  date,
  location,
  country,
  coverImage,
  readingTime,
  index = 0,
}: TravelCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/travel/${slug}`} className="block h-full">
        <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col kinetic-hover">
          <div className="relative h-52 overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container/80 backdrop-blur-sm rounded-full font-jetbrains text-[10px] text-emerald uppercase tracking-widest border border-white/10">
                <MapPin className="h-3 w-3" />
                {location}, {country}
              </span>
            </div>
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <h3 className="font-geist text-xl font-medium text-on-surface mb-3 hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-slate-muted text-sm leading-relaxed mb-4 flex-grow">
              {description}
            </p>
            <div className="flex items-center gap-4 text-slate-muted">
              <span className="flex items-center gap-1.5 font-jetbrains text-xs">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5 font-jetbrains text-xs">
                <Clock className="h-3.5 w-3.5" />
                {readingTime}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
